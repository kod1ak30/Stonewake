import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {parse} from 'acorn';
import {loadDeclarations} from './load-declarations.mjs';
import {Al, J, Ml, Nl, Pl, Tl, el, wl} from '../core/rules.js';
import {Y, SWFamily14, SWLoadout14, SWSelectedArmy14} from '../../client/build14/rules.js';
import {SWFleetLimit14, SWPackCargo14, SWPreparationArmy14, SWRecommendSeaPreparation14,
  SWValidateCargo14, SWReadyFleet14, SWSeaChapters14, SWShipCapacity14,
  SWShipRoles14, SWTroopWeight14} from '../../client/build14/naval.js';
import {SWPreparationIdentity16, SWMoveCargo16, SWCargoArmy16,
  SWShipReadiness16, SWSwapCargo16, SWCargoSwapOptions16} from '../../client/build15/preparation.js';

const source = new URL('../../client/build14/ui.js', import.meta.url);
const clone = value => JSON.parse(JSON.stringify(value));
const element = (type, props, ...children) => ({type, props: props || {}, children: children.flat(Infinity).filter(child => child !== false && child != null)});
const words = node => typeof node === 'object' ? (node.children || []).map(words).join(' ') : String(node);
function nodes(tree) {
  return typeof tree === 'object' ? [tree, ...tree.children.flatMap(nodes)] : [];
}
function fixture() {
  const state = Y(Al(1_800_000_000_000), 1_800_000_000_000);
  state.buildings.find(building => building.kind === 'keep').level = 6;
  state.buildings.push({id: 'test-barracks', kind: 'barracks', level: 6, x: 5, y: 5});
  state.army = {...wl(), infantry: 12, archer: 12, healer: 3};
  state.loadouts14 = [{id: 'test-force', name: 'Test force', slots: ['infantry', 'archer', 'healer'], counts: {infantry: 5, archer: 5, healer: 2}}];
  state.activeLoadout14 = 'test-force';
  state.fleet = [{id: 'cutter', kind: 'cutter', level: 1}, {id: 'cog', kind: 'cog', level: 1}, {id: 'galley', kind: 'galley', level: 1}];
  state.unitLevels = Object.fromEntries(Object.keys(J).map(kind => [kind, 1]));
  return state;
}
function scout(kind = 'sea', extra = {}) {
  return {kind, campaignIndex: 0, defense: {name: 'Test coast', buildings: []}, ...extra};
}

// Execute the production component and event closures. Only React's state storage
// and element creation are replaced; gameplay rules and preparation remain real.
function harness(state = fixture(), mission = scout()) {
  const cells = [], attacks = [], navigation = [];
  let cursor = 0, tree;
  const props = {state, scout: mission, busy: false, onClose: () => navigation.push('close'),
    onTrain: () => navigation.push('army'), onHarbor: () => navigation.push('harbor'),
    onAttack: preparation => attacks.push(clone(preparation))};
  const C = {Fragment: 'Fragment', useState(initial) {
    const index = cursor++;
    if (!(index in cells)) cells[index] = typeof initial === 'function' ? initial() : initial;
    return [cells[index], value => { cells[index] = typeof value === 'function' ? value(cells[index]) : value; }];
  }};
  const {SWPreparation16, SWScout} = loadDeclarations(source, ['SWPreparation16', 'SWScout'], {
    C, swElement: element, J, Ml, Nl, Pl, Tl, el, SWFamily14, SWLoadout14, SWSelectedArmy14,
    SWFleetLimit14, SWPackCargo14, SWPreparationArmy14, SWRecommendSeaPreparation14,
    SWValidateCargo14, SWReadyFleet14, SWSeaChapters14, SWShipCapacity14, SWShipRoles14,
    SWTroopWeight14, SWPreparationIdentity16, SWMoveCargo16, SWShipReadiness16,
    SWSwapCargo16, SWCargoSwapOptions16,
    SWDialog: 'Dialog', Eu: 'Map', lu: 'TroopArt', Ku: 'Cost', SWShipPreview14: 'ShipArt'
  });
  const render = () => { cursor = 0; tree = SWPreparation16(props); return tree; };
  render();
  const find = (label, attribute = null) => {
    const matches = nodes(tree).filter(node => node.type === 'button' && (attribute ? node.props[attribute] === label : words(node) === label));
    assert.equal(matches.length, 1, 'Expected one button: ' + label);
    return matches[0];
  };
  return {props, attacks, navigation, render, find,
    all: () => nodes(tree), text: () => words(tree), root: () => tree,
    click(label, attribute = null) { const button = find(label, attribute); assert.ok(!button.props.disabled, label + ' is enabled'); button.props.onClick(); render(); },
    launch() { const button = nodes(tree).find(node => node.type === 'button' && node.props.className?.includes('sw-launch14')); assert.ok(button, 'Launch action is visible'); assert.ok(!button.props.disabled); button.props.onClick(); return attacks.at(-1); },
    wrapper: mission => SWScout({...props, scout: mission, open: !!mission})
  };
}

