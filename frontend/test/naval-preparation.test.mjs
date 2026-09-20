import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../core/server-entry.js';

function kingdom(army, fleet, level = 7) {
  const now = 1800000000000, state = R.Y(R.Al(now), now);
  state.buildings.find(building => building.kind === 'keep').level = level;
  state.buildings.push({id: 'barracks-test', kind: 'barracks', level: 10, x: 3, y: 4});
  state.army = {...R.wl(), ...army};
  state.fleet = fleet;
  const slots = R.SWFamilies14.map(family => family.kinds.find(kind => army[kind] > 0)).filter(Boolean);
  state.loadouts14 = [{id: 'test', name: 'Test force', slots, counts: {...army}}];
  state.activeLoadout14 = 'test';
  return state;
}
function assertLaunchable(state, preparation) {
  assert.equal(preparation.canSail, true);
  const input = R.SWCreateBattle14(state, {kind: 'sea', campaignIndex: 0}, preparation, 19);
  assert.deepEqual(input.army, preparation.army);
  assert.equal(new Set(input.fleet14.map(ship => ship.id)).size, input.fleet14.length);
  for (const ship of input.fleet14) {
    const weight = Object.entries(ship.cargo).reduce((total, [kind, count]) => total + R.SWTroopWeight14(kind) * count, 0);
    assert.ok(weight <= R.SWShipCapacity14(ship));
  }
  assert.equal(preparation.weight, Object.entries(preparation.army).reduce((sum, [kind, count]) => sum + R.SWTroopWeight14(kind) * count, 0));
  assert.equal(preparation.excludedCount, R.Nl(preparation.remaining));
  assert.equal(preparation.troopCount, R.Nl(preparation.army));
  for (const kind of Object.keys(R.J)) assert.equal(preparation.army[kind] + preparation.remaining[kind], preparation.requestedArmy[kind]);
}

test('a small cutter preserves frontline and ranged troops before heavy specialists', () => {
  const state = kingdom({infantry: 6, archer: 6, trebuchet: 2, healer: 1}, [{id: 'cutter', kind: 'cutter', level: 1}]);
  const preparation = R.SWRecommendSeaPreparation14(state);
  assertLaunchable(state, preparation);
  assert.equal(preparation.army.infantry, 5);
  assert.equal(preparation.army.archer, 5);
  assert.equal(preparation.army.healer, 1);
  assert.equal(preparation.army.trebuchet, 0);
  assert.equal(preparation.capacity, 12);
  assert.equal(preparation.weight, 12);
  assert.equal(preparation.requestedWeight, 24);
  assert.equal(preparation.excludedCount, 4);
});

test('loading repacks fragmented holds when two mixed siege groups fit exactly', () => {
  // Greedy descending packing fills 5+5 and 4+4+3, stranding the last rider.
  // Each cutter can instead carry 5+4+3, preserving all six requested units.
  const state = kingdom({cavalry: 2, ram: 2, trebuchet: 2}, [
    {id: 'first', kind: 'cutter', level: 1}, {id: 'second', kind: 'cutter', level: 1}
  ]);
  const preparation = R.SWRecommendSeaPreparation14(state);
  assertLaunchable(state, preparation);
  assert.equal(preparation.excludedCount, 0);
  assert.equal(preparation.weight, 24);
  for (const ship of preparation.fleet) assert.deepEqual(ship.cargo, {cavalry: 1, ram: 1, trebuchet: 1});
});

test('small remainders cannot be pooled across holds to fit another heavy troop', () => {
  const state = kingdom({cavalry: 72}, Array.from({length: 3}, (_, index) => ({id: 'carrier-' + index, kind: 'cog', level: 9})));
  state.buildings.push({id: 'barracks-extra', kind: 'barracks', level: 1, x: 4, y: 3});
  assert.equal(R.Pl(state), 72);
  const preparation = R.SWRecommendSeaPreparation14(state);
  assertLaunchable(state, preparation);
  assert.equal(preparation.troopCount, 63);
  assert.equal(preparation.capacity, 192);
  assert.equal(preparation.weight, 189);
  assert.ok(preparation.fleet.every(ship => ship.cargo.cavalry === 21));
});

