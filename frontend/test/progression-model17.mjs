// Deterministic economy model, not a combat difficulty or human playtest claim.
// Victories and one-third field losses are explicit inputs. Every construction,
// research, recruitment, voyage, repair, price and timer uses production rules.
import * as R from '../core/server-entry.js';

export function runProgression17(style, {trades = true, throughKeep = 10, simulateBattles = false} = {}) {
  const start = 1800000000000;
  let state = R.Y(R.Al(start), start), now = start, steps = 0;
  const metrics = {style, trades, simulateBattles, minutes: 0, actions: 0, gemSpending: 0, blockedMinutes: Object.fromEntries(R.xl.map(kind => [kind, 0])), incomeOverflow: Object.fromEntries(R.xl.map(kind => [kind, 0])), spent: Object.fromEntries(R.xl.map(kind => [kind, 0])), levels: [], battles: [], tradeCount: 0};
  function advance(milliseconds) {
    const before = {...state.resources}, income = R.Il(state, now);
    now += Math.max(1, Math.ceil(milliseconds));
    state = R.Y(state, now);
    for (const kind of R.xl) metrics.incomeOverflow[kind] += Math.max(0, income[kind] * milliseconds / 60000 - (state.resources[kind] - before[kind]));
  }
  function action(command) {
    const before = {...state.resources}, gems = state.gems;
    state = R.Ul(state, command, now); metrics.actions++;
    for (const kind of R.xl) metrics.spent[kind] += Math.max(0, before[kind] - state.resources[kind]);
    metrics.gemSpending += Math.max(0, gems - state.gems);
  }
  function finishProjects() {
    const ends = [...state.buildings.map(item => item.readyAt || 0), ...state.fleet.flatMap(ship => [ship.readyAt || 0, ship.repairReadyAt || 0]), state.trainingResearch?.readyAt || 0];
    const end = Math.max(now, ...ends);
    if (end > now) advance(end - now);
  }
  function fund(cost) {
    if (++steps > 2000) throw Error('Progression model exceeded its bounded action budget.');
    if (Math.max(...Object.values(cost)) > R.SWCapacity(state)) expandStorage(Math.max(...Object.values(cost)));
    for (let attempt = 0; !R.Z(state, cost); attempt++) {
      if (attempt > 200) throw Error('Funding stalled at Keep ' + R.Ml(state));
      const trade = trades && R.SWShortfallTrades17(state, cost)[0];
      if (trade) { action(trade.action); metrics.tradeCount++; continue; }
      const income = R.Il(state, now), delays = R.xl.map(kind => ({kind, minutes: Math.max(0, cost[kind] - state.resources[kind]) / income[kind]})).sort((a, b) => b.minutes - a.minutes);
      if (!Number.isFinite(delays[0].minutes)) throw Error('A required resource cannot be earned.');
      metrics.blockedMinutes[delays[0].kind] += delays[0].minutes;
      advance(delays[0].minutes * 60000 + 1);
    }
  }
  function plot(kind) {
    for (let x = -3; x < 16; x++) for (let y = -2; y < 16; y++) if (R.SWCanPlace(state, kind, x, y)) return {x, y};
    throw Error('No buildable plot for ' + kind);
  }
  function build(kind) { fund(R.X(kind)); action({type: 'build', kind, ...plot(kind)}); finishProjects(); }
  function upgrade(building) { fund(R.X(building.kind, building.level + 1)); action({type: 'upgrade', id: building.id}); finishProjects(); }
  function expandStorage(required) {
    while (R.SWCapacity(state) < required) {
      const stores = state.buildings.filter(building => building.kind === 'storehouse');
      const candidate = stores.filter(building => building.level < R.Ml(state) && Math.max(...Object.values(R.X('storehouse', building.level + 1))) <= R.SWCapacity(state)).sort((a, b) => a.level - b.level)[0];
      if (candidate) upgrade(candidate);
      else if (stores.length < R.SWBuildingLimit(state, 'storehouse')) build('storehouse');
      else throw Error('Storage deadlock before Keep ' + (R.Ml(state) + 1));
    }
  }
  function raise(kind, level) {
    if (!state.buildings.some(building => building.kind === kind)) build(kind);
    while (state.buildings.find(building => building.kind === kind).level < level) upgrade(state.buildings.find(building => building.kind === kind));
  }
  function recruitAndResearch(level) {
    const capacity = R.Pl(state), desired = {infantry: Math.ceil(capacity * .6), archer: Math.floor(capacity * .4)};
    for (const [kind, count] of Object.entries(desired)) {
      while (state.army[kind] < count) {
        const missing = Math.min(10, count - state.army[kind]);
        fund(Object.fromEntries(R.xl.map(resource => [resource, R.J[kind].cost[resource] * missing]))); action({type: 'recruit', kind, count: missing});
      }
      while (R.el(state, kind) < level) { fund(R.tl(state, kind)); action({type: 'researchUnit', kind}); finishProjects(); }
    }
  }
  function prepareFleet(level) {
    raise('harbor', level);
    for (const kind of ['cutter', ...(level >= 2 ? ['cog'] : []), ...(level >= 3 ? ['galley'] : [])]) {
      if (!state.fleet.some(ship => ship.kind === kind)) { fund(R.nl(kind)); action({type: 'buildShip', kind}); finishProjects(); }
      while (state.fleet.find(ship => ship.kind === kind).level < level) {
        const ship = state.fleet.find(item => item.kind === kind);
        fund(R.nl(kind, ship.level + 1)); action({type: 'upgradeShip', id: ship.id}); finishProjects();
      }
    }
    const ship = state.fleet[0];
    action({type: 'voyage', id: ship.id, kind: 'coast'});
    advance(state.fleet[0].voyage.readyAt - now);
    action({type: 'collectVoyage', id: ship.id});
    if (R.SWDepotStatus17(state).canClaim) action({type: 'claimHarborDepot'});
  }

  for (let level = 1; level <= throughKeep; level++) {
    raise('barracks', level); raise('quarry', level);
    if (style === 'builder') for (const kind of ['lumber', 'farm', 'market']) raise(kind, level);
    else { raise('lumber', Math.max(1, Math.ceil(level * .6))); raise('farm', Math.max(1, Math.ceil(level * .5))); }
    recruitAndResearch(level);
    const sea = style === 'naval';
    if (sea) prepareFleet(level);
    const preparation = sea ? R.SWRecommendSeaPreparation14(state, state.army) : {army: R.SWPreparationArmy14(state, state.army)};
    const scout = sea ? {kind: 'sea', campaignIndex: state.seaCampaign} : {kind: 'campaign', campaignIndex: state.campaign, defense: R.Gl(state.campaign)};
    const input = R.SWCreateBattle14(state, scout, preparation, level * 17);
    const campaignBefore = R.SWCampaignProgress17(state).total;
    if (simulateBattles) {
      // The final coastal fort covers the middle and southern landing lanes.
      // Use the northern beach while the escort contests the enemy fleet.
      const beach = sea && scout.campaignIndex === 9 ? 1 : 4;
      for (const kind of [...Object.keys(R.J), 'hero']) for (let index = 0; index < (kind === 'hero' ? 1 : input.army[kind]); index++) {
        const order = R.SWDeploymentOrder14(input, kind, sea ? -1 : -2, beach, 0);
        if (order) input.orders.push(order);
      }
      if (sea) input.shipOrders14 = input.fleet14.map(ship => ({type: 'ability', shipId: ship.id, time: 8}));
    }
    const result = simulateBattles ? R.Kl(input) : {won: true, stars: 2, duration: 90, destruction: 75};
    if (!result.won) throw Object.assign(Error('Fixed deployment lost ' + (sea ? 'Sea' : 'Land') + ' chapter ' + (scout.campaignIndex + 1)), {input, result});
    metrics.battles.push({chapter: scout.campaignIndex + 1, won: result.won, duration: result.duration, destruction: result.destruction, deployed: input.orders.length, survivors: result.survivors ? R.Nl(result.survivors) : null});
    R.Fu(state, sea ? 'sea' : 'campaign', scout.campaignIndex, input, result, true, now);
    if (R.SWCampaignProgress17(state).total !== campaignBefore + 1) throw Error('First clear failed to advance renown.');
    // Attrition is a transparent model input. No gem purchase or fabricated
    // resource refill is allowed to hide replacement/repair costs.
    for (const kind of ['infantry', 'archer']) state.army[kind] -= simulateBattles ? preparation.army[kind] - result.survivors[kind] : Math.ceil(preparation.army[kind] / 3);
    if (simulateBattles) for (const ship of state.fleet) if (result.navalSurvivors?.[ship.id] === false) ship.wrecked = true;
    if (sea && !simulateBattles && level % 3 === 0) {
      state.fleet[0].wrecked = true;
    }
    for (const ship of state.fleet.filter(item => item.wrecked)) { fund(R.SWShipRepairCost(ship)); action({type: 'repairShip', id: ship.id}); finishProjects(); }
    metrics.levels.push({keep: level, minutes: (now - start) / 60000, capacity: R.SWCapacity(state), renown: R.SWCampaignProgress17(state).total, gems: state.gems});
    if (level < throughKeep) {
      const keep = state.buildings.find(building => building.kind === 'keep');
      fund(R.X('keep', level + 1));
      const quote = R.SWUpgradeQuote14(state, keep);
      if (!quote.allowed) throw Error('Keep ' + (level + 1) + ': ' + quote.reason);
      action({type: 'upgrade', id: keep.id}); finishProjects();
    }
  }
  metrics.minutes = (now - start) / 60000;
  metrics.finalArmy = R.Nl(state.army); metrics.gems = state.gems;
  return {state, metrics};
}