test('land preparation launches the latest stepper edits without an effect and never selects ships', () => {
  const state = fixture(), before = clone(state), h = harness(state, scout('campaign'));
  h.click('Change army');
  h.click('Deploy more ' + J.infantry.name, 'aria-label');
  h.click('Deploy fewer ' + J.archer.name, 'aria-label');
  h.click('Done');
  const launched = h.launch();
  assert.equal(launched.army.infantry, 6);
  assert.equal(launched.army.archer, 4);
  assert.deepEqual(launched.fleet, []);
  assert.deepEqual(state, before, 'Editing and callback delivery must not spend, save or mutate inventory.');
});

test('sea default is legal and cargo edits arrive directly in the launch snapshot', () => {
  const state = fixture(), before = clone(state), h = harness(state);
  const initial = h.launch();
  assert.ok(initial.fleet.length >= 1);
  assert.ok(Nl(initial.army) >= 3);
  assert.deepEqual(clone(SWValidateCargo14(state, initial.fleet, initial.army)), initial.fleet.map(({id, kind, level, cargo}) => ({id, kind, level, cargo})));
  h.click('Change army');
  h.click('Deploy fewer ' + J.infantry.name, 'aria-label');
  h.click('Done');
  const launched = h.launch();
  assert.equal(launched.army.infantry, initial.army.infantry - 1);
  assert.deepEqual(SWCargoArmy16(launched.fleet), launched.army);
  assert.deepEqual(state, before);
});

test('supplied multi-doctrine expeditions preserve their force and levels without personal troops', () => {
  const state = fixture(); state.army = wl(); state.fleet = [];
  const army = {...wl(), infantry: 5, shieldbearer: 3, archer: 5, crossbow: 2, healer: 2};
  const unitLevels = Object.fromEntries(Object.keys(J).map(kind => [kind, 4]));
  const h = harness(state, scout('saga', {fixedArmy: true, missionId: 'blockade', army, previewInput: {unitLevels, saga: {mode: 'blockade'}}}));
  assert.equal(h.all().filter(node => node.type === 'TroopArt').length, 5);
  assert.ok(h.all().filter(node => node.type === 'TroopArt').every(node => node.props.level === 4));
  assert.ok(!h.all().some(node => node.type === 'button' && words(node) === 'Change army'));
  assert.deepEqual(h.launch(), {army, fleet: []});
});

test('practice from an empty village uses supplied practice troops and harbor defense has its own launch action', () => {
  const state = fixture(); state.army = wl(); state.fleet = [];
  const practice = harness(state, scout('practice', {practiceKind: 'archer'}));
  assert.equal(words(practice.find('Begin practice')), 'Begin practice');
  assert.deepEqual(practice.launch(), {army: {...wl(), archer: Math.min(12, Pl(state))}, fleet: []});
  const hold = harness(state, scout('saga', {fixedArmy: true, missionId: 'harbor', army: {...wl(), infantry: 4}, previewInput: {saga: {mode: 'hold'}}}));
  assert.equal(words(hold.find('Defend harbor')), 'Defend harbor');
  assert.match(hold.text(), /Hold the harbor/);
});

