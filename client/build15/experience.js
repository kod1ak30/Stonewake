// @ts-nocheck
// Recovered as an ES module for build 15. Preserve saved-state and replay semantics.
import { startInputDiagnostics } from "../../frontend/runtime/input-probe.js";
import { C, je, ne, ve } from "../../frontend/vendor/runtime.js";
import { GemProjects, Sl, Ml, Rc, Z } from "../../frontend/core/rules.js";
import { swElement } from "../interface.js";
import { SWDialog } from "../build14/ui.js";
// Build 15: guided first session and private, bounded device diagnostics.
const SWExperienceKey15 = 'stonewake-experience-v15';
const SWGuideKey15 = 'stonewake-guide-v15';
const SWEventNames15 = new Set(['session_start','session_resume','session_background','session_end','screen_open','action_ok','action_blocked','battle_start','battle_end','guide_start','guide_step','guide_skip','guide_complete','frame_sample','runtime_error','promise_error','input_sample']);
const SWActionNames15 = ['build','upgrade','recruit','trainLoadout','researchUnit','speedup','claim','claimAchievement','claimMission','claimChapter','collectVoyage','collectFleet','cityRequest','claimReserve','commitLayout','buyCosmetic','buildShip','upgradeShip','repairShip','rename','move','rotate','landscape'];
const SWScreenNames15 = ['capital','build','frontier','army','fleet','sea','storage','gems','store','wardrobe','chronicle','city','plan','commander','achievements','reports','objectives','settings','account','help'];
let SWExperienceStore15;
let SWNativeSequence15 = 0;
const SWMetricNames15 = new Set(['screen','action','completed','total','fps','slow_percent','won','damage','sea','code','tapDowns','tapReleases','tapClicks','tapCancelled','tapMissingClicks','tapDetached','tapMoved','tapRepeated','inputDelayMaxMs','inputDelayP95Ms','mainLagMaxMs','sampleSeconds','tapReleaseHitMismatch','tapDisabledRelease','tapPreventedRelease','tapUnmatchedClicks','tapActivatedTouch','tapRejected']);
function SWCleanMetrics15(metrics) {
  const safe={};
  if(!metrics||typeof metrics!=='object'||Array.isArray(metrics))return safe;
  for(const key of SWMetricNames15){const value=metrics[key];if(typeof value==='number'&&Number.isFinite(value))safe[key]=Math.max(-1e9,Math.min(1e9,Math.round(value*100)/100));}
  return safe;
}
function SWCleanExperience15(value) {
  const valid=value?.version===15,events=valid&&Array.isArray(value.events)?value.events:[],counts={};
  for(const event of SWEventNames15){const count=value?.counts?.[event];if(valid&&Number.isFinite(count)&&count>=0)counts[event]=Math.min(100000,Math.floor(count));}
  return {version:15,enabled:!valid||value.enabled!==false,events:events.slice(-200).filter(e=>SWEventNames15.has(e?.event)&&Number.isFinite(e.at)&&e.at>=0&&e.at<=1e15).map(e=>({event:e.event,at:Math.floor(e.at),metrics:SWCleanMetrics15(e.metrics)})),counts,sessions:valid&&Number.isFinite(value.sessions)?Math.min(100000,Math.max(0,Math.floor(value.sessions))):0};
}
function SWReadExperience15() {
  if(SWExperienceStore15)return SWExperienceStore15;
  try{const raw=localStorage.getItem(SWExperienceKey15);if(raw&&raw.length<=262144)SWExperienceStore15=SWCleanExperience15(JSON.parse(raw));}catch{}
  return SWExperienceStore15 ||= SWCleanExperience15(null);
}
function SWWriteExperience15() {try{localStorage.setItem(SWExperienceKey15,JSON.stringify(SWReadExperience15()))}catch{}}
function SWNativeCall15(method,payload={}) {
  const handler=window.webkit?.messageHandlers?.stonewake;
  if(!handler)return Promise.resolve({available:false});
  const id='sw15-'+(++SWNativeSequence15);
  return new Promise((resolve,reject)=>{
    const done=event=>{if(event.detail?.id!==id)return;cleanup();event.detail.ok?resolve(event.detail.result):reject(new Error(event.detail.error?.message||event.detail.error||'This device action is unavailable.'))};
    const timeout=setTimeout(()=>{cleanup();reject(new Error('The device did not respond. Please try again.'))},method==='notifications.request'?180000:12000);
    const cleanup=()=>{clearTimeout(timeout);window.removeEventListener('stonewake-native-response',done)};
    window.addEventListener('stonewake-native-response',done);
    try{handler.postMessage({kind:'native',id,method,payload})}catch(error){cleanup();reject(error)}
  });
}
function SWRecord15(event,metrics={}) {
  const store=SWReadExperience15();
  if(!store.enabled||!SWEventNames15.has(event))return;
  const safe=SWCleanMetrics15(metrics);
  const entry={event,at:Date.now(),metrics:safe};
  store.events=[...store.events.slice(-199),entry];store.counts[event]=Math.min(100000,(store.counts[event]||0)+1);
  SWWriteExperience15();
  if(window.__STONEWAKE_NATIVE__)void SWNativeCall15('diagnostics.record',{event,metrics:safe}).catch(()=>{});
}
// Session-only, explicit opt-in. Never starts merely because diagnostics are on.
let SWInputCheck16 = null;
function SWStopInputCheck16(keep=true) { SWInputCheck16?.(keep); }
function SWStartInputCheck16() {
  if(!SWReadExperience15().enabled)return;
  SWStopInputCheck16();
  SWInputCheck16=startInputDiagnostics({sample:metrics=>SWRecord15('input_sample',metrics),enabled:()=>SWReadExperience15().enabled,stopped:()=>{SWInputCheck16=null;window.dispatchEvent(new Event('stonewake-input-check'))}});
  window.dispatchEvent(new Event('stonewake-input-check'));
}
function SWExperienceReport15() {
  const store=SWCleanExperience15(SWReadExperience15());
  return {product:'Stonewake',build:18,generatedAt:new Date().toISOString(),diagnostics:'Stored on this device only. No player names, account IDs, saves, purchases, or messages.',enabled:store.enabled,sessions:store.sessions,counts:{...store.counts},events:store.events.slice(-200)};
}
function SWGuideSteps15(state,seen=[]) {
  const has=kind=>state.buildings?.some(b=>b.kind===kind&&b.level>0);
  const pending=kind=>state.buildings?.find(b=>b.kind===kind&&b.readyAt);
  const army=Object.values(state.army||{}).reduce((n,v)=>n+(Number(v)||0),0);
  const construction=kind=>{
    if(pending(kind))return {action:'View construction',destination:'projects'};
    if(Ml(state)<Sl[kind].unlock)return {action:'Inspect Keep',destination:'keep',detail:'Reach Keep '+Sl[kind].unlock+' before building '+Sl[kind].name+'.'};
    if(Rc(state)<1)return {action:'View construction',destination:'projects',detail:'Your construction crew is working. Let the current project finish, then place '+Sl[kind].name+'.'};
    if(!Z(state,Sl[kind].cost))return {action:'Return to village',destination:'capital',detail:'Your producers keep gathering supplies. Save up for '+Sl[kind].name+', or collect any completed objective rewards.'};
    return {action:'Place '+Sl[kind].name,destination:'build:'+kind};
  };
  return [
    {id:'keep',title:'Meet your village',detail:'Your Keep is the heart of Stonewake. Inspect it to see the next upgrade and its requirements.',done:seen.includes('keep')||(state.campaign||0)>0,action:'Inspect Keep',destination:'keep'},
    {id:'quarry',title:'Secure your stone supply',detail:pending('quarry')?'Your Quarry is being built. Explore your village while the crew works.':'Place a Quarry on an open plot. Gold, timber, stone and food each help your town grow.',done:has('quarry'),...construction('quarry')},
    {id:'barracks',title:'Raise your first company',detail:pending('barracks')?'Your Barracks is under construction. Troops will be trained here.':'Build a Barracks. It increases how many troops your village can support.',done:has('barracks'),...construction('barracks')},
    {id:'train',title:'Prepare a small force',detail:'Open Army and choose Train missing to fill your starting force in one action. Vanguard protects your Rangers.',done:army>=6||(state.campaign||0)>0,action:has('barracks')?'Train troops':'Build Barracks',destination:has('barracks')?'army':'build:barracks'},
    {id:'battle',title:'Take the King’s Road',detail:'Scout the first land stronghold. Drag a troop card to the edge, then hold or paint to deploy.',done:(state.campaign||0)>0,action:'Scout first battle',destination:'frontier'},
    {id:'store',title:'Make room for your rewards',detail:'Build a Storehouse to hold more supplies. Keep expanding storage as your village grows.',done:has('storehouse'),...construction('storehouse')}
  ];
}
function SWReadGuide15(state) {
  try{const saved=JSON.parse(localStorage.getItem(SWGuideKey15)||'null');if(saved?.version===15&&['active','skipped','complete'].includes(saved.status)&&Array.isArray(saved.seen))return {version:15,status:saved.status,seen:[...new Set(saved.seen.filter(id=>['keep','quarry','barracks','train','battle','store'].includes(id)))],welcome:saved.status==='active'&&saved.welcome===true,collapsed:saved.collapsed===true}}catch{}
  const established=(state.campaign||0)>0||(state.buildings?.length||0)>5||(state.revision||0)>2;
  return {version:15,status:established?'skipped':'active',seen:[],welcome:!established,collapsed:false};
}
function SWProjectNotices15(state) {
  return GemProjects(state).map(p=>({id:p.target+'-'+p.id,title:p.name,readyAt:p.readyAt}));
}
function SWNotificationChoice15(status,native=true) {
  if(!native)return {method:null,label:'Available in the iPhone app'};
  if(status?.enabled)return {method:'notifications.disable',label:'Turn alerts off'};
  if(status?.authorization==='denied')return {method:'notifications.settings',label:'Open iPhone Settings'};
  return {method:'notifications.request',label:'Enable completion alerts'};
}
function SWCreateNoticeSync15(send) {
  let acknowledged=null,pending=null,latest=null,generation=0,live=true;
  const pump=()=>{
    if(!live||!latest||pending||latest.signature===acknowledged)return pending?.promise;
    const request={...latest,generation};pending=request;
    request.promise=Promise.resolve().then(()=>{if(live)return send(request.projects)}).then(()=>{
      if(live&&request.generation===generation)acknowledged=request.signature;
    },()=>{}).finally(()=>{
      if(pending!==request)return;pending=null;
      // Keep only the newest plan while a bridge request is outstanding. A failed
      // unchanged plan retries on the next state tick, never in a tight loop.
      if(live&&latest&&(latest.signature!==request.signature||generation!==request.generation))void pump();
    });
    return request.promise;
  };
  return {
    update(projects){const snapshot=projects.map(p=>({id:p.id,title:p.title,readyAt:p.readyAt}));latest={projects:snapshot,signature:JSON.stringify(snapshot)};return pump()},
    invalidate(){generation++;acknowledged=null;return pump()},
    dispose(){live=false;latest=null}
  };
}
function SWUseExperience15({state,ready,battle,result,replay}) {
  const [guide,setGuide]=C.useState(null),[notification,setNotification]=C.useState(null),noticeSync=C.useRef(null),battleLogged=C.useRef(null),lastMilestone=C.useRef('');
  const saveGuide=value=>{try{localStorage.setItem(SWGuideKey15,JSON.stringify(value))}catch{}setGuide(value)};
  C.useEffect(()=>{
    if(!ready)return;
    const sync=SWCreateNoticeSync15(projects=>SWNativeCall15('notifications.sync',{projects}));noticeSync.current=sync;
    const value=SWReadGuide15(state);setGuide(value);if(SWReadExperience15().enabled)SWReadExperience15().sessions=Math.min(100000,SWReadExperience15().sessions+1);SWRecord15('session_start');
    if(value.status==='active'&&value.welcome)SWRecord15('guide_start');
    let innerFrame;const frame=requestAnimationFrame(()=>{innerFrame=requestAnimationFrame(()=>void SWNativeCall15('ready').catch(()=>{}))});
    const error=()=>SWRecord15('runtime_error'),rejection=()=>SWRecord15('promise_error');
    const lifecycle=e=>{const phase=e.detail?.state;if(phase==='active'){SWRecord15('session_resume');sync.invalidate()}else if(phase==='background')SWRecord15('session_background');else if(phase==='closed')SWRecord15('session_end')};
    const pagehide=()=>{SWStopInputCheck16();SWRecord15('session_end')};
    const notificationChange=()=>{sync.invalidate();void SWNativeCall15('notifications.status').then(setNotification).catch(()=>{})};
    window.addEventListener('error',error);window.addEventListener('unhandledrejection',rejection);window.addEventListener('stonewake-lifecycle',lifecycle);window.addEventListener('pagehide',pagehide);window.addEventListener('stonewake-notifications-changed',notificationChange);
    void SWNativeCall15('notifications.status').then(setNotification).catch(()=>{});
    return()=>{SWStopInputCheck16();sync.dispose();if(noticeSync.current===sync)noticeSync.current=null;cancelAnimationFrame(frame);cancelAnimationFrame(innerFrame);window.removeEventListener('error',error);window.removeEventListener('unhandledrejection',rejection);window.removeEventListener('stonewake-lifecycle',lifecycle);window.removeEventListener('pagehide',pagehide);window.removeEventListener('stonewake-notifications-changed',notificationChange)};
  },[ready]);
  C.useEffect(()=>{
    if(!ready)return;
    noticeSync.current?.update(SWProjectNotices15(state));
  },[ready,state,notification]);
  C.useEffect(()=>{
    if(!ready||!guide||guide.status!=='active')return;
    const steps=SWGuideSteps15(state,guide.seen),completed=steps.filter(s=>s.done).length,key=steps.map(s=>s.done?'1':'0').join('');
    if(key!==lastMilestone.current){lastMilestone.current=key;SWRecord15('guide_step',{completed,total:steps.length})}
    if(completed===steps.length){saveGuide({...guide,status:'complete',welcome:false});SWRecord15('guide_complete')}
  },[ready,state,guide]);
  C.useEffect(()=>{
    if(!battle||replay)return;
    if(battleLogged.current!==battle.id){battleLogged.current=battle.id;SWRecord15('battle_start',{sea:battle.kind==='sea'?1:0})}
    if(result)SWRecord15('battle_end',{won:result.result?.won?1:0,damage:result.result?.destruction||0,sea:battle.kind==='sea'?1:0});
  },[battle?.id,!!result,replay]);
  C.useEffect(()=>{
    if(!ready)return;let raf,timer,live=true;
    const sample=()=>{if(!live)return;if(document.hidden){timer=setTimeout(sample,60000);return}let prior=null,frames=0,total=0,slow=0;const tick=now=>{if(!live)return;if(document.hidden){timer=setTimeout(sample,60000);return}if(prior!==null){const dt=now-prior;total+=dt;if(dt>33.4)slow++;frames++}prior=now;if(frames<180)raf=requestAnimationFrame(tick);else{SWRecord15('frame_sample',{fps:180000/Math.max(total,1),slow_percent:slow/1.8});timer=setTimeout(sample,60000)}};raf=requestAnimationFrame(tick)};
    timer=setTimeout(sample,5000);return()=>{live=false;cancelAnimationFrame(raf);clearTimeout(timer)};
  },[ready]);
  return {guide,notification,setNotification,saveGuide,restart:()=>{saveGuide({version:15,status:'active',seen:[],welcome:true,collapsed:false});SWRecord15('guide_start')},skip:()=>{saveGuide({...guide,status:'skipped',welcome:false});SWRecord15('guide_skip')}};
}
function SWWelcome15({guide,onBegin,onSkip}) {
  if(!guide?.welcome||guide.status!=='active')return null;
  return swElement(SWDialog,{open:true,onClose:onSkip,title:'A harbor. A home. A kingdom.',subtitle:'Welcome to Stonewake',className:'sw-welcome15'},swElement('div',{className:'sw-welcome-art15',role:'img','aria-label':'A coastal kingdom beneath blue sails'}),swElement('section',null,swElement('span',{className:'sw-eyebrow'},'YOUR FIRST CHAPTER'),swElement('h2',null,'Build a place worth defending.'),swElement('p',null,'Grow your village, raise a company and set your own course. The King’s Road starts on land. The Tideborn campaign awaits at sea.'),swElement('ul',null,swElement('li',null,'Pinch to zoom. Drag to explore.'),swElement('li',null,'Tap buildings to inspect and improve them.'),swElement('li',null,'Your guide follows the progress you make.')),swElement('div',{className:'sw-action-row14'},swElement('button',{className:'primary',onClick:onBegin},'Start my village'),swElement('button',{className:'secondary',onClick:onSkip},'Explore on my own'))));
}
function SWCoach15({state,guide,onChange,onSkip,onAction}) {
  if(!guide||guide.status!=='active'||guide.welcome)return null;
  const steps=SWGuideSteps15(state,guide.seen),index=steps.findIndex(s=>!s.done);if(index<0)return null;const step=steps[index],complete=steps.filter(s=>s.done).length;
  if(guide.collapsed)return swElement('button',{className:'sw-guide-chip15',onClick:()=>onChange({...guide,collapsed:false}),'aria-label':'Show village guide'},swElement(ve,{size:17}),'Guide · '+complete+'/'+steps.length);
  return swElement('aside',{className:'sw-coach15','aria-label':'Village guide'},swElement('div',{className:'sw-coach-copy15'},swElement('small',null,'FIRST CHAPTER · '+complete+'/'+steps.length),swElement('strong',null,step.title),swElement('p',null,step.detail)),swElement('button',{className:'primary',onClick:()=>{if(step.id==='keep')onChange({...guide,seen:[...guide.seen,'keep']});onAction(step.destination)}},step.action),swElement('button',{className:'icon-btn','aria-label':'Minimize village guide',onClick:()=>onChange({...guide,collapsed:true})},'−'),swElement('button',{className:'icon-btn','aria-label':'Dismiss village guide',onClick:onSkip},swElement(je,{size:17})));
}
function SWDeviceSettings15({onGuide}) {
  const [status,setStatus]=C.useState(null),[message,setMessage]=C.useState(''),[working,setWorking]=C.useState(false),[enabled,setEnabled]=C.useState(SWReadExperience15().enabled),[checking,setChecking]=C.useState(!!SWInputCheck16);
  C.useEffect(()=>{const changed=()=>setChecking(!!SWInputCheck16);window.addEventListener('stonewake-input-check',changed);return()=>window.removeEventListener('stonewake-input-check',changed)},[]);
  C.useEffect(()=>{let live=true;const refresh=()=>void SWNativeCall15('status').then(value=>{if(!live)return;setStatus(value.notifications||null);if(typeof value.diagnostics?.enabled==='boolean'){if(!value.diagnostics.enabled)SWStopInputCheck16(false);SWReadExperience15().enabled=value.diagnostics.enabled;SWWriteExperience15();setEnabled(value.diagnostics.enabled)}}).catch(()=>{});refresh();window.addEventListener('stonewake-notifications-changed',refresh);return()=>{live=false;window.removeEventListener('stonewake-notifications-changed',refresh)}},[]);
  const run=async(method,payload={})=>{
    if(method==='diagnostics.clear'||method==='diagnostics.settings'&&payload.enabled===false)SWStopInputCheck16(false);
    setWorking(true);setMessage('');
    try{
      const value=await SWNativeCall15(method,payload);
      if(method.startsWith('notifications.')){if(method!=='notifications.settings')setStatus(value);window.dispatchEvent(new CustomEvent('stonewake-notifications-changed'));}
      if(method==='diagnostics.settings'){if(!value.enabled)SWStopInputCheck16(false);SWReadExperience15().enabled=!!value.enabled;SWWriteExperience15();setEnabled(!!value.enabled);}
      if(method==='diagnostics.clear'){SWStopInputCheck16(false);SWExperienceStore15={version:15,enabled,events:[],counts:{},sessions:0};SWWriteExperience15();}
      setMessage(method==='notifications.request'?(value.enabled?'Construction alerts are enabled.':'You can change notification access in iPhone Settings.'):method==='notifications.disable'?'Construction alerts are off.':method==='diagnostics.export'?'Choose where to save or share your support report.':method==='diagnostics.clear'?'Your local diagnostics log has been cleared.':method==='diagnostics.settings'?(value.enabled?'Local diagnostics are on.':'Local diagnostics are off. Existing records stay here until you clear them.'):'Updated.');
    }catch(error){setMessage(error.message)}finally{setWorking(false)}
  };
  const native=!!window.webkit?.messageHandlers?.stonewake,notificationChoice=SWNotificationChoice15(status,native);
  return swElement('div',{className:'sw-device-settings15'},swElement('section',null,swElement('h3',null,'Construction alerts'),swElement('p',null,'One reminder when a building, research project or ship repair finishes. No promotional notifications.'),swElement('button',{className:'secondary',disabled:working||!native,onClick:()=>run(notificationChoice.method,{userInitiated:true})},notificationChoice.label),swElement('small',null,'Permission is requested only when you choose Enable.')),
  swElement('section',{className:'sw-touch-help18'},swElement('h3',null,'Help improve Stonewake'),swElement('p',null,'A small diagnostics log helps find slow frames and blocked actions. It stays on this device unless you choose to share it.'),swElement('button',{className:'secondary','aria-pressed':enabled,disabled:working,onClick:()=>{const value=!enabled;if(native)void run('diagnostics.settings',{enabled:value});else{if(!value)SWStopInputCheck16(false);SWReadExperience15().enabled=value;SWWriteExperience15();setEnabled(value)}}},'Local diagnostics: '+(enabled?'On':'Off')),swElement('button',{className:'secondary',disabled:working,onClick:()=>{if(native)void run('diagnostics.export',{userInitiated:true});else{const url=URL.createObjectURL(new Blob([JSON.stringify(SWExperienceReport15(),null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='Stonewake-support-build18.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}}},'Export support report'),swElement('button',{className:'secondary',disabled:working||!enabled,'aria-pressed':checking,onClick:()=>{if(checking)SWStopInputCheck16();else SWStartInputCheck16();setMessage(checking?'Touch check stopped. Results stay in the support report.':'Touch check started for two minutes. Close Settings and use the game normally, then export the support report.')}} ,checking?'Stop touch check':'Start touch check'),swElement('small',null,'Optional, two-minute check. Counts and timings only; no touch locations or control text are saved.'),swElement('button',{className:'text-button',disabled:working,onClick:()=>{if(native)void run('diagnostics.clear',{userInitiated:true});else{SWStopInputCheck16(false);SWExperienceStore15={version:15,enabled,events:[],counts:{},sessions:0};SWWriteExperience15();setMessage('Your local diagnostics log has been cleared.')}}},'Clear diagnostics log')),
  swElement('section',null,swElement('h3',null,'Your first chapter'),swElement('p',null,'Reopen the guided introduction at any time. Your village and progress stay intact.'),swElement('button',{className:'primary',onClick:onGuide},'Open village guide')),message&&swElement('p',{role:'status',className:'sw-account-message'},message));
}
function SWLandscapeGuard15(){return swElement('aside',{className:'sw-landscape-guard15','aria-label':'Rotate device'},swElement(ne,{size:44}),swElement('h2',null,'Your kingdom needs a wider horizon.'),swElement('p',null,'Turn your device sideways to play Stonewake.'))}

export { SWExperienceKey15, SWGuideKey15, SWEventNames15, SWActionNames15, SWScreenNames15, SWExperienceStore15, SWNativeSequence15, SWReadExperience15, SWWriteExperience15, SWNativeCall15, SWRecord15, SWExperienceReport15, SWGuideSteps15, SWReadGuide15, SWUseExperience15, SWWelcome15, SWCoach15, SWDeviceSettings15, SWLandscapeGuard15 };
