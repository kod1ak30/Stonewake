import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createInputProbe, startInputDiagnostics} from '../runtime/input-probe.js';

function harness() {
  let time = 0;
  const samples = [], probe = createInputProbe({now: () => time, sample: value => samples.push(value)});
  const control = {isConnected: true};
  const event = (values = {}) => ({pointerId: 1, clientX: 20, clientY: 30, timeStamp: time, isTrusted: true, ...values});
  return {probe, control, samples, event, setTime(value) { time = value; }, flush() { probe.flush(); return samples.at(-1); }};
}

test('an ordinary physical tap is counted once; keyboard and synthetic clicks do not distort it', () => {
  const h = harness();
  h.probe.down(h.event(), h.control);
  h.setTime(90); h.probe.up(h.event());
  h.probe.click(h.event(), h.control);
  h.probe.click(h.event(), h.control);
  h.probe.down(h.event({isTrusted: false}), h.control);
  h.probe.click(h.event({isTrusted: false}), h.control);
  const sample = h.flush();
  assert.equal(sample.tapDowns, 1);
  assert.equal(sample.tapReleases, 1);
  assert.equal(sample.tapClicks, 1);
  assert.equal(sample.tapMissingClicks, 0);
});

test('stationary released controls without a click are measured separately from scrolling and cancellation', () => {
  const h = harness();
  h.probe.down(h.event(), h.control); h.probe.up(h.event());
  h.probe.down(h.event({pointerId: 2}), h.control);
  h.probe.move(h.event({pointerId: 2, clientY: 60}));
  h.probe.up(h.event({pointerId: 2, clientY: 60}));
  h.probe.down(h.event({pointerId: 3}), h.control); h.probe.cancel(h.event({pointerId: 3}));
  h.setTime(600); h.probe.tick();
  const sample = h.flush();
  assert.equal(sample.tapReleases, 1);
  assert.equal(sample.tapMissingClicks, 1);
  assert.equal(sample.tapMoved, 1);
  assert.equal(sample.tapCancelled, 1);
  assert.equal(sample.tapRepeated, 2);
});

test('a control removed during its press or before click is not reported as a missed click', () => {
  const h = harness();
  h.probe.down(h.event(), h.control); h.control.isConnected = false; h.probe.up(h.event());
  h.control.isConnected = true;
  h.probe.down(h.event(), h.control); h.probe.up(h.event()); h.control.isConnected = false;
  h.setTime(600); h.probe.tick();
  const sample = h.flush();
  assert.equal(sample.tapDetached, 2);
  assert.equal(sample.tapMissingClicks, 0);
});

test('late clicks and main-thread delays remain visible without claiming why the delay occurred', () => {
  const h = harness();
  h.setTime(100); h.probe.down(h.event({timeStamp: 30}), h.control);
  h.probe.up(h.event());
  h.setTime(900); h.probe.click(h.event({timeStamp: 800}), h.control); h.probe.tick();
  const sample = h.flush();
  assert.equal(sample.tapMissingClicks, 1);
  assert.equal(sample.tapClicks, 0);
  assert.equal(sample.inputDelayMaxMs, 100);
  assert.equal(sample.mainLagMaxMs, 650);
});

test('lifecycle reset discards incomplete touches and never treats a background pause as input lag', () => {
  const h = harness();
  h.probe.down(h.event(), h.control); h.probe.up(h.event());
  h.setTime(30000); h.probe.reset();
  h.setTime(30250); h.probe.tick();
  const sample = h.flush();
  assert.equal(sample.tapMissingClicks, 0);
  assert.equal(sample.mainLagMaxMs, 0);
});

test('samples contain only numeric aggregate counters and reset after each batch', () => {
  const h = harness();
  h.control.secret = 'a player identifier must never leave this object';
  for (let n = 0; n < 90; n++) {
    h.setTime(n * 100);
    h.probe.down(h.event({clientX: 101, clientY: 203}), h.control);
    h.probe.up(h.event({clientX: 101, clientY: 203}));
    h.probe.click(h.event(), h.control);
  }
  const sample = h.flush();
  assert.equal(sample.tapClicks, 90);
  assert.ok(Object.values(sample).every(value => typeof value === 'number' && Number.isFinite(value)));
  assert.doesNotMatch(JSON.stringify(sample), /secret|identifier|clientX|clientY|target|control/);
  assert.equal(h.flush().tapDowns, 0);
});

test('release hit mismatch, disabling and prevention are distinct from missing clicks', () => {
  const h = harness(), other = {isConnected: true};
  h.probe.down(h.event(), h.control); h.probe.up(h.event(), {hitControl: other});
  h.probe.down(h.event(), h.control); h.probe.up(h.event(), {disabled: true, hitControl: h.control});
  h.probe.down(h.event(), h.control); h.probe.up(h.event({defaultPrevented: true}), {hitControl: h.control});
  h.setTime(600); h.probe.tick();
  const sample = h.flush();
  assert.equal(sample.tapReleaseHitMismatch, 1);
  assert.equal(sample.tapDisabledRelease, 1);
  assert.equal(sample.tapPreventedRelease, 1);
  assert.equal(sample.tapMissingClicks, 0);
  assert.equal(sample.tapReleases, 0);
});

