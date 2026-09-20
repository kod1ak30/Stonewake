const fs=require('fs'),acorn=require('../backend/node_modules/acorn'),base=fs.readFileSync('client/build14/engine13.js','utf8'),opts={ecmaVersion:2022,sourceType:'module'},ast=acorn.parse(base,opts);let s=base.slice(...(()=>{const n=ast.body.find(n=>n.type==='FunctionDeclaration'&&n.id.name==='Ju');return[n.start,n.end]})());
function replace(a,b){if(!s.includes(a))throw Error('Missing app anchor: '+a.slice(0,100));s=s.replace(a,b)}
function walk(n,fn){if(!n||typeof n!=='object')return;fn(n);for(const v of Object.values(n))if(Array.isArray(v))v.forEach(x=>walk(x,fn));else if(v&&typeof v==='object')walk(v,fn)}
function replaceCall(name,code){const tree=acorn.parse(s,opts);let match;walk(tree,n=>{if(!match&&n.type==='CallExpression'&&n.arguments?.[0]?.type==='Identifier'&&n.arguments[0].name===name)match=n});if(!match)throw Error('Call missing '+name);s=s.slice(0,match.start)+code+s.slice(match.end)}
replace('function Ju({ deviceOnly: e = !1 } = {}) {',`function Ju({ deviceOnly: e = !1 } = {}) {
  const [battlePrep14,setBattlePrep14]=C.useState(null),[selectedShip14,setSelectedShip14]=C.useState(null),[navalTool14,setNavalTool14]=C.useState(null);
  const [layout14,setLayout14]=C.useState(null),layoutRef14=C.useRef(null),[layoutOverlay14,setLayoutOverlay14]=C.useState('plots'),navHistory14=C.useRef(['capital']);layoutRef14.current=layout14;
  function SWStartLayout14(){const base=Y(r.current);const draft={base,states:[base],actions:[],index:0};layoutRef14.current=draft;setLayout14(draft);p('capital');ee('road');}
  function SWEditAct14(action,message){
   const draft=layoutRef14.current;if(!draft||!['move','rotate','landscape'].includes(action.type))return mn(action,message);
   try{const next=Ul(draft.states[draft.index],action,draft.base.lastTick),updated={...draft,states:[...draft.states.slice(0,draft.index+1),next],actions:[...draft.actions.slice(0,draft.index),action],index:draft.index+1};layoutRef14.current=updated;setLayout14(updated);He('click');return Promise.resolve(next)}catch(error){ic.error(error.message,{id:'layout-message'});return Promise.resolve(null)}
  }
  function SWLayoutTravel14(delta){const draft=layoutRef14.current;if(!draft)return;const index=Math.max(0,Math.min(draft.actions.length,draft.index+delta));const next={...draft,index};layoutRef14.current=next;setLayout14(next);}
  function SWCancelLayout14(){layoutRef14.current=null;setLayout14(null);ee(null);h(null);y(null);Ft(null);}
  async function SWSaveLayout14(){const draft=layoutRef14.current;if(!draft)return;const result=await mn({type:'commitLayout',actions:draft.actions.slice(0,draft.index)},'Layout saved');if(result)SWCancelLayout14();}
  function SWRequire14(action){
   if(action.type==='build'){gn(action.kind);return}
   if(action.type==='buildingKind'){const candidates=V.buildings.filter(b=>b.kind===action.kind).sort((a,b)=>b.level-a.level);if(candidates[0]){SWNavigate('capital');h(candidates[0].id)}else gn(action.kind);return}
   if(action.type==='land'){SWNavigate('frontier');nt('campaign');return}
   if(action.type==='projects'){setGemShopOpen(true);return}
   SWNavigate('storage');
  }
  function SWShipCommand14(command){
   if(['move','focus'].includes(command.type)){setNavalTool14(command);return}
   const input=swBattleInput.current;if(!input||input.navalVersion!==4||B||St)return;
   const order={...command,time:Math.min(119.5,Math.ceil(lt*4)/4)};
   if(c.current==='cloud'&&L?.kind!=='practice'){swOnlineQueue.current?.enqueue({type:'ship',order});return}
   const next={...input,shipOrders14:[...(input.shipOrders14||[]),order]};try{SWValidateShipOrders14(next,next.shipOrders14);SWQueueSimulation(next);He('click')}catch(error){ic.error(error.message)}setNavalTool14(null);
  }
  function SWNavalMap14(x,y,targetId){if(!navalTool14)return;const command={...navalTool14,...(navalTool14.type==='focus'?{targetId}:{x,y})};setNavalTool14(null);const input=swBattleInput.current;if(!input)return;const order={...command,time:Math.min(119.5,Math.ceil(lt*4)/4)};try{SWValidateShipOrders14(input,[...(input.shipOrders14||[]),order]);if(c.current==='cloud'&&L?.kind!=='practice')swOnlineQueue.current?.enqueue({type:'ship',order});else SWQueueSimulation({...input,shipOrders14:[...(input.shipOrders14||[]),order]})}catch(error){ic.error(error.message)}}
`);
replace('V = Y(t, i),','V = layout14?layout14.states[layout14.index]:Y(t, i),');
replace('function SWNavigate(destination) {',`function SWNavigate(destination) {
    if(destination==='back'){navHistory14.current.pop();destination=navHistory14.current.pop()||'capital';}
    if(navHistory14.current.at(-1)!==destination)navHistory14.current.push(destination);`);
