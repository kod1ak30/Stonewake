import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SWKeepFrames17, SWKeepRearFrames17, SWEconomyFrames17} from '../../client/build17/art-metadata.js';
import {SWKeepSize17, SWEconomySize17, SWWallMaterials17, SWWallPlan17, SWPaintWall17, SWRoadNetwork17} from '../../client/build17/world.js';
import {loadDeclarations} from './load-declarations.mjs';

const world = new URL('../../client/build17/world.js', import.meta.url);
const visuals = new URL('../../client/visual13.js', import.meta.url);
const render = new URL('../../client/build14/render.js', import.meta.url);
const coord = point => `${point.x},${point.y}`;

function canvasContext() {
  const calls = [], points = [], faces = [], alphas = [];
  let path = [];
  return {
    globalAlpha: 1, calls, points, faces,
    save() { alphas.push(this.globalAlpha); },
    restore() { assert.ok(alphas.length); this.globalAlpha = alphas.pop(); },
    beginPath() { path = []; },
    moveTo(x, y) { points.push({x, y}); path.push({x, y}); },
    lineTo(x, y) { points.push({x, y}); path.push({x, y}); },
    closePath() {},
    fill() { faces.push({points: path.slice(), color: this.fillStyle}); },
    stroke(...args) { calls.push({name: 'stroke', args}); },
    ellipse(x, y, rx, ry) { points.push({x: x-rx, y: y-ry}, {x: x+rx, y: y+ry}); },
    translate(...args) { calls.push({name: 'translate', args}); },
    scale(...args) { calls.push({name: 'scale', args}); },
    transform(...args) { calls.push({name: 'transform', args}); },
    drawImage(...args) { calls.push({name: 'drawImage', args}); },
    balanced() { assert.equal(alphas.length, 0); assert.equal(this.globalAlpha, 1); },
  };
}

function assertAtlasBounds(file, frames) {
  const png = readFileSync(new URL('../../Stonewake/Web/art/build17/'+file, import.meta.url));
  assert.equal(png.toString('ascii', 1, 4), 'PNG');
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  for (const [index, frame] of frames.entries()) {
    assert.ok(frame.w > 0 && frame.h > 0);
    assert.ok(frame.x >= 0 && frame.y >= 0 && frame.x+frame.w <= width && frame.y+frame.h <= height, `${file} crop ${index+1} is outside the atlas`);
    for (const other of frames.slice(index+1)) {
      assert.ok(frame.x+frame.w <= other.x || other.x+other.w <= frame.x || frame.y+frame.h <= other.y || other.y+other.h <= frame.y, 'Level crops overlap');
    }
  }
}

test('all front and rear Keep frames fit their actual PNGs without overlapping another level', () => {
  assert.equal(SWKeepFrames17.length, 10);
  assert.equal(SWKeepRearFrames17.length, 10);
  assertAtlasBounds('keep-levels.png', SWKeepFrames17);
  assertAtlasBounds('keep-rear.png', SWKeepRearFrames17);
  for (let level = 1; level <= 10; level++) for (const facing of [0, 2]) {
    const size = SWKeepSize17(level, facing), frame = size.frame;
    assert.ok(Math.abs(size.width / size.height - frame.w / frame.h) < 1e-9, 'Authored silhouette is stretched');
    assert.ok(size.width/2 < 160 && size.height < 320, 'Keep exceeds the existing building cache tile');
  }
  assert.deepEqual(SWKeepSize17(0), SWKeepSize17(1));
  assert.deepEqual(SWKeepSize17(99), SWKeepSize17(10));
});

