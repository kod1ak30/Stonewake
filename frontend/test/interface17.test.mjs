import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../core/rules.js';
import * as B from '../../client/build14/rules.js';
import * as N from '../../client/build14/naval.js';
import {loadDeclarations} from './load-declarations.mjs';

const ui = new URL('../../client/build14/ui.js', import.meta.url);
const general = new URL('../../client/interface.js', import.meta.url);
const premium = new URL('../../client/premium-ui.js', import.meta.url);
const plain = value => JSON.parse(JSON.stringify(value));
const element = (type, props, ...children) => ({type, props: props || {}, children: children.flat(Infinity).filter(child => child !== false && child != null)});
const children = node => [node.props?.headerActions, ...(node.children || []), node.props?.footer].filter(child => child != null && child !== false);
const nodes = tree => typeof tree === 'object' ? [tree, ...children(tree).flatMap(nodes)] : [];
const words = tree => typeof tree === 'object' ? children(tree).map(words).join(' ') : String(tree);
function fixture() {
  const state = B.Y(R.Al(Date.now()), Date.now());
  state.buildings.find(building => building.kind === 'keep').level = 6;
  state.buildings.push({id: 'barracks', kind: 'barracks', level: 6, x: 5, y: 5}, {id: 'port', kind: 'harbor', level: 3, x: -2, y: 3});
  state.army = {...R.wl(), infantry: 12, archer: 12, healer: 3};
  state.loadouts14 = [{id: 'force', name: 'Coastal company', slots: ['infantry', 'archer', 'healer'], counts: {infantry: 5, archer: 5, healer: 2}}];
  state.activeLoadout14 = 'force';
  state.fleet = [{id: 'cutter', kind: 'cutter', level: 1}];
  state.unitLevels = Object.fromEntries(Object.keys(R.J).map(kind => [kind, 1]));
  state.resources = Object.fromEntries(R.xl.map(kind => [kind, R.SWCapacity(state)]));
  return state;
}
function harness(file, name, declarations, props, extras = {}) {
  const cells = [], calls = [], navigation = []; let cursor = 0, tree;
  const C = {Fragment: 'Fragment', useEffect() {}, useContext: () => route => navigation.push(route),
    useState(initial) { const index = cursor++; if (!(index in cells)) cells[index] = typeof initial === 'function' ? initial() : initial; return [cells[index], value => {cells[index] = typeof value === 'function' ? value(cells[index]) : value;}]; },
    useRef(initial) { const index = cursor++; return cells[index] ||= {current: initial}; }};
  const symbols = Object.fromEntries('A O oe be re je xe we ne ve N _e Te ye Oe ke se Ee j'.split(' ').map(name => [name, name]));
  const environment = {...R, ...B, ...N, ...symbols, C, swElement: element, SWNavigationContext: {}, SWDialog: 'Dialog',
    SWQuantity17: 'Quantity', SWUnitPreview14: 'TroopPreview', SWAbilitySummary: 'Ability', SWShipPreview14: 'ShipPreview',
    SWRequirements14: 'Requirements', SWCosmeticPreview: 'CosmeticPreview', SWStoreProduct: 'StoreProduct',
    SWUseOnline: () => ({configured: false, products: []}), lu: 'TroopArt', qu: 'BuildingArt', Ku: 'Cost', Qc: seconds => Math.ceil(seconds) + 's', ...extras};
  const functions = loadDeclarations(file, [name, ...declarations], environment);
  props = {open: true, busy: false, onClose: () => navigation.push('close'), onFrontier: () => navigation.push('frontier'), onCommander: () => navigation.push('commander'), onPractice: kind => navigation.push('practice:' + kind), onViewCoast() {}, act: async action => {calls.push(plain(action)); return true;}, ...props};
  const render = () => {cursor = 0; tree = functions[name](props); return tree;};
  const button = label => {const matches = nodes(tree).filter(node => node.type === 'button' && words(node) === label); assert.equal(matches.length, 1, label); return matches[0];};
  render();
  return {props, calls, navigation, render, button, root: () => tree, all: () => nodes(tree), text: () => words(tree),
    click(label) {const control = button(label); assert.ok(!control.props.disabled, label + ' is enabled'); const result = control.props.onClick(); render(); return result;}};
}

