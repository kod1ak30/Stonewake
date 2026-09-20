// Premium progression v12. Pure rules shared by local play and the authoritative service.
const SWPremiumCatalog=[
 {id:'palette:coastal',slot:'palette',value:'coastal',category:'appearance',name:'Havencrest blue',description:'Weathered granite, blue cloth and warm timber.',priceGems:0,starter:true,preview:'#4a84bc'},
 {id:'palette:ember',slot:'palette',value:'ember',category:'appearance',name:'Ember coast',description:'Terracotta accents and crimson cloth.',priceGems:80,preview:'#b7553e'},
 {id:'palette:forest',slot:'palette',value:'forest',category:'appearance',name:'Verdant realm',description:'Deep green cloth and garden tones.',priceGems:80,preview:'#4e8765'},
 {id:'palette:ivory',slot:'palette',value:'ivory',category:'appearance',name:'Pearl harbor',description:'Ivory cloth with brass and ocean-blue accents.',priceGems:120,collectionId:'mariner',preview:'#e3d7b6'},
 {id:'banner:blue',slot:'banner',value:'blue',category:'banners',name:'Founding blue',description:'The original colors of Havencrest.',priceGems:0,starter:true,preview:'#4c86d5'},
 {id:'banner:red',slot:'banner',value:'red',category:'banners',name:'Ironward crimson',description:'A red standard for a steadfast city.',priceGems:35,preview:'#b34e4d'},
 {id:'banner:green',slot:'banner',value:'green',category:'banners',name:'Vale green',description:'Green standards inspired by the frontier.',priceGems:35,preview:'#568660'},
 {id:'banner:ivory',slot:'banner',value:'ivory',category:'banners',name:'Admiral ivory',description:'Pale pennants with a golden edge.',priceGems:60,collectionId:'mariner',preview:'#e9dbae'},
 {id:'sail:linen',slot:'sail',value:'linen',category:'sails',name:'Working linen',description:'Natural canvas for the home fleet.',priceGems:0,starter:true,preview:'#d4c2a0'},
 {id:'sail:blue',slot:'sail',value:'blue',category:'sails',name:'Azure fleet',description:'Ocean-blue sails with bright trim.',priceGems:65,collectionId:'mariner',preview:'#467fc0'},
 {id:'sail:red',slot:'sail',value:'red',category:'sails',name:'Crimson fleet',description:'Scarlet canvas for a striking arrival.',priceGems:65,collectionId:'royal',preview:'#b34641'},
 {id:'sail:black',slot:'sail',value:'black',category:'sails',name:'Nightwatch sails',description:'Dark sails earned by breaking the blockade.',priceGems:null,unlockLabel:'Complete The Broken Beacon',preview:'#243640'},
 {id:'road:earth',slot:'road',value:'earth',category:'roads',name:'Packed earth',description:'A practical route through the settlement.',priceGems:0,starter:true,preview:'#a68f64'},
 {id:'road:stone',slot:'road',value:'stone',category:'roads',name:'Harbor cobbles',description:'Dressed stone for your working streets.',priceGems:70,collectionId:'mariner',preview:'#9aafa9'},
 {id:'road:royal',slot:'road',value:'royal',category:'roads',name:'Royal paving',description:'Pale paving with warm decorative borders.',priceGems:100,collectionId:'royal',preview:'#c8b47e'},
 {id:'commander:standard',slot:'commander',value:'standard',category:'outfits',name:'Field equipment',description:'The commanders in their familiar equipment.',priceGems:0,starter:true,preview:'#7b9db6'},
 {id:'commander:laurel',slot:'commander',value:'laurel',category:'outfits',name:'Laurel honors',description:'Ceremonial gold details for your commander.',priceGems:90,collectionId:'royal',preview:'#d8b761'},
 {id:'commander:veteran',slot:'commander',value:'veteran',category:'outfits',name:'Veteran mantle',description:'A campaign mantle earned through mastery trials.',priceGems:null,unlockLabel:'Complete all three mastery trials',preview:'#8ca4a9'},
 {id:'ornament:lantern',slot:'ornament',value:'lantern',category:'monuments',name:'Harbor lantern',description:'Place up to twelve warm lanterns around your town.',priceGems:40,collectionId:'founder',preview:'#edc975'},
 {id:'ornament:standard',slot:'ornament',value:'standard',category:'monuments',name:'Realm standard',description:'Place your colors at a district entrance.',priceGems:30,collectionId:'founder',preview:'#638fd1'},
 {id:'ornament:planter',slot:'ornament',value:'planter',category:'monuments',name:'Stone planters',description:'Bring planted color to your streets and squares.',priceGems:40,collectionId:'founder',preview:'#8baa72'},
 {id:'ornament:statue',slot:'ornament',value:'statue',category:'monuments',name:'Beacon guardian',description:'A permanent monument to the people of the coast.',priceGems:null,unlockLabel:'Complete The Broken Beacon',preview:'#b0b9ac'}
];
const SWPremiumCollections=[
 {id:'mariner',name:'Mariner collection',description:'Pearl cloth, azure sails and a cobbled waterfront.',productId:'com.chrismozer.stonewake.collection.mariner',items:['palette:ivory','banner:ivory','sail:blue','road:stone']},
 {id:'royal',name:'Royal collection',description:'Crimson sails, royal paving and laurel honors.',productId:'com.chrismozer.stonewake.collection.royal',items:['sail:red','road:royal','commander:laurel']},
 {id:'founder',name:'Citymaker collection',description:'Reusable lanterns, standards and planters for your city.',productId:'com.chrismozer.stonewake.collection.founder',items:['ornament:lantern','ornament:standard','ornament:planter']}
];
const SWPremiumDefaults={palette:'palette:coastal',banner:'banner:blue',road:'road:earth',sail:'sail:linen',commander:'commander:standard'};
function SWPremium(state){
 const old=state.premium||{};
 return {...old,version:12,owned:[...new Set([...Object.values(SWPremiumDefaults),...(Array.isArray(old.owned)?old.owned:[])])],sources:old.sources||{},equipped:{...SWPremiumDefaults,...old.equipped},ornaments:Array.isArray(old.ornaments)?old.ornaments:[],chapter:{completed:[],claimed:[],records:{},...old.chapter},trials:old.trials||{},stories:old.stories||{},events:old.events||{},seenScenes:Array.isArray(old.seenScenes)?old.seenScenes:[]};
}
function SWMigratePremium(state){state.premium=SWPremium(state);return state.premium;}
function SWOwnCosmetic(state,id,source='earned'){
 const item=SWPremiumCatalog.find(i=>i.id===id);if(!item)throw Error('This appearance is unavailable.');
 const p=SWMigratePremium(state);if(p.owned.includes(id)&&!p.sources[id])p.sources[id]=['legacy'];if(!p.owned.includes(id))p.owned.push(id);
 p.sources[id]=[...new Set([...(p.sources[id]||[]),source])];
}
function SWGrantCollection(state,id,sourceId='store:'+id){
 const collection=SWPremiumCollections.find(c=>c.id===id);if(!collection)throw Error('Unknown collection.');
 for(const itemId of collection.items)SWOwnCosmetic(state,itemId,'collection:'+id+':'+sourceId);
 return collection.items;
}
function SWRevokeCollection(state,id,sourceId){
 const collection=SWPremiumCollections.find(c=>c.id===id);if(!collection)throw Error('Unknown collection.');
 const p=SWMigratePremium(state),prefix='collection:'+id+':';
 for(const itemId of collection.items){
  const sources=p.sources[itemId];
  // Older independently owned items have no purchase source and must survive refunds.
  if(!sources)continue;
  p.sources[itemId]=sources.filter(s=>sourceId?s!==prefix+sourceId:!s.startsWith(prefix));
  if(!p.sources[itemId].length){p.owned=p.owned.filter(i=>i!==itemId);for(const slot of Object.keys(p.equipped))if(p.equipped[slot]===itemId)p.equipped[slot]=SWPremiumDefaults[slot];p.ornaments=p.ornaments.filter(o=>o.itemId!==itemId);}
 }
}
function SWCosmeticStatus(state,id){
 const item=SWPremiumCatalog.find(i=>i.id===id);if(!item)throw Error('Choose an appearance.');
 const p=SWPremium(state),owned=p.owned.includes(id),equipped=p.equipped[item.slot]===id;
 const reason=owned?null:item.priceGems===null?item.unlockLabel:(state.gems||0)<item.priceGems?'More gems needed':null;
 return {owned,equipped,canBuy:!owned&&!reason,reason,priceGems:item.priceGems,unlockLabel:item.unlockLabel||null};
}
function SWAppearance(state,previewId){
 const p=SWPremium(state),equipped={...p.equipped},item=SWPremiumCatalog.find(i=>i.id===previewId);
 if(item&&item.slot!=='ornament')equipped[item.slot]=item.id;
 const result={};for(const [slot,id]of Object.entries(SWPremiumDefaults)){const picked=SWPremiumCatalog.find(i=>i.id===equipped[slot]&&i.slot===slot&&(p.owned.includes(i.id)||i.id===previewId))||SWPremiumCatalog.find(i=>i.id===id);result[slot]=picked.value;}
 result.ornaments=p.ornaments.filter(o=>p.owned.includes(o.itemId)).map(o=>({...o,kind:SWPremiumCatalog.find(i=>i.id===o.itemId)?.value||o.kind}));
 if(item?.slot==='ornament')result.ornaments=[...result.ornaments,{id:'preview',itemId:item.id,kind:item.value,x:4,y:6,facing:0,preview:true}];
 const done=p.chapter.completed;result.landmark={kind:'lighthouse',stage:done.includes('blockade')?3:done.includes('escort')?2:done.includes('causeway')?1:0,x:-1,y:7};
 result.festival=(state.city?.festivalUntil||0)>(state.lastTick||0);result.tradeOpen=done.includes('escort');return result;
}
const SWChapterMissions=[
 {id:'survey',title:'The silent beacon',summary:'Elowen has found a signal tower above the abandoned landing.',characterId:'ranger',keep:1,type:'city',objective:'Supply a coastal survey.',cost:{gold:0,wood:0,stone:0,food:40},reward:{resources:{gold:60,wood:80,stone:30,food:0},gems:5},storyBefore:[{speaker:'Elowen Vale',text:'No smoke on the horizon. No bell from the beacon. Someone wants this coast forgotten.'}],storyAfter:[{speaker:'Elowen Vale',text:'The tower is sound. Its light was taken apart, piece by piece. We can bring it home.'}]},
 {id:'causeway',title:'A road to the sea',summary:'Reconnect the Keep and waterfront before the repair crews arrive.',characterId:'engineer',keep:2,type:'city',objective:'Connect your Keep to the shipyard through the coastal promenade.',cost:{gold:60,wood:80,stone:60,food:50},reward:{resources:{gold:90,wood:100,stone:60,food:0},gems:8},storyBefore:[{speaker:'Bram Flint',text:'A fine harbor is useless if every cart loses a wheel getting there. Give us a proper road.'}],storyAfter:[{speaker:'Mara Ironward',text:'The first crew is waiting at the landing. For the first time in years, this feels like a way home.'}]},
 {id:'rescue',title:'The missing shipwrights',summary:'Free Bram’s crew from Greyhaven and escort their engineer to safety.',characterId:'captain',keep:3,type:'battle',objective:'Break the prison, then protect the engineer until he reaches the western exit.',reward:{resources:{gold:160,wood:120,stone:80,food:60},gems:10},storyBefore:[{speaker:'Mara Ironward',text:'Break the holding house, then cover their retreat. These people are builders, not soldiers.'},{speaker:'Bram Flint',text:'Bring my crew back, Captain. I still owe them a roof that does not leak.'}],storyAfter:[{speaker:'Bram Flint',text:'All accounted for. Now let us build something the admiral cannot steal.'}]},
 {id:'escort',title:'Through the chain',summary:'Bring the beacon lens through a defended sea lane.',characterId:'engineer',keep:3,type:'battle',objective:'Destroy the coastal battery and keep the repair vessel alive until it reaches the harbor.',reward:{resources:{gold:180,wood:120,stone:100,food:60},gems:12},storyBefore:[{speaker:'Bram Flint',text:'That ship carries the only lens left on the coast. Silence the shore battery before it enters the channel.'},{speaker:'Admiral Veyr',text:'A light in your harbor is a challenge to my fleet. Consider what you are asking for.'}],storyAfter:[{speaker:'Mara Ironward',text:'The lens is ashore. The merchants saw us do it. They will remember.'}]},
 {id:'harbor',title:'Hold the harbor',summary:'Veyr sends raiders against the city you have built.',characterId:'captain',keep:4,type:'battle',objective:'Keep your own Keep standing against the warned assault.',reward:{resources:{gold:220,wood:100,stone:120,food:70},gems:12},storyBefore:[{speaker:'Mara Ironward',text:'We know their route. Put your walls and towers to work. I will bring everyone inside.'}],storyAfter:[{speaker:'Mara Ironward',text:'They came for an easy victory. They found a city that stands together.'}]},
 {id:'blockade',title:'The Broken Beacon',summary:'Defeat Veyr’s flagship and seize the signal fort to reopen the coast.',characterId:'engineer',keep:5,type:'battle',objective:'Destroy the flagship and capture the signal Keep.',reward:{resources:{gold:350,wood:180,stone:160,food:100},gems:20,cosmetics:['sail:black','ornament:statue']},storyBefore:[{speaker:'Elowen Vale',text:'His fleet has gathered beneath the signal fort. Cut off its orders and the blockade will break.'},{speaker:'Admiral Veyr',text:'You may light one beacon. There are older powers watching this sea.'}],storyAfter:[{speaker:'Bram Flint',text:'There. A little glass, a little fire, and the whole coast can find its way.'},{speaker:'Mara Ironward',text:'Let them see us. Havencrest is here to stay.'}]}
];
function SWMissionRequirements(state,mission){
 const p=SWPremium(state),index=SWChapterMissions.findIndex(m=>m.id===mission.id),requirements=[{label:'Keep level '+mission.keep,met:Ml(state)>=mission.keep,action:'building',buildKind:'keep'}];
 if(index>0)requirements.push({label:'Complete '+SWChapterMissions[index-1].title,met:p.chapter.claimed.includes(SWChapterMissions[index-1].id),action:'chronicle'});
 if(mission.id==='causeway')requirements.push({label:'Complete a shipyard',met:state.buildings.some(b=>b.kind==='harbor'&&b.level>0),action:'build',buildKind:'harbor'},{label:'A road from the Keep to your shipyard',met:state.buildings.some(b=>b.kind==='harbor'&&SWLandStats(state).connectedIds.includes(b.id)),action:'plan'});
 return requirements;
}
function SWChapter(state){
 const p=SWPremium(state);
 return {id:'broken-beacon',title:'The Broken Beacon',description:'Restore the light. Reopen the coast. Bring your people home.',completed:p.chapter.completed.length,claimed:!!p.chapter.finaleClaimed,missions:SWChapterMissions.map(m=>{const requirements=SWMissionRequirements(state,m),status=p.chapter.claimed.includes(m.id)?'complete':p.chapter.completed.includes(m.id)?'claimable':requirements.every(r=>r.met)?'available':'locked';return {...m,status,requirements,record:p.chapter.records[m.id]||null};})};
}
const SWTrialDefinitions=[
 {id:'swift-rescue',missionId:'rescue',title:'The narrow window',description:'Rescue the engineer in 32 seconds or less.',objective:'Rescue in 32 seconds',reward:{gems:8}},
 {id:'safe-passage',missionId:'escort',title:'Safe passage',description:'Deliver the repair vessel with at least 60% of its hull intact.',objective:'Save 60% of the repair vessel’s hull',reward:{gems:8}},
 {id:'decisive-strike',missionId:'blockade',title:'Decisive strike',description:'Break the blockade in 45 seconds with at least half your expedition alive.',objective:'Win within 45 seconds; preserve half the army',reward:{gems:12}}
];
function SWTrials(state){const p=SWPremium(state);return SWTrialDefinitions.map(t=>({...t,status:p.trials[t.id]?.completed?'complete':p.chapter.completed.includes(t.missionId)?'available':'locked',best:p.trials[t.id]||null,reason:p.chapter.completed.includes(t.missionId)?null:'Complete the story mission first.'}));}
function SWSagaDefense(id){
 const spec=SWChapterMissions.find(m=>m.id===id);if(!spec||spec.type!=='battle')throw Error('Choose a battle mission.');
 const buildings=[],add=(id,kind,x,y,level=1)=>buildings.push({id,kind,x,y,level,facing:0});
 add('signal-keep','keep',6,3,id==='blockade'?3:1);add('dock','harbor',-1,2,1);add('stores','storehouse',5,5,1);add('quarters','cottage',7,5,1);
 if(id==='rescue'){add('prison','cottage',3,3,1);add('east-watch','tower',6,1,2);add('exit-watch','tower',1,4,2);add('gate-north','gate',3,1,1);add('wall-a','wall',4,1,1);add('wall-b','wall',5,1,1);}
 if(id==='escort'){add('shore-battery','tower',0,0,2);add('watch','tower',4,2,1);add('barracks','barracks',6,5,1);}
 if(id==='blockade'){add('shore-battery','tower',0,0,3);add('mortar','mortar',5,2,2);add('watch','tower',7,1,2);for(let y=1;y<=5;y++)if(y!==3)add('wall-'+y,'wall',3,y,2);add('sea-gate','gate',3,3,2);}
 return {name:id==='rescue'?'Greyhaven holding':id==='escort'?'The chain passage':'Veyr’s signal fort',level:id==='blockade'?4:2,rating:100,buildings};
}
function SWMissionScout(state,id,trialId){
 const mission=SWChapter(state).missions.find(m=>m.id===id);if(!mission||mission.type!=='battle')throw Error('Choose a battle mission.');
 const input=SWSagaInput(state,id,trialId||false,state.lastTick||Date.now());
 return {kind:trialId?'trial':'saga',missionId:id,trialId:trialId||undefined,fixedArmy:true,name:input.defense.name,defense:input.defense,title:mission.title,objective:input.saga.label,army:input.army,mission,previewInput:input};
}
function SWSagaInput(state,id,trial=false,now=Date.now()){
 const mission=SWChapter(state).missions.find(m=>m.id===id);if(!mission||mission.type!=='battle')throw Error('Choose a battle mission.');
 if(mission.status==='locked')throw Error(mission.requirements.find(r=>!r.met)?.label||'Mission unavailable.');
 const trialDef=trial?SWTrialDefinitions.find(t=>t.id===trial||trial===true&&t.missionId===id):null;
 if(trial&&(!trialDef||trialDef.missionId!==id||!SWPremium(state).chapter.completed.includes(id)))throw Error('Complete this mission before its trial.');
 if(id==='harbor'){
  const input=SWDefenseInput(state);input.orders=input.orders.map(o=>({...o,time:o.time*.65}));
  return {...input,saga:{version:12,missionId:id,mode:'hold',label:mission.objective,holdSeconds:90,trialId:null},combatVersion:12,presentationVersion:12};
 }
 const level=id==='blockade'?4:2,army={...wl(),infantry:id==='blockade'?8:5,archer:5,shieldbearer:3,healer:2,ram:1,...(id==='blockade'?{trebuchet:2,crossbow:2}:{})};
 return {defense:SWSagaDefense(id),appearance:SWAppearance(state),army,orders:[],bonus:1.2,front:'center',rulesVersion:4,combatVersion:12,presentationVersion:12,healerTacticsVersion:1,troopAbilitiesVersion:1,navalVersion:3,navalSupport:id==='rescue'?undefined:{id:'expedition',kind:id==='blockade'?'bombard':'galley',level:id==='blockade'?5:3},enemyNavy:id==='rescue'?[]:[{id:'flagship',kind:id==='blockade'?'bombard':'galley',level:id==='blockade'?3:1}],unitLevels:Object.fromEntries(Object.keys(J).map(k=>[k,level])),commander:{id:id==='blockade'?'engineer':'captain',level:level,gear:'armor'},seed:120031+SWChapterMissions.findIndex(m=>m.id===id)*7919,saga:{version:12,missionId:id,mode:id==='rescue'?'rescue':id==='escort'?'escort':'blockade',label:trialDef?.objective||mission.objective,trialId:trialDef?.id||null},createdAt:now};
}
function SWSagaSpawn(input){
 if(input.saga?.mode!=='escort')return null;
 const ship=SWCreateNavalUnit({id:'repair-vessel',kind:'galley',level:2},'attack');
 return {...ship,id:'saga-escort',shipId:'repair-vessel',sagaEscort:true,x:-3.5,y:5,hp:420,maxHp:420,damage:0,speed:.16,nextAttack:Infinity};
}
function SWSagaStep(input,units,time){
 const saga=input.saga;if(!saga)return;
 if(saga.mode==='rescue'&&!units.some(u=>u.id==='saga-escort')&&units.some(u=>u.id==='prison'&&u.hp<=0))units.push({id:'saga-escort',kind:'worker',sagaEscort:true,side:'attack',x:3,y:3,hp:240,maxHp:240,speed:.45,damage:0,range:0,cooldown:2,nextAttack:Infinity,level:1,building:false});
 const escort=units.find(u=>u.id==='saga-escort');if(!escort||escort.hp<=0||escort.rescued)return;
 if(saga.mode==='escort'&&units.some(u=>u.id==='shore-battery'&&u.hp>0)){escort.waitingForBattery=true;return;}delete escort.waitingForBattery;
 const target=saga.mode==='rescue'?{x:-2,y:3}:{x:-3.5,y:-1.1},dx=target.x-escort.x,dy=target.y-escort.y,d=Math.hypot(dx,dy),step=Math.min(d,escort.speed*.25);
 escort.vx=d?dx/d*escort.speed:0;escort.vy=d?dy/d*escort.speed:0;escort.heading=Math.atan2(dy,dx);
 if(d){escort.x+=dx/d*step;escort.y+=dy/d*step;}
 if(d<.12){escort.x=target.x;escort.y=target.y;escort.rescued=true;escort.vx=0;escort.vy=0;}
}
function SWSagaObjective(input,units,time,finished=false){
 const saga=input.saga;if(!saga)return null;
 const escort=units.find(u=>u.id==='saga-escort'),keep=units.find(u=>u.kind==='keep'&&u.building),flagship=units.find(u=>u.shipId==='flagship'),battery=units.find(u=>u.id==='shore-battery');
 let won=false,failed=false,progress=0,label=saga.label;
 if(saga.mode==='hold'){failed=!!keep&&keep.hp<=0;won=!failed&&(time>=saga.holdSeconds||finished);progress=Math.min(1,time/saga.holdSeconds);label=failed?'The Keep has fallen':Math.max(0,Math.ceil(saga.holdSeconds-time))+'s · Hold the Keep';}
 if(saga.mode==='rescue'){won=!!escort?.rescued&&escort.hp>0;failed=!!escort&&escort.hp<=0;progress=escort?Math.min(1,Math.max(0,(3-escort.x)/5)):0;label=failed?'The engineer was lost':escort?'Protect the engineer · '+Math.round(progress*100)+'% to safety':'Break the holding house';}
 if(saga.mode==='escort'){won=!!escort?.rescued&&escort.hp>0;failed=!!escort&&escort.hp<=0;progress=escort?Math.min(1,Math.max(0,(5-escort.y)/6.1)):0;label=failed?'The repair vessel was lost':battery?.hp>0?'Silence the shore battery':'Protect the repair vessel · '+Math.round(progress*100)+'%';}
 if(saga.mode==='blockade'){won=!!keep&&keep.hp<=0&&!!flagship&&flagship.hp<=0;progress=(+(keep?.hp<=0)+ +(flagship?.hp<=0))/2;label=(keep?.hp<=0?'Signal fort captured':'Capture the signal fort')+' · '+(flagship?.hp<=0?'Flagship sunk':'Sink the flagship');}
 const health=escort?Math.max(0,escort.hp/escort.maxHp):null;
 if(input.retreatAt!==undefined&&time>=input.retreatAt){won=false;failed=true;label='Expedition withdrawn';}
 if(won&&saga.trialId){const alive=units.filter(u=>u.side==='attack'&&!u.building&&!u.naval&&u.kind!=='hero'&&!u.sagaEscort&&u.hp>0).length;
  const pass=saga.trialId==='swift-rescue'?time<=32:saga.trialId==='safe-passage'?health>=.6:time<=45&&alive>=Nl(input.army)/2;
  if(!pass){won=false;failed=true;label='Objective secured · mastery condition missed';}}
 return {missionId:saga.missionId,mode:saga.mode,label,won,failed,complete:won||failed,progress,escortHealth:health,trialId:saga.trialId};
}
function SWSagaSettle(state,input,result,now=Date.now()){
 if(input.saga?.version!==12||!SWChapterMissions.some(m=>m.id===input.saga.missionId&&m.type==='battle'))throw Error('Invalid expedition.');
 const p=SWMigratePremium(state),id=input.saga.missionId,record=p.chapter.records[id]||{},objective=result.objective;
 if(!objective||objective.missionId!==id)throw Error('Expedition result is missing its objective.');
 const won=!!result.won&&!!objective.won;
 const reward={gold:0,wood:0,stone:0,food:0};
 if(input.saga.trialId){const trial=SWTrialDefinitions.find(t=>t.id===input.saga.trialId&&t.missionId===id);if(!trial)throw Error('Invalid mastery trial.');const prior=p.trials[trial.id]||{};if(won){p.trials[trial.id]={completed:true,bestSeconds:Math.min(prior.bestSeconds||Infinity,result.duration),completedAt:prior.completedAt||now};if(!prior.completed)state.gems=(state.gems||0)+trial.reward.gems;if(SWTrialDefinitions.every(t=>p.trials[t.id]?.completed))SWOwnCosmetic(state,'commander:veteran','mastery');}return {reward,won,trialId:trial.id,firstClear:won&&!prior.completed};}
 if(won){if(!p.chapter.completed.includes(id))p.chapter.completed.push(id);p.chapter.records[id]={...record,completedAt:record.completedAt||now,bestSeconds:Math.min(record.bestSeconds||Infinity,result.duration),stars:Math.max(record.stars||0,result.stars||1),escortHealth:Math.max(record.escortHealth||0,objective.escortHealth||0)};}
 return {reward,won,missionId:id,firstClear:won&&!record.completedAt};
}
const SWResidentStoryDefinitions=[
 {id:'crew-supper',title:'A place at the table',characterId:'captain',keep:1,description:'Mara’s watch has worked through the night. Help the neighborhood welcome them home.',duration:30,choices:[{id:'feast',label:'Cook a harbor supper',description:'Share your harvest with the watch.',cost:{gold:0,wood:10,stone:0,food:120}},{id:'supplies',label:'Stock their mess hall',description:'Pay the market to prepare supplies.',cost:{gold:90,wood:10,stone:0,food:30}}],reward:{resources:{gold:90,wood:50,stone:20,food:0},gems:5},ending:'Lanterns stay lit around the commons. The watch finally sits down to eat.'},
 {id:'cartwright',title:'Wheels for the waterfront',characterId:'engineer',keep:2,description:'Bram can repair the old cargo carts or commission lighter ones for the new road.',duration:45,choices:[{id:'repair',label:'Restore the old carts',description:'Use timber and meals for the crew.',cost:{gold:10,wood:90,stone:10,food:60}},{id:'commission',label:'Commission new wheels',description:'Pay local craftspeople for a lighter design.',cost:{gold:120,wood:40,stone:20,food:40}}],reward:{resources:{gold:140,wood:0,stone:80,food:0},gems:6},ending:'Loaded carts start arriving at the harbor. Bram insists every wheel is perfectly round.'},
 {id:'watch-path',title:'The watcher’s path',characterId:'ranger',keep:2,description:'Elowen found an overgrown path between the orchards and the shore.',duration:45,choices:[{id:'clear',label:'Clear the path',description:'Feed a team and bridge the wet ground.',cost:{gold:0,wood:60,stone:20,food:110}},{id:'mark',label:'Set stone waymarkers',description:'Create a durable trail for travelers.',cost:{gold:60,wood:15,stone:90,food:50}}],reward:{resources:{gold:80,wood:120,stone:0,food:0},gems:6,cosmetics:['banner:green']},ending:'Green ribbons lead travelers safely between the trees. Elowen leaves the first map at the tavern.'},
 {id:'storm-square',title:'After the rain',characterId:'captain',keep:3,description:'A storm has damaged the market awnings. The traders have asked the city for help.',duration:60,choices:[{id:'timber',label:'Raise timber shelters',description:'Build sturdy new market frames.',cost:{gold:20,wood:140,stone:30,food:80}},{id:'stone',label:'Repair the arcade',description:'Give the square permanent cover.',cost:{gold:90,wood:30,stone:130,food:60}}],reward:{resources:{gold:190,wood:30,stone:30,food:0},gems:8,cosmetics:['ornament:planter']},ending:'The market opens beneath new cover. Someone plants flowers beside the repaired stalls.'},
 {id:'ship-launch',title:'A name for the sea',characterId:'engineer',keep:3,description:'The shipwrights are ready to launch a new merchant boat. Its first voyage needs a proper send-off.',duration:60,choices:[{id:'gather',label:'Gather the neighborhood',description:'Prepare a shared meal and decorate the quay.',cost:{gold:40,wood:60,stone:0,food:180}},{id:'outfit',label:'Outfit the crew',description:'Provide warm supplies and working tools.',cost:{gold:120,wood:110,stone:25,food:80}}],reward:{resources:{gold:180,wood:80,stone:50,food:0},gems:8,cosmetics:['ornament:lantern']},ending:'The bell rings as the hull touches water. The crew names her Homeward.'},
 {id:'beacon-bell',title:'The bell keeper',characterId:'ranger',keep:4,description:'Elowen has found the family that once tended the beacon. They are ready to return.',duration:90,choices:[{id:'home',label:'Prepare their home',description:'Restore the keeper’s cottage.',cost:{gold:70,wood:150,stone:100,food:100}},{id:'workshop',label:'Restore their workshop',description:'Make a place for the old bell to be repaired.',cost:{gold:160,wood:80,stone:150,food:60}}],reward:{resources:{gold:240,wood:60,stone:60,food:0},gems:10,cosmetics:['banner:ivory']},ending:'For the first time in a generation, the beacon bell answers the ships in the harbor.'}
];
function SWResidentStories(state,now=state.lastTick||Date.now()){
 const p=SWPremium(state);return SWResidentStoryDefinitions.map((s,index)=>{const record=p.stories[s.id],requirements=[{label:'Keep level '+s.keep,met:Ml(state)>=s.keep},...(index?[{label:'Complete '+SWResidentStoryDefinitions[index-1].title,met:!!p.stories[SWResidentStoryDefinitions[index-1].id]?.claimed}]:[])];return {...s,record,requirements,status:record?.claimed?'complete':record?.readyAt?record.readyAt<=now?'claimable':'building':requirements.every(r=>r.met)?'available':'locked',readyAt:record?.readyAt,reason:requirements.find(r=>!r.met)?.label||null};});
}
function SWEvents(state,now=state.lastTick||Date.now()){
 const p=SWPremium(state),stories=Object.values(p.stories).filter(s=>s.claimed).length,trials=Object.values(p.trials).filter(t=>t.completed).length;
 const list=[{id:'harbor-festival',title:'Harbor festival',description:'Bring the neighborhoods together through six resident stories.',progress:stories,target:6,thresholds:[2,4,6],rewards:[{gems:5},{gems:10},{gems:15,cosmetics:['ornament:standard']}]},{id:'siege-trials',title:'The captain’s trials',description:'Master three fixed-army challenges. Retry freely.',progress:trials,target:3,thresholds:[1,2,3],rewards:[{gems:5},{gems:8},{gems:12,cosmetics:['commander:veteran']}]},{id:'beacon-restoration',title:'Lights along the coast',description:'Complete the six missions of The Broken Beacon.',progress:p.chapter.claimed.length,target:6,thresholds:[2,4,6],rewards:[{gems:5},{gems:8},{gems:12,cosmetics:['banner:red']}] }];
 return list.map((event,index)=>({...event,featured:Math.floor(now/604800000)%3===index,endsAt:null,completed:event.progress>=event.target,tiers:event.thresholds.map((target,i)=>({id:String(i+1),target,reward:event.rewards[i],claimed:!!p.events[event.id]?.includes(String(i+1)),claimable:event.progress>=target&&!p.events[event.id]?.includes(String(i+1))}))}));
}
function SWPremiumReward(state,reward,source){
 const resources=reward?.resources||{};state.reserveCrates||={gold:0,wood:0,stone:0,food:0};
 const delivered={gold:0,wood:0,stone:0,food:0};
 for(const k of xl){const amount=Math.max(0,resources[k]||0),room=Math.max(0,SWCapacity(state)-state.resources[k]),put=Math.min(room,amount);state.resources[k]+=put;state.reserveCrates[k]=(state.reserveCrates[k]||0)+amount-put;delivered[k]=put;}
 state.gems=(state.gems||0)+(reward?.gems||0);for(const id of reward?.cosmetics||[])SWOwnCosmetic(state,id,source);return delivered;
}
function SWCanPlaceOrnament(state,id,x,y){const p=SWPremium(state),item=SWPremiumCatalog.find(i=>i.id===id);return !!item&&item.slot==='ornament'&&p.owned.includes(id)&&Number.isInteger(x)&&Number.isInteger(y)&&Vc(state,x,y)&&!state.buildings.some(b=>b.x===x&&b.y===y)&&!(state.terrain||[]).some(t=>t.x===x&&t.y===y&&t.kind!=='road')&&!p.ornaments.some(o=>o.x===x&&o.y===y)&&p.ornaments.length<40&&p.ornaments.filter(o=>o.itemId===id).length<12;}
function SWMedievalFinale(state){const p=SWPremium(state),requirements=[{label:'Reach Keep level 10',met:Ml(state)>=10,action:'building',buildKind:'keep'},{label:'Complete the frontier campaign',met:state.campaign>=Tl.length,action:'frontier'},{label:'Relight the Broken Beacon',met:!!p.chapter.finaleClaimed,action:'chronicle'}];return {id:'crown-of-the-coast',title:'Crown of the coast',description:'The medieval coast stands united. Complete this age and record your kingdom in the chronicle.',requirements,status:p.eraCompletedAt?'complete':requirements.every(r=>r.met)?'claimable':'locked',reward:{gems:50,cosmetics:['commander:laurel','banner:ivory']},storyAfter:[{speaker:'Mara Ironward',text:'Every light along the coast answers ours. These people no longer need a refuge. They have a home.'},{speaker:'Bram Flint',text:'A merchant brought drawings of a curious new powder. That is a story for another age.'}],mastery:{districts:SWCivicProjects.filter(d=>SWCivicStage(state,d.id)===3).length,districtTarget:4,stories:Object.values(p.stories).filter(s=>s.claimed).length,storyTarget:6,trials:Object.values(p.trials).filter(t=>t.completed).length,trialTarget:3}};}
function SWPremiumAction(state,action,now){
 if(!['buyCosmetic','equipCosmetic','placeOrnament','removeOrnament','advanceMission','claimMission','claimChapter','startResidentStory','claimResidentStory','claimEvent','claimEraFinale','dismissScene'].includes(action.type))return false;
 const p=SWMigratePremium(state);
 if(action.type==='buyCosmetic'){
  const item=SWPremiumCatalog.find(i=>i.id===action.id),status=SWCosmeticStatus(state,action.id);
  if(status.owned)throw Error('You already own this appearance.');if(!status.canBuy)throw Error(status.reason||'Unavailable.');if(action.maxPrice!==item.priceGems)throw Error('The price changed. Review the item again.');
  state.gems-=item.priceGems;SWOwnCosmetic(state,item.id,'gems');
 }else if(action.type==='equipCosmetic'){
  const item=SWPremiumCatalog.find(i=>i.id===action.id);if(!item||!p.owned.includes(item.id))throw Error('Unlock this appearance first.');if(item.slot==='ornament')throw Error('Place this decoration on an empty plot.');p.equipped[item.slot]=item.id;
 }else if(action.type==='placeOrnament'){
  const item=SWPremiumCatalog.find(i=>i.id===action.id);if(!item||item.slot!=='ornament'||!p.owned.includes(item.id))throw Error('Unlock this decoration first.');
  if(!Number.isInteger(action.x)||!Number.isInteger(action.y)||!Vc(state,action.x,action.y)||state.buildings.some(b=>b.x===action.x&&b.y===action.y)||(state.terrain||[]).some(t=>t.x===action.x&&t.y===action.y&&t.kind!=='road')||p.ornaments.some(o=>o.x===action.x&&o.y===action.y))throw Error('Choose an empty land plot or a road edge.');
  if(p.ornaments.length>=40||p.ornaments.filter(o=>o.itemId===item.id).length>=12)throw Error('Decoration limit reached. Move or remove an existing piece.');
  p.ornaments.push({id:'ornament-'+now+'-'+state.revision,itemId:item.id,kind:item.value,x:action.x,y:action.y,facing:SWFacing(action.facing)});
 }else if(action.type==='removeOrnament'){
  if(!p.ornaments.some(o=>o.id===action.placementId))throw Error('Decoration not found.');p.ornaments=p.ornaments.filter(o=>o.id!==action.placementId);
 }else if(action.type==='advanceMission'){
  const mission=SWChapter(state).missions.find(m=>m.id===action.id);if(!mission||mission.type!=='city'||mission.status!=='available')throw Error('This city objective is not ready.');Q(state,mission.cost);p.chapter.completed.push(mission.id);p.chapter.records[mission.id]={completedAt:now};
 }else if(action.type==='claimMission'){
  const mission=SWChapter(state).missions.find(m=>m.id===action.id);if(!mission||mission.status!=='claimable')throw Error('This mission reward is not ready or was already collected.');
  p.chapter.claimed.push(mission.id);SWPremiumReward(state,mission.reward,'mission:'+mission.id);
 }else if(action.type==='claimChapter'){
  if(p.chapter.claimed.length!==SWChapterMissions.length||p.chapter.finaleClaimed)throw Error('Complete and collect all six missions first.');p.chapter.finaleClaimed=true;p.chapter.finishedAt=now;SWPremiumReward(state,{gems:25,cosmetics:['sail:black','ornament:statue']},'chapter');
 }else if(action.type==='startResidentStory'){
  const story=SWResidentStories(state,now).find(s=>s.id===action.id),choice=story?.choices.find(c=>c.id===action.choice);if(!story||story.status!=='available'||!choice)throw Error('Choose an available resident story and response.');
  if(Object.values(p.stories).some(s=>s.readyAt&&!s.claimed))throw Error('Finish your current resident story first.');Q(state,choice.cost);p.stories[story.id]={choice:choice.id,startedAt:now,readyAt:now+story.duration*1000};
 }else if(action.type==='claimResidentStory'){
  const story=SWResidentStories(state,now).find(s=>s.id===action.id);if(!story||story.status!=='claimable')throw Error('This story reward is not ready or was already collected.');p.stories[story.id].claimed=true;p.stories[story.id].completedAt=now;SWPremiumReward(state,story.reward,'story:'+story.id);state.city={...SWCity(state),jobs:(SWCity(state).jobs||0)+1};
 }else if(action.type==='claimEvent'){
  const event=SWEvents(state,now).find(e=>e.id===action.id),tier=event?.tiers.find(t=>t.id===String(action.tier));if(!tier?.claimable)throw Error('This event reward is not ready or was already collected.');p.events[event.id]=[...(p.events[event.id]||[]),tier.id];SWPremiumReward(state,tier.reward,'event:'+event.id+':'+tier.id);
 }else if(action.type==='claimEraFinale'){
  const finale=SWMedievalFinale(state);if(finale.status!=='claimable')throw Error('Complete the medieval age requirements first.');p.eraCompletedAt=now;SWPremiumReward(state,finale.reward,'era:medieval');
 }else if(action.type==='dismissScene'){
  if(typeof action.id!=='string'||!SWChapterMissions.some(m=>action.id===m.id+':before'||action.id===m.id+':after'))throw Error('Unknown story scene.');if(!p.seenScenes.includes(action.id))p.seenScenes.push(action.id);
 }
 return true;
}
// End premium progression v12.