test('selecting another vessel at the fleet limit requires an explicit replacement', () => {
  const state = fixture(), h = harness(state), initial = h.launch();
  h.click('Change ships');
  const label = ship => SWShipRoles14[ship.kind].name + ' ' + (state.fleet.indexOf(ship) + 1) + ', level ' + ship.level + ', Ready';
  for (const ship of state.fleet) {
    const selected = h.find(label(ship), 'aria-label').props['aria-pressed'];
    if (!selected && h.all().filter(node => node.type === 'button' && node.props['aria-pressed']).length < SWFleetLimit14(state)) h.click(label(ship), 'aria-label');
  }
  const selectedLabels = () => h.all().filter(node => node.type === 'button' && node.props['aria-pressed']).map(node => node.props['aria-label']);
  const before = selectedLabels();
  assert.equal(before.length, SWFleetLimit14(state));
  const replacement = state.fleet.find(ship => !before.includes(label(ship)));
  h.click(label(replacement), 'aria-label');
  assert.match(h.text(), /Replace which ship\?/);
  assert.deepEqual(selectedLabels(), before, 'The first click must not silently replace an existing ship.');
  h.click('Cancel replacement');
  assert.deepEqual(selectedLabels(), before);
  h.click(label(replacement), 'aria-label');
  const box = h.all().find(node => node.props.className === 'sw-prep-replace16');
  const replace = nodes(box).find(node => node.type === 'button' && words(node) !== 'Cancel replacement');
  replace.props.onClick(); h.render();
  assert.ok(selectedLabels().includes(label(replacement)));
  assert.equal(selectedLabels().length, before.length);
  h.click('Done');
  const launched = h.launch();
  assert.ok(launched.fleet.some(ship => ship.id === replacement.id));
  assert.ok(initial.fleet.length <= SWFleetLimit14(state));
  SWValidateCargo14(state, launched.fleet, launched.army);
});

test('every preparation editor avoids native numeric input and leaves the force usable', () => {
  const h = harness();
  const check = () => assert.ok(!h.all().some(node => node.type === 'input' && node.props.type === 'number'));
  check();
  for (const label of ['Change army', 'Change ships']) { h.click(label); check(); h.click('Done'); }
  // Ensure two ships are selected even if the recommendation needs only one.
  h.click('Change ships');
  const unselected = h.all().find(node => node.type === 'button' && node.props['aria-pressed'] === false && !node.props.disabled);
  const selected = h.all().filter(node => node.type === 'button' && node.props['aria-pressed']).length;
  if (selected < 2 && unselected) { unselected.props.onClick(); h.render(); }
  h.click('Arrange ship cargo'); check(); h.click('Done');
  assert.ok(Nl(h.launch().army) >= 3);
});

test('the cargo editor launches the changed manifest and recovers when a selected ship becomes unavailable', () => {
  const state = fixture(), before = clone(state), h = harness(state), initial = h.launch();
  assert.equal(initial.fleet.length, 2);
  h.click('Change ships'); h.click('Arrange ship cargo');
  const move = h.all().find(node => node.type === 'button' && /^Move aboard (more|fewer) /.test(node.props['aria-label'] || '') && !node.props.disabled);
  assert.ok(move, 'At least one soldier can transfer between these ships.');
  move.props.onClick(); h.render(); h.click('Done');
  const edited = h.launch();
  assert.notDeepEqual(edited.fleet.map(ship => ship.cargo), initial.fleet.map(ship => ship.cargo));
  assert.deepEqual(edited.army, initial.army);
  assert.deepEqual(SWCargoArmy16(edited.fleet), edited.army);
  assert.deepEqual(state, before, 'Manual cargo arrangement remains a draft.');
  state.fleet.find(ship => ship.id === edited.fleet[1].id).voyage = {readyAt: state.lastTick + 100_000};
  h.render();
  assert.match(h.text(), /Fleet availability changed/);
  const refreshed = h.launch();
  assert.equal(refreshed.fleet.length, 1);
  assert.equal(refreshed.fleet[0].id, edited.fleet[0].id);
  SWValidateCargo14(state, refreshed.fleet, refreshed.army);
});

