// Shared medieval progression and economy. Quotes are pure; actions mutate only
// the already-cloned kingdom supplied by the authoritative action dispatcher.
import {Cc, Hl, Ic, Il, Ml, Pl, SWCapacity, SWCivicLevel, SWPremium, SWPremiumCatalog,
  SWPremiumCollections, SWTradeQuote, sl, xl, zl} from '../../frontend/core/rules.js';

/** @typedef {import('../../frontend/contracts/game.ts').Building} Building */
/** @typedef {import('../../frontend/contracts/game.ts').Resources} Resources */
/** @typedef {{voyage?: {readyAt: number, reward: Partial<Resources>}}} CargoShip */
/** @typedef {import('../../frontend/contracts/game.ts').Kingdom & {
 * fleet?: CargoShip[], harborDepot17: Record<string, number>,
 * harborDepotVersion17?: number, harborDepotLegacyCap17?: number
 * }} Kingdom17 */
/** @typedef {{label: string, before: number, after: number, unit: string}} UpgradeStat */

/** @param {Kingdom17} state */
export function SWCampaignProgress17(state) {
  /** @param {number | undefined} value */
  const clears = value => typeof value === 'number' && Number.isInteger(value) ? Math.max(0, Math.min(10, value)) : 0;
  const land = clears(state.campaign), sea = clears(state.seaCampaign), required = Math.min(10, Ml(state));
  return {land, sea, total: land + sea, required, next: Math.min(10, required + 1), met: required === 10 || land + sea >= required};
}

/** @param {Record<string, number> | Partial<Resources> | undefined} [raw] */
const resources = raw => Object.fromEntries(xl.map(kind => {
  const value = /** @type {Record<string, number> | undefined} */ (raw)?.[kind];
  return [kind, typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0];
}));
/** @param {Kingdom17} state */
function committedCargo(state) {
  return Object.fromEntries(xl.map(kind => [kind, (state.fleet || []).reduce((sum, ship) => sum + resources(ship.voyage?.reward)[kind], 0)]));
}
/** @param {Kingdom17} state */
export function SWMigrateHarbor17(state) {
  state.harborDepot17 = resources(state.harborDepot17);
  const committed = committedCargo(state), held = Math.max(0, ...xl.map(kind => state.harborDepot17[kind] + committed[kind]));
  // Existing cargo is grandfathered once. This allowance only decreases as
  // those goods are used; it can never mint cargo or become an unlimited bank.
  if (state.harborDepotVersion17 !== 1) {
    state.harborDepotLegacyCap17 = held;
    state.harborDepotVersion17 = 1;
  } else state.harborDepotLegacyCap17 = Math.min(Math.max(0, state.harborDepotLegacyCap17 || 0), held);
  return state;
}
/** @param {Kingdom17} state */
export function SWDepotStatus17(state) {
  const stored = resources(state.harborDepot17), committed = committedCargo(state);
  const main = /** @type {Record<string, number>} */ (state.resources);
  const capacity = Math.max(SWCapacity(state), state.harborDepotLegacyCap17 || 0);
  return {resources: stored, capacity, committed,
    available: Object.fromEntries(xl.map(kind => [kind, Math.max(0, capacity - stored[kind] - committed[kind])])),
    canClaim: xl.some(kind => stored[kind] > 0 && main[kind] < SWCapacity(state))};
}
/** @param {Kingdom17} state @param {Partial<Resources>} reward */
export function SWReserveVoyage17(state, reward) {
  const depot = SWDepotStatus17(state);
  if (xl.some(kind => resources(reward)[kind] > depot.available[kind])) throw Error('Move supplies from the Harbor depot into Storage before sending another trade voyage.');
}
/** @param {Kingdom17} state @param {CargoShip} ship @param {number} now */
export function SWUnloadVoyage17(state, ship, now) {
  if (!ship?.voyage || ship.voyage.readyAt > now) throw Error('This ship has not returned yet.');
  const cargo = resources(ship.voyage.reward), depot = SWDepotStatus17(state), cap = SWCapacity(state);
  const main = /** @type {Record<string, number>} */ (state.resources);
  const delivered = Object.fromEntries(xl.map(kind => [kind, Math.min(cargo[kind], Math.max(0, cap - main[kind]))]));
  const stored = Object.fromEntries(xl.map(kind => [kind, cargo[kind] - delivered[kind]]));
  if (xl.some(kind => depot.resources[kind] + stored[kind] > depot.capacity)) throw Error('Move supplies out of the Harbor depot before unloading this cargo.');
  for (const kind of xl) { main[kind] += delivered[kind]; state.harborDepot17[kind] += stored[kind]; }
  delete ship.voyage;
  return {delivered, stored};
}
/** @param {Kingdom17} state */
export function SWClaimHarborDepot17(state) {
  const depot = SWDepotStatus17(state), moved = resources();
  const main = /** @type {Record<string, number>} */ (state.resources);
  for (const kind of xl) moved[kind] = Math.min(depot.resources[kind], Math.max(0, SWCapacity(state) - main[kind]));
  if (!xl.some(kind => moved[kind] > 0)) throw Error('Spend supplies or expand Storage before collecting from the Harbor depot.');
  for (const kind of xl) { main[kind] += moved[kind]; state.harborDepot17[kind] -= moved[kind]; }
  return moved;
}