replace("if(destination==='capital'||destination==='build'||destination==='frontier')p(destination);", "if(destination==='capital'||destination==='build'||destination==='frontier')p(destination);\n    else if(destination==='sea'){p('frontier');nt('sea')}\n    else if(destination==='harborUpgrade'){p('capital');h(V.buildings.filter(b=>b.kind==='harbor').sort((a,b)=>b.level-a.level)[0]?.id||null)}");
replace("else if(destination==='plan'){p('capital');ee('road')}", "else if(destination==='plan')SWStartLayout14();");
replace('function yn(e) {\n    setNavalId(\'\');',"function yn(e) {\n    setBattlePrep14(null);setSelectedShip14(null);setNavalTool14(null);setNavalId('');");
const start=s.indexOf('let t = {\n            defense: I.defense,');const tree=acorn.parse(s,opts);let input;walk(tree,n=>{if(n.type==='VariableDeclarator'&&n.init?.type==='ObjectExpression'&&n.start>start&&n.start<start+20)input=n.init});if(!input)throw Error('Battle input not found');s=s.slice(0,input.start)+'SWCreateBattle14(Y(r.current),I,battlePrep14,Math.floor(Math.random()*4294967295))'+s.slice(input.end);
replace("if(e.input.navalSupport){const ship=t.fleet.find(ship=>ship.id===e.input.navalSupport.id);if(ship)ship.combatBattleId=e.id;}","for(const vessel of e.input.fleet14||[]){const ship=t.fleet.find(s=>s.id===vessel.id);if(ship)ship.combatBattleId=e.id;}");
replace('((t.army = wl()), (t.activeBattle = e.id), t.revision++, n(t));',"(Object.keys(J).forEach(k=>{t.army[k]=Math.max(0,(t.army[k]||0)-(e.input.army[k]||0))}), (t.activeBattle=e.id),t.revision++,r.current=t,n(t));");
replace('army:{...V.army},navalShipId:navalId||undefined','army:battlePrep14?.army||SWSelectedArmy14(V),fleet:battlePrep14?.fleet,navalShipId:navalId||undefined,combatVersion:14');
replace("R.navalAt === void 0 && !(R.navalVersion>=2&&R.navalSupport)","R.navalAt === void 0 && !(R.navalVersion>=2&&(R.navalSupport||R.fleet14?.length))");
replace('R?.navalSupport, St, o]','R?.navalSupport, R?.fleet14, St, o]');
replace('const input=swBattleInput.current;\n    if (!input || input.rulesVersion', 'const input=swBattleInput.current,kind=options.kind||le;\n    if (!input || input.rulesVersion');
replace('if (!pl(input.defense, e, t)) {','if (!SWCanDeploy14(input, e, t)) {');
replace('ic(`Deploy along the outside edge.`','ic(input.campaignType===\'sea\'?`Choose a beach along the western shore.`:`Deploy along the outside edge.`');
replace('if (!hl(input)[le]) return false;',`if(!hl(input)[kind])return false;
    const order=SWDeploymentOrder14(input,kind,e,t,lt,options.shipId);if(!order)return false;
    if(order.shipId&&kn?.units.some(u=>u.shipId===order.shipId&&u.hp<=0)){if(!options.silent)ic('That transport was sunk. Its remaining troops will return home.');return false;}`);