test('moving cargo preserves troop totals, refuses overflow, and does not mutate the previous manifest', () => {
  const fleet = [{id: 'a', kind: 'cutter', level: 1, cargo: {infantry: 4, healer: 2}},
    {id: 'b', kind: 'galley', level: 1, cargo: {archer: 6}}];
  const before = clone(fleet), totals = SWCargoArmy16(fleet);
  const moved = SWMoveCargo16(fleet, 'healer', 'a', 'b');
  assert.ok(moved);
  assert.deepEqual(SWCargoArmy16(moved), totals);
  assert.deepEqual(fleet, before);
  assert.equal(moved[0].cargo.healer, 1);
  assert.equal(moved[1].cargo.healer, 1);
  assert.equal(SWMoveCargo16(moved, 'infantry', 'a', 'b'), null, 'An 8-space galley is full after receiving the healer.');
  assert.equal(SWMoveCargo16(moved, 'archer', 'a', 'b'), null, 'Cannot transfer a troop absent from its source.');
  assert.equal(SWMoveCargo16(moved, 'infantry', 'a', 'a'), null);
});

test('full-hold swaps require an explicit return troop and preserve all counts after confirmation', () => {
  const state = fixture();
  state.fleet = [{id: 'first', kind: 'cutter', level: 1}, {id: 'second', kind: 'cutter', level: 1}];
  state.loadouts14[0].counts = {infantry: 12, archer: 12, healer: 0};
  const before = clone(state), h = harness(state), initial = h.launch();
  assert.equal(initial.fleet.length, 2);
  const weight = ship => Object.entries(ship.cargo).reduce((total, [kind, count]) => total + SWTroopWeight14(kind) * count, 0);
  assert.ok(initial.fleet.every(ship => weight(ship) === SWShipCapacity14(ship)), 'Both holds are full.');
  const [receiver, donor] = initial.fleet;
  const kind = Object.keys(J).find(type => donor.cargo[type] > 0 && SWCargoSwapOptions16(initial.fleet, type, receiver.id).length);
  assert.ok(kind, 'The full receiver has a legal equal-space exchange.');
  const option = SWCargoSwapOptions16(initial.fleet, kind, receiver.id)[0];
  const open = () => { h.click('Change ships'); h.click('Arrange ship cargo'); };
  const counts = () => h.all().filter(node => node.type === 'output').map(node => [node.props['aria-label'], words(node)]);
  open();
  const originalCounts = counts();
  h.click('Choose swap for ' + J[kind].name, 'aria-label');
  assert.ok(h.find('Send ' + J[option.returnKind].name + ' to Cutter 2'));
  assert.deepEqual(counts(), originalCounts, 'Opening the choice must not silently move either troop.');
  h.click('Cancel swap');
  assert.deepEqual(counts(), originalCounts);
  h.click('Done');
  assert.deepEqual(h.launch(), initial, 'Cancelling leaves the complete launch snapshot intact.');
  open();
  h.click('Choose swap for ' + J[kind].name, 'aria-label');
  h.click('Send ' + J[option.returnKind].name + ' to Cutter 2');
  assert.ok(h.all().some(node => node.props.role === 'status' && words(node).includes('aboard;')));
  h.click('Done');
  const confirmed = h.launch();
  assert.deepEqual(confirmed.army, initial.army);
  assert.deepEqual(SWCargoArmy16(confirmed.fleet), initial.army);
  assert.equal(confirmed.fleet[0].cargo[kind], (receiver.cargo[kind] || 0) + 1);
  assert.equal(confirmed.fleet[0].cargo[option.returnKind], receiver.cargo[option.returnKind] - 1);
  assert.equal(confirmed.fleet[1].cargo[kind], donor.cargo[kind] - 1);
  assert.equal(confirmed.fleet[1].cargo[option.returnKind], (donor.cargo[option.returnKind] || 0) + 1);
  assert.ok(confirmed.fleet.every(ship => weight(ship) === SWShipCapacity14(ship)));
  SWValidateCargo14(state, confirmed.fleet, confirmed.army);
  assert.deepEqual(state, before, 'Even confirmed swaps only edit preparation, not owned inventory.');
});

