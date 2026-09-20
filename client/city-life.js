// Civic life and coastal defense. Existing saves gain fields lazily, never replacement assets.
Object.assign(Sl, {
  well:{name:'Village well',description:'Fresh water improves every resource producer. Each level adds 2% income, up to 20% across your wells.',cost:{gold:90,wood:35,stone:80,food:25},time:45,unlock:1,max:10,sprite:5,benefit:'+2% all resource income per level'},
  storehouse:{name:'Storehouse',description:'Keep more goods at home and supply the town.',cost:{gold:140,wood:110,stone:60,food:40},time:65,unlock:1,max:10,sprite:6,benefit:'Larger stores with every upgrade'},
  workshop:{name:'Artisan workshop',description:'Craft materials and equip your construction crews. Each level speeds building by 3%, up to 30%.',cost:{gold:180,wood:120,stone:100,food:65},time:85,unlock:2,max:10,sprite:5,benefit:'Craft goods · faster construction'},
  tavern:{name:'Town tavern',description:'A place for residents to gather. Improves request rewards and hosts festivals.',cost:{gold:160,wood:95,stone:65,food:100},time:75,unlock:2,max:10,sprite:6,benefit:'Resident requests · town festivals'}
});
const SWCivicKinds=['well','storehouse','workshop','tavern'];
const SWCityRecipes={
 stone:{name:'Dressed stone',cost:{gold:0,wood:50,stone:0,food:30},reward:{gold:0,wood:0,stone:90,food:0},duration:60},
 goods:{name:'Crafted goods',cost:{gold:0,wood:65,stone:35,food:25},reward:{gold:150,wood:0,stone:0,food:0},duration:90}
};
function SWCivicLevel(state,kind){return state.buildings.filter(b=>b.kind===kind).reduce((sum,b)=>sum+b.level,0);}
function SWCity(state){return state.city||{jobs:0,crafted:0,raidWins:0,raidCount:0,requests:{}};}
function SWCityRequest(state,slot){
 const city=SWCity(state),record=city.requests?.[slot]||{count:0,readyAt:0},index=(slot+record.count)%3;
 const templates=[
  {name:'Meals for the workers',text:'The construction crews need a hot meal.',cost:{gold:0,wood:10,stone:0,food:85},reward:{gold:115,wood:0,stone:20,food:0}},
  {name:'Repair the market carts',text:'Replace the wheels and keep local trade moving.',cost:{gold:0,wood:70,stone:20,food:0},reward:{gold:100,wood:0,stone:0,food:75}},
  {name:'Supplies for new homes',text:'Residents are furnishing their new cottages.',cost:{gold:15,wood:50,stone:25,food:25},reward:{gold:135,wood:0,stone:35,food:0}}
 ];
 const task=templates[index],bonus=1+Math.min(.5,SWCivicLevel(state,'tavern')*.05);
 return {...task,reward:{...task.reward,gold:Math.round(task.reward.gold*bonus)},id:slot+':'+record.count,slot,readyAt:record.readyAt};
}
function SWShipRepairCost(ship){return Object.fromEntries(xl.map(k=>[k,Math.ceil(nl(ship.kind,ship.level)[k]*.35)]));}
function SWCityTick(state,now){
 for(const ship of state.fleet||[])if(ship.repairReadyAt&&ship.repairReadyAt<=now){delete ship.wrecked;delete ship.repairReadyAt;}
}
function SWCityAction(state,action,now){
 if(!['cityRequest','startCraft','collectCraft','festival','repairShip'].includes(action.type))return false;
 state.city={jobs:0,crafted:0,raidWins:0,raidCount:0,requests:{},...state.city};
 const city=state.city;
 if(action.type==='repairShip'){
  const ship=state.fleet.find(s=>s.id===action.id);
  if(!ship?.wrecked||ship.repairReadyAt||ship.combatBattleId)throw Error('Choose a wrecked ship that is not being repaired.');
  if(state.fleet.some(s=>s.readyAt||s.repairReadyAt))throw Error('Your shipwright is already building or repairing a vessel.');
  Q(state,SWShipRepairCost(ship));ship.repairReadyAt=now+Math.ceil(wc[ship.kind].time*(1+.2*(ship.level-1))*.6*(1-SWCivicBonuses(state).repairSpeed))*1000;
 }else if(action.type==='cityRequest'){
  if(!Number.isInteger(action.slot)||action.slot<0||action.slot>2)throw Error('Choose a resident request.');
  const task=SWCityRequest(state,action.slot);
  if(task.id!==action.id||task.readyAt>now)throw Error('A new resident request will arrive shortly.');
  SWRequireRoom(state,task.reward,task.cost);Q(state,task.cost);Ll(state,task.reward);city.jobs++;
  city.requests={...city.requests,[action.slot]:{count:(city.requests?.[action.slot]?.count||0)+1,readyAt:now+60000}};
  if(city.jobs%5===0)state.gems+=3;
 }else if(action.type==='startCraft'){
  const recipe=SWCityRecipes[action.kind];
  if(!recipe||!SWCivicLevel(state,'workshop'))throw Error('Complete an artisan workshop first.');
  if(city.craft)throw Error('Collect the current workshop order first.');
  Q(state,recipe.cost);city.craft={kind:action.kind,readyAt:now+Math.max(20,recipe.duration-SWCivicLevel(state,'workshop')*3)*1000};
 }else if(action.type==='collectCraft'){
  if(!city.craft||city.craft.readyAt>now)throw Error('Your artisans are still working.');
  const recipe=SWCityRecipes[city.craft.kind];if(!recipe)throw Error('Unknown workshop order.');
  if(xl.some(k=>state.resources[k]+recipe.reward[k]>Fl(state)))throw Error('Make room in storage before collecting.');
  Ll(state,recipe.reward);delete city.craft;city.crafted++;
 }else if(action.type==='festival'){
  if(!SWCivicLevel(state,'tavern'))throw Error('Complete a town tavern first.');
  if((city.festivalReadyAt||0)>now)throw Error('Let the town prepare for its next festival.');
  Q(state,{gold:60,wood:0,stone:0,food:180});city.festivalUntil=now+(10+SWCivicBonuses(state).festivalMinutes)*60000;city.festivalReadyAt=now+1200000;
 }
 return true;
}
function SWDefenseInput(state){
 const level=Math.min(10,1+SWCity(state).raidWins),defense=Wl(state),army=wl(),orders=[];
 army.infantry=5+level*2;army.archer=2+level;army.ram=level>=3?Math.floor(level/3):0;
 const bounds=fl(defense),points=[{x:bounds.minX,y:Math.round((bounds.minY+bounds.maxY)/2)},{x:bounds.maxX,y:Math.round((bounds.minY+bounds.maxY)/2)},{x:Math.round((bounds.minX+bounds.maxX)/2),y:bounds.maxY}];
 for(const kind of Object.keys(army))for(let i=0;i<army[kind];i++)orders.push({kind,...points[Math.floor(orders.length/6)%points.length],time:Math.floor(orders.length/6)*4});
 return {defense,army,orders,bonus:1,front:'center',rulesVersion:4,combatVersion:12,presentationVersion:12,healerTacticsVersion:1,troopAbilitiesVersion:1,unitLevels:Object.fromEntries(Object.keys(J).map(k=>[k,Math.max(1,Math.ceil(level/2))])),seed:(state.revision*7919+level*131)>>>0,defenseRaidLevel:level,defenseEconomyVersion:2};
}
function SWResolveDefense(state,input,result,now=Date.now()){
 const city=state.city={jobs:0,crafted:0,raidWins:0,raidCount:0,requests:{},...state.city};
 const won=!result.won,level=input.defenseRaidLevel||1;
 const loot=input.defenseEconomyVersion===2?SWRaidLoot(state,result):{gold:won?0:Math.min(150,Math.floor(state.resources.gold*.05)),wood:0,stone:0,food:0};
 for(const k of xl)state.resources[k]-=loot[k];
 const reward=won?Ll(state,{gold:120+level*45,wood:35+level*15,stone:40+level*20,food:30+level*10}):{gold:0,wood:0,stone:0,food:0};
 city.raidCount++;if(won){city.raidWins++;state.gems+=2;}city.raidReadyAt=now+300000;
 return {won,reward,lost:Object.values(loot).reduce((a,b)=>a+b,0),loot};
}
Dl.push(
 {id:'civic_water',title:'Water for everyone',description:'Complete your first village well.',icon:'users',target:1,value:s=>SWCivicLevel(s,'well'),reward:{gold:80,wood:25,stone:45,food:30}},
 {id:'helping_hands',title:'Helping hands',description:'Complete five resident requests.',icon:'users',target:5,value:s=>SWCity(s).jobs,reward:{gold:150,wood:60,stone:60,food:60}},
 {id:'artisan',title:'Made in Havencrest',description:'Collect three workshop orders.',icon:'hammer',target:3,value:s=>SWCity(s).crafted,reward:{gold:160,wood:80,stone:80,food:0}},
 {id:'hold_the_line',title:'Hold the line',description:'Repel your first computer raid.',icon:'shield',target:1,value:s=>SWCity(s).raidWins,reward:{gold:180,wood:60,stone:100,food:60}},
 {id:'frontier_provinces',title:'A wider world',description:'Capture your first province.',icon:'flag',target:1,value:s=>s.provinces?.length||0,reward:{gold:120,wood:100,stone:80,food:40}}
);
function SWCityDialog({open,onClose,state,act,busy,onBuild,onDefense}){
 const [tab,setTab]=C.useState('Residents'),city=SWCity(state),now=Date.now();
 const button=(label,click,disabled=false,cls='secondary')=>swElement('button',{className:cls,onClick:click,disabled:busy||disabled},label);
 const cost=(value)=>swElement(cu,{cost:value});
 const card=(title,body,children)=>swElement('section',{className:'sw-city-card',key:title},swElement('h3',null,title),swElement('p',{className:'sw-muted'},body),children);
 const tabs=['Residents','Infrastructure','Defense'];
 return swElement(SWDialog,{open,onClose,title:'Your city',subtitle:'A living home for your people',className:'sw-city-dialog'},
  swElement('nav',{className:'sw-tabs','aria-label':'City sections'},tabs.map(t=>button(t,()=>setTab(t),false,tab===t?'selected':''))),
  tab==='Residents'&&swElement('div',{className:'sw-city-stack'},
   swElement('div',{className:'sw-city-summary'},city.jobs+' requests fulfilled · '+city.crafted+' goods crafted',swElement('small',null,'Every fifth resident request also earns 3 gems.')),
   [0,1,2].map(slot=>{const task=SWCityRequest(state,slot),wait=Math.max(0,task.readyAt-now);return card(task.name,task.text,[cost(task.cost),swElement('div',{className:'sw-city-reward',key:'reward'},'Earn ',swElement(zu,{reward:task.reward})),button(wait?'New request in '+Qc(wait/1000):!SWCanReceive(state,task.reward,task.cost)?'Make room in storage':'Deliver supplies',()=>act({type:'cityRequest',slot,id:task.id},'Residents supplied'),wait>0||!Z(state,task.cost)||!SWCanReceive(state,task.reward,task.cost),'primary')]);}),
   SWCivicLevel(state,'workshop')?card('Artisan orders','Turn surplus materials into useful goods.',city.craft?[swElement('strong',{key:'current'},SWCityRecipes[city.craft.kind].name),button(city.craft.readyAt>now?'Ready in '+Qc((city.craft.readyAt-now)/1000):'Collect crafted goods',()=>act({type:'collectCraft'},'Crafting complete'),city.craft.readyAt>now,'primary')]:Object.entries(SWCityRecipes).map(([id,r])=>swElement('div',{className:'sw-city-recipe',key:id},swElement('strong',null,r.name),cost(r.cost),swElement(zu,{reward:r.reward}),button('Craft · '+Qc(Math.max(20,r.duration-SWCivicLevel(state,'workshop')*3)),()=>act({type:'startCraft',kind:id},'Artisans are at work'),!Z(state,r.cost))))):card('Open an artisan workshop','Craft stone and trade goods while your army is at home.',button('Build workshop',()=>onBuild('workshop'),Ml(state)<2)),
   card('Town festival',city.festivalUntil>now?'The festival is active. All resource income is 15% higher.':'Share a meal and music in the square. +15% resource income for 10 minutes.',[cost({gold:60,wood:0,stone:0,food:180}),button(!SWCivicLevel(state,'tavern')?'Build a tavern':city.festivalReadyAt>now?'Next festival in '+Qc((city.festivalReadyAt-now)/1000):'Host a festival',()=>SWCivicLevel(state,'tavern')?act({type:'festival'},'The festival has begun'):onBuild('tavern'),!!SWCivicLevel(state,'tavern')&&((city.festivalReadyAt||0)>now||!Z(state,{gold:60,wood:0,stone:0,food:180})))])
  ),
  tab==='Infrastructure'&&swElement('div',{className:'sw-city-stack'},SWCivicKinds.map(kind=>card(Sl[kind].name,Sl[kind].description,[swElement('strong',{key:'benefit'},Sl[kind].benefit),cost(X(kind)),button(SWBuildingCount(state,kind)>=SWBuildingLimit(state,kind)?'Building limit reached':'Build '+Sl[kind].name.toLowerCase(),()=>onBuild(kind),Ml(state)<Sl[kind].unlock||SWBuildingCount(state,kind)>=SWBuildingLimit(state,kind))]))),
  tab==='Defense'&&swElement('div',{className:'sw-city-stack'},
   card('Coastal raiders · wave '+Math.min(10,1+city.raidWins),'Computer enemies attack your actual streets, walls, towers and keep. A stronger layout protects the town and earns a larger bounty.',[
    swElement('div',{className:'sw-city-summary',key:'stats'},city.raidWins+' raids repelled · '+state.buildings.filter(b=>zc(b)&&b.level).length+' wall segments · '+state.buildings.filter(b=>Cc.includes(b.kind)&&b.level).length+' defenses'),
    swElement('p',{className:'sw-muted',key:'risk'},'Protect your stores: 20% of storage capacity is secured. Raiders can steal up to 18% of exposed gold, timber, stone and food, depending on destruction. Holding the Keep earns a bounty and 2 gems. Buildings recover and your home army stays intact. Start a raid when ready.'),
    button((city.raidReadyAt||0)>now?'Scouts return in '+Qc((city.raidReadyAt-now)/1000):'Defend my city',onDefense,!!state.activeBattle||(city.raidReadyAt||0)>now,'primary'),
    button('Build defenses',()=>onBuild('tower'))
   ]),
   card('Beyond the medieval kingdom','Playable upgrades currently stop at level 10.',swElement('p',{className:'sw-muted'},'Planned ages: 10–20 gunpowder, 20–30 industrial and early 1900s, 30–40 modern, 40–50 future. These later ages are not built yet.'))
  )
 );
}
// End civic life.