test('all four Keep facings select the matching front or rear level and mirror without old props', () => {
  const {SW13BuildingArt, SWLegacySculpted13} = loadDeclarations(visuals, ['SW13BuildingArt', 'SWLegacySculpted13'], {SWKeepSize17, SWEconomySize17});
  const {SWDrawSculptedBuilding13} = loadDeclarations(render, ['SWDrawSculptedBuilding13'], {
    SW13BuildingArt, SWLegacySculpted13, SW13BuildingCells: {keep: [0, 1, 2]},
    SWRigMesh() { throw Error('Old tier props must not overlay the authored Keep'); },
  });
  const images = {keep17: {src: 'keep-levels.png'}, keepRear17: {src: 'keep-rear.png'}}, crops = new Set();
  for (let level = 1; level <= 10; level++) {
    const orientations = new Set();
    for (let facing = 0; facing < 4; facing++) {
      const context = canvasContext(), size = SWKeepSize17(level, facing), building = {kind: 'keep', level, facing};
      const expectedImage = facing >= 2 ? images.keepRear17 : images.keep17;
      assert.equal(SW13BuildingArt(building, images).image, expectedImage);
      assert.equal(SWDrawSculptedBuilding13(context, building, images, {x: 160, y: 320}, size.width), true);
      const draws = context.calls.filter(call => call.name === 'drawImage');
      assert.equal(draws.length, 1);
      const [source, x, y, w, h, dx, dy, dw, dh] = draws[0].args;
      assert.equal(source, expectedImage);
      assert.deepEqual({x, y, w, h}, size.frame);
      assert.ok(Math.abs(dw/dh-w/h) < 1e-9);
      assert.ok(160+dx >= 0 && 160+dx+dw <= 320 && 327+dy >= 0 && 327+dy+dh <= 360);
      const mirrored = context.calls.some(call => call.name === 'scale' && call.args[0] === -1 && call.args[1] === 1);
      assert.equal(mirrored, facing === 1 || facing === 2);
      orientations.add([source.src, mirrored].join(':'));
      crops.add([source.src, x, y, w, h].join(','));
      context.balanced();
    }
    assert.equal(orientations.size, 4, 'Rotation repeats a front view instead of using the rear atlas');
  }
  assert.equal(crops.size, 20);
});

test('economic crops fit the real atlas and keep each family distinct through its authored tiers', () => {
  assert.equal(SWEconomyFrames17.length, 12);
  assertAtlasBounds('economy-buildings.png', SWEconomyFrames17);
  const {SW13BuildingArt, SWLegacySculpted13} = loadDeclarations(visuals, ['SW13BuildingArt', 'SWLegacySculpted13'], {SWKeepSize17, SWEconomySize17});
  const {SWDrawSculptedBuilding13} = loadDeclarations(render, ['SWDrawSculptedBuilding13'], {
    SW13BuildingArt, SWLegacySculpted13,
    SWRigMesh() { throw Error('Legacy props must not overlay authored economic buildings'); },
  });
  const images = {economy17: {src: 'economy-buildings.png'}}, allCrops = new Set();
  for (const kind of ['farm', 'lumber', 'quarry', 'storehouse']) {
    const tierCrops = new Set();
    let previousWidth = 0;
    for (let level = 1; level <= 10; level++) {
      const size = SWEconomySize17(kind, level), building = {kind, level, facing: 0};
      assert.ok(size && size.width > previousWidth && size.height > 0);
      assert.ok(size.width/2 < 160 && size.height < 320, 'Economic building clips the shared building tile');
      previousWidth = size.width;
      const art = SW13BuildingArt(building, images);
      assert.equal(art.image, images.economy17);
      assert.deepEqual(art.frame, size.frame);
      const context = canvasContext();
      assert.equal(SWDrawSculptedBuilding13(context, building, images, {x: 160, y: 320}, size.width), true);
      const [source, x, y, w, h, , , width, height] = context.calls.find(call => call.name === 'drawImage').args;
      assert.equal(source, images.economy17);
      assert.equal(width, size.width, 'World art width diverged from selection and collapse geometry');
      assert.ok(Math.abs(width/height-w/h) < 1e-9, 'Economic silhouette is stretched');
      tierCrops.add([x, y, w, h].join(','));
      context.balanced();
    }
    assert.equal(tierCrops.size, 3);
    for (const crop of tierCrops) { assert.ok(!allCrops.has(crop), 'Two building families share an unrelated crop'); allCrops.add(crop); }
  }
  assert.equal(allCrops.size, 12);
  assert.equal(SWEconomySize17('tower', 1), null);
});

test('mixed-level walls meet all actual neighbours through ends, corners, tees, crosses and gates', () => {
  const buildings = [
    {x: 0, y: 0, level: 1}, {x: 1, y: 0, level: 4},
    {x: 2, y: 0, kind: 'gate', axis: 'x', level: 6}, {x: 3, y: 0, level: 10},
    {x: 1, y: 1, level: 5}, {x: 1, y: 2, level: 8},
    {x: 0, y: 2, level: 3}, {x: 2, y: 2, level: 9}, {x: 1, y: 3, level: 7},
  ].map((building, index) => ({kind: 'wall', id: 'wall-'+index, ...building}));
  const map = new Map(buildings.map(building => [coord(building), building]));
  const original = JSON.stringify(buildings);
  for (const building of buildings) {
    const plan = SWWallPlan17(building, map);
    for (const [dx, dy] of plan.links) {
      const neighbour = map.get(`${building.x+dx},${building.y+dy}`);
      assert.ok(neighbour, 'A joined wall grows into an empty plot');
      const reverse = SWWallPlan17(neighbour, map).links;
      assert.ok(reverse.some(([nx, ny]) => nx === -dx && ny === -dy), 'Connection has no matching neighbour end');
      const edge = {x: building.x+dx/2, y: building.y+dy/2};
      assert.deepEqual(edge, {x: neighbour.x-dx/2, y: neighbour.y-dy/2});
    }
  }
  assert.equal(SWWallPlan17(buildings[0], map).junction, true, 'An exposed end needs a finished post');
  assert.equal(SWWallPlan17(buildings[1], map).links.length, 3);
  assert.equal(SWWallPlan17(buildings[5], map).links.length, 4);
  assert.equal(JSON.stringify(buildings), original);
});