test('ship IDs are distinct and invalid or duplicate choices do not consume fleet slots', () => {
  const state = kingdom({infantry: 10, archer: 10}, [
    {id: 'first', kind: 'cutter', level: 1}, {id: 'second', kind: 'cog', level: 1}, {id: 'third', kind: 'cutter', level: 1}
  ], 2);
  const preparation = R.SWRecommendSeaPreparation14(state, state.army, ['missing', 'first', 'first', 'second', 'third']);
  assertLaunchable(state, preparation);
  assert.deepEqual(preparation.ids, ['first', 'second']);
});

test('recommendation prefers sufficient cargo with an available escort', () => {
  const state = kingdom({infantry: 6, archer: 6}, [
    {id: 'cutter', kind: 'cutter', level: 1}, {id: 'carrier', kind: 'cog', level: 1}, {id: 'escort', kind: 'galley', level: 1}
  ]);
  const preparation = R.SWRecommendSeaPreparation14(state);
  assertLaunchable(state, preparation);
  assert.equal(preparation.excludedCount, 0);
  assert.equal(preparation.ids.length, 2);
  assert.ok(preparation.ids.includes('escort'));
  assert.ok(preparation.ids.includes('cutter') || preparation.ids.includes('carrier'));
  assert.deepEqual(R.SWRecommendFleet14({...state, fleet: [...state.fleet].reverse()}), preparation.ids);
});

test('a transport carries the landing force while a smaller escort keeps its hold free', () => {
  const state = kingdom({infantry: 6, archer: 6, healer: 1}, [
    {id: 'carrier', kind: 'cog', level: 4}, {id: 'escort', kind: 'galley', level: 4}
  ]);
  const preparation = R.SWRecommendSeaPreparation14(state);
  assertLaunchable(state, preparation);
  assert.equal(preparation.excludedCount, 0);
  assert.equal(preparation.weight, 14);
  assert.equal(R.SWShipCapacity14(state.fleet[0]), 39);
  assert.equal(R.SWShipCapacity14(state.fleet[1]), 14);
  assert.deepEqual(preparation.fleet.find(ship => ship.id === 'carrier').cargo, {infantry: 6, archer: 6, healer: 1});
  assert.deepEqual(preparation.fleet.find(ship => ship.id === 'escort').cargo, {});
});

test('fleet recommendation chooses the full transport instead of filling an escort to improve tiny gun damage', () => {
  const state = kingdom({infantry: 26, archer: 16}, [
    {id: 'cutter', kind: 'cutter', level: 6}, {id: 'cog', kind: 'cog', level: 6}, {id: 'escort', kind: 'galley', level: 6}
  ], 6);
  const preparation = R.SWRecommendSeaPreparation14(state);
  assertLaunchable(state, preparation);
  assert.deepEqual(preparation.ids, ['cog', 'escort']);
  assert.equal(preparation.weight, 42);
  assert.deepEqual(preparation.fleet.find(ship => ship.id === 'escort').cargo, {});
});

test('unavailable vessels stay unavailable, including returned ships with unclaimed cargo', () => {
  const unavailable = [
    {id: 'building', readyAt: 1}, {id: 'trading', voyage: {readyAt: 1}}, {id: 'fighting', combatBattleId: 'battle'},
    {id: 'wreck', wrecked: true}, {id: 'repairing', repairReadyAt: 1}, {id: 'unfinished', level: 0}
  ].map(ship => ({kind: 'cog', level: 7, ...ship}));
  const state = kingdom({infantry: 6, archer: 6}, [...unavailable, {id: 'ready', kind: 'cutter', level: 1}]);
  const preparation = R.SWRecommendSeaPreparation14(state, state.army, state.fleet.map(ship => ship.id));
  assertLaunchable(state, preparation);
  assert.deepEqual(preparation.ids, ['ready']);
  assert.deepEqual(R.SWRecommendFleet14(state), ['ready']);
});

