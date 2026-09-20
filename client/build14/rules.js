// Shared medieval progression and preparation rules. All mutations run through Ul.
const SWFamilies14 = Object.freeze([
 {id:'vanguard',name:'Vanguard',role:'Protect and hold the breach',kinds:['infantry','shieldbearer','spearman'],default:'infantry'},
 {id:'rangers',name:'Rangers',role:'Ranged support behind the frontline',kinds:['archer','crossbow'],default:'archer'},
 {id:'riders',name:'Riders',role:'Flank exposed targets',kinds:['cavalry','knight','scout'],default:'cavalry'},
 {id:'breachers',name:'Breachers',role:'Open walls and gates',kinds:['ram'],default:'ram'},
 {id:'siege',name:'Siege crews',role:'Heavy fire from long range',kinds:['trebuchet','cannon','grenadier'],default:'trebuchet'},
 {id:'medics',name:'Field medics',role:'Support separate fighting groups',kinds:['healer'],default:'healer'}
]);
function SWFamily14(kind){return SWFamilies14.find(f=>f.kinds.includes(kind));}
function SWMigrate14(state){
 if(state.medievalVersion!==14){
  state.seaCampaign=Number.isInteger(state.seaCampaign)?Math.max(0,Math.min(10,state.seaCampaign)):0;
  state.loadouts14=Array.isArray(state.loadouts14)?state.loadouts14.slice(0,3):[];
  if(!state.loadouts14.length){
   const slots=SWFamilies14.map(f=>f.kinds.filter(k=>state.army?.[k]>0).sort((a,b)=>(state.unitLevels?.[b]||1)-(state.unitLevels?.[a]||1)||(state.army[b]-state.army[a]))[0]||f.default).filter(k=>(J[k].unlock||1)<=Ml(state));
   state.loadouts14=[{id:'balanced',name:'Balanced force',slots,counts:Object.fromEntries(slots.map(k=>[k,Math.max(1,state.army?.[k]||(['ram','trebuchet','healer'].includes(k)?2:6))]))}];
  }
  for(const force of state.loadouts14){let room=Pl(state);const desired={...force.counts};force.counts=Object.fromEntries(force.slots.map(k=>[k,0]));while(room>0){let assigned=false;for(const k of force.slots){if(room>0&&force.counts[k]<(desired[k]||0)){force.counts[k]++;room--;assigned=true;}}if(!assigned)break;}}
  state.activeLoadout14=state.loadouts14[0].id;
  state.medievalVersion=14;
 }
 state.seaCampaign=Math.max(0,Math.min(10,state.seaCampaign||0));
 return state;
}
function Y(state,now=Date.now()){return SWMigrate14(SWLegacyY13(state,now));}
function SWUpgradeQuote14(state,building){
 if(!building)return {allowed:false,requirements:[{id:'missing',text:'Choose a building.',met:false}],cost:{},shortfall:{}};
 const level=building.level||0,next=level+1,max=Math.min(10,Sl[building.kind].max||10),cost=X(building.kind,next),capacity=SWCapacity(state),requirements=[];
 const add=(id,text,met,action=null)=>requirements.push({id,text,met:!!met,action});
 add('maximum',level<max?'Level '+next:'Medieval level complete',level<max);
 add('project',building.readyAt?'Construction is in progress':'Ready for development',!building.readyAt,{type:'projects'});
 add('builders',Rc(state)>0?'Construction crew available':'All construction crews are working',Rc(state)>0,{type:'projects'});
 if(building.kind!=='keep')add('keep','Keep '+next,Ml(state)>=next,{type:'buildingKind',kind:'keep'});
 else{
  add('campaign',level+' land strongholds captured',(state.campaign||0)>=level,{type:'land'});
  for(const kind of (level>=2?['barracks','quarry']:['barracks']))add(kind,Sl[kind].name+' '+level,state.buildings.some(b=>b.kind===kind&&b.level>=level),{type:'buildingKind',kind});
 }
 const needed=Math.max(...Object.values(cost)),storeCount=SWBuildingCount(state,'storehouse'),canBuildStore=storeCount<SWBuildingLimit(state,'storehouse');
 add('storage','Storage '+Math.floor(capacity).toLocaleString()+' / '+needed.toLocaleString(),needed<=capacity,canBuildStore?{type:'build',kind:'storehouse'}:{type:'buildingKind',kind:'storehouse'});
 const shortfall=Object.fromEntries(xl.map(k=>[k,Math.max(0,Math.ceil(cost[k]-state.resources[k]))]));
 add('supplies','Supplies for this upgrade',!Object.values(shortfall).some(Boolean),{type:'storage'});
 return {allowed:requirements.every(r=>r.met),requirements,level,next,max,cost,capacity,shortfall,duration:Zc(state,building.kind,next)*(1-Math.min(.3,SWCivicLevel(state,'workshop')*.03)),benefit:Bl({...building,level:next}),reason:requirements.find(r=>!r.met)?.text||null};
}
function Vl(state,building){return SWUpgradeQuote14(state,building).reason;}
function $c(state,building){return SWUpgradeQuote14(state,building).requirements.find(r=>!r.met&&['campaign','barracks','quarry'].includes(r.id))?.text||null;}
function Bl(building){return SWLegacyBl13(building).replace(/^Age /,'Keep level ');}
function SWLoadout14(state){const list=state.loadouts14||[];return list.find(l=>l.id===state.activeLoadout14)||list[0]||{id:'balanced',name:'Balanced force',slots:['infantry','archer'],counts:{infantry:6,archer:6}};}
function SWValidateLoadout14(state,raw){
 if(!raw||!Array.isArray(raw.slots)||!raw.slots.length||raw.slots.length>6)throw Error('Choose one to six troop types.');
 const slots=[...new Set(raw.slots)];if(slots.length!==raw.slots.length)throw Error('Choose each troop only once.');
 const families=new Set();
 for(const k of slots){if(!Object.hasOwn(J,k)||(J[k].unlock||1)>Ml(state))throw Error('That troop is not unlocked.');const family=SWFamily14(k).id;if(families.has(family))throw Error('Choose one doctrine for each troop family.');families.add(family);}
 const counts={};for(const k of slots){const n=raw.counts?.[k];if(!Number.isInteger(n)||n<0||n>80)throw Error('Choose between 0 and 80 troops per type.');counts[k]=n;}
 if(Object.values(counts).reduce((a,b)=>a+b,0)>Pl(state))throw Error('This loadout exceeds your army capacity.');
 return {id:typeof raw.id==='string'&&/^[a-z0-9_-]{1,30}$/.test(raw.id)?raw.id:'balanced',name:String(raw.name||'My force').trim().slice(0,24)||'My force',slots,counts};
}
function SWSelectedArmy14(state,loadout=SWLoadout14(state)){return Object.fromEntries(Object.keys(J).map(k=>[k,loadout.slots.includes(k)?Math.min(state.army[k]||0,loadout.counts[k]||0):0]));}
function SWTrainQuote14(state,loadout=SWLoadout14(state)){
 const missing=Object.fromEntries(loadout.slots.map(k=>[k,Math.max(0,(loadout.counts[k]||0)-(state.army[k]||0))]));
 const count=Object.values(missing).reduce((a,b)=>a+b,0),cost=Object.fromEntries(xl.map(r=>[r,Object.entries(missing).reduce((sum,[k,n])=>sum+(J[k].cost[r]||0)*n,0)]));
 const reason=!count?'This force is ready':!state.buildings.some(b=>b.kind==='barracks'&&b.level>0)?'Complete a Barracks first':missing.cannon>0&&!state.buildings.some(b=>b.kind==='forge'&&b.level>0)?'Complete a Forge for this siege doctrine':loadout.slots.some(k=>missing[k]>0&&(J[k].unlock||1)>Ml(state))?'This troop is not unlocked':Nl(state.army)+count>Pl(state)?'Not enough army space':!Z(state,cost)?'More training supplies needed':null;
 return {missing,count,cost,reason,allowed:!reason};
}
function SWTroopStats14(state,kind,level=el(state,kind)){
 const base=J[kind],unit={kind,level,hp:base.hp*(1+.16*(level-1)),maxHp:base.hp*(1+.16*(level-1)),damage:base.damage*(1+.14*(level-1)),range:base.range,speed:base.speed,cooldown:base.cooldown};
 SWApplyTroopStats(unit);const townBonus=Hl(state);return {...unit,baseDamage:unit.damage,damage:unit.damage*townBonus,townBonus,heal:kind==='healer'?20*(1+.14*(level-1)):0,abilities:SWTroopAbilities(kind).filter(a=>a.level<=level)};
}
const SWEquipment14=Object.freeze({
 vanguard:['Cloth tunic & buckler','Padded vest & iron shield rim','Mail shirt & guard stance','Kite shield & bracers','Full helm & longer blade','Officer sash & cleaving blade','Shoulder armor & house crest','Plate vest & short mantle','Veteran plume & embossed shield','Gilded steel & royal mantle'],
 rangers:['Shortbow & belt quiver','Leather jerkin & broad quiver','Longbow & leather hood','Braced bow & arm guards','Iron helm & bound arrows','Reflex bow & quick-draw belt','Mail shoulders & house cloak','Reinforced limbs & steel tips','Twin-arrow rig & veteran crest','Royal bow & embroidered mantle'],
 riders:['Light tack & riding spear','Saddle blanket & leather vest','Spurs & reinforced lance','Horse chest guard & arm plates','Barded neck & steel helm','Charge lance & officer banner','Mail barding & house shield','Armored saddle & cape','Veteran pennant & war plate','Royal barding & gilded lance'],
 breachers:['Timber frame & iron ram','Bound beams & larger head','Braced roof & heavy chassis','Hide roof & crew shields','Iron ribs & capstan','Gatebreaker head & crew harness','Plated roof & larger wheels','Steel axle & armored doors','Veteran crew & shock ram','Royal siege frame & iron prow'],
 siege:['Timber frame & stone sling','Larger wheels & braced sling','Long counterweight & lever','Cross-braced frame & crew cover','Stone counterweight & iron arm','Shattering boulders & loading crane','Armored crew station & banner','Double braces & geared winch','Veteran crew & quick-load rig','Royal siege engine & gilded fittings'],
 medics:['Satchel & walking staff','Supply belt & padded robe','Field lantern & reach staff','White mantle & supply case','Brass staff & surgeon kit','Shared-care censer & blue sash','Armored shoulders & field banner','Reinforced satchel & long mantle','Veteran halo & emergency kit','Royal healer robes & beacon staff']
});
function SWEquipmentName14(kind,level){
 const index=Math.max(0,Math.min(9,level-1)),base=SWEquipment14[SWFamily14(kind)?.id||'vanguard'][index];
 if(kind==='crossbow')return ['Light crossbow & bolt pouch','Bound stock & leather jerkin','Steel prod & leather hood','Braced stock & arm guards','Iron helm & broadhead bolts','Windlass & quick-load belt','Mail shoulders & house cloak','Steel limbs & armor-piercing bolts','Volley rig & veteran crest','Royal crossbow & embroidered mantle'][index];
 if(kind==='grenadier')return ['Clay firepots & canvas satchel','Leather apron & larger pots','Throwing harness & fireproof gloves','Bronze-capped pots & bracers','Iron helm & protected fuses','Fragmenting pots & armored apron','Mail shoulders & house sash','Steel supply case & short mantle','Veteran crest & quick-throw harness','Royal alchemist kit & gilded fittings'][index];
 if(kind==='cannon')return ['Iron barrel & timber carriage','Bound wheels & reinforced carriage','Long barrel & iron trunnions','Braced axle & crew shields','Cast barrel & plated carriage','Blast shells & loading gear','Crew armor & house banner','Steel axles & counter-recoil brace','Veteran crew & siege rounds','Royal artillery & gilded fittings'][index];
 if(kind==='spearman')return base.replace('short blade','spear').replace('longer blade','long pike').replace('cleaving blade','braced pike').replace('royal mantle','royal pike');
 if(kind==='scout')return ['Light boots & scout blade','Leather vest & field pack','Hood & longer blade','Bracers & trail cloak','Steel helm & light mail','Swift boots & officer sash','Mail shoulders & house crest','Plate vest & short mantle','Veteran plume & embossed buckler','Royal scout armor & mantle'][index];
 return base;
}
function SWLayoutAction14(state,action,now){
 if(!Array.isArray(action.actions)||action.actions.length>300)throw Error('A layout can contain up to 300 edits.');
 if(state.activeBattle)throw Error('Finish the battle before changing your defenses.');
 let draft=state;
 for(const edit of action.actions){if(!['move','rotate','landscape'].includes(edit.type))throw Error('Only layout edits may be committed.');draft=Ul(draft,edit,now);}
 return draft;
}
function Ul(state,action,now=Date.now()){
 const current=Y(state,now);
 if(action.type==='upgrade'){
  const b=current.buildings.find(b=>b.id===action.id),q=SWUpgradeQuote14(current,b);if(!q.allowed)throw Error(q.requirements.filter(r=>!r.met).map(r=>r.text).join(' · '));
 }
 if(action.type==='saveLoadout'){
  if(current.activeBattle)throw Error('Change your force after the battle.');
  const loadout=SWValidateLoadout14(current,action.loadout);const others=current.loadouts14.filter(l=>l.id!==loadout.id);if(others.length>=3)throw Error('You can save up to three forces.');
  current.loadouts14=[...others,loadout];current.activeLoadout14=loadout.id;current.revision++;return current;
 }
 if(action.type==='selectLoadout'){if(current.activeBattle)throw Error('Change your force after the battle.');if(!current.loadouts14.some(l=>l.id===action.id))throw Error('Choose a saved force.');current.activeLoadout14=action.id;current.revision++;return current;}
 if(action.type==='trainLoadout'){
  if(current.activeBattle)throw Error('Finish your battle before training.');
  const q=SWTrainQuote14(current);if(!q.allowed)throw Error(q.reason);Q(current,q.cost);for(const [kind,count] of Object.entries(q.missing))current.army[kind]=(current.army[kind]||0)+count;current.revision++;return current;
 }
 if(action.type==='commitLayout')return SWLayoutAction14(current,action,now);
 if(action.type==='collectFleet'){
  let collected=false;for(const ship of current.fleet){if(ship.voyage&&ship.voyage.readyAt<=now){try{ol(current,{type:'collectVoyage',id:ship.id},now);collected=true;}catch{}}}
  if(!collected)throw Error('No returned cargo fits in storage yet.');current.revision++;return current;
 }
 const result=SWLegacyUl13(current,action,now);if(action.type==='move'&&action.facing!==undefined){if(!Number.isInteger(action.facing)||action.facing<0||action.facing>3)throw Error('Choose a valid building rotation.');const b=result.buildings.find(b=>b.id===action.id);if(b)b.facing=action.facing;}return result;
}

