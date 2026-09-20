import test from 'node:test';
import assert from 'node:assert/strict';
import {loadDeclarations} from './load-declarations.mjs';
import {SWShipDamageArt17} from '../../client/build17/unit-art.js';

const render = new URL('../../client/build14/render.js', import.meta.url);
const visuals = new URL('../../client/visual13.js', import.meta.url);

function canvasContext() {
  const calls = [];
  const context = {globalAlpha: 1, calls};
  for (const name of ['save', 'restore', 'translate', 'scale', 'rotate', 'beginPath', 'closePath', 'ellipse', 'fill', 'stroke', 'moveTo', 'lineTo', 'quadraticCurveTo', 'fillRect', 'rect', 'clip', 'drawImage']) {
    context[name] = (...args) => calls.push({name, args});
  }
  return context;
}

test('citizens move at one speed through short and long route segments', () => {
  const {SWCitizenPosition} = loadDeclarations(render, ['SWCitizenPosition']);
  const person = {id: 0, route: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 4, y: 0}]};
  const before = JSON.stringify(person);
  const a = SWCitizenPosition(person, 1);
  const b = SWCitizenPosition(person, 2);
  const c = SWCitizenPosition(person, 4);
  const d = SWCitizenPosition(person, 5);
  assert.ok(Math.abs((b.x - a.x) - .42) < .00001);
  assert.ok(Math.abs((d.x - c.x) - .42) < .00001);
  assert.equal(JSON.stringify(person), before);
});

test('a work cycle stays normalized and continues after long uptime', () => {
  const {SWCitizenPosition} = loadDeclarations(render, ['SWCitizenPosition']);
  const person = {id: 3, route: [{x: 1, y: 2}]};
  const phases = [3600, 3600.4, 3600.8].map(time => SWCitizenPosition(person, time).workPhase);
  assert.ok(phases.every(value => value >= 0 && value < 1));
  assert.equal(new Set(phases.map(value => Math.floor(value * 4))).size, 3);
});

test('workers perform painted work frames without a procedural mannequin fallback', () => {
  const workerArt = {src: 'workers'};
  const names = ['SWPresentationAssets15', 'SWPresentationFiles15', 'SWPresentationImages15', 'SWPresentationBudget15', 'SWMaskedSprites15', 'SWDrawContact15', 'SWDrawAtlasPose15', 'SWDrawPaintedWorker'];
  const {SWDrawPaintedWorker} = loadDeclarations(render, names, {
    vu: (x, y) => ({x, y}),
    SWAtlasFrame: (_image, _columns, _rows, column, row) => ({x: column * 40, y: row * 50, w: 20, h: 40}),
  });
  const context = canvasContext();
  const person = {id: 0, role: 'Woodcutter', sprite: 1};
  for (const workPhase of [.05, .3, .55, .8]) {
    assert.equal(SWDrawPaintedWorker(context, person, {x: 0, y: 0, working: true, workPhase}, {workers11: workerArt}, 3600), true);
  }
  const draws = context.calls.filter(call => call.name === 'drawImage');
  assert.deepEqual(draws.map(call => call.args[1]), [0, 40, 80, 120]);
  assert.ok(draws.every(call => call.args[2] === 150));
});

test('reduced motion holds a stable painted worker pose', () => {
  const names = ['SWPresentationAssets15', 'SWPresentationFiles15', 'SWPresentationImages15', 'SWPresentationBudget15', 'SWMaskedSprites15', 'SWDrawContact15', 'SWDrawAtlasPose15', 'SWDrawPaintedWorker'];
  const {SWDrawPaintedWorker} = loadDeclarations(render, names, {
    vu: (x, y) => ({x, y}),
    SWAtlasFrame: (_image, _columns, _rows, column, row) => ({x: column * 40, y: row * 50, w: 20, h: 40}),
  });
  const context = canvasContext();
  for (const time of [1, 20, 3600]) SWDrawPaintedWorker(context, {id: 0, role: 'Smith', sprite: 4}, {x: 0, y: 0, moving: true, working: true, workPhase: .8}, {workers11: {src: 'workers'}}, time, true);
  assert.deepEqual(context.calls.filter(call => call.name === 'drawImage').map(call => call.args[1]), [0, 0, 0]);
});

test('masked sprite work is cached and bounded', () => {
  let allocations = 0;
  const {SWDrawAtlasPose15, SWMaskedSprites15, SWPresentationBudget15} = loadDeclarations(render, ['SWPresentationBudget15', 'SWMaskedSprites15', 'SWDrawAtlasPose15'], {
    document: {createElement: () => { allocations++; return {getContext: () => canvasContext()}; }},
  });
  const context = canvasContext();
  const frame = {x: 0, y: 0, w: 300, h: 400, maskRects: [[0, 0, 300, 400]]};
  const image = {src: 'atlas'};
  for (let i = 0; i < 100; i++) SWDrawAtlasPose15(context, image, frame, 31, 400);
  assert.equal(allocations, 1);
  for (let i = 1; i <= 150; i++) SWDrawAtlasPose15(context, image, {...frame, x: i}, 31, 400);
  assert.equal(SWMaskedSprites15.size, SWPresentationBudget15.maskedSpriteTiles);
  assert.ok([...SWMaskedSprites15.values()].every(tile => tile.width <= 224 && tile.height <= 224));
});

