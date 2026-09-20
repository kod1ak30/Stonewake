import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadDeclarations} from './load-declarations.mjs';
import {SWVanguardPose17, SWVanguardAnchors17, SWShipDamageArt17, SWShipDamageCache17, SWUnitArtBudget17} from '../../client/build17/unit-art.js';

const render = new URL('../../client/build14/render.js', import.meta.url);
const image = {src: 'build17/vanguard-ranks.png'};

test('legacy troop portrait delegates to the shared army and combat preview with its selected rank', () => {
  const createElement = (type, props, ...children) => ({type, props, children});
  const SWUnitPreview14 = () => {};
  const {lu} = loadDeclarations(render, ['lu'], {swElement: createElement, SWUnitPreview14});
  const {SWUnitPortrait} = loadDeclarations(new URL('../legacy/presentation.js', import.meta.url), ['SWUnitPortrait'], {C: {createElement}, lu});
  for (const level of [1, 4, 7, 10]) {
    const portrait = SWUnitPortrait({kind: 'infantry', level, className: 'troop-frame'});
    assert.equal(portrait.props.className, 'troop-portrait troop-frame');
    const preview = portrait.children[0].type(portrait.children[0].props);
    assert.equal(preview.type, SWUnitPreview14);
    assert.equal(preview.props.kind, 'infantry');
    assert.equal(preview.props.level, level);
  }
});

test('army portrait waits for the shared atlas loader and draws the selected rank through the combat renderer', async () => {
  let completeLoad, cleanup, drawFrame;
  const draws = [];
  const assetLoad = new Promise(resolve => { completeLoad = resolve; });
  const canvas = {getContext: () => ({clearRect() {}})};
  const {SWUnitPreview14} = loadDeclarations(new URL('../../client/build14/ui.js', import.meta.url), ['SWUnitPreview14'], {
    C: {useRef: () => ({current: canvas}), useEffect: callback => { cleanup = callback(); }},
    performance: {now: () => 0},
    SWLoadPresentationAssets15: () => assetLoad,
    requestAnimationFrame: callback => { drawFrame = callback; return 1; },
    cancelAnimationFrame() {},
    SWDrawTroopRig14: (_context, options) => draws.push(options),
    swElement: (type, props) => ({type, props}),
    J: {infantry: {name: 'Vanguard'}}, SWEquipmentName14: () => 'Royal Vanguard',
  });
  const portrait = SWUnitPreview14({kind: 'infantry', level: 10});
  assert.equal(drawFrame, undefined);
  completeLoad();
  await Promise.resolve();
  drawFrame(0);
  assert.equal(draws[0].kind, 'infantry');
  assert.equal(draws[0].level, 10);
  assert.equal(draws[0].state, 'idle');
  assert.equal(portrait.props.role, 'img');
  cleanup();
  drawFrame(1000);
  assert.equal(draws.length, 1, 'unmounted portraits never draw into stale canvases');
});

test('Vanguard ranks use real atlas rows and preserve the existing attack clock', () => {
  const rows = Array.from({length: 10}, (_, index) => SWVanguardPose17('infantry', index + 1, {vanguard17: image}, 'idle', 0).frame.y);
  assert.deepEqual(rows, [0, 0, 0, 256, 256, 256, 512, 512, 512, 768]);
  const frames = [-1, 0, .249, .25, .5, .75, 1, 50].map(phase => SWVanguardPose17('infantry', 10, {vanguard17: image}, 'attack', phase));
  assert.deepEqual(frames.map(pose => pose.frame.x / 256), [4, 4, 4, 5, 6, 7, 7, 7]);
  assert.equal(new Set(frames.map(pose => pose.reference)).size, 1);
  assert.equal(SWVanguardPose17('archer', 10, {vanguard17: image}, 'idle', 0), null);
  assert.equal(SWVanguardPose17('infantry', 10, {}, 'idle', 0), null);
});

