import test from 'node:test';
import assert from 'node:assert/strict';
import {loadDeclarations} from './load-declarations.mjs';

const source = new URL('../../client/build15/combat-presentation.js', import.meta.url);

test('structural collapse settles from roof to base without looping', () => {
  const {SWDestructionPhase15} = loadDeclarations(source, ['SWDestructionPhase15']);
  let previous = {roof: 0, walls: 0, base: 0};
  for (const age of [0, 120, 350, 600, 900, 1050, 5000]) {
    const phase = SWDestructionPhase15(age);
    assert.ok(phase.roof >= phase.walls && phase.walls >= phase.base);
    for (const key of ['roof', 'walls', 'base']) assert.ok(phase[key] >= previous[key] && phase[key] <= 1);
    previous = phase;
  }
  assert.equal(SWDestructionPhase15(5000).dust, 0);
  assert.equal(SWDestructionPhase15(5000).settled, true);
});

test('reduced motion immediately uses static ruins and suppresses damage animation', () => {
  const {SWDestructionPhase15, SWDamageProfile15} = loadDeclarations(source, ['SWDestructionPhase15', 'SWDamageProfile15']);
  const collapse = SWDestructionPhase15(20, true);
  assert.equal(collapse.settled, true);
  assert.equal(collapse.dust, 0);
  assert.equal(collapse.debris, 1);
  const damage = SWDamageProfile15(.1, true);
  assert.equal(damage.stage, 3);
  assert.equal(damage.smoke, 0);
  assert.equal(damage.flames, false);
});

test('visible damage increases with damage and disappears for destroyed buildings', () => {
  const {SWDamageProfile15} = loadDeclarations(source, ['SWDamageProfile15']);
  assert.deepEqual([1, .7, .4, .2, 0].map(hp => SWDamageProfile15(hp).stage), [0, 1, 2, 3, 0]);
  assert.ok(SWDamageProfile15(.2).scorch > SWDamageProfile15(.7).scorch);
});

test('naval siege hits use strong water effects without a gunpowder fireball', () => {
  const {SWCombatEffectProfile15} = loadDeclarations(source, ['SWTimberStructures15', 'SWCombatEffectProfile15']);
  const hit = SWCombatEffectProfile15({kind: 'bombard', type: 'impact', targetNaval: true});
  assert.equal(hit.heavy, true);
  assert.equal(hit.water, true);
  assert.equal(hit.timber, true);
  assert.equal(hit.fire, false);
  assert.equal(SWCombatEffectProfile15({kind: 'cannon', type: 'impact'}).fire, true);
  // Simulation events identify the hull via targetKind, without targetNaval.
  const actualHullHit = SWCombatEffectProfile15({kind: 'tower', type: 'impact', targetKind: 'cog'});
  assert.equal(actualHullHit.water, true);
  assert.equal(actualHullHit.timber, true);
});

test('combat effects keep major impacts and discard expired particles within a fixed budget', () => {
  const {SWSelectCombatEffects15, SWBattleEffectBudget15} = loadDeclarations(source, ['SWTimberStructures15', 'SWBattleEffectBudget15', 'SWCombatEffectProfile15', 'SWSelectCombatEffects15']);
  const impacts = Array.from({length: 60}, (_, id) => ({id, type: 'impact', kind: 'archer', born: 900 + id}));
  const breach = {id: 'collapse', type: 'breach', kind: 'trebuchet', born: 700};
  const expired = {id: 'expired', type: 'breach', kind: 'trebuchet', born: 0};
  const selected = SWSelectCombatEffects15([...impacts, breach, expired], 1500);
  assert.equal(selected.length, SWBattleEffectBudget15.activeImpacts);
  assert.equal(selected[0], breach);
  assert.ok(!selected.includes(expired));
  assert.equal(impacts.length, 60);
});
