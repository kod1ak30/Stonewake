import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {parse} from 'acorn';

// Run the real component navigation function with state setters supplied by a
// harness. This catches leaked overlays without loading React or changing saves.
const file = new URL('../../client/build14/Ju.js', import.meta.url);
const source = readFileSync(file, 'utf8');
const ast = parse(source, {ecmaVersion: 2022, sourceType: 'module'});
const component = ast.body.find(node => node.type === 'FunctionDeclaration' && node.id.name === 'Ju');
const declaration = component.body.body.find(node => node.type === 'FunctionDeclaration' && node.id.name === 'SWNavigate');
assert.ok(declaration, 'The navigation entry point must be present.');
const navigationNames = ['SWNavigate', 'yn', 'SWStartAdventure', 'SWCloseScout16', 'SWResultNavigate17', 'En'];
const navigateSource = component.body.body.filter(node => node.type === 'FunctionDeclaration' && navigationNames.includes(node.id.name)).map(node => source.slice(node.start, node.end)).join('\n');
function componentCallback(name, property) {
  let call;
  const visit = node => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'CallExpression' && node.callee?.name === 'swElement' && node.arguments[0]?.name === name) call = node;
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  };
  visit(component);
  const value = call?.arguments[1]?.properties.find(node => node.key.name === property)?.value;
  assert.ok(value, name + '.' + property + ' callback is present.');
  return source.slice(value.start, value.end);
}

const overlays = {
  x: 'army', w: 'fleet', Ut: 'commander', Je: 'oldAchievements', Fe: 'reports',
  de: 'settings', Ne: 'help', Lt: 'town', setCityOpen: 'city', setStorageOpen: 'storage',
  setGemShopOpen: 'projects', setStonewakeObjectiveOpen: 'objectives', rt: 'scout',
  setPremiumStore: 'store', setChronicleTab: 'journal', setStonewakeMenuOpen: 'menu'
};
function harness(screen = 'capital', active = {}) {
  const state = {screen, frontierTab: 'campaign', overlays: {...active}, selected: null, notices: []};
  const environment = {
    f: screen, SWRecord15() {}, SWScreenNames15: [],
    layoutRef14: {current: null}, navHistory14: {current: ['capital', ...(screen !== 'capital' ? [screen] : [])]},
    requirementTrail14: {current: []}, scoutReturn14: {current: {kind: 'sea'}},
    V: {name: 'Test village', buildings: [{id: 'test-harbor', kind: 'harbor', level: 2}]},
    ic: message => state.notices.push(message),
    p: value => { state.screen = value; }, h: value => { state.selected = value; },
    setOrnamentPlacement() {}, _() {}, y() {}, Ft() {}, Gt() {}, ee() {}, He() {},
    SWHaptic() {}, nt(value) { state.frontierTab = value; }, setSettingsSection() {}, Le() {}, dismissNotice() {},
    setSelectedShip14() {}, setNavalTool14() {}, setNavalId() {}, at() {}, qt() {},
    Gl: () => ({name: 'Practice', buildings: []}),
    swBattleRuntime: {current: {cancel() {state.battleCanceled = true;}}}, swSimulationPending: {current: true}, Et: {current: true},
    ot() {}, ct() {}, st() {}, pt() {}, Ot() {}, Ct() {}, Tt() {},
    SWStartLayout14() { state.screen = 'capital'; }, Dn() { state.overlays.journal = 'Reports'; }
  };
  for (const [setter, key] of Object.entries(overlays)) environment[setter] = value => { state.overlays[key] = value; };
  const context = vm.createContext(environment);
  vm.runInContext(navigateSource, context);
  const sync = () => {
    Object.assign(context, {f: state.screen, tt: state.frontierTab, I: state.overlays.scout || null,
      b: !!state.overlays.army, S: !!state.overlays.fleet, chronicleTab: state.overlays.journal || null});
  };
  const invoke = (expression, ...args) => { sync(); return vm.runInContext('(' + expression + ')', context)(...args); };
  return {state, context,
    navigate: destination => invoke('SWNavigate', destination),
    scout: mission => invoke('yn', mission),
    edit: destination => invoke(componentCallback('SWScout', destination === 'army' ? 'onTrain' : 'onHarbor')),
    closeScout: () => invoke(componentCallback('SWScout', 'onClose')),
    practice: kind => invoke(componentCallback('SWArmy', 'onPractice'), kind),
    adventure: mission => invoke('SWStartAdventure', mission),
    result: destination => invoke('SWResultNavigate17', destination)
  };
}