test('authored walk frames loop after long uptime and never resize the body', () => {
  const poses = [3600, 3600 + 1 / 6, 3600 + 2 / 6, 3600 + 3 / 6].map(phase => SWVanguardPose17('infantry', 7, {vanguard17: image}, 'walk', phase));
  assert.deepEqual(poses.map(pose => pose.frame.x), [0, 256, 512, 768]);
  assert.ok(poses.every(pose => pose.reference === 178.717 && pose.frame.w === 256 && pose.frame.h === 256));
  assert.equal(SWVanguardAnchors17.length, SWUnitArtBudget17.vanguardFrames);
  const bytes = readFileSync(new URL('../../Stonewake/Web/art/build17/vanguard-ranks.png', import.meta.url));
  assert.equal(bytes.readUInt32BE(16), 2048);
  assert.equal(bytes.readUInt32BE(20), 1024);
  assert.equal(bytes[25], 6, 'artwork has true RGBA transparency');
});

test('production troop draw uses common scale and per-pose foot anchors without sticker overlays', () => {
  const draws = [], translations = [], layers = [];
  const context = {save() {}, restore() {}, scale() {}, rotate() {}, translate: (...args) => translations.push(args)};
  const {SWDrawPaintedTroop15} = loadDeclarations(render, ['SWDrawPaintedTroop15'], {
    SWVanguardPose17,
    SWPresentationImages15: images => images,
    SWPaintedTroopPose15: () => ({image: {}, frame: {x: 0, y: 0, w: 10, h: 20}, reference: 20}),
    SWDrawContact15() {},
    SWDrawAtlasPose15: (...args) => draws.push(args),
    SWTroopTier: (...args) => layers.push(args),
  });
  for (const level of [1, 4, 7, 10]) for (const phase of [0, .25, .5, .75]) {
    translations.length = 0;
    SWDrawPaintedTroop15(context, {kind: 'infantry', level, images: {vanguard17: image}, state: 'attack', phase});
    const pose = SWVanguardPose17('infantry', level, {vanguard17: image}, 'attack', phase);
    const draw = draws.at(-1);
    assert.equal(draw[3], 42, 'rank adds equipment without enlarging the person');
    assert.equal(draw[4], pose.reference);
    assert.equal(draw[5], undefined, 'authored materials are not re-dyed');
    assert.ok(Math.abs(translations.at(-1)[0] - (128 - pose.anchorX) * 42 / pose.reference) < .000001);
  }
  assert.equal(layers.length, 0);
  SWDrawPaintedTroop15(context, {kind: 'infantry', level: 1, images: {}, state: 'idle'});
  assert.equal(draws.length, 17, 'missing new art still uses the existing painted fallback');
});

function damageCanvas() {
  const canvas = {width: 0, height: 0};
  canvas.getContext = () => ({
    drawImage() {},
    getImageData: () => ({data: new Uint8ClampedArray(canvas.width * canvas.height * 4).map((_, index) => [30, 100, 150, 255][index % 4])}),
    putImageData: pixels => { canvas.pixels = pixels.data; },
  });
  return canvas;
}

test('ship damage is cached by wound stage, preserves the original and stays within its bitmap budget', () => {
  SWShipDamageCache17.clear();
  let allocations = 0;
  const factory = () => { allocations++; return damageCanvas(); };
  const art = {image: {src: 'ship-atlas'}, rect: [3, 5, 512, 384]};
  assert.equal(SWShipDamageArt17(art, 'cog', 7, undefined, undefined, factory), art);
  assert.equal(SWShipDamageArt17(art, 'cog', 7, 100, 100, factory), art);
  assert.equal(allocations, 0);
  const wounded = SWShipDamageArt17(art, 'cog', 7, 70, 100, factory);
  assert.equal(SWShipDamageArt17(art, 'cog', 7, 65, 100, factory), wounded);
  assert.equal(allocations, 1);
  const critical = SWShipDamageArt17(art, 'cog', 7, 18, 100, factory);
  assert.notEqual(wounded.image.src, critical.image.src, 'sail recolor cache receives a unique wound texture');
  assert.ok(critical.image.pixels.some((value, index) => index % 4 === 3 && value === 0), 'torn cloth has real transparent holes');
  assert.deepEqual(art.rect, [3, 5, 512, 384]);
  for (let index = 0; index < 60; index++) SWShipDamageArt17({...art, image: {src: 'ship-' + index}}, 'galley', 10, 20, 100, factory);
  assert.equal(SWShipDamageCache17.size, SWUnitArtBudget17.damageTiles);
  assert.ok([...SWShipDamageCache17.values()].every(entry => Math.max(entry.image.width, entry.image.height) <= SWUnitArtBudget17.damageExtent));
  SWShipDamageCache17.clear();
});