function ol(state,action,now){
 if(action.type==='collectVoyage'){
  const ship=state.fleet?.find(s=>s.id===action.id);if(!ship?.voyage||ship.voyage.readyAt>now)throw Error('This ship has not returned yet.');
  const cap=SWCapacity(state),reward=ship.voyage.reward,received=Object.fromEntries(xl.map(k=>[k,Math.min(reward[k]||0,Math.max(0,Math.floor(cap-state.resources[k])))]));
  if(!Object.values(received).some(Boolean))throw Error('Make room in storage for this cargo.');Ll(state,received);for(const k of xl)reward[k]=Math.max(0,(reward[k]||0)-received[k]);if(!Object.values(reward).some(Boolean))delete ship.voyage;return true;
 }
 if(action.type==='landscape'){
  if(!SWWalkable(state,action.x,action.y))throw Error('Choose a buildable plot or the harbor promenade.');
  if(state.buildings.some(b=>b.x===action.x&&b.y===action.y))throw Error('Move the building before changing this plot.');
  if((state.premium?.ornaments||[]).some(o=>o.x===action.x&&o.y===action.y))throw Error('Move the decoration before changing this plot.');
  if(!Object.hasOwn(Tc,action.kind||''))throw Error('Choose a layout tool.');
  const before=il(state,action.x,action.y),kind=action.kind==='clear'?'grass':action.kind;
  if(before?.kind===kind||action.kind==='clear'&&!before)return true;
  Q(state,Tc[action.kind].cost);
  if(action.kind==='clear'&&before&&!before.harvested)Ll(state,{gold:0,wood:before.kind==='tree'?20:0,stone:before.kind==='rock'?15:0,food:0});
  state.terrain=[...(state.terrain||[]).filter(t=>t.x!==action.x||t.y!==action.y),{x:action.x,y:action.y,kind,harvested:true}];return true;
 }
 return SWLegacyFleet13(state,action,now);
}
