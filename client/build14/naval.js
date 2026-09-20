// Two campaigns share combat, while sea assaults require a real transport manifest.
const SWShipRoles14=Object.freeze({
 cutter:{name:'Coastal cutter',role:'Fast landing craft',capacity:12,growth:3,hp:440,damage:12,range:2.6,speed:.85,cooldown:2.8},
 cog:{name:'Landing cog',role:'Heavy troop transport',capacity:24,growth:5,hp:760,damage:10,range:2.3,speed:.58,cooldown:3.3},
 galley:{name:'War galley',role:'Escort & interception',capacity:8,growth:2,hp:680,damage:38,range:4.2,speed:.76,cooldown:2.5},
 bombard:{name:'Siege barge',role:'Trebuchet bombardment',capacity:4,growth:1,hp:820,damage:105,range:7.4,speed:.38,cooldown:6.5}
});
const SWSeaChapters14=Object.freeze([
 ['Saltwind Cove','First landing','Split a landing between two beaches.',1,'assault'],
 ['The Lantern Run','Convoy rescue','Protect the relief cutter through the channel.',2,'convoy'],
 ['Breakwater Gate','Harbor assault','Silence the patrol and take the harbor keep.',2,'assault'],
 ['Iron Shoals','Two approaches','Move around the shoals before landing siege crews.',3,'assault'],
 ['The Drowned Bells','Coastal battery','Land beyond the battery while your escort draws fire.',3,'assault'],
 ['Red Sails','Blockade','Destroy the flagship and capture its stronghold.',4,'blockade'],
 ['Greywater Reach','Relief convoy','Escort the relief ship through defended waters.',4,'convoy'],
 ['The Splinter Coast','Crossfire','Open a safe beach between overlapping towers.',5,'assault'],
 ['Crown Anchorage','Fleet engagement','Coordinate a landing and a duel against three ships.',6,'blockade'],
 ['The Last Beacon','Sea campaign finale','Break the fleet, land your veterans, and take the beacon.',7,'blockade']
].map(([name,title,objective,keep,mode],index)=>({id:'sea-'+index,index,name,title,objective,keep,mode,reward:{gold:280+index*260,wood:200+index*180,stone:100+index*135,food:90+index*90},gems:30})));
function SWShipCapacity14(ship){const d=SWShipRoles14[ship.kind];return d?d.capacity+d.growth*(Math.max(1,Math.min(10,ship.level||1))-1):0;}
function SWTroopWeight14(kind){return {hero:0,infantry:1,archer:1,spearman:1,shieldbearer:2,scout:1,crossbow:2,cavalry:3,knight:4,ram:4,trebuchet:5,cannon:5,grenadier:2,healer:2}[kind]??1;}
function SWReadyFleet14(state){return (state.fleet||[]).filter(s=>SWShipRoles14[s.kind]&&s.level>0&&!s.readyAt&&!s.voyage&&!s.combatBattleId&&!s.wrecked&&!s.repairReadyAt);}
function SWFleetLimit14(state){return Ml(state)>=7?3:2;}
function SWPackCargo14(state,ids,army){
 const ready=SWReadyFleet14(state),fleet=ids.slice(0,SWFleetLimit14(state)).map(id=>ready.find(s=>s.id===id)).filter(Boolean).map(s=>({id:s.id,kind:s.kind,level:s.level,cargo:{},capacity:SWShipCapacity14(s)}));
 const remaining={...army};for(const kind of Object.keys(army).filter(k=>army[k]>0).sort((a,b)=>SWTroopWeight14(b)-SWTroopWeight14(a))){for(let i=0;i<army[kind];i++){
  const weight=SWTroopWeight14(kind),ship=fleet.filter(s=>s.capacity-Object.entries(s.cargo).reduce((a,[k,n])=>a+SWTroopWeight14(k)*n,0)>=weight).sort((a,b)=>(a.kind==='cog'?-1:0)-(b.kind==='cog'?-1:0))[0];
  if(!ship)break;ship.cargo[kind]=(ship.cargo[kind]||0)+1;remaining[kind]--;
 }}
 return {fleet,remaining,army:Object.fromEntries(Object.keys(J).map(k=>[k,(army[k]||0)-(remaining[k]||0)])),capacity:fleet.reduce((n,s)=>n+s.capacity,0),weight:Object.entries(army).reduce((n,[k,v])=>n+v*SWTroopWeight14(k),0)};
}
function SWValidateCargo14(state,rawFleet,army){
 if(!Array.isArray(rawFleet)||!rawFleet.length||rawFleet.length>SWFleetLimit14(state))throw Error('Choose up to '+SWFleetLimit14(state)+' ready ships.');
 const ids=new Set(),totals=wl(),fleet=[];
 for(const raw of rawFleet){const owned=SWReadyFleet14(state).find(s=>s.id===raw.id);if(!owned||ids.has(raw.id))throw Error('Choose distinct, ready ships.');ids.add(raw.id);
  const cargo={};for(const [kind,count]of Object.entries(raw.cargo||{})){if(!Object.hasOwn(J,kind)||!Number.isInteger(count)||count<0||count>80)throw Error('Invalid troop cargo.');cargo[kind]=count;totals[kind]+=count;}
  if(Object.entries(cargo).reduce((n,[k,v])=>n+v*SWTroopWeight14(k),0)>SWShipCapacity14(owned))throw Error('Troops exceed this ship’s capacity.');
  fleet.push({id:owned.id,kind:owned.kind,level:owned.level,cargo});
 }
 if(Object.keys(J).some(k=>totals[k]!==army[k]))throw Error('Every selected troop must be assigned to a ship.');return fleet;
}
function SWSeaDefense14(index){
 const chapter=SWSeaChapters14[index];if(!chapter)throw Error('Choose a sea campaign.');
 const level=Math.min(10,Math.max(1,index)),defense=cl(Math.max(0,index-1),chapter.name,level);
 defense.coast14=true;defense.seaMode=chapter.mode;
 defense.buildings=defense.buildings.map(b=>({...b,level:['keep','wall','gate'].includes(b.kind)?Math.max(1,level):Math.max(1,Math.ceil(level*.7))}));
 if(index===0)defense.buildings=defense.buildings.filter(b=>!['tower','mortar','bastion'].includes(b.kind)||b.x===6);
 defense.buildings.push({id:'sea-harbor',kind:'harbor',x:0,y:6,level:Math.max(1,chapter.keep)});
 defense.buildings=defense.buildings.filter((b,i,all)=>!all.slice(0,i).some(p=>p.x===b.x&&p.y===b.y));
 if(index>=2){defense.buildings=defense.buildings.filter(b=>b.x!==0||b.y!==2);defense.buildings.push({id:'shore-battery',kind:'tower',specialty:'ballista',x:0,y:2,level:Math.max(1,chapter.keep-1)});}
 return defense;
}
function SWSeaNavy14(index){return Array.from({length:index<2?1:index<7?2:3},(_,i)=>({id:i===0?'flagship':'patrol-'+i,kind:index>=5&&i===0?'bombard':'galley',level:Math.max(1,Math.ceil((index+1)/3))}));}
function SWSeaLanding14(defense,x,y){return Number.isInteger(x)&&Number.isInteger(y)&&x===-1&&y>=0&&y<=8&&!defense.buildings.some(b=>Math.hypot(b.x-x,b.y-y)<.9);}
function SWCanDeploy14(input,x,y){return input.campaignType==='sea'?SWSeaLanding14(input.defense,x,y):pl(input.defense,x,y);}
function SWDeploymentOrder14(input,kind,x,y,time,shipId){
 if(!SWCanDeploy14(input,x,y)||!hl(input)[kind])return null;
 const order={kind,x,y,time:Math.max(input.orders?.at(-1)?.time||0,Math.min(119.5,Math.ceil(time*4)/4))};
 if(input.campaignType==='sea'){
  const available=(input.fleet14||[]).filter(s=>!shipId||shipId===s.id).find(s=>kind==='hero'?!(input.orders||[]).some(o=>o.kind==='hero'):(s.cargo[kind]||0)>(input.orders||[]).filter(o=>o.shipId===s.id&&o.kind===kind).length);
  if(!available)return null;order.shipId=available.id;
 }
 return order;
}
function SWOrders14(input,orders){
 if(input.campaignType!=='sea')return ml(input,orders);
 if(!Array.isArray(orders)||orders.length>81)throw Error('Invalid landing orders.');const accepted=[],counts={};let last=0;
 for(const raw of orders){
  if(!raw||!(raw.kind==='hero'?input.commander:Object.hasOwn(J,raw.kind))||!Number.isFinite(raw.time)||raw.time<last||raw.time<0||raw.time>119.5||!SWSeaLanding14(input.defense,raw.x,raw.y))throw Error('Choose a beach and a valid landing time.');
  const ship=input.fleet14.find(s=>s.id===raw.shipId);if(!ship)throw Error('This landing needs a transport.');
  const key=raw.kind==='hero'?'hero':raw.shipId+':'+raw.kind;counts[key]=(counts[key]||0)+1;
  if(counts[key]>(raw.kind==='hero'?1:(ship.cargo[raw.kind]||0)))throw Error('That transport has no more of this troop.');
  accepted.push({kind:raw.kind,x:raw.x,y:raw.y,time:raw.time,shipId:ship.id});last=raw.time;
 }
 return accepted;
}
function SWCreateBattle14(state,scout,preparation,seed){
 const army={...wl(),...(preparation?.army||SWSelectedArmy14(state))};
 if(Object.entries(army).some(([k,n])=>!Object.hasOwn(J,k)||!Number.isInteger(n)||n<0||n>80))throw Error('Invalid troop selection.');
 const active=Object.keys(J).filter(k=>army[k]>0);if(active.length>6||new Set(active.map(k=>SWFamily14(k).id)).size!==active.length)throw Error('Choose one doctrine per family, up to six types.');
 if(active.some(k=>!Number.isInteger(army[k])||army[k]<0||army[k]>(state.army[k]||0))||Nl(army)<3)throw Error('Choose at least three available troops.');
 if(Nl(army)>Pl(state))throw Error('This force exceeds your army capacity.');
 if(active.some(k=>(J[k].unlock||1)>Ml(state)))throw Error('This force contains a troop that is not unlocked.');
 const sea=scout.kind==='sea',chapter=SWSeaChapters14[scout.campaignIndex];
 if(sea&&(!chapter||scout.campaignIndex>state.seaCampaign||Ml(state)<chapter.keep))throw Error('Complete the previous sea chapter and its Keep requirement.');
 const fleet=sea?SWValidateCargo14(state,preparation?.fleet||[],army):[];
 return {defense:sea?SWSeaDefense14(scout.campaignIndex):scout.defense,appearance:SWAppearance(state),army,bonus:Hl(state),front:'center',rulesVersion:4,combatVersion:14,presentationVersion:12,healerTacticsVersion:1,troopAbilitiesVersion:1,campaignType:sea?'sea':'land',navalVersion:sea?4:0,fleet14:fleet,enemyNavy:sea?SWSeaNavy14(scout.campaignIndex):[],seaMode:sea?chapter.mode:undefined,seaIndex:sea?scout.campaignIndex:undefined,orders:[],shipOrders14:[],unitLevels:{...state.unitLevels},commander:Gc(state),commanderStartingXP14:Wc(state,Gc(state).id)?.xp||0,provinceId:scout.provinceId,structureBonus:1+.05*(state.provinces?.find(p=>p.id==='ironpass')?.level||0),seed};
}
function SWCreateShip14(ship,side,index=0){
 const d=SWShipRoles14[ship.kind];if(!d)return null;const level=Math.max(1,Math.min(10,ship.level||1)),friendly=side==='attack',hp=d.hp*(1+.14*(level-1))*(friendly?1:.52);
 return {id:(friendly?'naval-':'enemy-naval-')+ship.id,shipId:ship.id,side,kind:ship.kind,naval:true,navalVersion:4,building:false,x:friendly?-9-index*.8:-5.5-index*1.1,y:friendly?2+index*2:6-index*2,hp,maxHp:hp,level,damage:d.damage*(1+.13*(level-1))*(friendly?1:.72),range:d.range,navalRange:ship.kind==='bombard'?5.8:d.range,speed:d.speed,cooldown:d.cooldown,nextAttack:1+index*.4,heading:friendly?0:Math.PI,vx:0,vy:0,cargo:{...ship.cargo},landed:0,command:null};
}
function SWFleetUnits14(input){return (input.fleet14||[]).map((s,i)=>SWCreateShip14(s,'attack',i)).filter(Boolean);}
function SWSeaEnemyUnits14(input){return (input.enemyNavy||[]).map((s,i)=>SWCreateShip14(s,'defend',i)).filter(Boolean);}
function SWValidateShipOrders14(input,orders){
 if(!Array.isArray(orders)||orders.length>80)throw Error('Invalid fleet orders.');let last=0;return orders.map(order=>{
  if(!input.fleet14.some(s=>s.id===order.shipId)||!['move','focus','withdraw','ability'].includes(order.type)||!Number.isFinite(order.time)||order.time<last||order.time>119.5)throw Error('Choose a ship and a valid order.');last=order.time;
  if(order.type==='move'&&(!Number.isFinite(order.x)||!Number.isFinite(order.y)||order.x< -12||order.x> -2.4||order.y< -2||order.y>11))throw Error('Choose navigable water.');
  if(order.type==='focus'&&typeof order.targetId!=='string')throw Error('Choose a visible enemy target.');
  return {shipId:order.shipId,type:order.type,time:order.time,...(order.type==='move'?{x:order.x,y:order.y}:{}),...(order.type==='focus'?{targetId:order.targetId}: {})};
 });
}
function SWSeaStep14(input,units,time,orders,spawn,events){
 for(const command of input.shipOrders14||[]){if(command.time>time||command.applied14)continue;command.applied14=true;const ship=units.find(u=>u.shipId===command.shipId&&u.side==='attack');if(!ship||ship.hp<=0)continue;
  if(command.type==='ability'){if(ship.abilityUsed)continue;ship.abilityUsed=true;if(['cog','cutter'].includes(ship.kind)){ship.hp=Math.min(ship.maxHp,ship.hp+ship.maxHp*.2);ship.coverUntil=time+7;}else ship.volleyUntil=time+8;}
  else ship.command={...command};
 }
 for(const ship of units.filter(u=>u.navalVersion===4&&u.side==='attack'&&u.hp>0&&!u.sagaEscort)){
  const pending=orders.find(o=>!o.landed14&&o.time<=time&&o.shipId===ship.shipId);
  if(!pending){ship.landing=null;continue;}
  ship.landing={x:-2.45,y:pending.y};
  if(ship.command?.type==='withdraw'||ship.command?.type==='move')continue;
  if(Math.hypot(ship.x+2.45,ship.y-pending.y)>.5||time<(ship.nextLanding14||0))continue;
  spawn(pending,orders.indexOf(pending));pending.landed14=true;ship.landed++;ship.nextLanding14=time+.25;
  if(pending.kind!=='hero')ship.cargo[pending.kind]=Math.max(0,(ship.cargo[pending.kind]||0)-1);
  events.push({id:'landing-'+orders.indexOf(pending),type:'landing',sourceId:ship.id,kind:pending.kind,x:ship.x,y:ship.y,tx:pending.x,ty:pending.y,time});
 }
 const convoy=units.find(u=>u.id==='relief-convoy');if(convoy&&convoy.hp>0){convoy.y=Math.min(10,convoy.y+.25*.13);convoy.heading=Math.PI/2;convoy.vy=.13;}
}
function SWNavalStep(ship,units,time,step=.25){
 if(ship.navalVersion!==4)return SWLegacyNavalStep13(ship,units,time,step);
 ship.vx=0;ship.vy=0;if(ship.hp<=0)return null;
 const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),enemies=units.filter(u=>u.side!==ship.side&&u.hp>0),rivals=enemies.filter(u=>u.naval).sort((a,b)=>distance(ship,a)-distance(ship,b)||a.id.localeCompare(b.id));
 let target=ship.command?.type==='focus'?enemies.find(u=>u.id===ship.command.targetId):null;
 target ||= rivals[0]||enemies.filter(u=>u.building&&!ll(u)).sort((a,b)=>distance(ship,a)-distance(ship,b))[0];
 const command=ship.command,withdraw=command?.type==='withdraw',manual=command?.type==='move';
 let destination=withdraw?{x:-11,y:ship.y}:manual?command:ship.landing||target||{x:-5,y:4};
 const range=target?.naval?ship.navalRange:ship.range,desired=withdraw||manual||destination===ship.landing? .15:Math.max(.3,range*.8);
 // Transports stop at their chosen beach. Escorts keep their weapon range offshore.
 const arrival=(destination===ship.landing||withdraw||manual)?.15:desired;
 const goal=destination;
 if(ship.detour14&&Math.sign(goal.x-ship.x)!==ship.detour14.direction)ship.detour14=null;
 if(ship.detour14){while(ship.detour14.points.length&&distance(ship,ship.detour14.points[0])<.22)ship.detour14.points.shift();if(!ship.detour14.points.length)ship.detour14=null;}
 if(!ship.detour14&&((ship.x<-6.7&&goal.x>-5.7)||(ship.x>-5.7&&goal.x<-6.7))){
  const ratio=(-6.2-ship.x)/(goal.x-ship.x),crossY=ship.y+(goal.y-ship.y)*ratio;
  if(crossY>3.05&&crossY<5.85){const direction=Math.sign(goal.x-ship.x),side=ship.y<4.45?2.95:5.95;ship.detour14={direction,points:[{x:direction>0?-7.1:-5.3,y:side},{x:direction>0?-5.3:-7.1,y:side}]};}
 }
 if(ship.detour14)destination=ship.detour14.points[0];
 let dx=destination.x-ship.x,dy=destination.y-ship.y,gap=Math.hypot(dx,dy);
 const stop=ship.detour14?.15:arrival;
 if(gap>stop){const stride=Math.min(ship.speed*step,gap-stop);dx=dx/gap*stride;dy=dy/gap*stride;}else{dx=0;dy=0;if(manual&&!ship.detour14)ship.command=null;}
 for(const other of units.filter(u=>u.naval&&u.hp>0&&u.id!==ship.id)){const d=distance(ship,other);if(d>.01&&d<.8){dx+=(ship.x-other.x)/d*.035;dy+=(ship.y-other.y)/d*.035;}}
 // Waypoints clear the shoal completely before returning to the landing lane.
 const x=Math.max(-12,Math.min(-2.4,ship.x+dx)),y=Math.max(-2,Math.min(11,ship.y+dy));ship.vx=(x-ship.x)/step;ship.vy=(y-ship.y)/step;ship.x=x;ship.y=y;
 if(Math.hypot(ship.vx,ship.vy)>.005){const desired=Math.atan2(ship.vy,ship.vx),delta=Math.atan2(Math.sin(desired-ship.heading),Math.cos(desired-ship.heading));ship.heading+=Math.max(-.2,Math.min(.2,delta));}
 if(!target||withdraw||distance(ship,target)>range||time<ship.nextAttack)return null;
 ship.nextAttack=time+ship.cooldown*(time<(ship.volleyUntil||0)?.5:1);const damage=ship.damage*(target.building&&ship.kind==='bombard'?1.5:1);
 return {target,damage,splash:ship.kind==='bombard'?enemies.filter(u=>u.id!==target.id&&distance(u,target)<1.1).map(unit=>({unit,damage:damage*.3})):[],shot:{x:ship.x,y:ship.y,tx:target.x,ty:target.y,side:ship.side,kind:'naval',navalVersion:4,sourceId:ship.id,targetId:target.id,impact:target.naval?'ship':target.building?'structure':'troop',heading:Math.atan2(target.y-ship.y,target.x-ship.x)}};
}
function SWSeaObjective14(input,units){
 const keep=units.find(u=>u.kind==='keep'&&u.building),enemies=units.filter(u=>u.naval&&u.side==='defend'&&u.hp>0),convoy=units.find(u=>u.id==='relief-convoy');
 if(input.seaMode==='convoy')return {won:!!convoy&&convoy.hp>0&&convoy.y>=9.9,failed:!convoy||convoy.hp<=0,label:'Protect the relief convoy',progress:convoy?Math.round(Math.max(0,(convoy.y+1)/11)*100):0,escortHealth:convoy?Math.max(0,convoy.hp/convoy.maxHp):0};
 const landed=units.some(u=>u.side==='attack'&&!u.naval&&!u.building&&u.hp>0),ruined=!!keep&&keep.hp<=0;
 const won=ruined&&landed&&(input.seaMode!=='blockade'||enemies.length===0);
 return {won,failed:false,label:ruined&&!landed?'Land troops to secure the keep':input.seaMode==='blockade'?'Break the blockade and capture the keep':'Capture the coastal keep',progress:keep?Math.min(won?100:95,Math.round((1-keep.hp/keep.maxHp)*100)):0,enemyShips:enemies.length,landingRequired:!landed};
}
function Fu(state,kind,index,input,result,ranked=true,now=Date.now()){
 if(kind!=='sea')return SWLegacyFu13(state,kind,index,input,result,ranked,now);
 const chapter=SWSeaChapters14[index];if(!chapter)throw Error('Sea campaign not found.');
 if(!result.won)return {gold:0,wood:0,stone:0,food:0};
 const first=state.seaCampaign===index;if(index>state.seaCampaign)throw Error('Complete the earlier sea campaign first.');
 if(first){state.seaCampaign++;state.gems+=chapter.gems;state.rating+=20;}state.wins++;
 if(input.commander)Kc(state,input.commander.id,first?50:15);
 return Ll(state,first?chapter.reward:{gold:35,wood:30,stone:15,food:20});
}
