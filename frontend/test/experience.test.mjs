import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadDeclarations} from './load-declarations.mjs';
import {Al, Sl, Ml, Rc, Z, J, GemProjects, SWCanPlace} from '../core/rules.js';
import {Ul, Y, SWLoadout14, SWSelectedArmy14, SWTrainQuote14} from '../../client/build14/rules.js';

const source = new URL('../../client/build15/experience.js', import.meta.url);
const guideNames = ['SWGuideKey15', 'SWGuideSteps15', 'SWReadGuide15'];
const diagnosticNames = ['SWExperienceKey15', 'SWEventNames15', 'SWMetricNames15', 'SWExperienceStore15', 'SWCleanMetrics15', 'SWCleanExperience15', 'SWReadExperience15', 'SWWriteExperience15', 'SWRecord15', 'SWExperienceReport15'];
function setup(saved = null, names = guideNames, environment = {}) {
  const writes=[];
  const values = loadDeclarations(source, names, {Sl,Ml,Rc,Z,localStorage:{getItem:()=>saved,setItem:(...args)=>writes.push(args)},window:{},...environment});
  return {...values,writes};
}
function fresh() { return Y(Al(1_000_000),1_000_000); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function nextStep(read,state,seen=['keep']) { return read(state,seen).find(step=>!step.done); }

test('fresh guide construction, training and storage can be afforded and are unlocked in the real rules', () => {
  const {SWGuideSteps15}=setup();
  let state=fresh(),now=state.lastTick;
  assert.equal(nextStep(SWGuideSteps15,state,[]).destination,'keep');
  for(const kind of ['quarry','barracks']){
    assert.equal(nextStep(SWGuideSteps15,state).destination,'build:'+kind);
    assert.ok(Ml(state)>=Sl[kind].unlock);
    assert.ok(Z(state,Sl[kind].cost));
    const tile=Array.from({length:121},(_,i)=>({x:i%11-1,y:Math.floor(i/11)-1})).find(p=>SWCanPlace(state,kind,p.x,p.y));
    assert.ok(tile);
    state=Ul(state,{type:'build',kind,...tile},now);
    assert.equal(nextStep(SWGuideSteps15,state).destination,'projects');
    now=state.buildings.find(b=>b.kind===kind).readyAt+1;
    state=Y(state,now);
  }
  assert.equal(nextStep(SWGuideSteps15,state).destination,'army');
  assert.equal(J.infantry.unlock,1);
  assert.equal(J.archer.unlock,1);
  const startingForce=SWLoadout14(state);
  assert.deepEqual(startingForce.counts,{infantry:3,archer:3});
  const training=SWTrainQuote14(state);
  assert.equal(training.allowed,true);
  assert.equal(training.count,6);
  assert.ok(Z(state,training.cost));
  state=Ul(state,{type:'trainLoadout'},now);
  const selected=SWSelectedArmy14(state);
  assert.equal(selected.infantry,3);
  assert.equal(selected.archer,3);
  assert.equal(Object.values(selected).reduce((total,count)=>total+count,0),6);
  assert.equal(SWTrainQuote14(state).count,0);
  assert.equal(nextStep(SWGuideSteps15,state).destination,'frontier');
  // Victory is an observed gameplay condition, not granted by the guide.
  state.campaign=1;
  assert.equal(nextStep(SWGuideSteps15,state).destination,'build:storehouse');
  assert.ok(Z(state,Sl.storehouse.cost));
  assert.equal(Ml(state),1);
  const before=JSON.stringify(state);
  SWGuideSteps15(state,['keep']);
  assert.equal(JSON.stringify(state),before);
  state.buildings.push({id:'test-store',kind:'storehouse',level:1,x:9,y:9});
  assert.equal(SWGuideSteps15(state).every(step=>step.done),true);
});

test('guide does not send players into construction when crews or resources are unavailable',()=>{
  const {SWGuideSteps15}=setup();
  const state=fresh();
  state.resources={gold:0,wood:0,stone:0,food:0};
  assert.equal(nextStep(SWGuideSteps15,state).destination,'capital');
  assert.match(nextStep(SWGuideSteps15,state).detail,/gathering supplies/);
  state.resources={gold:999,wood:999,stone:999,food:999};
  state.buildings[0].readyAt=state.lastTick+99999;
  assert.equal(nextStep(SWGuideSteps15,state).destination,'projects');
});

test('fresh players see guidance, established saves are respected, and reopening never modifies gameplay',()=>{
  const {SWReadGuide15}=setup();
  assert.equal(SWReadGuide15(fresh()).status,'active');
  for(const state of [{...fresh(),campaign:1},{...fresh(),revision:10},{...fresh(),buildings:[...fresh().buildings,{kind:'quarry',level:1}]}]){
    const before=JSON.stringify(state);
    assert.equal(SWReadGuide15(state).welcome,false);
    assert.equal(JSON.stringify(state),before);
  }
  const saved=JSON.stringify({version:15,status:'skipped',seen:['keep','keep','private name'],welcome:true,name:'private name',collapsed:true});
  const restored=setup(saved).SWReadGuide15(fresh());
  assert.deepEqual(clone(restored),{version:15,status:'skipped',seen:['keep'],welcome:false,collapsed:true});
  const resumed=setup(JSON.stringify({version:15,status:'active',seen:['keep'],welcome:false})).SWReadGuide15({...fresh(),revision:5});
  assert.equal(resumed.status,'active');
  assert.equal(resumed.welcome,false);
  assert.equal(setup('broken json').SWReadGuide15(fresh()).status,'active');
});

test('private diagnostics reject raw data on load and sanitize the final export again',()=>{
  const saved=JSON.stringify({version:15,enabled:true,name:'Alice',sessions:Infinity,counts:{session_start:3.9,secret:'token',battle_end:-3},events:[{event:'session_start',at:42,accountId:'secret',save:{gems:999},metrics:{fps:60,name:'Alice',account_id:123456,screen:2}},{event:'unknown_private_event',at:43},{event:'frame_sample',at:-1},{event:'frame_sample',at:44,metrics:{fps:'name',code:15}}]});
  const {SWReadExperience15,SWExperienceReport15}=setup(saved,diagnosticNames);
  const store=SWReadExperience15();
  assert.equal(store.events.length,2);
  assert.deepEqual(clone(store.counts),{session_start:3});
  store.events[0].save={name:'Bob'};
  store.events[0].metrics.email='hidden';
  store.counts.secret='hidden';
  const report=SWExperienceReport15();
  assert.equal(report.sessions,0);
  const serialized=JSON.stringify(report);
  for(const value of ['Alice','Bob','hidden','account_id','accountId','999','secret','email'])assert.equal(serialized.includes(value),false);
  assert.deepEqual(clone(report.events[0].metrics),{screen:2,fps:60});
});

test('diagnostic ring and counters are bounded and disabled collection records nothing',()=>{
  const {SWRecord15,SWReadExperience15,SWExperienceReport15}=setup(null,diagnosticNames);
  for(let i=0;i<250;i++)SWRecord15('frame_sample',{fps:60.12345,screen:i,code:Infinity,damage:1e30,secret:123});
  let report=SWExperienceReport15();
  assert.equal(report.events.length,200);
  assert.equal(report.counts.frame_sample,250);
  assert.equal(report.events[0].metrics.screen,50);
  assert.equal(report.events[0].metrics.fps,60.12);
  assert.equal(report.events[0].metrics.damage,1e9);
  assert.equal('code' in report.events[0].metrics,false);
  assert.equal('secret' in report.events[0].metrics,false);
  SWReadExperience15().enabled=false;
  SWRecord15('session_start');SWRecord15('anything');
  report=SWExperienceReport15();
  assert.equal(report.counts.session_start,undefined);
  assert.equal(report.events.length,200);
});

test('oversized stored diagnostics are rejected before JSON parsing',()=>{
  const {SWReadExperience15}=setup(' '.repeat(262145),diagnosticNames);
  assert.equal(SWReadExperience15().events.length,0);
});

test('native bridge nests consent, projects and diagnostics in payload and cleans response listeners',async()=>{
  const listeners=new Set(),posts=[],durations=[];
  const window={webkit:{messageHandlers:{stonewake:{postMessage:message=>{
    posts.push(message);
    for(const listener of [...listeners])listener({detail:{id:message.id,ok:true,result:{enabled:true}}});
  }}}},addEventListener:(_name,listener)=>listeners.add(listener),removeEventListener:(_name,listener)=>listeners.delete(listener)};
  const {SWNativeCall15}=setup(null,['SWNativeSequence15','SWNativeCall15'],{window,setTimeout:(_fn,duration)=>{durations.push(duration);return 1},clearTimeout:()=>{}});
  await SWNativeCall15('notifications.request',{userInitiated:true});
  await SWNativeCall15('notifications.sync',{projects:[{id:'keep',title:'Keep upgrade',readyAt:12345}]});
  await SWNativeCall15('diagnostics.record',{event:'frame_sample',metrics:{fps:60}});
  assert.equal(posts[0].payload.userInitiated,true);
  assert.equal(posts[0].userInitiated,undefined);
  assert.equal(posts[1].payload.projects[0].id,'keep');
  assert.equal(posts[2].payload.event,'frame_sample');
  assert.equal(durations[0],180000);
  assert.equal(listeners.size,0);
});

test('notification plan exports project labels and timestamps, never kingdom contents',()=>{
  const {SWProjectNotices15}=setup(null,['SWProjectNotices15'],{GemProjects});
  const state=fresh();
  state.name='Private kingdom';
  state.buildings[0].readyAt=state.lastTick+10000;
  state.fleet=[{id:'ship-one',kind:'cog',level:1,wrecked:true,repairReadyAt:state.lastTick+20000}];
  const plan=SWProjectNotices15(state);
  assert.equal(plan.length,2);
  assert.equal(plan[0].id,'building-keep');
  assert.equal(plan[1].id,'repair-ship-one');
  assert.match(plan[1].title,/repair$/);
  assert.equal(new Set(plan.map(row=>row.id)).size,plan.length);
  assert.ok(plan.every(row=>!row.title.includes('is ready')));
  assert.ok(plan.every(row=>Object.keys(row).sort().join(',')==='id,readyAt,title'));
  assert.equal(JSON.stringify(plan).includes('Private kingdom'),false);
});

test('notification control respects app opt-in independently of OS permission',()=>{
  const {SWNotificationChoice15}=setup(null,['SWNotificationChoice15']);
  assert.equal(SWNotificationChoice15({authorization:'authorized',enabled:false}).method,'notifications.request');
  assert.equal(SWNotificationChoice15({authorization:'authorized',enabled:true}).method,'notifications.disable');
  assert.equal(SWNotificationChoice15({authorization:'denied',enabled:false}).method,'notifications.settings');
  assert.equal(SWNotificationChoice15({authorization:'notDetermined',enabled:false}).method,'notifications.request');
  assert.equal(SWNotificationChoice15({},false).method,null);
});

function noticeHarness() {
  const calls=[];
  const {SWCreateNoticeSync15}=setup(null,['SWCreateNoticeSync15']);
  const sync=SWCreateNoticeSync15(projects=>new Promise((resolve,reject)=>calls.push({projects,resolve,reject})));
  const plan=time=>[{id:'building-keep',title:'Keep upgrade',readyAt:time}];
  return {sync,calls,plan};
}

test('notification sync acknowledges only success and retries a failed unchanged plan on the next tick',async()=>{
  const {sync,calls,plan}=noticeHarness(),projects=plan(10000);
  const first=sync.update(projects);
  sync.update(projects);
  await Promise.resolve();
  assert.equal(calls.length,1);
  calls[0].reject(new Error('Transient bridge failure'));
  await first;
  assert.equal(calls.length,1,'failure must not create an unbounded retry loop');
  const retry=sync.update(projects);
  await Promise.resolve();
  assert.equal(calls.length,2);
  calls[1].resolve({enabled:true});
  await retry;
  sync.update(projects);
  await Promise.resolve();
  assert.equal(calls.length,2,'successful unchanged plan must be deduplicated');
  sync.dispose();
});

test('notification sync serializes requests and sends only the latest plan after an in-flight response',async()=>{
  const {sync,calls,plan}=noticeHarness(),first=sync.update(plan(10000));
  await Promise.resolve();
  sync.update(plan(20000));
  const last=plan(30000);sync.update(last);last[0].readyAt=90000;
  assert.equal(calls.length,1);
  calls[0].resolve({enabled:true});
  await first;await Promise.resolve();
  assert.equal(calls.length,2);
  assert.equal(calls[1].projects[0].readyAt,30000,'pending plan must be a snapshot');
  calls[1].resolve({enabled:true});
  await sync.update(plan(30000));
  sync.update(plan(30000));await Promise.resolve();
  assert.equal(calls.length,2);
  sync.dispose();
});

test('notification permission or active-context refresh cannot be acknowledged by an old in-flight request',async()=>{
  const {sync,calls,plan}=noticeHarness(),first=sync.update(plan(10000));
  await Promise.resolve();sync.invalidate();
  calls[0].resolve({enabled:false});
  await first;await Promise.resolve();
  assert.equal(calls.length,2,'same plan must be resent after context invalidation');
  const pending=sync.update(plan(20000));sync.dispose();
  calls[1].resolve({enabled:true});await pending;await Promise.resolve();
  assert.equal(calls.length,2,'unmounted hook must not send queued plans');
});
