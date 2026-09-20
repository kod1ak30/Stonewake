// Civic districts improve an existing place through three visible, persistent stages.
const SWCivicProjects=[
 {id:'market',name:'Market square',description:'Turn the market into a busy civic center with stalls, lighting and a guild court.',anchorKind:'market',stages:[
  {name:'Trading square',benefit:'+5% gold production',keep:2,anchorLevel:1,roads:2,jobs:1,duration:90,cost:{gold:180,wood:120,stone:150,food:100}},
  {name:'Lantern market',benefit:'+10% gold production',keep:4,anchorLevel:2,roads:6,jobs:5,duration:240,cost:{gold:600,wood:400,stone:500,food:350}},
  {name:'Guild court',benefit:'+15% gold production',keep:7,anchorLevel:4,roads:10,jobs:15,duration:600,cost:{gold:2200,wood:1500,stone:2000,food:1000}}]},
 {id:'waterfront',name:'Working waterfront',description:'Equip the harbor with cargo facilities and better shipwright services.',anchorKind:'harbor',stages:[
  {name:'Cargo landing',benefit:'Voyages 5% faster · ship repairs 10% faster',keep:3,anchorLevel:2,ships:1,duration:120,cost:{gold:300,wood:320,stone:180,food:150}},
  {name:'Shipwright quay',benefit:'Voyages 10% faster · ship repairs 20% faster',keep:5,anchorLevel:3,ships:2,duration:360,cost:{gold:1100,wood:900,stone:600,food:400}},
  {name:'Merchant waterfront',benefit:'Voyages 15% faster · ship repairs 30% faster',keep:8,anchorLevel:5,ships:3,duration:720,cost:{gold:3300,wood:3000,stone:2200,food:1600}}]},
 {id:'homes',name:'Residential quarter',description:'Add shared services, meeting spaces and a skilled neighborhood workforce.',anchorKind:'cottage',stages:[
  {name:'Village commons',benefit:'Construction 5% faster · 12 more residents',keep:2,anchorLevel:1,homes:1,well:1,duration:90,cost:{gold:170,wood:150,stone:100,food:120}},
  {name:'Neighborhood hall',benefit:'Construction 10% faster · 24 more residents',keep:4,anchorLevel:2,homes:2,well:1,duration:240,cost:{gold:650,wood:550,stone:450,food:400}},
  {name:'Town quarter',benefit:'Construction 15% faster · 36 more residents',keep:7,anchorLevel:4,homes:3,well:2,duration:600,cost:{gold:1800,wood:2200,stone:1700,food:1400}}]},
 {id:'gardens',name:'Public gardens',description:'Build a planted gathering place around the village well.',anchorKind:'well',stages:[
  {name:'Kitchen gardens',benefit:'+5% food production · festivals last 2 minutes longer',keep:2,anchorLevel:1,gardens:1,roads:2,duration:60,cost:{gold:150,wood:80,stone:90,food:90}},
  {name:'Community orchard',benefit:'+10% food production · festivals last 4 minutes longer',keep:4,anchorLevel:2,gardens:3,roads:6,duration:180,cost:{gold:400,wood:300,stone:350,food:200}},
  {name:'Fountain gardens',benefit:'+15% food production · festivals last 6 minutes longer',keep:6,anchorLevel:3,gardens:5,roads:10,duration:420,cost:{gold:1200,wood:850,stone:1000,food:600}}]}
];
function SWCivicStage(state,id){return Math.max(0,Math.min(3,state.city?.projects?.[id]?.stage||0));}
function SWCivicBonuses(state){return {goldIncome:.05*SWCivicStage(state,'market'),foodIncome:.05*SWCivicStage(state,'gardens'),buildSpeed:.05*SWCivicStage(state,'homes'),voyageSpeed:.05*SWCivicStage(state,'waterfront'),repairSpeed:.1*SWCivicStage(state,'waterfront'),festivalMinutes:2*SWCivicStage(state,'gardens'),residents:12*SWCivicStage(state,'homes')};}
function SWCivicProject(state,id,now=Date.now()){
 const def=SWCivicProjects.find(p=>p.id===id);if(!def)throw Error('Choose a civic project.');
 const record=state.city?.projects?.[id]||{},stage=SWCivicStage(state,id),next=def.stages[stage],anchor=state.buildings.filter(b=>b.kind===def.anchorKind&&b.level>0).sort((a,b)=>b.level-a.level)[0],land=SWLandStats(state),requirements=[];
 if(next){requirements.push({label:'Keep level '+next.keep,met:Ml(state)>=next.keep,buildKind:'keep',action:'building'},{label:Sl[def.anchorKind].name+' level '+next.anchorLevel,met:!!anchor&&anchor.level>=next.anchorLevel,buildKind:def.anchorKind,action:'building'});
  if(next.roads)requirements.push({label:next.roads+' roads connected to the Keep',met:land.connectedRoadCount>=next.roads,action:'plan'});
  if(next.jobs)requirements.push({label:next.jobs+' resident requests fulfilled',met:(SWCity(state).jobs||0)>=next.jobs,action:'residents'});
  if(next.ships)requirements.push({label:next.ships+' completed ships',met:(state.fleet||[]).filter(s=>s.level>0).length>=next.ships,buildKind:'harbor',action:'fleet'});
  if(next.homes)requirements.push({label:next.homes+' completed cottages',met:state.buildings.filter(b=>b.kind==='cottage'&&b.level>0).length>=next.homes,buildKind:'cottage',action:'build'});
  if(next.well)requirements.push({label:'Village well level '+next.well,met:state.buildings.some(b=>b.kind==='well'&&b.level>=next.well),buildKind:'well',action:'building'});
  if(next.gardens)requirements.push({label:next.gardens+' planted gardens',met:land.gardenCount>=next.gardens,action:'plan'});
 }
 const claimable=stage>(record.claimedStage||0),status=record.readyAt?'building':claimable?'claimable':stage===3?'complete':requirements.some(r=>!r.met)?'locked':'available';
 const reason=status==='building'?'Construction underway':claimable?'Celebrate the completed stage first':stage===3?'District complete':requirements.find(r=>!r.met)?.label||(!Rc(state)?'All construction crews are working':!Z(state,next.cost)?'More resources needed':null);
 return {...def,stage,nextStage:Math.min(3,stage+1),targetStage:record.targetStage,startedAt:record.startedAt,readyAt:record.readyAt,siteId:record.siteId||anchor?.id,status,benefit:stage?def.stages[stage-1].benefit:'No district bonus yet',nextBenefit:next?.benefit||def.stages[2].benefit,stageName:stage?def.stages[stage-1].name:'Not started',nextName:next?.name,cost:next?.cost||{gold:0,wood:0,stone:0,food:0},duration:next?.duration||0,requirements,reason,gemReward:claimable?stage*5:(stage+1)*5};
}
function SWCivicTick(state,now){
 for(const project of Object.values(state.city?.projects||{}))if(project.readyAt&&project.readyAt<=now){project.stage=project.targetStage;delete project.targetStage;delete project.startedAt;delete project.readyAt;}
}
function SWCivicProjectAction(state,action,now){
 if(!['startCivicProject','claimCivicProject'].includes(action.type))return false;
 const quote=SWCivicProject(state,action.id,now);state.city={...SWCity(state),projects:{...state.city?.projects}};
 if(action.type==='startCivicProject'){
  if(quote.reason)throw Error(quote.reason+'.');if(quote.status!=='available')throw Error('This district stage is not available.');
  Q(state,quote.cost);state.city.projects[action.id]={...state.city.projects[action.id],stage:quote.stage,siteId:quote.siteId,targetStage:quote.nextStage,startedAt:now,readyAt:now+quote.duration*1000};
 }else{
  if(quote.status!=='claimable')throw Error('This district celebration has already been collected.');
  state.gems+=quote.gemReward;state.city.projects[action.id]={...state.city.projects[action.id],claimedStage:quote.stage};
  state.city.prosperity=(state.city.prosperity||0)+quote.stage*10;
 }
 return true;
}
// End civic progression.
