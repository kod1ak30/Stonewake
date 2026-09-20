import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../core/server-entry.js';

const now = 1800000000000, crown = 'banner:beacon-crown';
const fresh = () => R.Y(R.Al(now), now);

test('Coastal Crown is an earned finale appearance that cannot be bought or equipped early', () => {
  const state = fresh(); state.gems = 100000;
  const item = R.SWPremiumCatalog.find(item => item.id === crown);
  assert.equal(item.slot, 'banner');
  assert.equal(item.value, 'beacon-crown');
  assert.equal(item.priceGems, null);
  assert.equal(R.SWCosmeticStatus(state, crown).canBuy, false);
  assert.ok(!R.SWPremiumCollections.some(collection => collection.items.includes(crown)));
  const before = structuredClone(state);
  for (const maxPrice of [0, null, 100000]) assert.throws(() => R.Ul(state, {type: 'buyCosmetic', id: crown, maxPrice}, now), /Complete Crown/);
  assert.throws(() => R.Ul(state, {type: 'equipCosmetic', id: crown}, now), /Unlock/);
  assert.ok(!R.Y(state, now).premium.owned.includes(crown));
  assert.deepEqual(state, before);
});

test('the finale awards its unique banner once while retaining the established gem and cosmetic rewards', () => {
  const state = fresh();
  state.buildings.find(building => building.kind === 'keep').level = 10;
  state.campaign = 10;
  state.premium.chapter.finaleClaimed = true;
  assert.equal(R.SWMedievalFinale(state).status, 'claimable');
  const completed = R.Ul(state, {type: 'claimEraFinale'}, now);
  assert.equal(completed.gems, state.gems+50);
  for (const id of [crown, 'commander:laurel', 'banner:ivory']) {
    assert.equal(completed.premium.owned.filter(item => item === id).length, 1);
    assert.ok(completed.premium.sources[id].includes('era:medieval'));
  }
  assert.equal(R.SWMedievalFinale(completed).status, 'complete');
  assert.throws(() => R.Ul(completed, {type: 'claimEraFinale'}, now), /requirements/);
  const equipped = R.Ul(completed, {type: 'equipCosmetic', id: crown}, now);
  assert.equal(R.SWAppearance(equipped).banner, 'beacon-crown');
  assert.equal(equipped.gems, completed.gems);
});

test('previously completed finales gain the banner idempotently without gems or changes to existing ownership', () => {
  const legacy = fresh();
  legacy.premium.eraCompletedAt = now-1000;
  legacy.premium.owned.push('banner:ivory', 'commander:laurel');
  legacy.premium.equipped.banner = 'banner:ivory';
  legacy.premium.sources['banner:ivory'] = ['gems'];
  legacy.premium.sources['commander:laurel'] = ['era:medieval'];
  const before = structuredClone(legacy), migrated = R.Y(legacy, now);
  assert.equal(migrated.gems, legacy.gems);
  assert.deepEqual(migrated.premium.owned.filter(id => id !== crown), legacy.premium.owned);
  assert.deepEqual(migrated.premium.equipped, legacy.premium.equipped);
  assert.deepEqual(migrated.premium.sources[crown], ['era:medieval']);
  for (const id of ['banner:ivory', 'commander:laurel']) assert.deepEqual(migrated.premium.sources[id], legacy.premium.sources[id]);
  for (const field of ['resources', 'army', 'buildings', 'fleet', 'unitLevels', 'campaign', 'seaCampaign']) assert.deepEqual(migrated[field], legacy[field]);
  assert.deepEqual(R.Y(migrated, now), migrated);
  assert.deepEqual(legacy, before);
});
