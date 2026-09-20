import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../core/server-entry.js';
import {loadDeclarations} from './load-declarations.mjs';

const now = 1800000000000;
function readyDistrict() {
  const state = R.Y(R.Al(now), now);
  state.buildings.find(building => building.kind === 'keep').level = 2;
  state.buildings.push({id: 'well', kind: 'well', level: 1, x: 8, y: 8});
  state.resources = Object.fromEntries(R.xl.map(kind => [kind, R.SWCapacity(state)]));
  return state;
}
const startDistrict = () => R.Ul(readyDistrict(), {type: 'startCivicProject', id: 'homes'}, now);

test('real civic construction appears in Projects and natural completion releases the blocked upgrade crew', () => {
  let state = readyDistrict();
  const farm = state.buildings.find(building => building.kind === 'farm');
  assert.equal(R.SWUpgradeQuote14(state, farm).allowed, true);
  state = R.Ul(state, {type: 'startCivicProject', id: 'homes'}, now);
  assert.equal(R.Rc(state), 0);
  const quote = R.SWUpgradeQuote14(state, farm);
  assert.equal(quote.allowed, false);
  assert.deepEqual(quote.requirements.find(requirement => requirement.id === 'builders').action, {type: 'projects'});
  const snapshot = structuredClone(state), project = R.GemProjects(state).find(item => item.target === 'civic');
  assert.equal(project.id, 'homes');
  assert.equal(project.districtId, 'homes');
  assert.equal(project.siteId, state.city.projects.homes.siteId);
  assert.match(project.name, /Residential quarter.*Village commons/);
  assert.equal(project.readyAt, now + 90000);
  assert.deepEqual(state, snapshot, 'Reading the project list changed the kingdom');
  assert.throws(() => R.Ul(state, {type: 'upgrade', id: farm.id}, now), /construction crews/);
  const completed = R.Y(state, project.readyAt);
  assert.equal(R.SWCivicStage(completed, 'homes'), 1);
  assert.equal(R.Rc(completed), 1);
  assert.equal(R.GemProjects(completed).some(item => item.target === 'civic'), false);
  assert.equal(R.SWUpgradeQuote14(completed, farm).allowed, true);
  assert.equal(completed.gems, state.gems, 'Timer completion silently claimed the district reward');
});

test('quoted civic speedup completes only the district, frees its crew and leaves celebration as a separate claim', () => {
  const state = startDistrict(), snapshot = structuredClone(state);
  const project = R.GemProjects(state).find(item => item.target === 'civic'), price = R.GemCost(project.readyAt, now);
  const completed = R.Ul(state, {type: 'speedup', target: 'civic', id: project.id, maxCost: price}, now);
  assert.equal(price, 2);
  assert.equal(completed.gems, state.gems-price);
  assert.equal(completed.city.projects.homes.stage, 1);
  assert.equal(completed.city.projects.homes.readyAt, undefined);
  assert.equal(completed.city.projects.homes.targetStage, undefined);
  assert.equal(completed.city.projects.homes.claimedStage, undefined);
  assert.equal(R.SWCivicProject(completed, 'homes', now).status, 'claimable');
  assert.equal(R.Rc(completed), 1);
  for (const field of ['resources', 'buildings', 'army', 'fleet', 'unitLevels']) assert.deepEqual(completed[field], state[field], field+' changed during district speedup');
  assert.deepEqual(state, snapshot, 'The authoritative action mutated its input');
  const farm = completed.buildings.find(building => building.kind === 'farm');
  assert.equal(R.Ul(completed, {type: 'upgrade', id: farm.id}, now).buildings.find(building => building.id === farm.id).targetLevel, 2);
  const celebrated = R.Ul(completed, {type: 'claimCivicProject', id: 'homes'}, now);
  assert.equal(celebrated.gems, completed.gems+5);
  assert.throws(() => R.Ul(celebrated, {type: 'claimCivicProject', id: 'homes'}, now), /already been collected/);
});

test('civic speedup rejects stale, duplicate and unaffordable requests without charging or advancing work', () => {
  const state = startDistrict(), snapshot = structuredClone(state);
  const command = {type: 'speedup', target: 'civic', id: 'homes', maxCost: 2};
  assert.throws(() => R.Ul(state, {...command, maxCost: 1}, now), /current gem cost/);
  assert.throws(() => R.Ul(state, {...command, id: 'missing'}, now), /already complete/);
  const poor = {...state, gems: 1}, poorSnapshot = structuredClone(poor);
  assert.throws(() => R.Ul(poor, command, now), /Not enough gems/);
  assert.deepEqual(poor, poorSnapshot);
  assert.deepEqual(state, snapshot);
  const completed = R.Ul(state, command, now), doneSnapshot = structuredClone(completed);
  assert.throws(() => R.Ul(completed, command, now), /already complete/);
  assert.deepEqual(completed, doneSnapshot);
  assert.throws(() => R.Ul(state, command, state.city.projects.homes.readyAt), /already complete/);
  assert.deepEqual(state, snapshot);
});

test('civic work enters the shared notification plan once with its visible stage and real deadline', () => {
  const {SWProjectNotices15} = loadDeclarations(new URL('../../client/build15/experience.js', import.meta.url), ['SWProjectNotices15'], {GemProjects: R.GemProjects});
  const state = startDistrict(), rows = SWProjectNotices15(state);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, 'civic-homes');
  assert.match(rows[0].title, /Village commons/);
  assert.equal(rows[0].readyAt, state.city.projects.homes.readyAt);
  assert.equal(Object.keys(rows[0]).sort().join(','), 'id,readyAt,title');
  assert.equal(SWProjectNotices15(R.Y(state, rows[0].readyAt)).length, 0);
});
