import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createBattleRuntime} from '../runtime/battle-runtime.js';

async function setup() {
  const sent = [], reports = [];
  let stopped = false, disposed = false;
  const worker = {onmessage: null, onerror: null, postMessage: value => sent.push(value), terminate: () => {stopped = true;}};
  const runtime = createBattleRuntime({open: async () => ({worker, dispose: () => {disposed = true;}}), report: (...value) => reports.push(value)});
  await Promise.resolve();
  const receive = data => worker.onmessage({data});
  return {runtime, worker, sent, reports, receive, get stopped() {return stopped;}, get disposed() {return disposed;}};
}

test('worker waits for startup and coalesces queued forecasts while publishing completed prefixes', async () => {
  const h = await setup(), completed = [];
  try {
    h.runtime.request({seed: 1}, (result, meta) => completed.push([result, meta]));
    assert.equal(h.sent.length, 0);
    h.receive({type: 'ready'});
    assert.equal(h.runtime.status, 'ready');
    const first = h.sent[0].id;
    h.runtime.request({seed: 2}, () => assert.fail('Superseded job published.'));
    h.runtime.request({seed: 3}, (result, meta) => completed.push([result, meta]));
    h.receive({id: first, result: 'first'});
    assert.deepEqual(completed, [['first', {pending: true}]]);
    assert.equal(h.sent.length, 2);
    assert.equal(h.sent[1].input.seed, 3);
    h.receive({id: h.sent[1].id, result: 'last'});
    assert.deepEqual(completed[1], ['last', {pending: false}]);
  } finally {h.runtime.close();}
  assert.equal(h.stopped, true);
  assert.equal(h.disposed, true);
});

test('cancelled and stale replies cannot resurrect a battle', async () => {
  const h = await setup(), completed = [];
  try {
    h.receive({type: 'ready'});
    h.runtime.request({seed: 1}, value => completed.push(value));
    const old = h.sent[0].id;
    h.runtime.cancel();
    h.runtime.request({seed: 2}, value => completed.push(value));
    h.receive({id: old + 100, result: 'foreign'});
    assert.equal(h.sent.length, 1);
    h.receive({id: old, result: 'cancelled'});
    h.receive({id: h.sent[1].id, result: 'current'});
    assert.deepEqual(completed, ['current']);
    h.runtime.close();
    h.receive({id: h.sent[1].id, result: 'late'});
    assert.deepEqual(completed, ['current']);
  } finally {h.runtime.close();}
});

test('worker failure is explicit, terminates the worker and never runs simulation on the UI thread', async () => {
  const h = await setup(), errors = [];
  try {
    h.receive({type: 'ready'});
    h.runtime.request({seed: 1}, () => assert.fail('Failed worker returned a result.'), error => errors.push(error));
    h.runtime.request({seed: 2}, () => assert.fail('Pending worker returned a result.'), error => errors.push(error));
    h.worker.onerror({preventDefault() {}});
    assert.equal(h.runtime.status, 'failed');
    assert.equal(h.runtime.threaded, false);
    assert.equal(h.stopped, true);
    assert.equal(h.disposed, true);
    assert.equal(errors.length, 2);
    assert.equal(h.reports.at(-1)[0], 'failed');
    h.runtime.request({seed: 3}, () => assert.fail('Fallback must not simulate.'), error => errors.push(error));
    assert.equal(errors.length, 3);
    assert.equal(h.sent.length, 1);
  } finally {h.runtime.close();}
});

test('failed startup and closing during asynchronous load release resources', async () => {
  const reports = [], errors = [];
  const runtime = createBattleRuntime({open: async () => {throw new Error('Unavailable');}, report: (...args) => reports.push(args)});
  runtime.request({seed: 1}, () => assert.fail('No worker exists.'), error => errors.push(error));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(runtime.status, 'failed');
  assert.equal(reports[0][0], 'failed');
  assert.equal(errors.length, 1);
  runtime.close();
  let finish, stops = 0, disposals = 0;
  const closing = createBattleRuntime({open: () => new Promise(resolve => {finish = resolve;}), report: () => assert.fail('Closed runtime emitted a status.')});
  closing.close();
  finish({worker: {terminate: () => stops++}, dispose: () => disposals++});
  await Promise.resolve();
  assert.equal(stops, 1);
  assert.equal(disposals, 1);
});
