import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../core/server-entry.js';

const now = 1800000000000;
const fresh = () => R.Y(R.Al(now), now);
const totalGoods = state => Object.fromEntries(R.xl.map(kind => [kind, state.resources[kind] + (state.harborDepot17?.[kind] || 0)
  + state.fleet.reduce((sum, ship) => sum + (ship.voyage?.reward[kind] || 0), 0)]));

test('a street through a gate connects civic income while other building footprints still block it', () => {
  const state = fresh();
  state.buildings = [
    {id: 'keep', kind: 'keep', level: 1, x: 0, y: 0},
    {id: 'passage', kind: 'gate', level: 1, x: 2, y: 0},
    {id: 'farm', kind: 'farm', level: 1, x: 4, y: 0},
  ];
  state.terrain = [1, 2, 3].map(x => ({kind: 'road', x, y: 0}));
  const before = structuredClone(state), connected = R.SWLandStats(state);
  assert.ok(connected.connectedIds.includes('farm'));
  assert.equal(connected.connectedRoadCount, 3);
  const connectedFood = R.Il(state).food;
  for (const kind of ['wall', 'cottage', 'storehouse', 'harbor']) {
    const blocked = structuredClone(state);
    blocked.buildings[1].kind = kind;
    assert.ok(!R.SWLandStats(blocked).connectedIds.includes('farm'), kind + ' no longer blocks a road footprint');
    assert.ok(connectedFood > R.Il(blocked).food, 'Visible gate passage does not deliver its civic income benefit');
  }
  assert.deepEqual(state, before);
});

test('Land and Sea first clears both unlock the same Keep and income requirements', () => {
  const land = fresh(), sea = fresh();
  land.campaign = 2; sea.seaCampaign = 2;
  for (const state of [land, sea]) {
    state.buildings.find(building => building.kind === 'keep').level = 2;
    state.buildings.push({id: 'barracks', kind: 'barracks', x: 4, y: 2, level: 2}, {id: 'quarry', kind: 'quarry', x: 4, y: 3, level: 2}, {id: 'store', kind: 'storehouse', x: 4, y: 4, level: 2});
    state.resources = Object.fromEntries(R.xl.map(kind => [kind, R.SWCapacity(state)]));
    const keep = state.buildings.find(building => building.kind === 'keep');
    assert.equal(R.SWUpgradeQuote14(state, keep).allowed, true);
    assert.equal(R.Ul(state, {type: 'upgrade', id: keep.id}, now).buildings.find(building => building.id === keep.id).targetLevel, 3);
  }
  assert.deepEqual(R.Il(sea), R.Il(land));
  const mixed = fresh(); mixed.campaign = 1; mixed.seaCampaign = 1; mixed.wins = 100;
  assert.equal(R.SWCampaignProgress17(mixed).total, 2);
  mixed.wins += 20; mixed.city = {...mixed.city, raidWins: 50};
  assert.equal(R.SWCampaignProgress17(mixed).total, 2);
});

test('returned ships unload into a bounded Harbor depot even when main stores are full', () => {
  let state = fresh();
  state.buildings.push({id: 'harbor', kind: 'harbor', level: 1, x: -2, y: 3});
  state.fleet = [{id: 'cutter', kind: 'cutter', level: 1}];
  state.resources = Object.fromEntries(R.xl.map(kind => [kind, R.SWCapacity(state)]));
  state = R.Ul(state, {type: 'voyage', id: 'cutter', kind: 'coast'}, now);
  const readyAt = state.fleet[0].voyage.readyAt;
  state = R.Y(state, readyAt);
  const before = totalGoods(state), gems = state.gems;
  state = R.Ul(state, {type: 'collectVoyage', id: 'cutter'}, readyAt);
  assert.equal(state.fleet[0].voyage, undefined);
  assert.deepEqual(R.SWReadyFleet14(state).map(ship => ship.id), ['cutter']);
  assert.deepEqual(totalGoods(state), before);
  assert.equal(state.gems, gems);
  assert.equal(R.SWDepotStatus17(state).resources.wood, R.Ec[0].reward.wood);
  assert.ok(R.xl.every(kind => state.harborDepot17[kind] <= R.SWDepotStatus17(state).capacity));
  assert.throws(() => R.Ul(state, {type: 'collectVoyage', id: 'cutter'}, readyAt), /not returned/);
  assert.throws(() => R.Ul(state, {type: 'claimHarborDepot'}, readyAt), /Spend supplies/);
  state.resources.wood -= 50;
  const beforeClaim = totalGoods(state);
  state = R.Ul(state, {type: 'claimHarborDepot'}, readyAt);
  assert.deepEqual(totalGoods(state), beforeClaim);
  assert.equal(state.harborDepot17.wood, R.Ec[0].reward.wood - 50);
});

test('voyages reserve finite depot space before departure without holding combat ships hostage', () => {
  let state = fresh(); state.buildings.push({id: 'port', kind: 'harbor', level: 1, x: -2, y: 3});
  state.fleet = [{id: 'one', kind: 'cutter', level: 1}, {id: 'two', kind: 'cutter', level: 1}];
  state.harborDepot17.wood = R.SWCapacity(state) - 110;
  state = R.Ul(state, {type: 'voyage', id: 'one', kind: 'coast'}, now);
  const snapshot = structuredClone(state);
  assert.throws(() => R.Ul(state, {type: 'voyage', id: 'two', kind: 'coast'}, now), /Harbor depot/);
  assert.deepEqual(state, snapshot);
  assert.deepEqual(R.SWReadyFleet14(state).map(ship => ship.id), ['two']);
});