test('native touch activation is counted separately and consumes its release before a closing action', () => {
  const h = harness();
  h.probe.down(h.event(), h.control); h.probe.up(h.event(), {hitControl: h.control});
  h.probe.touchResult(h.control);
  // The existing click callback can synchronously stop the check or close a dialog.
  h.probe.click(h.event({isTrusted: false, detail: 0}), h.control);
  h.control.isConnected = false;
  h.setTime(600); h.probe.tick();
  const sample = h.flush();
  assert.equal(sample.tapActivatedTouch, 1);
  assert.equal(sample.tapClicks, 0);
  assert.equal(sample.tapDetached, 0);
  assert.equal(sample.tapMissingClicks, 0);
});

test('a rejected owned touch is not presented as an unexplained missing click', () => {
  const h = harness();
  h.probe.down(h.event(), h.control); h.probe.up(h.event());
  h.probe.touchResult(h.control, true);
  h.setTime(600); h.probe.tick();
  const sample = h.flush();
  assert.equal(sample.tapRejected, 1);
  assert.equal(sample.tapActivatedTouch, 0);
  assert.equal(sample.tapMissingClicks, 0);
});

test('unmatched trusted pointer clicks stay visible without counting keyboard or arbitrary synthetic clicks', () => {
  const h = harness();
  h.probe.click(h.event({detail: 1}), h.control);
  h.probe.click(h.event({detail: 0}), h.control);
  h.probe.click(h.event({detail: 1, isTrusted: false}), h.control);
  assert.equal(h.flush().tapUnmatchedClicks, 1);
});

test('a newer explicit touch receipt cannot hide an earlier unexplained missed click', () => {
  const h = harness();
  h.probe.down(h.event(), h.control); h.probe.up(h.event());
  h.setTime(100); h.probe.down(h.event(), h.control); h.probe.up(h.event());
  h.probe.touchResult(h.control);
  h.setTime(600); h.probe.tick();
  const sample = h.flush();
  assert.equal(sample.tapActivatedTouch, 1);
  assert.equal(sample.tapMissingClicks, 1);
});


test('the optional observer uses passive capture only, stops on opt-out, and removes every listener', context => {
  let time = 0, enabled = true, stopped = 0, timer;
  const handlers = new Map(), samples = [];
  class TestControl { isConnected = true; closest() { return this; } matches() { return false; } }
  const originalElement = globalThis.Element;
  globalThis.Element = TestControl;
  context.after(() => { if (originalElement === undefined) delete globalThis.Element; else globalThis.Element = originalElement; });
  context.mock.method(globalThis, 'setInterval', callback => { timer = callback; return 9; });
  const clear = context.mock.method(globalThis, 'clearInterval', () => {});
  const doc = {
    hidden: false,
    addEventListener(name, handler, options) {
      if (name !== 'visibilitychange') assert.deepEqual(options, {capture: true, passive: true});
      handlers.set(name, handler);
    },
    removeEventListener(name, handler) { assert.equal(handlers.get(name), handler); handlers.delete(name); }
  };
  const stop = startInputDiagnostics({document: doc, now: () => time, enabled: () => enabled,
    sample: value => samples.push(value), stopped: () => stopped++});
  const control = new TestControl(), event = {target: control, pointerId: 1, clientX: 20, clientY: 20, timeStamp: 0, isTrusted: true,
    preventDefault() { assert.fail('The probe must not alter touch behavior.'); }, stopPropagation() { assert.fail('The probe must not alter bubbling.'); }};
  handlers.get('pointerdown')(event); handlers.get('pointerup')(event); handlers.get('click')(event);
  time = 30000; timer();
  assert.equal(samples.length, 1); assert.equal(samples[0].tapClicks, 1);
  enabled = false; timer();
  assert.equal(handlers.size, 0); assert.equal(stopped, 1); assert.equal(clear.mock.callCount(), 1);
  stop(); assert.equal(stopped, 1); assert.equal(samples.length, 1, 'Opt-out must not save another sample.');
});

test('the observer stops automatically at two minutes or when the app is hidden', context => {
  let time = 0, timer;
  context.mock.method(globalThis, 'setInterval', callback => { timer = callback; return 4; });
  context.mock.method(globalThis, 'clearInterval', () => {});
  for (const hide of [false, true]) {
    time = 0;
    const handlers = new Map(), samples = [];
    let stopped = 0;
    const doc = {hidden: false, addEventListener(name, value) { handlers.set(name, value); }, removeEventListener(name) { handlers.delete(name); }};
    startInputDiagnostics({document: doc, now: () => time, enabled: () => true, sample: value => samples.push(value), stopped: () => stopped++});
    if (hide) { doc.hidden = true; handlers.get('visibilitychange')(); }
    else { time = 120000; timer(); }
    assert.equal(handlers.size, 0); assert.equal(stopped, 1); assert.equal(samples.length, 1);
  }
});