test('battle result destinations clear the battle and preserve the correct campaign or review context', () => {
  for (const destination of ['land', 'sea', 'provinces', 'rivals', 'army', 'fleet', 'city', 'building:test-keep', 'capital']) {
    const h = harness('frontier');
    h.context.navHistory14.current = ['capital', 'sea', 'scout'];
    h.context.requirementTrail14.current = ['old-store'];
    h.result(destination);
    assert.equal(h.state.battleCanceled, true);
    assert.equal(h.context.swSimulationPending.current, false);
    assert.equal(h.context.scoutReturn14.current, null);
    assert.equal(h.context.requirementTrail14.current.length, 0);
    assert.ok(!h.context.navHistory14.current.includes('scout'));
    if (['land', 'sea', 'provinces', 'rivals'].includes(destination)) {
      assert.equal(h.state.screen, 'frontier');
      assert.equal(h.state.frontierTab, destination === 'land' ? 'campaign' : destination);
    } else {
      assert.equal(h.state.screen, 'capital');
      if (['army', 'fleet', 'city'].includes(destination)) assert.deepEqual(activeDialogs(h), [destination]);
      if (destination.startsWith('building:')) assert.equal(h.state.selected, 'test-keep');
    }
  }
});
function activeDialogs(h) {
  return [
    ...(h.state.screen === 'build' ? ['build'] : []),
    ...Object.entries(h.state.overlays).filter(([key, value]) => key !== 'menu' && !!value).map(([key]) => key)
  ];
}

test('opening any menu destination retires the Build modal before showing one destination', () => {
  for (const [destination, expected] of [
    ['army', 'army'], ['fleet', 'fleet'], ['storage', 'storage'], ['city', 'city'],
    ['settings', 'settings'], ['account', 'settings'], ['commander', 'commander'],
    ['store', 'store'], ['gems', 'store'], ['wardrobe', 'store'],
    ['chronicle', 'journal'], ['events', 'journal'], ['residents', 'journal'],
    ['achievements', 'journal'], ['reports', 'journal'], ['objectives', 'objectives'],
    ['town', 'town'], ['help', 'help'], ['scout', 'scout']
  ]) {
    const h = harness('build');
    h.navigate(destination);
    assert.equal(h.state.screen, 'capital', destination);
    assert.deepEqual(activeDialogs(h), [expected], destination + ' must not stack focus/pointer traps.');
  }
});

test('switching dialogs clears every previous panel and Back intentionally restores the Build screen', () => {
  const h = harness('build');
  h.navigate('army');
  h.navigate('commander');
  assert.deepEqual(activeDialogs(h), ['commander']);
  h.navigate('back');
  assert.deepEqual(activeDialogs(h), ['army']);
  h.navigate('back');
  assert.deepEqual(activeDialogs(h), ['build']);
  h.navigate('close');
  assert.deepEqual(activeDialogs(h), []);
  assert.equal(h.state.screen, 'capital');
});

test('scouting keeps the frontier background, and screen navigation leaves no modal open', () => {
  const h = harness('frontier', {scout: {kind: 'sea'}});
  h.navigate('army');
  assert.equal(h.state.screen, 'frontier');
  assert.deepEqual(activeDialogs(h), ['army']);
  for (const destination of ['sea', 'frontier', 'capital', 'building:test-harbor', 'harborUpgrade']) {
    h.navigate('storage');
    h.navigate(destination);
    assert.deepEqual(activeDialogs(h), []);
  }
});

test('unsaved layouts keep navigation blocked with an explicit message', () => {
  const h = harness();
  h.context.layoutRef14.current = {index: 1};
  h.navigate('army');
  assert.deepEqual(activeDialogs(h), []);
  assert.equal(h.state.screen, 'capital');
  assert.equal(h.state.notices.length, 1);
  assert.match(h.state.notices[0], /Save or cancel/);
});