test('legacy cargo survives one-time depot migration and the extra allowance only shrinks', () => {
  const original = R.Al(now);
  original.resources = Object.fromEntries(R.xl.map(kind => [kind, 750]));
  original.fleet = [{id: 'old', kind: 'cutter', level: 1, voyage: {readyAt: now, reward: {gold: 0, wood: 2000, stone: 0, food: 0}}}];
  let state = R.Y(original, now);
  assert.equal(R.SWDepotStatus17(state).capacity, 2000);
  assert.deepEqual(R.Y(state, now), state);
  assert.equal(original.harborDepot17, undefined);
  state = R.Ul(state, {type: 'collectVoyage', id: 'old'}, now);
  assert.equal(state.harborDepot17.wood, 2000);
  state.resources.wood = 0;
  state = R.Ul(state, {type: 'claimHarborDepot'}, now);
  assert.equal(state.harborDepot17.wood, 1250);
  assert.equal(R.SWDepotStatus17(state).capacity, 1250);
  state.resources.wood = 0;
  state = R.Ul(state, {type: 'claimHarborDepot'}, now);
  assert.equal(R.SWDepotStatus17(state).capacity, 750);
  assert.deepEqual(R.Y(state, now), state);
});

test('permanent gem collections charge only missing pieces, once, at the reviewed price', () => {
  let state = fresh(); const initialGems = state.gems;
  const initialQuote = R.SWCollectionQuote17(state, 'founder');
  assert.ok(initialQuote.priceGems <= 40);
  const lantern = R.SWPremiumCatalog.find(item => item.id === 'ornament:lantern');
  state = R.Ul(state, {type: 'buyCosmetic', id: lantern.id, maxPrice: lantern.priceGems}, now);
  const partial = R.SWCollectionQuote17(state, 'founder');
  assert.equal(partial.ownedCount, 1);
  assert.equal(partial.missing.length, 2);
  assert.equal(partial.priceGems, Math.ceil(partial.missing.reduce((sum, item) => sum + item.priceGems, 0) * .8));
  assert.throws(() => R.Ul(state, {type: 'buyGemCollection', id: 'founder', maxPrice: initialQuote.priceGems}, now), /price changed/);
  state = R.Ul(state, {type: 'buyGemCollection', id: 'founder', maxPrice: partial.priceGems}, now);
  assert.equal(state.gems, initialGems - lantern.priceGems - partial.priceGems);
  assert.equal(R.SWCollectionQuote17(state, 'founder').missing.length, 0);
  assert.throws(() => R.Ul(state, {type: 'buyGemCollection', id: 'founder', maxPrice: 0}, now), /owned/);
  R.SWRevokeCollection(state, 'founder');
  assert.equal(R.SWCollectionQuote17(state, 'founder').missing.length, 0, 'Gem ownership must survive unrelated cash-entitlement revocation.');
  assert.equal(R.Y(state, now).gems, state.gems);
});

test('shortfall trades preserve the project food budget and use the authoritative exchange rate', () => {
  const state = fresh(), cost = {gold: 100, wood: 500, stone: 100, food: 80};
  state.resources.food = 500;
  const quotes = R.SWShortfallTrades17(state, cost), quote = quotes.find(item => item.resource === 'wood');
  assert.ok(quote);
  assert.equal(quote.payment, quote.amount * 2);
  assert.ok(state.resources.food - quote.payment >= cost.food);
  const next = R.Ul(state, quote.action, now);
  assert.equal(next.resources.wood, state.resources.wood + quote.amount);
  assert.equal(next.resources.food, state.resources.food - quote.payment);
  assert.deepEqual(R.SWShortfallTrades17({...state, resources: {...state.resources, food: 90}}, cost), []);
});

test('building upgrade deltas agree with battle health and actual economic capacity', () => {
  const state = fresh(); state.buildings[0].level = 4;
  for (const kind of ['wall', 'gate', 'tower', 'mortar', 'bastion', 'storehouse', 'barracks', 'harbor']) {
    const building = {id: 'tested', kind, level: 3, x: 8, y: 8};
    const fixture = {...state, buildings: [...state.buildings, building]};
    const rows = R.SWBuildingUpgradeStats17(fixture, building);
    const health = rows.find(row => row.label === 'Structure health');
    const battle = R.Kl({defense: {name: 'Test', level: 1, buildings: [{...building, level: 4}]}, army: R.wl(), unitLevels: {}, seed: 1, bonus: 1, rulesVersion: 4, combatVersion: 14, navalVersion: 0, orders: []});
    assert.ok(Math.abs(health.after - battle.frames[0].units.find(unit => unit.id === building.id).maxHp) < .05);
    if (kind === 'storehouse') assert.equal(rows[0].after - rows[0].before, R.SWStorageContribution(4) - R.SWStorageContribution(3));
  }
});

test('ship repairs use the same explicit optional instant-completion quote as construction', () => {
  let state = fresh(); state.fleet = [{id: 'cutter', kind: 'cutter', level: 1, wrecked: true, repairReadyAt: now + 90000}];
  const repair = R.GemProjects(state).find(project => project.target === 'repair');
  assert.ok(repair);
  const gems = state.gems, price = R.GemCost(repair.readyAt, now);
  state = R.Ul(state, {type: 'speedup', target: 'repair', id: repair.id, maxCost: price}, now);
  assert.equal(state.gems, gems - price);
  assert.equal(state.fleet[0].wrecked, undefined);
  assert.equal(state.fleet[0].repairReadyAt, undefined);
  assert.throws(() => R.Ul(state, {type: 'speedup', target: 'repair', id: repair.id, maxCost: price}, now), /already complete/);
});
