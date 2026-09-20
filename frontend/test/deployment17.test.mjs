import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {parse} from 'acorn';
import {SWCreateDeploymentGesture17, SWDeploymentCadence17, SWLandingCarrier17, SWShotPose17, SWContactMotion17, SWNavalCommandTarget17} from '../../client/build17/combat.js';
import {loadDeclarations} from './load-declarations.mjs';

function gestureRig() {
  let time = 0, serial = 0, active = true, available = 12, pinches = 0, preview = null;
  const timers = new Map(), orders = [], rejections = [], captured = new Set();
  const rail = {scrollLeft: 0, scrollWidth:800,clientWidth:400,getBoundingClientRect: () => ({top: 300, bottom: 400})};
  const element = {closest: () => rail, setPointerCapture: id => captured.add(id),
    hasPointerCapture: id => captured.has(id), releasePointerCapture: id => captured.delete(id)};
  let surface = {token: {}, active: () => active, contains: (x, y) => x >= 0 && x < 400 && y >= 0 && y < 400,
    target: (x, y) => x >= 0 && x < 400 && y >= 0 && y < 300 ? {x, y} : null,
    fire: (target, kind) => { if (available <= 0) return false; available--; orders.push({target, kind, time}); return true; },
    preview: value => { preview = value; }, rejected: (target, kind) => rejections.push({target, kind}),
    pinch: () => { pinches++; }, endPinch: () => {}};
  const controller = SWCreateDeploymentGesture17({getSurface: () => surface, now: () => time,
    schedule: (fn, delay) => { const id = ++serial; timers.set(id, {fn, due: time + delay}); return id; },
    unschedule: id => timers.delete(id)});
  const event = (x = 80, y = 100, pointerId = 1) => ({clientX: x, clientY: y, pointerId,
    pointerType: 'touch', button: 0, target: element, currentTarget: element, preventDefault() {}});
  const down = (x = 80, y = 100, origin = 'map', kind = 'archer', id = 1) => {
    const value = event(x, y, id); controller.pointerDown(value); return controller.begin(value, kind, origin);
  };
  const advance = ms => {
    const end = time + ms;
    while (true) {
      const next = [...timers].filter(([, timer]) => timer.due <= end).sort((a, b) => a[1].due - b[1].due)[0];
      if (!next) break;
      const [id, timer] = next; timers.delete(id); time = timer.due; timer.fn();
    }
    time = end;
  };
  return {controller, event, down, advance, orders, timers, rejections, rail, captured,
    move: (x, y, id = 1) => controller.pointerMove(event(x, y, id)),
    up: (x = 80, y = 100, id = 1, cancelled = false) => controller.pointerUp(event(x, y, id), cancelled),
    get preview() { return preview; }, get pinches() { return pinches; },
    setActive: value => { active = value; }, setAvailable: value => { available = value; },
    replace: (changes, sameToken = true) => { surface = {...surface, ...changes, token: sameToken ? surface.token : {}}; },
    delayedTick: ms => { time += ms; const due = [...timers].filter(([, timer]) => timer.due <= time); for (const [id, timer] of due) { timers.delete(id); timer.fn(); } },
  };
}

test('short map tap emits exactly one order, releases capture and leaves no timers', () => {
  const rig = gestureRig(); assert.equal(rig.down(), true); rig.advance(90);
  assert.equal(rig.orders.length, 0); rig.up(); rig.advance(1000);
  assert.equal(rig.orders.length, 1); assert.equal(rig.timers.size, 0); assert.equal(rig.captured.size, 0);
  assert.equal(rig.preview, null);
});

test('held deployment follows the current finger at a bounded rate with no release burst', () => {
  const rig = gestureRig(); rig.down(); rig.advance(SWDeploymentCadence17.hold);
  assert.equal(rig.orders.length, 1); rig.move(100, 150); rig.move(130, 150);
  assert.equal(rig.orders.length, 1); rig.advance(SWDeploymentCadence17.repeat);
  assert.deepEqual(rig.orders.at(-1).target, {x: 130, y: 150});
  rig.up(130, 150); rig.advance(1000); assert.equal(rig.orders.length, 2);
});

test('dragging a troop card onto the map immediately deploys that card, then sweeps', () => {
  const rig = gestureRig(); rig.down(90, 350, 'tray', 'spearman'); rig.advance(500);
  assert.equal(rig.orders.length, 0); rig.move(95, 275);
  assert.equal(rig.orders.length, 1); assert.equal(rig.orders[0].kind, 'spearman');
  rig.move(180, 240); rig.advance(SWDeploymentCadence17.repeat); rig.up(180, 240);
  assert.equal(rig.orders.length, 2); assert.deepEqual(rig.orders[1].target, {x: 180, y: 240});
});