/** @param {Kingdom17} state @param {string} id */
export function SWCollectionQuote17(state, id) {
  const collection = SWPremiumCollections.find(item => item.id === id);
  if (!collection) throw Error('Choose a collection.');
  const owned = new Set(SWPremium(state).owned), items = collection.items.map(itemId => {
    const item = SWPremiumCatalog.find(item => item.id === itemId);
    if (!item) throw Error('This collection is unavailable.');
    return item;
  });
  const missing = items.filter(item => !owned.has(item.id)), priceGems = Math.ceil(missing.reduce((sum, item) => sum + (item.priceGems || 0), 0) * .8);
  const reason = !missing.length ? 'Collection owned' : missing.some(item => item.priceGems === null) ? 'Earn these pieces through adventures' : state.gems < priceGems ? 'More gems needed' : null;
  return {id, name: collection.name, description: collection.description, items, missing, ownedCount: items.length - missing.length, priceGems, canBuy: !reason, reason};
}

/** @param {Kingdom17} state @param {Record<string, number>} cost */
export function SWShortfallTrades17(state, cost) {
  const spareFood = Math.max(0, state.resources.food - (cost.food || 0)), result = [];
  const main = /** @type {Record<string, number>} */ (state.resources);
  for (const resource of ['wood', 'stone', 'gold']) {
    const shortfall = Math.max(0, (cost[resource] || 0) - main[resource]);
    if (!shortfall) continue;
    const choices = [50, 100, 250].map(amount => SWTradeQuote(state, resource, amount, 'food')).filter(quote => !quote.reason && quote.payment <= spareFood);
    const quote = choices.find(item => item.amount >= shortfall) || choices.at(-1);
    if (quote) result.push({...quote, shortfall, action: {type: 'marketTrade', resource, amount: quote.amount, payWith: 'food'}, label: quote.payment + ' food → ' + quote.amount + ' ' + (resource === 'wood' ? 'timber' : resource)});
  }
  return result;
}

/** @param {Kingdom17} state @param {Building | undefined} building */
export function SWBuildingUpgradeStats17(state, building) {
  if (!building || building.level >= 10) return [];
  const next = {...building, level: Math.max(1, building.level + 1)}, after = {...state, buildings: state.buildings.map(item => item.id === building.id ? next : item)};
  /** @type {UpgradeStat[]} */
  const rows = [];
  /** @param {string} label @param {number} before @param {number} value @param {string} unit */
  const add = (label, before, value, unit = '') => { if (Math.abs(value - before) > .00001) rows.push({label, before: Math.round(before * 10) / 10, after: Math.round(value * 10) / 10, unit}); };
  /** @type {Record<string, keyof Resources>} */
  const income = {farm: 'food', lumber: 'wood', quarry: 'stone', cottage: 'gold', market: 'gold', harbor: 'gold', keep: 'gold'};
  if (building.kind === 'storehouse') add('Storage per resource', SWCapacity(state), SWCapacity(after));
  if (building.kind === 'keep') add('Base storage per resource', 500 + 250 * building.level, 500 + 250 * next.level);
  if (building.kind === 'barracks') add('Army capacity', Pl(state), Pl(after), 'troops');
  if (building.kind === 'forge') add('Army attack bonus', (Hl(state) - 1) * 100, (Hl(after) - 1) * 100, '%');
  if (building.kind === 'harbor') add('Ship berths', Math.min(8, building.level + 1), Math.min(8, next.level + 1));
  if (building.kind === 'cottage') add('Residents', zl(state), zl(after));
  if (building.kind === 'builder') { add('Construction crews', Ic(state), Ic(after)); add('Crew speed bonus', Math.min(.6, state.buildings.filter(item => item.kind === 'builder').reduce((sum, item) => sum + Math.max(0, item.level - 1) * .025, 0)) * 100, Math.min(.6, after.buildings.filter(item => item.kind === 'builder').reduce((sum, item) => sum + Math.max(0, item.level - 1) * .025, 0)) * 100, '%'); }
  if (building.kind === 'workshop') add('Construction time reduction', Math.min(30, SWCivicLevel(state, 'workshop') * 3), Math.min(30, SWCivicLevel(after, 'workshop') * 3), '%');
  if (building.kind === 'tavern') add('Resident request gold bonus', Math.min(50, SWCivicLevel(state, 'tavern') * 5), Math.min(50, SWCivicLevel(after, 'tavern') * 5), '%');
  if (income[building.kind]) add((income[building.kind] === 'wood' ? 'Timber' : income[building.kind][0].toUpperCase() + income[building.kind].slice(1)) + ' income', Il(state)[income[building.kind]], Il(after)[income[building.kind]], '/ min');
  if (building.kind === 'well') for (const resource of /** @type {(keyof Resources)[]} */ (xl)) add(resource === 'wood' ? 'Timber income' : resource[0].toUpperCase() + resource.slice(1) + ' income', Il(state)[resource], Il(after)[resource], '/ min');
  /** @param {Building} item */
  const health = item => Cc.includes(item.kind) ? sl(item).hp : (item.kind === 'keep' ? 1050 : item.kind === 'wall' ? 500 : item.kind === 'gate' ? 330 : 300) * (1 + (item.level - 1) * .35);
  if (Cc.includes(building.kind)) add('Damage per hit', sl(building).damage, sl(next).damage);
  add('Structure health', health(building), health(next));
  return rows;
}