test('Army company edits require Save or Discard before leaving and preserve the latest draft', async () => {
  const state = fixture(), h = harness(ui, 'SWArmy', ['SWArmyUpgradeView17'], {state});
  const stepper = h.all().find(node => node.type === 'Quantity');
  stepper.props.onChange(8); h.render();
  assert.ok(h.button('Save company'));
  h.root().props.onClose(); h.render();
  assert.deepEqual(h.navigation, []);
  await h.click('Save & continue'); h.render();
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].type, 'saveLoadout');
  assert.equal(h.calls[0].loadout.counts.infantry, 8);
  assert.deepEqual(h.navigation, ['close']);
  assert.equal(state.loadouts14[0].counts.infantry, 5, 'Draft editing does not mutate the saved company.');
  h.all().find(node => node.type === 'Quantity').props.onChange(9); h.render();
  h.click('Choose battle'); h.click('Discard');
  assert.deepEqual(h.navigation, ['close', 'frontier']);
  assert.equal(h.calls.length, 1);
});

test('Army upgrade comparison uses actual current and next combat stats, abilities and mastery cap', () => {
  const state = fixture(), {SWArmyUpgradeView17} = loadDeclarations(ui, ['SWArmyUpgradeView17'], {...R, ...B});
  for (const kind of ['infantry', 'healer', 'cannon']) for (const level of [1, 2, 3, 4, 5, 6, 8, 9, 10]) {
    state.unitLevels[kind] = level;
    const view = SWArmyUpgradeView17(state, kind);
    assert.deepEqual(plain(view.before), plain(B.SWTroopStats14(state, kind, level)));
    assert.deepEqual(plain(view.after), plain(B.SWTroopStats14(state, kind, Math.min(10, level + 1))));
    assert.ok(view.deltas.every(row => row.before !== row.after));
    assert.deepEqual(plain(view.unlocks), plain(R.SWTroopAbilities(kind).filter(ability => ability.level === level + 1)));
    assert.equal(view.appearanceChanged,kind==='infantry'&&[3,6,9].includes(level));
    assert.equal(/New ability/.test(view.upgradeSummary),view.unlocks.length>0);
    assert.equal(/appearance/.test(view.upgradeSummary),view.appearanceChanged);
    assert.ok(!/equipment/.test(view.upgradeSummary));
    if (level === 10) {assert.equal(view.nextLevel, 10); assert.equal(view.deltas.length, 0);}
  }
});

test('Army and project spending ignore repeated taps while the real action is pending', async () => {
  let resolve; const actions = [];
  const action = value => {actions.push(plain(value)); return new Promise(done => {resolve = done;});};
  const state = fixture(), h = harness(ui, 'SWArmy', ['SWArmyUpgradeView17'], {state, act: action});
  h.click('Train');
  const train = h.button('Train 5');
  const pending = train.props.onClick(); train.props.onClick();
  assert.equal(actions.length, 1); assert.deepEqual(actions[0], {type: 'recruit', kind: 'infantry', count: 5});
  resolve(true); await pending;
  state.buildings[0].readyAt = Date.now() + 100_000; state.buildings[0].targetLevel = 7;
  const gems = harness(general, 'SWGems', [], {state, act: action});
  const project = gems.all().find(node => node.type === 'button' && node.props['aria-pressed'] === false);
  project.props.onClick(); gems.render();
  const finish = gems.all().find(node => node.type === 'button' && /^Finish · /.test(words(node)));
  const quoted = Number(words(finish).match(/\d+/)[0]), done = finish.props.onClick(); finish.props.onClick();
  assert.equal(actions.length, 2); assert.equal(actions[1].type, 'speedup'); assert.equal(actions[1].maxCost, quoted);
  resolve(true); await done;
});