test('rank cloth treatment preserves skin and steel and reuses bounded bitmaps', () => {
  const source = [50, 100, 150, 255, 186, 132, 97, 255, 151, 156, 160, 255];
  let allocations = 0;
  const {SWDrawAtlasPose15, SWRankSprites15, SWPresentationBudget15} = loadDeclarations(render, ['SWPresentationBudget15', 'SWRankSprites15', 'SWRankCloth15', 'SWDrawAtlasPose15'], {
    document: {createElement: () => {
      allocations++;
      const context = canvasContext();
      const tile = {getContext: () => context};
      context.getImageData = () => ({data: new Uint8ClampedArray(source)});
      context.putImageData = pixels => { tile.pixels = [...pixels.data]; };
      return tile;
    }},
  });
  const context = canvasContext();
  const frame = {x: 0, y: 0, w: 300, h: 400};
  const image = {src: 'painted-troops'};
  const treatment = {kind: 'shieldbearer', level: 2};
  for (let i = 0; i < 60; i++) SWDrawAtlasPose15(context, image, frame, 42, 400, treatment);
  assert.equal(allocations, 1);
  const bitmap = [...SWRankSprites15.values()][0];
  assert.notDeepEqual(bitmap.pixels.slice(0, 3), source.slice(0, 3));
  assert.deepEqual(bitmap.pixels.slice(4), source.slice(4));
  const appearances = [];
  for (let level = 2; level <= 10; level++) {
    SWDrawAtlasPose15(context, image, frame, 42, 400, {...treatment, level});
    appearances.push([...SWRankSprites15.values()].at(-1).pixels.slice(0, 3).join(','));
  }
  assert.equal(new Set(appearances).size, 9);
  for (let i = 1; i < 90; i++) SWDrawAtlasPose15(context, image, {...frame, x: i}, 42, 400, treatment);
  assert.equal(SWRankSprites15.size, SWPresentationBudget15.rankSpriteTiles);
  assert.ok([...SWRankSprites15.values()].every(tile => tile.width <= 224 && tile.height <= 224));
});

test('cog and siege barge use their own new art at all three milestones', () => {
  const art = {src: 'coastal-ships'};
  const {SW13ShipArt} = loadDeclarations(visuals, ['SW15CoastalShipFrames', 'SW13ShipArt'], {SWPresentationAssets15: {coastalShips15: art}});
  for (const kind of ['cog', 'bombard']) {
    const tiers = [1, 4, 7].map(level => SW13ShipArt(kind, level, {}));
    assert.ok(tiers.every(tier => tier.image === art));
    assert.equal(new Set(tiers.map(tier => tier.rect.join(','))).size, 3);
    assert.ok(tiers.every(tier => kind === 'cog' ? tier.rect[1] < 512 : tier.rect[1] >= 512));
  }
});

test('ship preview fit includes the complete mast', () => {
  const {SWDrawPaintedShip15} = loadDeclarations(render, ['SWDrawPaintedShip15'], {
    SWShipDamageArt17,
    SWPaintedShipArt15: () => ({image: {}, rect: [0, 0, 300, 600]}),
  });
  const context = canvasContext();
  SWDrawPaintedShip15(context, {kind: 'cog', level: 10, x: 100, y: 105, scale: 1.4, fitHeight: 92});
  const draw = context.calls.find(call => call.name === 'drawImage');
  assert.equal(draw.args[8], 92);
  assert.equal(draw.args[6], -92);
});

test('ship bows face their direction of travel', () => {
  const {SWDrawPaintedShip15} = loadDeclarations(render, ['SWDrawPaintedShip15'], {
    SWShipDamageArt17,
    SWPaintedShipArt15: () => ({image: {}, rect: [0, 0, 300, 400]}),
  });
  const right = canvasContext();
  const left = canvasContext();
  SWDrawPaintedShip15(right, {kind: 'cog', heading: 0});
  SWDrawPaintedShip15(left, {kind: 'cog', heading: Math.PI});
  assert.ok(right.calls.some(call => call.name === 'scale' && call.args[0] === -1));
  assert.ok(!left.calls.some(call => call.name === 'scale' && call.args[0] === -1));
});

test('sunken ships finish sinking instead of restarting the animation every frame', () => {
  const rendered = [];
  const {SWDrawNavalUnit} = loadDeclarations(render, ['SWPresentationBudget15', 'SWDrawNavalUnit'], {
    vu: (x, y) => ({x, y}),
    SWDrawShipRig14: (_context, ship) => rendered.push(ship),
  });
  const ship = {x: 0, y: 0, kind: 'cog', hp: 0, maxHp: 100};
  for (const age of [0, 1150, 2300, 6000]) SWDrawNavalUnit(canvasContext(), ship, {}, 40, age, false);
  assert.equal(rendered.length, 2);
  assert.equal(rendered[0].sinkProgress, 0);
  assert.equal(rendered[1].sinkProgress, .5);
});