test('implicit portrait capture can transfer to its card without cancelling troop deployment', () => {
  const rig = gestureRig(), portrait = {tagName: 'CANVAS'};
  const down = {...rig.event(90, 350), target: portrait};
  rig.controller.pointerDown(down);
  assert.equal(rig.controller.begin(down, 'spearman', 'tray'), true);
  assert.ok(rig.captured.has(1), 'the parent troop card now owns explicit capture');
  // WebKit can report the prior implicit capture being released by its child.
  rig.controller.lostCapture({pointerId: 1, target: portrait});
  assert.ok(rig.controller.session, 'the active parent capture remains valid');
  rig.move(95, 275);
  assert.equal(rig.orders.length, 1);
  assert.equal(rig.orders[0].kind, 'spearman');
  rig.advance(SWDeploymentCadence17.repeat);
  assert.equal(rig.orders.length, 2);
  // An actual loss from the capturing card must still cancel immediately.
  rig.controller.lostCapture({pointerId: 1, target: down.currentTarget});
  assert.equal(rig.controller.session, null);
  rig.advance(1000); rig.up(95, 275);
  assert.equal(rig.orders.length, 2);
  assert.equal(rig.timers.size, 0);
});

test('horizontal troop rail scroll stays a scroll even if the finger later leaves the rail', () => {
  const rig = gestureRig(); rig.down(200, 350, 'tray'); rig.move(140, 348); rig.move(120, 260);
  rig.advance(1000); rig.up(120, 260);
  assert.equal(rig.rail.scrollLeft, 80); assert.equal(rig.orders.length, 0);
});

test('diagonal dragging from a fully visible troop tray deploys instead of entering a nonexistent scroll', () => {
  const rig=gestureRig();rig.rail.scrollWidth=400;
  rig.down(70,350,'tray','cavalry');rig.move(130,340);rig.move(260,305);rig.move(360,265);rig.up(360,265);
  assert.equal(rig.rail.scrollLeft,0);assert.equal(rig.orders.length,1);
  assert.equal(rig.orders[0].kind,'cavalry');assert.deepEqual(rig.orders[0].target,{x:360,y:265});
});

test('native coalesced tray drag resolves its release position once without a pointermove', () => {
  const rig=gestureRig();rig.rail.scrollWidth=400;
  rig.down(70,350,'tray','cavalry');rig.up(360,265);rig.advance(1000);
  assert.equal(rig.orders.length,1);assert.deepEqual(rig.orders[0].target,{x:360,y:265});
  assert.equal(rig.timers.size,0);assert.equal(rig.captured.size,0);
  const cancelled=gestureRig();cancelled.down(70,350,'tray');cancelled.up(360,265,1,true);
  assert.equal(cancelled.orders.length,0);
});

test('crossing invalid ground pauses deployment and returning resumes at the current point', () => {
  const rig = gestureRig(); rig.down(); rig.advance(SWDeploymentCadence17.hold);
  rig.move(500, 100); rig.advance(500); assert.equal(rig.orders.length, 1);
  rig.move(250, 120); rig.advance(SWDeploymentCadence17.repeat);
  assert.equal(rig.orders.length, 2); assert.deepEqual(rig.orders[1].target, {x: 250, y: 120});
  rig.up(250, 120);
});

test('a delayed event loop produces one order instead of a catch-up spending burst', () => {
  const rig = gestureRig(); rig.down(); rig.delayedTick(3000);
  assert.equal(rig.orders.length, 1); assert.equal(rig.timers.size, 1);
  rig.up(); assert.equal(rig.orders.length, 1);
});

test('rejected or exhausted troops stop repeats and report only once per gesture', () => {
  const rig = gestureRig(); rig.setAvailable(1); rig.down(); rig.advance(1000); rig.move(120, 150); rig.up(120, 150);
  assert.equal(rig.orders.length, 1); assert.equal(rig.rejections.length, 1); assert.equal(rig.timers.size, 0);
});

test('two map fingers cancel deployment until all fingers lift, then allow a fresh tap', () => {
  const rig = gestureRig(); rig.down(); rig.advance(180);
  rig.controller.pointerDown(rig.event(200, 150, 2)); rig.move(220, 160, 2); rig.advance(1000);
  assert.equal(rig.pinches, 2); assert.equal(rig.orders.length, 1);
  rig.up(220, 160, 2); rig.up(); assert.equal(rig.orders.length, 1);
  rig.down(); rig.up(); assert.equal(rig.orders.length, 2);
});