replace("enqueue({type:'deploy',kind:le,x:e,y:t})", "enqueue({type:'deploy',kind,x:e,y:t,shipId:order.shipId})");
replace("{kind:le,x:e,y:t,time:Math.max(input.orders?.at(-1)?.time||0,Math.ceil(lt*2)/2)}",'order');
s=s.replaceAll("detail:{x:e,y:t,label:''}","detail:{x:e,y:t,label:'',kind:'deploy'}");
replace('deployment: R.rulesVersion === 4 && !St && !B', 'deployment: !navalTool14 && R.rulesVersion === 4 && !St && !B');
replace('navalSupport: R.navalSupport,',"navalSupport:R.navalSupport||R.fleet14?.[0],battleInput14:R,navalTool14,onNavalMap14:SWNavalMap14,");
replace('onRally: wn, onAbility: Tn,', 'onRally: wn, onAbility: Tn,onShipCommand:SWShipCommand14,selectedShip14,onSelectShip14:setSelectedShip14,');
replace('children: `The frontier`','children: `Battle`');
replace('children: `Conquer land. Forge rivalries. Raise your banner.`','children: `Two campaigns. One growing kingdom.`');
replace('children: [(0, F.jsx)(j, { size: 16 }), `Campaign`],','children: [(0, F.jsx)(j, { size: 16 }), `Land`],');
replace('value: `provinces`,', 'value: `provinces`,');
const anchor=s.indexOf('value: `campaign`,',s.indexOf('className: `frontier-heading`'));const end=s.indexOf('}),',anchor)+3;s=s.slice(0,end)+"\n                          swElement(Bs,{value:'sea'},swElement(xe,{size:16}),'Sea'),"+s.slice(end);
const ca=s.indexOf('tt === `campaign`\n                  ?');const cb=s.indexOf(': tt === `provinces`',ca);if(ca<0||cb<ca)throw Error('Campaign view not found');s=s.slice(0,ca)+"tt === `campaign` || tt === 'sea'\n                  ? swElement(SWCampaignBoard14,{state:V,sea:tt==='sea',onScout:yn,onHarbor:()=>SWNavigate('fleet')})\n                  "+s.slice(cb);
replaceCall('SWBuildingPanel',"swElement(SWBuildingDetails14,{state:V,building:H,busy:l,act:SWEditAct14,onClose:()=>h(null),onMove:()=>{y(H.id);setBuildFacing(H.facing||0);h(null);ee(null)},onRequirement:SWRequire14})");
replaceCall('fu',"swElement(SWLayoutBar14,{tool:T,overlay:layoutOverlay14,onOverlay:setLayoutOverlay14,onTool:ee,onBuildings:()=>{ee(null);h(null)},onUndo:()=>SWLayoutTravel14(-1),onRedo:()=>SWLayoutTravel14(1),onCancel:SWCancelLayout14,onCommit:SWSaveLayout14,canUndo:!!layout14?.index,canRedo:layout14&&layout14.index<layout14.actions.length,count:layout14?.index||0,busy:l})");
replace('T\n                  ? swElement(SWLayoutBar14','layout14\n                  ? swElement(SWLayoutBar14');
replace('editing: !!T,','editing:!!T,layoutOverlay14:layout14?layoutOverlay14:null,');
replace('void mn(\n                      { type: `landscape`','void SWEditAct14(\n                      { type: `landscape`');
replace('await mn({ type: `move`','await SWEditAct14({ type: `move`');
replace("if(e.kind === `harbor` && !e.readyAt) w(true);","if(e.kind === `harbor` && !e.readyAt && !layout14) w(true);");
replace('navalId,onNavalChange:setNavalId,onAttack:', 'navalId,onNavalChange:setNavalId,onPreparation:setBattlePrep14,onAttack:');
replace("onCommander:()=>{x(false);Ut(true)}}),", "onCommander:()=>{x(false);Ut(true)},onPractice:kind=>{x(false);const army={...wl(),[kind]:Math.min(12,Pl(V))};setBattlePrep14({army,fleet:[]});yn({kind:'practice',defense:Gl(0),practiceKind:kind})}}),");
// Practice uses a supplied selection and never changes owned soldiers.
replace('SWCreateBattle14(Y(r.current),I,battlePrep14,',"SWCreateBattle14(I.practiceKind?{...Y(r.current),army:{...wl(),[I.practiceKind]:12}}:Y(r.current),I,I.practiceKind?{army:{...wl(),[I.practiceKind]:12}}:battlePrep14,");
acorn.parse(s,opts);fs.writeFileSync('client/build14/Ju.js',s);console.log('Application integrations prepared');