test('requested troops stay owned, unlocked, integer and in one doctrine per family', () => {
  const state = kingdom({infantry: 12, shieldbearer: 12, archer: 12, crossbow: 12, cavalry: 5, trebuchet: 4, healer: 4}, [{id: 'carrier', kind: 'cog', level: 10}], 3);
  state.loadouts14[0].slots = ['shieldbearer', 'crossbow', 'cavalry'];
  const preparation = R.SWRecommendSeaPreparation14(state, {infantry: 80, shieldbearer: 9.8, archer: 80, crossbow: 4, cavalry: Infinity, trebuchet: 3, healer: 2, ram: -1, unknown: 4});
  assertLaunchable(state, preparation);
  assert.equal(preparation.army.shieldbearer, 9);
  assert.equal(preparation.army.crossbow, 4);
  for (const kind of ['infantry', 'archer', 'cavalry', 'trebuchet', 'healer', 'ram']) assert.equal(preparation.army[kind], 0);
  assert.equal(Object.hasOwn(preparation.army, 'unknown'), false);
});

test('army capacity remains authoritative even when a ship could carry more', () => {
  const state = kingdom({infantry: 40, archer: 40}, [{id: 'carrier', kind: 'cog', level: 10}]);
  state.buildings = state.buildings.filter(building => building.kind !== 'barracks');
  const preparation = R.SWRecommendSeaPreparation14(state);
  assertLaunchable(state, preparation);
  assert.equal(preparation.troopCount, R.Pl(state));
  assert.equal(preparation.army.infantry, 3);
  assert.equal(preparation.army.archer, 3);
  assert.equal(R.SWPreparationArmy14(state, {infantry: 999}).infantry, 6);
});

test('an explicit empty force or fleet stays empty instead of adding unrequested troops or ships', () => {
  const state = kingdom({infantry: 6, archer: 6}, [{id: 'cutter', kind: 'cutter', level: 1}]);
  assert.equal(R.SWRecommendSeaPreparation14(state, {}).troopCount, 0);
  assert.equal(R.SWRecommendSeaPreparation14(state, {}).canSail, false);
  assert.deepEqual(R.SWRecommendFleet14(state, {}), []);
  const noShips = R.SWRecommendSeaPreparation14(state, state.army, []);
  assert.deepEqual(noShips.fleet, []);
  assert.equal(noShips.canSail, false);
  assert.equal(noShips.excludedCount, 12);
  state.loadouts14[0].counts = {infantry: 0, archer: 0};
  assert.equal(R.SWRecommendSeaPreparation14(state).troopCount, 0);
  assert.equal(R.SWRecommendSeaPreparation14(state).canSail, false);
  const onlyArchers = R.SWRecommendSeaPreparation14(state, {archer: 4});
  assertLaunchable(state, onlyArchers);
  assert.equal(onlyArchers.army.infantry, 0);
  assert.equal(onlyArchers.army.archer, 4);
});

test('too few troops and unsuitable hold sizes remain blocked', () => {
  const state = kingdom({infantry: 2, trebuchet: 4}, [{id: 'barge', kind: 'bombard', level: 1}]);
  const preparation = R.SWRecommendSeaPreparation14(state);
  assert.equal(preparation.canSail, false);
  assert.equal(preparation.troopCount, 2);
  assert.equal(preparation.army.trebuchet, 0);
  assert.match(preparation.reason, /three/);
});

test('recommendations do not alter the kingdom, requested force or selected ship IDs', () => {
  const state = kingdom({infantry: 6, archer: 6, healer: 2}, [{id: 'cutter', kind: 'cutter', level: 1}, {id: 'escort', kind: 'galley', level: 1}]);
  const original = structuredClone(state), requested = {...state.army}, ids = ['cutter', 'escort'];
  function freeze(value) { for (const item of Object.values(value)) if (item && typeof item === 'object') freeze(item); return Object.freeze(value); }
  freeze(state); freeze(requested); freeze(ids);
  const first = R.SWRecommendSeaPreparation14(state, requested, ids);
  assert.deepEqual(R.SWRecommendSeaPreparation14(state, requested, ids), first);
  assert.deepEqual(R.SWRecommendSeaPreparation14(state, requested), R.SWRecommendSeaPreparation14(state, requested));
  assert.deepEqual(state, original);
  assert.deepEqual(requested, original.army);
  assert.deepEqual(ids, ['cutter', 'escort']);
});