test('civic work appears in Active projects and opens its district without spending gems', () => {
  const state=fixture();state.city={...state.city,projects:{homes:{stage:0,targetStage:1,siteId:'home',readyAt:Date.now()+100000}}};
  const h=harness(general,'SWGems',[],{state});
  const project=h.all().find(node=>node.type==='button'&&words(node).includes('Residential quarter'));
  assert.ok(project);project.props.onClick();h.render();
  h.click('View district');
  assert.deepEqual(h.navigation,['city']);assert.equal(h.calls.length,0);
  assert.ok(h.all().some(node=>node.type==='button'&&/^Finish · /.test(words(node))));
});

test('battle next actions reflect the settled kingdom and never auto spend or launch', () => {
  const {SWResultActions17}=loadDeclarations(general,['SWResultActions17'],{...R,...B});
  const state=fixture(),battle={result:{won:true}},input={campaignType:'sea',fleet14:[{id:'cutter'}]};
  const view=(options={})=>plain(SWResultActions17({state,battle,input,kind:'sea',...options}));
  assert.equal(view()[0].destination,'sea');
  state.fleet[0].wrecked=true;assert.equal(view()[0].destination,'fleet');
  assert.deepEqual(view().map(action=>action.destination),['fleet','sea','army','capital']);
  delete state.fleet[0].wrecked;
  assert.equal(view({battle:{result:{won:false}}})[0].destination,'army');
  assert.equal(view({battle:{result:{won:false}}})[1].label,'Try again');
  assert.deepEqual(view({battle:{saga:true,result:{won:false}}}),[]);
  assert.deepEqual(view({replay:true}).map(action=>action.destination),['capital']);
  assert.deepEqual(view({battle:{practice:true}}).map(action=>action.destination),['army','capital']);
  assert.deepEqual(view({battle:{defense:true}}).map(action=>action.destination),['city','capital']);
  state.seaCampaign=10;assert.equal(view()[0].label,'Review campaign');
  const ready=fixture();ready.buildings.find(b=>b.kind==='keep').level=1;ready.campaign=1;ready.resources=Object.fromEntries(R.xl.map(key=>[key,R.SWCapacity(ready)]));
  assert.equal(B.SWUpgradeQuote14(ready,ready.buildings.find(b=>b.kind==='keep')).allowed,true);
  const upgrade=view({state:ready,input:{campaignType:'land'},kind:'campaign'});
  assert.equal(upgrade[0].label,'Review Keep upgrade');assert.equal(upgrade[0].destination,'building:keep');
  assert.ok(upgrade.every(action=>!('action' in action)), 'Result controls only describe navigation destinations.');
});

test('blocked building upgrade opens a concrete requirement instead of silently ignoring the tap', () => {
  const destinations=[],state = fixture(), building = state.buildings.find(item => item.kind === 'keep'), h = harness(ui, 'SWBuildingDetails14', [], {state, building, onMove() {}, onRequirement(action) {destinations.push(plain(action));}});
  assert.equal(B.SWUpgradeQuote14(state, building).allowed, false);
  h.click('Resolve requirements');
  const requirement = h.all().find(node => node.type === 'Requirements');
  assert.ok(requirement); assert.ok(requirement.props.quote.requirements.some(item => !item.met));
  h.click('Land campaign');assert.deepEqual(destinations,[{type:'land'}]);
  assert.equal(h.calls.length, 0);
  h.click('View improvements'); assert.match(h.text(), /The next improvement/);
});

test('Harbor allows returned ships to unload into its depot when main Storage is full', async () => {
  const state = fixture(); state.fleet[0].voyage = {readyAt: Date.now() - 10, reward: R.Ec[0].reward};
  const h = harness(ui, 'SWFleet', [], {state});
  await h.click('Unload & free ship');
  assert.deepEqual(h.calls, [{type: 'collectVoyage', id: 'cutter'}]);
  assert.match(h.text(), /Overflow moves to the Harbor depot/);
  state.fleet[0].voyage = undefined; state.harborDepot17 = {gold: 0, wood: B.SWDepotStatus17(state).capacity, stone: 0, food: 0}; h.render();
  assert.equal(h.button('Send voyage').props.disabled, true);
  assert.match(h.text(), /Make room in the depot/);
  h.all().find(node => node.type === 'button' && node.props.className === 'sw-depot-tab17').props.onClick(); h.render();
  assert.equal(h.button('Storage is full').props.disabled, true);
  state.resources.wood -= 50; h.render(); await h.click('Move supplies into storage');
  assert.deepEqual(h.calls.at(-1), {type: 'claimHarborDepot'});
});

