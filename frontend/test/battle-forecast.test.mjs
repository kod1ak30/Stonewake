import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createBattleForecast} from '../runtime/battle-forecast.js';

function harness() {
  const runtimes = [], changes = [], legacy = [];
  const forecast = createBattleForecast({
    onChange: state => changes.push(state),
    simulateLegacy: input => { legacy.push(input); return {version: input.rulesVersion}; },
    openRuntime: () => {
      const value = {jobs: [], cancelled: 0, closed: false,
        request(input, complete, fail) { this.jobs.push({input, complete, fail}); },
        cancel() { this.cancelled++; },
        close() { this.closed = true; }};
      runtimes.push(value);
      return value;
    }
  });
  return {forecast, runtimes, changes, legacy};
}

test('modern start and resume queue all simulation off-thread while historical replays preserve their route', () => {
  const h = harness(), saved = {rulesVersion: 4, seed: 24, orders: [{kind: 'infantry', time: 4}]};
  h.forecast.request(saved, {reset: true});
  assert.equal(h.legacy.length, 0);
  assert.deepEqual(h.forecast.state, {result: null, pending: true, error: ''});
  assert.equal(h.runtimes[0].jobs[0].input, saved, 'Resume must use exactly the persisted input, including orders.');
  h.runtimes[0].jobs[0].complete({won: true, duration: 88}, {pending: false});
  assert.equal(h.forecast.state.result.duration, 88);
  const old = {rulesVersion: 3, seed: 1};
  h.forecast.request(old, {reset: true});
  assert.deepEqual(h.legacy, [old]);
  assert.deepEqual(h.forecast.state, {result: {version: 3}, pending: false, error: ''});
  h.forecast.close();
});

test('failure discards stale victories and retry runs the latest orders in a fresh worker', () => {
  const h = harness(), first = {rulesVersion: 4, orders: []}, latest = {rulesVersion: 4, orders: [{kind: 'archer', time: 9}]};
  h.forecast.request(first, {reset: true});
  const runtime = h.runtimes[0];
  runtime.jobs[0].complete({won: true}, {pending: false});
  h.forecast.request(latest);
  assert.equal(h.forecast.state.pending, true);
  runtime.jobs[1].fail('Worker stopped');
  assert.equal(runtime.closed, true);
  assert.deepEqual(h.forecast.state, {result: null, pending: false, error: 'Worker stopped'});
  runtime.jobs[0].complete({won: true}, {pending: false});
  assert.equal(h.forecast.state.result, null, 'Late old results cannot resurrect a stale victory.');
  h.forecast.retry();
  assert.equal(h.runtimes.length, 2);
  assert.equal(h.runtimes[1].jobs[0].input, latest);
  assert.deepEqual(h.forecast.state, {result: null, pending: true, error: ''});
  h.runtimes[1].jobs[0].complete({won: false}, {pending: false});
  assert.deepEqual(h.forecast.state, {result: {won: false}, pending: false, error: ''});
  assert.equal(h.legacy.length, 0, 'Worker failure must never fall back to UI-thread combat.');
  h.forecast.close();
});

test('coalesced prefixes remain pending and a new battle ignores old completions', () => {
  const h = harness();
  h.forecast.request({rulesVersion: 4, seed: 1}, {reset: true});
  h.forecast.request({rulesVersion: 4, seed: 2});
  const runtime = h.runtimes[0];
  runtime.jobs[0].complete({duration: 50}, {pending: true});
  assert.equal(h.forecast.state.pending, true);
  h.forecast.request({rulesVersion: 4, seed: 3}, {reset: true});
  runtime.jobs[1].complete({duration: 60}, {pending: false});
  assert.equal(h.forecast.state.result, null);
  runtime.jobs[2].complete({duration: 70}, {pending: false});
  assert.equal(h.forecast.state.result.duration, 70);
  h.forecast.cancel();
  runtime.jobs[2].complete({duration: 90}, {pending: false});
  assert.deepEqual(h.forecast.state, {result: null, pending: false, error: ''});
  h.forecast.retry();
  assert.equal(runtime.jobs.length, 3, 'Cancelled battles must not be retried.');
  h.forecast.close();
});
