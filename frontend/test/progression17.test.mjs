import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../core/server-entry.js';
import {runProgression17} from './progression-model17.mjs';

for (const style of ['builder', 'land', 'naval']) test(style + ' economy reaches Keep 10 through real construction, research and funding actions', () => {
  const {state, metrics} = runProgression17(style);
  assert.equal(R.Ml(state), 10);
  assert.equal(metrics.levels.length, 10);
  assert.equal(metrics.gemSpending, 0);
  assert.ok(metrics.actions > 70);
  assert.ok(metrics.tradeCount > 0);
  assert.equal(state.gems, 100 + 10 * (style === 'naval' ? 30 : 25));
  assert.equal(state.campaign, style === 'naval' ? 0 : 10);
  assert.equal(state.seaCampaign, style === 'naval' ? 10 : 0);
  assert.ok(R.xl.every(kind => state.resources[kind] <= R.SWCapacity(state)));
  assert.ok(state.buildings.every(building => building.level <= 10));
  assert.equal(R.SWUpgradeQuote14(state, state.buildings.find(building => building.kind === 'keep')).allowed, false);
  assert.throws(() => R.Ul(state, {type: 'upgrade', id: 'keep'}, state.lastTick), /Medieval level complete/);
});

test('optional shortfall trades reduce material waits in the modeled builder loop without gem spending', () => {
  const withTrades = runProgression17('builder').metrics, withoutTrades = runProgression17('builder', {trades: false}).metrics;
  assert.ok(withTrades.minutes < withoutTrades.minutes);
  assert.ok(Object.values(withTrades.blockedMinutes).reduce((sum, minutes) => sum + minutes, 0) < Object.values(withoutTrades.blockedMinutes).reduce((sum, minutes) => sum + minutes, 0));
  assert.equal(withTrades.gemSpending, 0);
  assert.equal(withoutTrades.gemSpending, 0);
});

for (const style of ['land', 'naval']) test('a fresh kingdom can finish all ten ' + style + ' missions with actual combat and earned resources', () => {
  const {state, metrics} = runProgression17(style, {simulateBattles: true});
  assert.equal(metrics.battles.length, 10);
  assert.ok(metrics.battles.every(battle => battle.won));
  assert.equal(metrics.battles[0].won, true);
  assert.ok(metrics.battles[0].deployed >= 4);
  assert.ok(metrics.battles[0].survivors > 0);
  assert.equal(R.SWCampaignProgress17(state).total, 10);
  assert.equal(R.Ml(state), 10);
  assert.equal(metrics.gemSpending, 0);
});