test('gem sets display the missing-piece quote and dispatch its confirmed price only once', async () => {
  const state = fixture(); state.gems = 100;
  let resolve; const actions = [];
  const h = harness(premium, 'SWPremiumStore', ['SWCollectionScope17', 'SWWardrobeCategories'], {state, initialTab: 'Collections', act: action => {actions.push(plain(action)); return new Promise(done => {resolve = done;});}});
  const collection = R.SWPremiumCollections[0], quote = B.SWCollectionQuote17(state, collection.id);
  const card = h.all().find(node => node.type === 'article' && node.props.key === collection.id);
  assert.ok(words(card).includes('◆ ' + quote.priceGems));
  nodes(card).find(node => node.type === 'button' && words(node) === 'Unlock set').props.onClick(); h.render();
  const confirm = h.button('Confirm · ' + quote.priceGems + ' ◆'), pending = confirm.props.onClick(); confirm.props.onClick();
  assert.deepEqual(actions, [{type: 'buyGemCollection', id: collection.id, maxPrice: quote.priceGems}]);
  resolve(true); await pending;
});

test('campaign selection previews locks without launching and keeps Land and Sea choices separate', () => {
  const state = fixture(), scouts = []; state.campaign = 2; state.seaCampaign = 0;
  const h = harness(ui, 'SWCampaignBoard14', ['SWCampaignView17'], {state, onScout: mission => scouts.push(plain(mission)), onHarbor() {}}, {Eu: 'Map'});
  assert.match(h.text(), /Ironridge/);
  assert.ok(h.text().includes(R.Gl(2).tacticalHint17.match(/^[^.!?]+[.!?]?/)[0]));
  assert.equal(h.all().filter(node => node.type === 'button' && node.props['aria-label']?.startsWith('Chapter ')).length, 10);
  h.click('Prepare attack');
  assert.equal(scouts[0].campaignIndex, 2); assert.equal(scouts[0].kind, 'campaign');
  h.all().find(node => node.props['aria-label'] === 'Chapter 1: Briarwatch, captured').props.onClick(); h.render();
  h.click('Replay chapter'); assert.equal(scouts[1].campaignIndex, 0);
  const cost = h.all().find(node => node.type === 'Cost');
  assert.deepEqual(plain(cost.props.cost), {gold: 35, wood: 20, stone: 15, food: 25});
  h.props.sea = true; h.render(); assert.match(h.text(), /Saltwind Cove/);
  assert.ok(h.text().includes(N.SWSeaDefense14(0).tacticalHint17.match(/^[^.!?]+[.!?]?/)[0]));
  h.all().find(node => node.props['aria-label']?.startsWith('Chapter 10:')).props.onClick(); h.render();
  const locked = h.all().find(node => node.type === 'button' && node.props.className === 'primary');
  assert.equal(locked.props.disabled, true); assert.match(words(locked), /Complete Crown Anchorage first/);
  locked.props.onClick(); assert.equal(scouts.length, 2);
  h.props.sea = false; h.render(); assert.match(h.text(), /Briarwatch/); assert.ok(h.button('Replay chapter'));
});