test('touching a menu with the second finger cancels spending but never pinches the map', () => {
  const rig = gestureRig(); rig.down(); rig.controller.pointerDown(rig.event(600, 100, 2));
  rig.move(620, 140, 2); rig.advance(1000); rig.up(); rig.up(620, 140, 2);
  assert.equal(rig.orders.length, 0); assert.equal(rig.pinches, 0);
});

test('blur/reset, pointer cancellation and lost capture cannot finish a pending order', () => {
  for (const stop of ['reset', 'cancel', 'capture']) {
    const rig = gestureRig(); rig.down(); rig.advance(80);
    if (stop === 'reset') rig.controller.reset();
    if (stop === 'cancel') rig.up(80, 100, 1, true);
    if (stop === 'capture') rig.controller.lostCapture(rig.event());
    rig.advance(1000); rig.up(); assert.equal(rig.orders.length, 0, stop); assert.equal(rig.preview, null, stop);
  }
});

test('rerendered live surface callbacks are used, while an unmounted/replaced battle cannot receive orders', () => {
  const rig = gestureRig(), latest = []; rig.down();
  rig.replace({fire: (target, kind) => { latest.push({target, kind}); return true; }});
  rig.up(); assert.equal(latest.length, 1); assert.equal(rig.orders.length, 0);
  rig.down(); rig.replace({}, false); rig.advance(1000); rig.up(); assert.equal(latest.length, 1);
  rig.down(); rig.setActive(false); rig.up(); assert.equal(latest.length, 1);
});

test('production pointer bridge installs once and wires background, cancel and lost-capture cleanup', () => {
  const handlers = new Map(), documentHandlers = new Map(), timers = new Map();
  const document = {hidden: false, addEventListener: (name, fn) => documentHandlers.set(name, fn)};
  const exports = loadDeclarations(new URL('../../client/build14/gestures.js', import.meta.url),
    ['SWGestureBridge14', 'SWInstallPointers14', 'SWBeginPointer14', 'SWStartTrayDrag14'], {
      SWCreateDeploymentGesture17, window: {addEventListener: (name, fn) => { assert.ok(!handlers.has(name)); handlers.set(name, fn); }},
      document, performance: {now: () => 0}, setTimeout: fn => { const id = timers.size + 1; timers.set(id, fn); return id; },
      clearTimeout: id => timers.delete(id), Map,
    });
  exports.SWInstallPointers14(); exports.SWInstallPointers14();
  const bridge = exports.SWGestureBridge14, selections = [], orders = [];
  bridge.surface = {active: () => true, contains: () => true, target: () => ({x: 1, y: 2}), preview() {},
    fire: (_, kind) => { orders.push(kind); return true; }, endPinch() {}};
  const card = {};
  const event = {pointerId: 1, clientX: 30, clientY: 40, pointerType: 'touch', button: 0, target: card, currentTarget: card, preventDefault() {}};
  handlers.get('pointerdown')(event); exports.SWStartTrayDrag14(event, 'archer', kind => selections.push(kind));
  assert.deepEqual(selections, ['archer']); assert.ok(bridge.session);
  handlers.get('lostpointercapture')(event); handlers.get('pointerup')(event);
  assert.equal(bridge.session, null); assert.equal(orders.length, 0);
  for (const type of ['pointercancel', 'blur', 'visibilitychange']) {
    handlers.get('pointerdown')(event); exports.SWBeginPointer14(event, 'archer');
    if (type === 'visibilitychange') { document.hidden = true; documentHandlers.get(type)(); }
    else handlers.get(type)(event);
    assert.equal(bridge.session, null); assert.equal(timers.size, 0); assert.equal(orders.length, 0);
  }
});

