import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../core/server-entry.js';
import {SWCampaignFort17} from '../../client/build17/campaign.js';

const coordinate = building => `${building.x},${building.y}`;
const wallKinds = new Set(['wall', 'gate']);
const neighbours = point => [{x: point.x-1, y: point.y}, {x: point.x+1, y: point.y}, {x: point.x, y: point.y-1}, {x: point.x, y: point.y+1}];
const silhouette = defense => defense.buildings.map(building => building.kind+'@'+coordinate(building)).sort().join('|');

function assertEnclosed(defense) {
  const barrier = new Set(defense.buildings.filter(building => wallKinds.has(building.kind)).map(coordinate));
  const exterior = new Set(['-1,-1']), queue = [{x: -1, y: -1}];
  for (let index = 0; index < queue.length; index++) for (const next of neighbours(queue[index])) {
    const key = coordinate(next);
    if (next.x < -1 || next.x > 9 || next.y < -1 || next.y > 9 || exterior.has(key) || barrier.has(key)) continue;
    exterior.add(key); queue.push(next);
  }
  for (const building of defense.buildings.filter(building => !wallKinds.has(building.kind))) {
    assert.ok(!exterior.has(coordinate(building)), `${defense.name}: ${building.kind} is outside the defended enclosure`);
  }
  const gates = defense.buildings.filter(building => building.kind === 'gate');
  assert.ok(gates.length >= 2, 'Fort has no meaningful alternate entrance');
  for (const gate of gates) {
    const along = gate.axis === 'x' ? [{x: gate.x-1, y: gate.y}, {x: gate.x+1, y: gate.y}] : [{x: gate.x, y: gate.y-1}, {x: gate.x, y: gate.y+1}];
    assert.ok(along.every(point => barrier.has(coordinate(point))), `${defense.name}: gate has a disconnected wall end`);
  }
}

test('all ten Land and Sea forts have distinct geometry, enclosed structures and connected gates', () => {
  for (const sea of [false, true]) {
    const silhouettes = new Set();
    for (let chapter = 0; chapter < 10; chapter++) {
      const defense = SWCampaignFort17(sea ? Math.max(0, chapter-1) : chapter, (sea ? 'Sea ' : 'Land ')+(chapter+1), chapter+1, {sea, chapter});
      assert.equal(new Set(defense.buildings.map(coordinate)).size, defense.buildings.length, 'Two structures occupy one tile');
      assert.equal(new Set(defense.buildings.map(building => building.id)).size, defense.buildings.length);
      assert.ok(defense.buildings.every(building => Number.isInteger(building.x) && Number.isInteger(building.y) && building.x >= 0 && building.x <= 8 && building.y >= 0 && building.y <= 8));
      assertEnclosed(defense);
      assert.ok(defense.tacticalHint17.length > 25);
      silhouettes.add(silhouette(defense));
    }
    assert.equal(silhouettes.size, 10, 'Chapter names or levels changed, but geometry repeats');
  }
});

test('authored fort placement retains established combat and economic building counts before Sea adjustments', () => {
  // Historical fort contract: towers, mortars, bomb towers, flame towers, bastions.
  const counts = [[2,0,0,0,0], [3,0,0,0,0], [3,1,0,0,0], [3,1,1,0,0], [3,1,1,1,0], [3,1,1,1,0], [3,1,1,1,1], [3,1,1,1,1], [3,1,1,1,2], [3,1,1,1,2]];
  const kinds = ['tower', 'mortar', 'bombtower', 'flame', 'bastion'];
  for (const sea of [false, true]) for (let chapter = 0; chapter < 10; chapter++) {
    const stage = sea ? Math.max(0, chapter-1) : chapter;
    const defense = SWCampaignFort17(stage, 'Count check', 4, {sea, chapter});
    assert.deepEqual(kinds.map(kind => defense.buildings.filter(building => building.kind === kind).length), counts[stage]);
    for (const kind of ['keep', 'cottage', 'market', 'farm', 'lumber', 'barracks', 'quarry']) assert.equal(defense.buildings.filter(building => building.kind === kind).length, 1);
    assert.ok(defense.buildings.every(building => building.level === 4), 'Layout silently changed defensive levels');
    const perimeter = defense.buildings.filter(building => wallKinds.has(building.kind)).length;
    assert.ok(perimeter >= 30 && perimeter <= 34, 'Authored recess inflated the wall budget');
  }
});

test('actual Sea missions retain their harbor, shore defenses and unoccupied legal landing lane', () => {
  const shapes = new Set();
  for (let chapter = 0; chapter < 10; chapter++) {
    const defense = R.SWSeaDefense14(chapter);
    assert.equal(new Set(defense.buildings.map(coordinate)).size, defense.buildings.length);
    const harbor = defense.buildings.find(building => building.id === 'sea-harbor');
    assert.ok(harbor, 'Boundary wall erased the harbor');
    assert.equal(harbor.kind, 'harbor');
    assert.deepEqual({x: harbor.x, y: harbor.y}, {x: 0, y: 6});
    assert.ok(defense.buildings.every(building => building.x >= 0 && building.y >= 0 && building.y <= 8), 'A land structure occupies the water/landing lane');
    for (let y = 0; y <= 8; y++) assert.equal(R.SWSeaLanding14(defense, -1, y), true);
    if (chapter >= 2) {
      const battery = defense.buildings.find(building => building.id === 'shore-battery');
      assert.ok(battery && battery.kind === 'tower' && battery.specialty === 'ballista');
    }
    shapes.add(silhouette(defense));
  }
  assert.equal(shapes.size, 10);
});