test('HUD initial and hydration values snap truthfully, while actual reward animation is bounded and monotonic', () => {
  const cells = [], requests = new Map(); let cursor = 0, effects = [], sequence = 0;
  const C = {useRef(initial) {const i = cursor++; return cells[i] ||= {current: initial};},
    useState(initial) {const i = cursor++; if (!(i in cells)) cells[i] = initial; return [cells[i], value => {cells[i] = value;}];},
    useEffect(callback, dependencies) {const i = cursor++, previous = cells[i]; if (!previous || dependencies.some((value, n) => value !== previous.dependencies[n])) {effects.push(() => {previous?.cleanup?.(); cells[i] = {dependencies, cleanup: callback()};});}}};
  const {SWResourceCount17, SWCounterValue17} = loadDeclarations(general, ['SWResourceCount17', 'SWCounterValue17'], {C, document: {documentElement: {dataset: {}}}, performance: {now: () => 100}, requestAnimationFrame: callback => {requests.set(++sequence, callback); return sequence;}, cancelAnimationFrame: id => requests.delete(id)});
  const render = (value, rewardId = null) => {cursor = 0; effects = []; const output = SWResourceCount17({value, rewardId}); effects.forEach(effect => effect()); return Number(output.replaceAll(',', ''));};
  const tick = now => {const waiting = [...requests]; requests.clear(); for (const [, callback] of waiting) callback(now);};
  assert.equal(render(988), 988); assert.equal(requests.size, 0);
  assert.equal(render(11363), 11363, 'Hydration never counts up from placeholder state.'); assert.equal(requests.size, 0);
  assert.equal(render(11413, 1), 11363); assert.equal(requests.size, 1);
  tick(90); assert.equal(render(11413, 1), 11363, 'Earlier frame timestamps cannot become negative progress.');
  tick(200); const middle = render(11413, 1); assert.ok(middle >= 11363 && middle <= 11413);
  tick(600); assert.equal(render(11413, 1), 11413); assert.equal(requests.size, 0);
  assert.equal(render(11414, 1), 11414, 'An old celebration does not animate unrelated income.');
  assert.equal(render(100), 100, 'Spending uses the current authoritative balance immediately.');
  for (const elapsed of [-100, 0, 50, 200, 420, 1000]) assert.ok(SWCounterValue17(100, 10, elapsed, 420) >= 10 && SWCounterValue17(100, 10, elapsed, 420) <= 100);
});

test('Storage keeps both held-supply actions in its persistent footer and uses their distinct actions', async () => {
  const state = fixture(); state.reserveCrates = {gold: 20, wood: 20, stone: 0, food: 0}; state.harborDepot17 = {gold: 0, wood: 40, stone: 0, food: 0}; state.resources.wood -= 100;
  const h = harness(general, 'SWStorage', [], {state, onBuilding() {}, onBuild() {}}, {Uu: Object.fromEntries(R.xl.map(kind => [kind, 'ResourceIcon'])), Wu: Object.fromEntries(R.xl.map(kind => [kind, kind]))});
  assert.ok(h.root().props.footer, 'Held supplies actions are outside the scrolling body.');
  assert.ok(nodes(h.root().props.footer).some(node => words(node) === 'Claim what fits'));
  await h.click('Claim what fits'); h.render(); await h.click('Transfer cargo');
  assert.deepEqual(h.calls, [{type: 'claimReserve'}, {type: 'claimHarborDepot'}]);
});

test('City keeps section navigation fixed and overview actions open their actual destinations', () => {
  const h=harness(general,'SWCityHub',[],{state:fixture(),onBuild() {},onDefense() {},onBuilding() {}},{SWCivicProjectCard:'District',SWRaidSummary:'Protection',SWCityResidents:'Residents',SWDefenseReportSummary:'DefenseReport',Rl:()=>({title:'A coastal home'})});
  assert.equal(h.root().props.headerActions.props['aria-label'],'City sections');
  assert.equal(h.all().filter(node=>node.type==='section'&&node.props.className?.includes('sw-city-card')).length,3);
  assert.match(h.text(),/buildings connected by built roads/);
  h.click('Manage storage');assert.deepEqual(h.navigation,['storage']);
  h.click('Plan city');assert.deepEqual(h.navigation,['storage','plan']);
  h.click('View project');assert.equal(h.all().filter(node=>node.type==='District').length,4);
  h.click('Residents');assert.ok(h.all().some(node=>node.type==='Residents'));
  h.click('Defense');assert.ok(h.root().props.footer);h.click('All battle reports');
  assert.deepEqual(h.navigation,['storage','plan','reports']);assert.equal(h.calls.length,0);
});