test('carrier choice respects remaining cargo, live safety, selected ship and landing distance', () => {
  const input = {campaignType: 'sea', fleet14: [
    {id: 'far', kind: 'cog', cargo: {archer: 3}}, {id: 'near', kind: 'cutter', cargo: {archer: 2}},
    {id: 'sunk', kind: 'cog', cargo: {archer: 10}}, {id: 'retreating', kind: 'cog', cargo: {archer: 10}},
  ], orders: [{shipId: 'near', kind: 'archer'}]};
  const frame = {units: [
    {shipId: 'far', side: 'attack', hp: 100, x: -8, y: 2}, {shipId: 'near', side: 'attack', hp: 20, x: -3, y: 5},
    {shipId: 'sunk', side: 'attack', hp: 0, x: -2, y: 5}, {shipId: 'retreating', side: 'attack', hp: 90, x: -2, y: 5, command: {type: 'withdraw'}},
  ]}, target = {x: -1, y: 5}, before = JSON.stringify({input, frame});
  assert.equal(SWLandingCarrier17(input, frame, 'archer', target).shipId, 'near');
  assert.equal(SWLandingCarrier17(input, frame, 'archer', target, 'far').shipId, 'far');
  assert.equal(SWLandingCarrier17(input, frame, 'archer', target, 'sunk').shipId, 'near');
  assert.equal(JSON.stringify({input, frame}), before);
  input.orders.push({shipId: 'near', kind: 'archer'});
  assert.equal(SWLandingCarrier17(input, frame, 'archer', target, 'near').shipId, 'far');
  assert.equal(SWLandingCarrier17(input, frame, 'cannon', target), null);
  assert.equal(SWLandingCarrier17({...input, campaignType: 'land'}, frame, 'archer', target), null);
});

test('a commander cannot be queued twice or without a commander in the battle', () => {
  const input = {campaignType: 'sea', commander: {id: 'captain'}, fleet14: [{id: 'ship', kind: 'cog'}], orders: []};
  assert.ok(SWLandingCarrier17(input, null, 'hero', {x: -1, y: 3}));
  input.orders.push({kind: 'hero'}); assert.equal(SWLandingCarrier17(input, null, 'hero', {x: -1, y: 3}), null);
  input.orders = []; delete input.commander; assert.equal(SWLandingCarrier17(input, null, 'hero', {x: -1, y: 3}), null);
});

test('ship targeting rejects land, shoals, off-map water and dead or friendly focus targets', () => {
  for (const tile of [{x: 0, y: 2}, {x: -6.2, y: 4}, {x: -15, y: 3}, {x: -4, y: 15}]) {
    assert.equal(SWNavalCommandTarget17(null, tile, 'move'), null);
  }
  assert.deepEqual(SWNavalCommandTarget17(null, {x: -4, y: 7}, 'move'), {x: -4, y: 7, valid: true, label: 'Sail here'});
  const frame = {units: [
    {id: 'friendly', side: 'attack', hp: 100, x: -4, y: 3},
    {id: 'sunk', side: 'defend', hp: 0, x: -4, y: 3},
    {id: 'enemy', side: 'defend', hp: 100, naval: true, x: -5, y: 3},
  ]};
  assert.equal(SWNavalCommandTarget17(frame, {x: -4, y: 3}, 'focus').targetId, 'enemy');
  frame.units[2].hp = 0;
  assert.equal(SWNavalCommandTarget17(frame, {x: -4, y: 3}, 'focus'), null);
});

function navalCanvasRig() {
  const source = readFileSync(new URL('../../client/build14/Eu.js', import.meta.url), 'utf8');
  const ast = parse(source, {ecmaVersion: 2022, sourceType: 'module'}), declarations = {};
  const visit = node => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'Property' && ['onPointerDown', 'onPointerMove', 'onPointerUp'].includes(node.key?.name)) {
      const code = source.slice(node.value.start, node.value.end);
      if (code.includes('swGesture.current')) declarations[node.key.name] = code;
    }
    for (const value of Object.values(node)) if (Array.isArray(value)) value.forEach(visit); else if (value && typeof value === 'object') visit(value);
  };
  visit(ast);
  const ref = current => ({current}), orders = [], pans = [], captures = new Set();
  const env = {ge: ref(new Map()), swAllPointers: ref(new Set()), swGesture: ref({mode: 'idle', multi: false}),
    swPreview: ref(null), swDeploymentFeedback17: ref(null), me: ref(null), Ce: ref(null), _e: ref(null),
    be: ref({frame: {units: []}}), navalTool14: {type: 'move'}, swCancelHold() {},
    We: (x, y) => ({x, y}), yu: (x, y) => ({x, y}), SWNavalCommandTarget17,
    onNavalMap14: (...args) => orders.push(args), se: value => pans.push(value),
    T: false, S: false, staticPreview: false, w: null, l: null, i: [], Re: 0, ze: 0, A: 1,
    swMinPanX: -100, swMaxPanX: 100, swMinPanY: -100, swMaxPanY: 100,
    performance: {now: () => 1000}, Math, Map, Set};
  const context = vm.createContext(env), handlers = Object.fromEntries(Object.entries(declarations).map(([key, code]) => [key, vm.runInContext('(' + code + ')', context)]));
  assert.equal(Object.keys(handlers).length, 3);
  const event = (x, y, id = 1) => ({clientX: x, clientY: y, pointerId: id, pointerType: 'touch', button: 0,
    currentTarget: {setPointerCapture: value => captures.add(value)}, preventDefault() {}});
  return {env, orders, pans, down(x = -4, y = 7, id = 1) { env.swAllPointers.current.add(id); handlers.onPointerDown(event(x, y, id)); },
    move(x, y, id = 1) { handlers.onPointerMove(event(x, y, id)); },
    up(x = -4, y = 7, id = 1) { env.swAllPointers.current.delete(id); handlers.onPointerUp(event(x, y, id)); }};
}

