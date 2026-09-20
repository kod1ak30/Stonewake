import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SWCargoArmy16, SWMoveCargo16, SWSwapCargo16, SWCargoSwapOptions16} from '../../client/build15/preparation.js';
import {SWShipCapacity14, SWTroopWeight14} from '../../client/build14/naval.js';

const weight = ship => Object.entries(ship.cargo).reduce((sum, [kind, count]) => sum + SWTroopWeight14(kind) * count, 0);
function fleet() {
  return [
    {id: 'cutter', kind: 'cutter', level: 1, cargo: {infantry: 8, archer: 4}},
    {id: 'escort', kind: 'galley', level: 1, cargo: {archer: 8}}
  ];
}
function freeze(value) {
  for (const item of Object.values(value)) if (item && typeof item === 'object') freeze(item);
  return Object.freeze(value);
}

test('full holds can explicitly exchange different troops with equal cargo weight', () => {
  const source = fleet(), original = structuredClone(source);
  freeze(source);
  assert.equal(SWMoveCargo16(source, 'infantry', 'cutter', 'escort'), null);
  const result = SWSwapCargo16(source, 'infantry', 'cutter', 'escort', 'archer');
  assert.equal(result.mode, 'swap');
  assert.deepEqual(result.moved, {kind: 'infantry', fromId: 'cutter', toId: 'escort'});
  assert.deepEqual(result.returned, {kind: 'archer', fromId: 'escort', toId: 'cutter'});
  assert.deepEqual(result.fleet[0].cargo, {infantry: 7, archer: 5});
  assert.deepEqual(result.fleet[1].cargo, {archer: 7, infantry: 1});
  assert.deepEqual(SWCargoArmy16(result.fleet), SWCargoArmy16(source));
  assert.deepEqual(result.fleet.map(weight), source.map(weight));
  assert.deepEqual(source, original);
});

test('swap choices identify the exact donor and return unit before any mutation', () => {
  const source = fleet();
  source[1].cargo = {archer: 3, scout: 3, healer: 1};
  source.push({id: 'second-cutter', kind: 'cutter', level: 1, cargo: {infantry: 2}});
  const original = structuredClone(source);
  const options = SWCargoSwapOptions16(source, 'infantry', 'escort');
  assert.deepEqual(options, [
    {kind: 'infantry', fromId: 'cutter', toId: 'escort', returnKind: 'archer'},
    {kind: 'infantry', fromId: 'cutter', toId: 'escort', returnKind: 'scout'},
    {kind: 'infantry', fromId: 'second-cutter', toId: 'escort', returnKind: 'archer'},
    {kind: 'infantry', fromId: 'second-cutter', toId: 'escort', returnKind: 'scout'}
  ]);
  for (const option of options) {
    const result = SWSwapCargo16(source, option.kind, option.fromId, option.toId, option.returnKind);
    assert.ok(result);
    assert.deepEqual(SWCargoArmy16(result.fleet), SWCargoArmy16(source));
  }
  assert.deepEqual(source, original);
});

test('two-space specialists exchange legally while mismatched weights and no-op swaps are rejected', () => {
  const source = [
    {id: 'one', kind: 'cutter', level: 1, cargo: {shieldbearer: 6}},
    {id: 'two', kind: 'galley', level: 1, cargo: {healer: 4}}
  ];
  assert.ok(SWSwapCargo16(source, 'shieldbearer', 'one', 'two', 'healer'));
  assert.equal(SWSwapCargo16(source, 'shieldbearer', 'one', 'two', 'archer'), null);
  assert.equal(SWSwapCargo16(source, 'shieldbearer', 'one', 'one', 'healer'), null);
  assert.equal(SWSwapCargo16(source, 'shieldbearer', 'one', 'two', 'shieldbearer'), null);
  assert.equal(SWSwapCargo16(source, 'shieldbearer', 'missing', 'two', 'healer'), null);
  assert.deepEqual(SWCargoSwapOptions16(source, 'infantry', 'two'), []);
});

test('invalid cargo, duplicate IDs, unknown ships and overfilled holds cannot generate swap options', () => {
  const invalid = [
    value => { value[1].id = value[0].id; },
    value => { value[1].cargo.archer = -1; },
    value => { value[1].cargo.archer = 1.5; },
    value => { value[1].cargo.archer = Infinity; },
    value => { value[1].cargo.archer = 81; },
    value => { value[1].cargo.archer = 9; },
    value => { value[1].cargo.unknown = 0; },
    value => { value[1].cargo = []; },
    value => { value[1].cargo = null; },
    value => { value[1].kind = 'unknown'; },
    value => { value[1].level = 1.5; },
    value => { value[1].level = 0; },
    value => { value[1].level = 11; }
  ];
  for (const mutate of invalid) {
    const source = fleet(); mutate(source);
    const original = structuredClone(source);
    assert.equal(SWSwapCargo16(source, 'infantry', 'cutter', 'escort', 'archer'), null);
    assert.deepEqual(SWCargoSwapOptions16(source, 'infantry', 'escort'), []);
    assert.deepEqual(source, original);
  }
  assert.equal(SWSwapCargo16(null, 'infantry', 'one', 'two', 'archer'), null);
  assert.deepEqual(SWCargoSwapOptions16([], 'infantry', 'two'), []);
  assert.deepEqual(SWCargoSwapOptions16(fleet(), 'unknown', 'escort'), []);
  assert.deepEqual(SWCargoSwapOptions16(fleet(), 'infantry', 'missing'), []);
});

test('ordinary transfer still conserves all troops and respects the receiving hold', () => {
  const source = fleet(); source[1].cargo.archer = 7;
  const original = structuredClone(source); freeze(source);
  const moved = SWMoveCargo16(source, 'infantry', 'cutter', 'escort');
  assert.ok(moved);
  assert.deepEqual(SWCargoArmy16(moved), SWCargoArmy16(source));
  assert.equal(moved[0].cargo.infantry, 7);
  assert.equal(moved[1].cargo.infantry, 1);
  assert.ok(moved.every(ship => weight(ship) <= SWShipCapacity14(ship)));
  assert.equal(SWMoveCargo16(moved, 'infantry', 'cutter', 'escort'), null);
  assert.equal(SWMoveCargo16(source, 'healer', 'cutter', 'escort'), null);
  assert.equal(SWMoveCargo16(source, 'infantry', 'cutter', 'cutter'), null);
  assert.deepEqual(source, original);
});
