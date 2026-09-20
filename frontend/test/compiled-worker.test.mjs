import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Worker} from 'node:worker_threads';
import {createHash} from 'node:crypto';
import * as R from '../../backend/src/rules.mjs';

const asset = new URL('../../Stonewake/Web/assets/battle-worker.js', import.meta.url);

async function openWorker() {
  const bootstrap = `const {parentPort}=require('node:worker_threads');globalThis.postMessage=value=>parentPort.postMessage(value);parentPort.on('message',data=>globalThis.onmessage({data}));import(${JSON.stringify(asset.href)}).catch(error=>{throw error});`;
  const worker = new Worker(bootstrap, {eval: true});
  await new Promise((resolve, reject) => {
    worker.once('message', message => {try {assert.equal(message.type, 'ready'); resolve();} catch (error) {reject(error);}});
    worker.once('error', reject);
  });
  return worker;
}
async function simulate(worker, input, id) {
  return new Promise((resolve, reject) => {
    worker.once('message', message => {
      try {assert.equal(message.id, id); assert.equal(message.error, undefined); resolve(message.result);} catch (error) {reject(error);}
    });
    worker.once('error', reject);
    worker.postMessage({id, input});
  });
}

test('compiled worker and shared server preserve historical battle and naval replays', {timeout: 30000}, async () => {
  const worker = await openWorker();
  try {
    let id = 0;
    for (const file of ['combat-legacy.json', 'naval-v2-legacy.json']) {
      const fixture = JSON.parse(await readFile(new URL('../../scripts/fixtures/' + file, import.meta.url), 'utf8'));
      const server = R.Kl(fixture.input);
      assert.equal(createHash('sha256').update(JSON.stringify(server)).digest('hex'), fixture.sha256);
      assert.deepEqual(await simulate(worker, fixture.input, ++id), server);
    }
  } finally {await worker.terminate();}
});

test('compiled worker preserves sea cargo, landing, ship commands and final objective', {timeout: 30000}, async () => {
  const now = 1800000000000, state = R.Y(R.Al(now), now);
  state.buildings.find(building => building.kind === 'keep').level = 7;
  state.buildings.push({id: 'harbor', kind: 'harbor', level: 7, x: -2, y: 3});
  state.buildings.push({id: 'barracks', kind: 'barracks', level: 7, x: 3, y: 4});
  state.fleet = [{id: 'carrier', kind: 'cog', level: 7}, {id: 'escort', kind: 'galley', level: 7}];
  state.army = {...R.wl(), infantry: 10, archer: 6, healer: 3};
  state.unitLevels = Object.fromEntries(Object.keys(R.J).map(kind => [kind, 5]));
  const pack = R.SWPackCargo14(state, state.fleet.map(ship => ship.id), state.army);
  const input = R.SWCreateBattle14(state, {kind: 'sea', campaignIndex: 0}, {army: pack.army, fleet: pack.fleet}, 101);
  input.orders = [];
  for (const ship of input.fleet14) for (const [kind, count] of Object.entries(ship.cargo)) {
    for (let index = 0; index < count; index++) input.orders.push({kind, shipId: ship.id, x: -1, y: ship.id === 'escort' ? 6 : 2, time: input.orders.length * 0.25});
  }
  input.shipOrders14 = [{type: 'ability', shipId: 'carrier', time: 4}];
  const worker = await openWorker();
  try {
    const server = R.Kl(input), result = await simulate(worker, input, 77);
    assert.deepEqual(result, server);
    assert.ok(result.landedTroops > 0);
    assert.equal(result.landedTroops + result.rescuedTroops, R.Nl(input.army));
    assert.ok(result.frames.some(frame => frame.shots.some(shot => shot.kind === 'naval')));
  } finally {await worker.terminate();}
});