test('production naval canvas handlers commit only on release and leave dragging available for panning', () => {
  const rig = navalCanvasRig(); rig.down(); assert.equal(rig.orders.length, 0);
  assert.equal(rig.env.swPreview.current.label, 'Sail here'); rig.up();
  assert.deepEqual(rig.orders, [[-4, 7, undefined]]);
  rig.down(); rig.move(-15, 7); rig.up(-15, 7);
  assert.equal(rig.orders.length, 1); assert.equal(rig.pans.length, 1);
});

test('production naval handlers cancel a pending command when pinch starts and revalidate at release', () => {
  const rig = navalCanvasRig(); rig.down(); rig.down(-8, 5, 2); rig.up(); rig.up(-8, 5, 2);
  assert.equal(rig.orders.length, 0);
  rig.env.navalTool14 = {type: 'focus'};
  rig.env.be.current.frame.units = [{id: 'enemy', side: 'defend', hp: 100, naval: true, x: -4, y: 7}];
  rig.down(); rig.env.be.current.frame.units[0].hp = 0; rig.up();
  assert.equal(rig.orders.length, 0); assert.equal(rig.env.swDeploymentFeedback17.current.valid, false);
});

test('campaign preview canvas cannot issue a ship command', () => {
  const rig=navalCanvasRig();rig.env.staticPreview=true;rig.down();rig.up();
  assert.equal(rig.orders.length,0);assert.equal(rig.env.swGesture.current.mode,'idle');
});

test('ranged release is timed to firing, melee contact to impact, with bounded non-looping recoil', () => {
  const shot = {firedAt: 4, impactAt: 5};
  assert.equal(SWShotPose17(shot, 4, 'trebuchet').phase, .5);
  assert.equal(SWShotPose17(shot, 5, 'infantry').phase, .5);
  assert.equal(SWShotPose17(shot, 3.8, 'trebuchet').stage, 'windup');
  assert.ok(SWShotPose17(shot, 4.1, 'trebuchet').recoil > 0);
  assert.equal(SWShotPose17(shot, 5, 'trebuchet'), null);
  assert.equal(SWShotPose17(shot, 5.4, 'infantry'), null);
  assert.equal(SWShotPose17({impactAt: 4}, 4, 'archer'), null);
});

test('contact motion is directional, short and absent in reduced motion', () => {
  const event = {x: 0, y: 0, tx: 4, ty: 1, time: 10};
  assert.deepEqual(SWContactMotion17(event, 9.9), {x: 0, y: 0, angle: 0});
  assert.ok(SWContactMotion17(event, 10.08).x > 0);
  assert.deepEqual(SWContactMotion17(event, 10.4), {x: 0, y: 0, angle: 0});
  assert.deepEqual(SWContactMotion17(event, 10.08, true), {x: 0, y: 0, angle: 0});
});

test('impact phases separate contact, shock and debris, then settle without motion leakage', () => {
  const {SWImpactPhase17} = loadDeclarations(new URL('../../client/build15/combat-presentation.js', import.meta.url), ['SWImpactPhase17']);
  const contact = SWImpactPhase17(0, true), shock = SWImpactPhase17(140, true), final = SWImpactPhase17(2000, true);
  assert.equal(contact.contact, 1); assert.equal(contact.dust, 0); assert.equal(contact.fragments, 0);
  assert.equal(shock.contact, 0); assert.equal(shock.shock, 1); assert.ok(shock.fragments > 0);
  assert.equal(final.settled, true); assert.equal(final.contact, 0); assert.equal(final.shock, 0);
  assert.ok(Math.abs(final.dust) < 1e-12);
  const reduced = SWImpactPhase17(80, true, true);
  assert.equal(reduced.shock, 0); assert.equal(reduced.fragments, 0); assert.equal(reduced.dust, 0);
});