test('Back from land or sea preparation returns to its campaign board instead of the village', () => {
  for (const [kind, tab] of [['campaign', 'campaign'], ['sea', 'sea']]) {
    const h = harness('frontier'); h.state.frontierTab = tab;
    const mission = {kind, campaignIndex: 0, defense: {name: 'Target'}};
    h.scout(mission);
    assert.deepEqual(activeDialogs(h), ['scout']);
    assert.equal(h.context.navHistory14.current.filter(destination => destination === 'scout').length, 1);
    h.navigate('back');
    assert.deepEqual(activeDialogs(h), []);
    assert.equal(h.state.screen, 'frontier');
    assert.equal(h.state.frontierTab, tab);
    assert.ok(!h.context.navHistory14.current.includes('scout'));
  }
});

test('Army or Harbor editor Back restores the same mission, and a second Back restores its origin', () => {
  for (const editor of ['army', 'fleet']) {
    const h = harness('frontier'); h.state.frontierTab = 'sea';
    const mission = {kind: 'sea', campaignIndex: 2, defense: {name: 'Breakwater'}};
    h.scout(mission);
    h.edit(editor);
    assert.deepEqual(activeDialogs(h), [editor]);
    assert.equal(h.context.navHistory14.current.filter(destination => destination === 'scout').length, 1, 'Editor callbacks must not add duplicate scout entries.');
    h.navigate('back');
    assert.deepEqual(activeDialogs(h), ['scout']);
    assert.equal(h.state.overlays.scout, mission);
    h.navigate('back');
    assert.deepEqual(activeDialogs(h), []);
    assert.equal(h.state.screen, 'frontier');
    assert.equal(h.state.frontierTab, 'sea');
  }
});

test('closing preparation clears its return reference and history before another screen opens', () => {
  const h = harness('frontier'); h.state.frontierTab = 'sea';
  h.scout({kind: 'sea', campaignIndex: 1});
  h.closeScout();
  assert.deepEqual(activeDialogs(h), []);
  assert.equal(h.state.screen, 'frontier');
  assert.ok(!h.context.navHistory14.current.includes('scout'));
  assert.equal(h.context.scoutReturn14.current, null);
  h.navigate('army'); h.navigate('back');
  assert.deepEqual(activeDialogs(h), []);
  assert.equal(h.state.screen, 'frontier');
  h.scout({kind: 'sea', campaignIndex: 2});
  assert.equal(h.context.navHistory14.current.filter(destination => destination === 'scout').length, 1);
  h.navigate('back');
  assert.deepEqual(activeDialogs(h), []);
});

test('practice and supplied trial preparation return to the screen that opened them', () => {
  const practice = harness(); practice.navigate('army'); practice.practice('archer');
  assert.deepEqual(activeDialogs(practice), ['scout']);
  assert.equal(practice.state.overlays.scout.practiceKind, 'archer');
  practice.navigate('back');
  assert.deepEqual(activeDialogs(practice), ['army']);
  const trial = harness(); trial.navigate('chronicle'); trial.state.overlays.journal = 'Trials';
  const mission = {kind: 'trial', missionId: 'rescue', trialId: 'swift-rescue', fixedArmy: true};
  trial.adventure(mission);
  assert.deepEqual(activeDialogs(trial), ['scout']);
  trial.navigate('back');
  assert.deepEqual(activeDialogs(trial), ['journal']);
  assert.equal(trial.state.overlays.journal, 'Trials');
});

test('starting practice from a preparation editor cannot reopen an older mission as the new practice scout', () => {
  const h = harness('frontier'); h.state.frontierTab = 'sea';
  const seaMission = {kind: 'sea', campaignIndex: 2, defense: {name: 'Breakwater'}};
  h.scout(seaMission); h.edit('army'); h.practice('archer');
  assert.deepEqual(activeDialogs(h), ['scout']);
  assert.equal(h.state.overlays.scout.practiceKind, 'archer');
  assert.equal(h.context.navHistory14.current.filter(destination => destination === 'scout').length, 1);
  h.navigate('back');
  assert.deepEqual(activeDialogs(h), ['army']);
  h.navigate('back');
  assert.deepEqual(activeDialogs(h), []);
  assert.equal(h.state.screen, 'frontier');
  assert.equal(h.state.frontierTab, 'sea');
  assert.ok(!h.context.navHistory14.current.includes('scout'));
});