test('gate openings follow the selected wall axis while painted bounds fit the cached tile at every level', () => {
  for (let level = 1; level <= 10; level++) for (const axis of ['x', 'y']) {
    const gate = {id: 'gate', kind: 'gate', x: 0, y: 0, axis, level};
    const neighbours = new Set(axis === 'x' ? ['-1,0', '1,0'] : ['0,-1', '0,1']);
    const context = canvasContext();
    SWPaintWall17(context, gate, neighbours, new Map(), .7);
    const door = context.faces.find(face => face.color === '#584735');
    assert.ok(door && door.points.length === 4, 'Gate lost its visible doorway');
    const [a, b] = door.points;
    assert.equal(Math.sign(b.x-a.x), axis === 'x' ? 1 : -1);
    assert.ok(b.y > a.y && Math.abs(b.x-a.x) < 52, 'Door should sit inside the joined wall span');
    assert.ok(context.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 530 && p.x <= 670 && p.y >= 93 && p.y <= 205), `Level ${level} gate clips its cached tile`);
    context.balanced();
  }
});

test('wall material upgrades change silhouettes and ruins clear the standing wall height', () => {
  assert.equal(SWWallMaterials17.length, 10);
  assert.equal(new Set(SWWallMaterials17.map(material => material.name)).size, 10);
  assert.ok(SWWallMaterials17[0].wood && !SWWallMaterials17[9].wood);
  let previousHeight = 0;
  for (let level = 1; level <= 10; level++) {
    const material = SWWallMaterials17[level-1];
    assert.ok(material.height > previousHeight, 'Upgrade has no silhouette height change');
    previousHeight = material.height;
    const wall = {id: 'w', kind: 'wall', x: 0, y: 0, level};
    const links = new Set(['1,0', '-1,0', '0,1', '0,-1']);
    const alive = canvasContext(), ruined = canvasContext();
    SWPaintWall17(alive, wall, links, new Map([['w', {hp: 25, maxHp: 100}]]));
    SWPaintWall17(ruined, wall, links, new Map([['w', {hp: 0, maxHp: 100}]]));
    for (const context of [alive, ruined]) {
      assert.ok(context.points.length > 0);
      assert.ok(context.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 530 && p.x <= 670 && p.y >= 93 && p.y <= 205), `Level ${level} wall clips its cached tile`);
      context.balanced();
    }
    assert.ok(Math.min(...ruined.points.map(p => p.y)) > Math.min(...alive.points.map(p => p.y))+10, 'Ruins still fill the standing silhouette');
  }
});

test('converting a corner or tee into a gate retains each perpendicular wall connection', () => {
  for (const axis of ['x', 'y']) for (const sign of [-1, 1]) {
    const gate = {id: 'gate', kind: 'gate', x: 0, y: 0, level: 6, axis};
    const straight = new Set(axis === 'x' ? ['-1,0', '1,0'] : ['0,-1', '0,1']);
    const dx = axis === 'y' ? sign : 0, dy = axis === 'x' ? sign : 0;
    const corner = new Set([...straight, `${dx},${dy}`]);
    const before = canvasContext(), joined = canvasContext();
    SWPaintWall17(before, gate, straight, new Map());
    SWPaintWall17(joined, gate, corner, new Map());
    const existing = new Set(before.points.map(coord));
    const additional = joined.points.filter(point => !existing.has(coord(point)));
    const edge = {x: 600+(dx-dy)*26, y: 175+(dx+dy)*13.5};
    assert.ok(additional.some(point => Math.hypot(point.x-edge.x, point.y-edge.y) < 11), 'Gate has no painted arm reaching its perpendicular neighbour');
    assert.ok(joined.faces.length > before.faces.length);
    joined.balanced();
  }
});

