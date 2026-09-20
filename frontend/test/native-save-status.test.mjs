import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {parse} from 'acorn';
import {createNativeSaveStatus} from '../runtime/native-save-status.js';
import {loadDeclarations} from './load-declarations.mjs';

function nativeHarness(session = 'document-A') {
  const status = createNativeSaveStatus(() => session), messages = [], shown = [];
  let listener;
  const window = {
    addEventListener: (name, callback) => { if (name === 'stonewake-save-status') listener = callback; },
    removeEventListener: () => { listener = undefined; },
  };
  const host = {postMessage: message => messages.push(message)};
  const {Mu} = loadDeclarations(new URL('../legacy/presentation.js', import.meta.url), ['Mu'], {Au: () => host, window, nativeSaveStatus: status});
  const source = readFileSync(new URL('../../client/build14/Ju.js', import.meta.url), 'utf8');
  const ast = parse(source, {ecmaVersion: 2022, sourceType: 'module'});
  const effects = [];
  const visit = node => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'CallExpression' && source.slice(node.callee.start, node.callee.end).endsWith('C.useEffect') && node.arguments[0]?.type === 'ArrowFunctionExpression') effects.push(node.arguments[0]);
    for (const child of Object.values(node)) if (Array.isArray(child)) child.forEach(visit); else if (child && typeof child === 'object') visit(child);
  };
  visit(ast);
  const context = vm.createContext({Mu, nativeSaveStatus: status, window, Mt: saved => shown.push(saved), o: 'practice', ju: () => null, t: {revision: 1}, vt: [], L: null, R: null, lt: 0});
  const extract = marker => {
    const effect = effects.find(node => source.slice(node.start, node.end).includes(marker));
    assert.ok(effect, `production save effect contains ${marker}`);
    return vm.runInContext('(' + source.slice(effect.start, effect.end) + ')', context);
  };
  extract('stonewake-save-status')();
  return {Mu, status, host, messages, shown, save: extract('const saveStatus = Mu('), acknowledge: detail => listener({detail})};
}

test('latest native write stays pending until its own durable acknowledgement', () => {
  const h = nativeHarness();
  h.save(); h.save();
  const [first, latest] = h.messages;
  assert.equal(first.requestId, 'document-A.1');
  assert.equal(latest.requestId, 'document-A.2');
  assert.deepEqual(h.shown, [null, null], 'every native write clears the saved indicator immediately');
  h.acknowledge({requestId: first.requestId, saved: true});
  assert.deepEqual(h.shown, [null, null], 'older success cannot confirm the latest snapshot');
  h.acknowledge({requestId: latest.requestId, saved: true});
  assert.deepEqual(h.shown, [null, null, true]);
  h.acknowledge({requestId: first.requestId, saved: false});
  h.acknowledge({requestId: latest.requestId, saved: false});
  assert.deepEqual(h.shown, [null, null, true], 'late or duplicate replies cannot overwrite a settled result');
});

test('native error remains unsaved and malformed or uncorrelated replies are ignored', () => {
  const h = nativeHarness();
  h.save();
  const requestId = h.messages[0].requestId;
  for (const detail of [null, {}, {saved: true}, {requestId, saved: 'true'}]) h.acknowledge(detail);
  assert.deepEqual(h.shown, [null]);
  h.acknowledge({requestId, saved: false});
  assert.deepEqual(h.shown, [null, false]);
  h.save();
  h.acknowledge({requestId: h.messages[1].requestId, saved: true});
  assert.equal(h.shown.at(-1), true, 'a subsequent successful write recovers the status');
});

test('a new document cannot accept the previous document save completion', () => {
  const old = nativeHarness('old-document'), current = nativeHarness('new-document');
  old.save(); current.save();
  assert.ok(old.messages[0].requestId.endsWith('.1'));
  assert.ok(current.messages[0].requestId.endsWith('.1'));
  current.acknowledge({requestId: old.messages[0].requestId, saved: true});
  assert.deepEqual(current.shown, [null]);
  current.acknowledge({requestId: current.messages[0].requestId, saved: true});
  assert.deepEqual(current.shown, [null, true]);
});

test('failed bridge dispatch supersedes prior requests and stays unsaved', () => {
  const h = nativeHarness();
  h.save();
  h.host.postMessage = () => { throw new Error('bridge unavailable'); };
  h.save();
  assert.deepEqual(h.shown, [null, false]);
  h.acknowledge({requestId: h.messages[0].requestId, saved: true});
  h.acknowledge({requestId: 'document-A.2', saved: true});
  assert.deepEqual(h.shown, [null, false], 'neither a prior completion nor an impossible failed-dispatch reply confirms saving');
});