test('closing unmounts preparation and every mission identity receives a separate draft', () => {
  const h = harness();
  assert.equal(h.wrapper(null), null);
  for (const [first, second] of [
    [scout('player', {rivalId: 'a'}), scout('player', {rivalId: 'b'})],
    [scout('province', {provinceId: 'a'}), scout('province', {provinceId: 'b'})],
    [scout('trial', {missionId: 'rescue', trialId: 'a'}), scout('trial', {missionId: 'rescue', trialId: 'b'})],
    [scout('practice', {practiceKind: 'infantry'}), scout('practice', {practiceKind: 'archer'})],
    [scout('sea'), scout('campaign')]
  ]) assert.notEqual(h.wrapper(first).props.key, h.wrapper(second).props.key);
});

const launchSource = readFileSync(new URL('../../client/build14/Ju.js', import.meta.url), 'utf8');
const launchAst = parse(launchSource, {ecmaVersion: 2022, sourceType: 'module'});
const component = launchAst.body.find(node => node.type === 'FunctionDeclaration' && node.id.name === 'Ju');
const launchDeclaration = component.body.body.find(node => node.type === 'FunctionDeclaration' && node.id.name === 'bn');
const closeScoutDeclaration = component.body.body.find(node => node.type === 'FunctionDeclaration' && node.id.name === 'SWCloseScout16');
assert.ok(launchDeclaration);
assert.ok(closeScoutDeclaration);

test('the production cloud launch uses the passed snapshot and blocks a second in-flight request', async () => {
  const state = fixture(), preparation = SWRecommendSeaPreparation14(state), requests = [], errors = [];
  let resolveRequest, rejectRequest;
  const snapshot = {army: preparation.army, fleet: preparation.fleet};
  const environment = {
    I: scout(), d: {current: false}, Qt: Nl(state.army), o: 'cloud', c: {current: 'cloud'},
    swOnlineEpoch: {current: 1}, swOnlineRevision: {current: 8}, swOnlineQueue: {current: null},
    navHistory14: {current: ['capital', 'sea', 'scout']}, scoutReturn14: {current: scout()},
    V: state, navalId: '', J, SWSelectedArmy14, Et: {current: false},
    ic: {error: message => errors.push(message)},
    window: {SWOnline: {request: (url, args) => { requests.push({url, args}); return new Promise((resolve, reject) => { resolveRequest = resolve; rejectRequest = reject; }); }}, SWOnlineGame: {requestId: () => 'test-launch'}},
    u() {}, SWApplyOnlineGame() {}, SWBeginOnlineBattle() {}, M() {}, ot() {},
    SWQueueSimulation() {}, ut() {}, ft() {}, pt() {}, rt() {}, Ct() {}, _t() {}, He() {}
  };
  const context = vm.createContext(environment);
  const launch = vm.runInContext(launchSource.slice(closeScoutDeclaration.start, closeScoutDeclaration.end) + '\n' + launchSource.slice(launchDeclaration.start, launchDeclaration.end) + '\nbn', context);
  const first = launch(snapshot);
  await launch({army: {...wl(), infantry: 3}, fleet: []});
  assert.equal(requests.length, 1);
  assert.equal(requests[0].args.body.army, snapshot.army);
  assert.equal(requests[0].args.body.fleet, snapshot.fleet);
  resolveRequest({battle: {kind: 'sea', input: {army: snapshot.army}}, serverTime: 1});
  await first;
  assert.deepEqual(errors, []);
  assert.equal(environment.d.current, false);
  assert.deepEqual(environment.navHistory14.current, ['capital', 'sea']);
  assert.equal(environment.scoutReturn14.current, null);
  environment.I = scout('campaign');
  const land = launch(snapshot);
  assert.deepEqual(clone(requests[1].args.body.fleet), []);
  resolveRequest({battle: {kind: 'campaign', input: {army: snapshot.army}}, serverTime: 2});
  await land;
  assert.deepEqual(errors, []);
  const failedScout = scout();
  environment.I = failedScout;
  environment.scoutReturn14.current = failedScout;
  environment.navHistory14.current = ['capital', 'sea', 'scout'];
  const failure = launch(snapshot);
  rejectRequest(new Error('Fleet availability changed.'));
  await failure;
  assert.equal(errors.length, 1);
  assert.equal(environment.scoutReturn14.current, failedScout, 'Failed launch keeps the mission available for correction.');
  assert.deepEqual(environment.navHistory14.current, ['capital', 'sea', 'scout']);
  assert.equal(environment.d.current, false);
});