test('roads join across a gate and stop before building and wall footprints without duplicate edges', () => {
  const terrain = Array.from({length: 6}, (_, x) => ({kind: 'road', x, y: 0}));
  const routes = [[{x: 2, y: -1}, {x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}], [{x: 1, y: 0}, {x: 2, y: 0}]];
  const buildings = [{kind: 'keep', x: 0, y: 0}, {kind: 'gate', x: 2, y: 0}, {kind: 'wall', x: 5, y: 0}, {kind: 'cottage', x: 2, y: 2}];
  const before = JSON.stringify({terrain, routes, buildings});
  const {tiles, segments} = SWRoadNetwork17(terrain, routes, buildings);
  const occupied = new Set(['0,0', '5,0', '2,2']);
  assert.ok(tiles.every(tile => !occupied.has(coord(tile))));
  assert.ok(tiles.some(tile => coord(tile) === '2,0'), 'Gate passage disappeared');
  const edges = new Set(), connected = new Set(['1,0']);
  for (const [a, b] of segments) {
    assert.equal(Math.abs(a.x-b.x)+Math.abs(a.y-b.y), 1);
    assert.ok(!occupied.has(coord(a)) && !occupied.has(coord(b)));
    const key = [coord(a), coord(b)].sort().join('|');
    assert.ok(!edges.has(key), 'Duplicate road produces a darker seam');
    edges.add(key);
  }
  for (let pass = 0; pass < tiles.length; pass++) for (const [a, b] of segments) {
    if (connected.has(coord(a))) connected.add(coord(b));
    if (connected.has(coord(b))) connected.add(coord(a));
  }
  assert.equal(connected.size, tiles.length, 'A bend or crossing is disconnected');
  assert.ok(connected.has('4,0') && connected.has('2,-1') && connected.has('2,1'));
  assert.equal(JSON.stringify({terrain, routes, buildings}), before);
});

test('isolated road ends remain on their own plot and malformed coordinates never reach the canvas', () => {
  const network = SWRoadNetwork17([{kind: 'road', x: -2, y: 3}, {kind: 'tree', x: -1, y: 3}, {kind: 'road', x: NaN, y: 0}], [[{x: .5, y: 2}, {x: Infinity, y: 0}]]);
  assert.deepEqual(network.tiles, [{x: -2, y: 3}]);
  assert.equal(network.segments.length, 1);
  for (const point of network.segments[0]) assert.ok(point.x > -2.5 && point.x < -1.5 && point.y === 3);
});

test('road paths reuse unchanged topology across real frame allocations and update when footprints move', () => {
  let allocations = 0;
  class Path {
    constructor() { allocations++; }
    moveTo() {}
    lineTo() {}
    closePath() {}
  }
  const {SWDrawRoads17} = loadDeclarations(world, ['directions', 'keyOf', 'SWRoadNetwork17', 'roadNetworks', 'SWDrawRoads17'], {Path2D: Path});
  const context = canvasContext();
  const makeRoads = () => Array.from({length: 12}, (_, x) => ({kind: 'road', x, y: 1}));
  SWDrawRoads17(context, makeRoads(), [], {road:'stone'}, [{kind:'keep',x:0,y:1}]);
  const firstAllocation=allocations;assert.ok(firstAllocation>0);
  for (let frame = 0; frame < 120; frame++) SWDrawRoads17(context, makeRoads(), [], {road: frame % 2 ? 'stone' : 'earth'}, [{kind: 'keep', x: 0, y: 1}]);
  assert.equal(allocations, firstAllocation, 'Unchanged roads allocate new paths during animation');
  SWDrawRoads17(context, makeRoads(), [], {}, [{kind: 'keep', x: 1, y: 1}]);
  assert.equal(allocations, firstAllocation*2, 'Moving a building left its old road geometry cached');
  context.balanced();
});

test('a single road plot renders finite cobbles at ordinary and negative map coordinates', () => {
  class FinitePath {
    moveTo(x, y) { assert.ok(Number.isFinite(x) && Number.isFinite(y)); }
    lineTo(x, y) { this.moveTo(x, y); }
    closePath() {}
  }
  const {SWDrawRoads17} = loadDeclarations(world, ['directions', 'keyOf', 'SWRoadNetwork17', 'roadNetworks', 'SWDrawRoads17'], {Path2D: FinitePath});
  for (const road of ['earth', 'stone', 'royal']) for (const [x, y] of [[0, 0], [-3, 6], [8, 9]]) {
    const context = canvasContext();
    assert.doesNotThrow(() => SWDrawRoads17(context, [{kind: 'road', x, y}], [], {road}, []));
    assert.ok(context.calls.some(call => call.name === 'stroke'));
    context.balanced();
  }
});
