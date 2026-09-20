// Warned NPC raids use the saved city, a bounded loss and one catch-up event.
const SWRaidTiming={initialShield:20*60000,warning:5*60000,shield:2*3600000};
function SWMigrateRaids(state,now){
 state.city={...SWCity(state)};
 if(!state.city.raidSchedule)state.city.raidSchedule={version:1,enabled:true,cycle:0};
 const raid=state.city.raidSchedule;
 if(Ml(state)>=3&&!raid.eligibleAt){raid.eligibleAt=now;raid.shieldUntil=now+SWRaidTiming.initialShield;raid.dueAt=raid.shieldUntil+SWRaidTiming.warning;}
}
function SWRaidStatus(state,now=Date.now()){
 const raid=state.city?.raidSchedule,enabled=raid?.enabled!==false,wave=Math.max(1,Math.min(10,Math.ceil(Ml(state)/2)+Math.floor((SWCity(state).raidWins||0)/2)));
 const phase=state.activeBattle&&String(state.activeBattle).startsWith('defense-')?'active':!enabled||Ml(state)<3?'peace':!raid||now<raid.shieldUntil?'protected':now<raid.dueAt?'warning':'ready';
 return {phase,enabled,wave,endsAt:phase==='protected'?(raid?.shieldUntil||now+SWRaidTiming.initialShield):phase==='warning'?raid.dueAt:0,lootRisk:SWRaidLoot(state,{won:true,destruction:100}),cycle:raid?.cycle||0,dueAt:raid?.dueAt};
}
function SWRaidScheduleAfter(state,now,id){
 SWMigrateRaids(state,now);const raid=state.city.raidSchedule;
 raid.lastSettledId=id||raid.lastSettledId;raid.cycle=(raid.cycle||0)+1;raid.shieldUntil=now+SWRaidTiming.shield;raid.dueAt=raid.shieldUntil+SWRaidTiming.warning;
}
function SWRaidInput(state,now=Date.now(),automatic=false){
 SWMigrateRaids(state,now);const status=SWRaidStatus(state,now),input=SWDefenseInput(state);
 // New snapshots opt into measured telemetry and Keep-scaled raiders. Historical snapshots stay unchanged.
 const level=status.wave,army=wl(),orders=[],bounds=fl(input.defense),points=[{x:bounds.minX,y:Math.round((bounds.minY+bounds.maxY)/2)},{x:bounds.maxX,y:Math.round((bounds.minY+bounds.maxY)/2)},{x:Math.round((bounds.minX+bounds.maxX)/2),y:bounds.maxY}];
 army.infantry=5+level*2;army.archer=2+level;army.ram=level>=3?Math.floor(level/3):0;
 for(const kind of Object.keys(army))for(let i=0;i<army[kind];i++)orders.push({kind,...points[Math.floor(orders.length/6)%points.length],time:Math.floor(orders.length/6)*4});
 const raidId=automatic?'defense-auto-'+state.city.raidSchedule.cycle+'-'+state.city.raidSchedule.dueAt:'defense-'+now+'-'+state.revision;
 return {...input,army,orders,unitLevels:Object.fromEntries(Object.keys(J).map(k=>[k,Math.max(1,Math.ceil(level/2))])),seed:(state.revision*7919+level*131+state.city.raidSchedule.cycle*3571)>>>0,defenseRaidLevel:level,defenseEconomyVersion:2,defenseTelemetryVersion:1,raidId,automaticRaid:automatic};
}
function SWDefenseReport(input,result,outcome,now){
 const stats=result.defenseStats||{};return {id:input.raidId,won:outcome.won,keepHeld:outcome.won,destruction:result.destruction,duration:result.duration,loot:outcome.loot,reward:outcome.reward,lootProtected:Math.floor(SWCapacity({buildings:input.defense.buildings})*.2),towerDamage:stats.towerDamage,wallDamageAbsorbed:stats.wallDamageAbsorbed,wallDelaySeconds:stats.wallDelaySeconds,attackersDefeated:stats.attackersDefeated,startedAt:now-Math.round(result.duration*1000),endedAt:now,automatic:!!input.automaticRaid};
}
function SWSettleScheduledRaid(state,input,result,now){
 if(!input.raidId||state.city?.raidSchedule?.lastSettledId===input.raidId)return null;
 if(input.automaticRaid){const schedule=state.city?.raidSchedule;if(!schedule||now<schedule.dueAt||schedule.enabled===false||state.activeBattle||Ml(state)<3||input.raidId!=='defense-auto-'+schedule.cycle+'-'+schedule.dueAt)return null;}
 const outcome=SWResolveDefense(state,input,result,now);SWRaidScheduleAfter(state,now,input.raidId);const report=SWDefenseReport(input,result,outcome,now);state.city.lastDefense=report;return {...outcome,defenseReport:report};
}
// End warned raids.
