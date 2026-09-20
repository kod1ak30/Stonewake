// Versioned battle rules: historical inputs without these flags keep their original simulation.
function SWMedicTarget(healer, units, assignments, time) {
  const allies=units.filter(u=>u.side===healer.side&&!u.building&&!u.naval&&u.hp>0&&u.id!==healer.id);
  if(!allies.length)return null;
  const fighters=allies.filter(u=>u.kind!=='healer');
  const candidates=fighters.length?allies.filter(u=>u.kind!=='healer'||u.hp/u.maxHp<.45):allies;
  const enemies=units.filter(u=>u.side!==healer.side&&u.hp>0&&u.damage>0);
  const living=new Map(units.filter(u=>u.hp>0).map(u=>[u.id,u]));
  const heal=20*(1+.14*((healer.level||1)-1));
  const previous=assignments.get(healer.id);
  const frontline=new Set(['infantry','shieldbearer','spearman','cavalry','knight','ram','hero']);
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  let winner=null,best=Infinity;
  for(const ally of candidates){
    const missing=ally.maxHp-ally.hp,ratio=missing/ally.maxHp;
    const local=candidates.filter(u=>distance(u,ally)<2.4);
    const groupNeed=local.reduce((sum,u)=>sum+(u.maxHp-u.hp),0);
    let incoming=0,coverage=0;
    for(const [medicId,assignment] of assignments){
      if(medicId===healer.id)continue;
      const medic=living.get(medicId),target=living.get(assignment.targetId);
      if(!medic||!target||medic.side!==healer.side)continue;
      const separation=distance(target,ally);
      if(separation<2.4)coverage+=(1-separation/3.2);
      if(target.id===ally.id&&distance(medic,ally)<=medic.range+1&&medic.nextAttack<=time+1)
        incoming+=20*(1+.14*((medic.level||1)-1));
    }
    const uncovered=Math.max(0,missing-incoming);
    const threatened=enemies.some(enemy=>distance(enemy,ally)<=Math.max(1,enemy.range||0)+.8);
    const priority=uncovered>1?(uncovered/ally.maxHp)*8+Math.min(2,uncovered/heal)*2:0;
    const coveragePenalty=coverage*9/Math.max(1,groupNeed/(heal*2.5));
    const incomingPenalty=incoming&&missing<=incoming?7:0;
    const overheal=missing>0&&missing<heal*.55?2.8:0;
    const sticky=previous?.targetId===ally.id?(time<previous.until?5:2.2):0;
    const score=distance(healer,ally)*.75+coveragePenalty+incomingPenalty+overheal-priority-
      (frontline.has(ally.kind)?1.5:0)-(threatened?2:0)-sticky;
    if(score<best-1e-9||(Math.abs(score-best)<1e-9&&String(ally.id)<String(winner?.id))){best=score;winner=ally;}
  }
  return winner;
}
function SWNavalEligible(scout) {
  return !!scout && !!scout.defense;
}
function SWNavalShips(state) {
  return (state.fleet||[]).filter(ship=>['galley','bombard'].includes(ship.kind)&&ship.level>0&&!ship.readyAt&&!ship.voyage&&!ship.combatBattleId&&!ship.wrecked&&!ship.repairReadyAt);
}
function SWNavalStrike(input,units,time) {
  if(input.navalVersion!==1||!input.navalSupport||!['galley','bombard'].includes(input.navalSupport.kind)||
    !Number.isFinite(input.navalAt)||input.navalAt<0||input.navalAt>119.5||time<input.navalAt)return null;
  const shore={x:-3,y:3},weapons=new Set(['tower','mortar','bombtower','flame','bastion']);
  const targets=units.filter(u=>u.side==='defend'&&u.building&&u.hp>0&&(weapons.has(u.kind)||u.kind==='keep'));
  targets.sort((a,b)=>(weapons.has(a.kind)?0:1)-(weapons.has(b.kind)?0:1)||
    Math.hypot(a.x-shore.x,a.y-shore.y)-Math.hypot(b.x-shore.x,b.y-shore.y)||(String(a.id)<String(b.id)?-1:String(a.id)>String(b.id)?1:0));
  const target=targets[0];if(!target)return null;
  const level=Math.max(1,Math.min(10,Math.trunc(input.navalSupport.level)||1));
  const damage=input.navalSupport.kind==='bombard'?260+45*level:140+30*level;
  const hits=units.filter(u=>u.side==='defend'&&u.hp>0&&Math.hypot(u.x-target.x,u.y-target.y)<=1.25)
    .map(unit=>({unit,damage:damage*(1-Math.min(.5,Math.hypot(unit.x-target.x,unit.y-target.y)*.4))}));
  return {target,hits,shot:{x:shore.x,y:shore.y,tx:target.x,ty:target.y,side:'attack',kind:'naval'}};
}

const SWAbilityData = Object.freeze({
  infantry:[[3,'Shield drill','10% less incoming damage.'],[6,'Cleave','Strikes one nearby enemy for 35% damage.'],[9,'Veteran guard','25% less incoming damage.']],
  archer:[[3,'Longbow','Adds 0.35 attack range.'],[6,'Quick draw','Attack cooldown is 20% shorter.'],[9,'Split volley','Hits a second nearby enemy for 60% damage.']],
  cavalry:[[3,'Spurred charge','Moves 12% faster.'],[6,'Impact charge','First attack deals 75% extra damage.'],[9,'Tower riders','Deals 25% extra damage to defensive weapons.']],
  cannon:[[3,'Long barrel','Adds 0.5 attack range.'],[6,'Blast shell','Nearby enemies take 45% blast damage.'],[9,'Siege ammunition','Deals 35% extra damage to structures.']],
  spearman:[[3,'Long pikes','Adds 0.3 attack range.'],[6,'Cavalry counter','Deals triple damage to cavalry and knights.'],[9,'Braced formation','25% less incoming damage.']],
  shieldbearer:[[3,'Reinforced shield','Adds 15% maximum health.'],[6,'Shield cover','Nearby allies take 12% less damage.'],[9,'Bulwark','Shield protection reduces incoming damage by a further 30%.']],
  scout:[[3,'Fleet foot','Moves 15% faster.'],[6,'Supply raider','Deals 65% extra damage to production buildings.'],[9,'Relentless raids','Attack cooldown is 30% shorter.']],
  crossbow:[[3,'Heavy bow','Adds 0.4 attack range.'],[6,'Armor piercing','Deals 40% extra damage to armored defenders.'],[9,'Precision volley','Every third attack deals 75% extra damage.']],
  ram:[[3,'Heavy frame','Adds 20% maximum health.'],[6,'Gate breaker','Deals sixfold damage to walls and gates.'],[9,'Breach shock','Nearby enemies take 50% impact damage.']],
  healer:[[3,'Field reach','Adds 0.4 healing range.'],[6,'Shared care','A nearby wounded ally receives a 50% follow-up heal.'],[9,'Emergency care','Heals 40% more when a patient is below 35% health.']],
  grenadier:[[3,'Long throw','Adds 0.35 attack range.'],[6,'Shrapnel','Wider blasts deal 90% damage to nearby enemies.'],[9,'Rapid bombardment','Attack cooldown is 25% shorter.']],
  knight:[[3,'Plate armor','Adds 15% maximum health.'],[6,'Fortress assault','Deals 50% extra damage to defensive weapons.'],[9,'Iron resolve','Takes 25% less damage.']],
  trebuchet:[[3,'Long counterweight','Adds 0.75 attack range.'],[6,'Shattering boulder','Wide impacts deal 65% damage to nearby enemies.'],[9,'Veteran crew','Attack cooldown is 25% shorter.']],
});
function SWTroopAbilities(kind) {
  return (SWAbilityData[kind]||[]).map(([level,name,description])=>({level,name,description}));
}
function SWTroopAbility(kind,level) {
  return SWTroopAbilities(kind).filter(a=>a.level<=Math.min(10,level)).at(-1)||null;
}
function SWApplyTroopStats(unit) {
  const level=Math.min(10,unit.level||1),kind=unit.kind;
  unit.abilitiesVersion=1;unit.attackCount=0;
  if(level>=3){
    if(['shieldbearer','knight'].includes(kind))unit.hp=unit.maxHp*=1.15;
    if(kind==='ram')unit.hp=unit.maxHp*=1.2;
    const range={archer:.35,cannon:.5,spearman:.3,crossbow:.4,healer:.4,grenadier:.35,trebuchet:.75}[kind]||0;
    unit.range+=range;
    if(kind==='cavalry')unit.speed*=1.12;
    if(kind==='scout')unit.speed*=1.15;
  }
  if(level>=6&&kind==='archer')unit.cooldown*=.8;
  if(level>=9&&kind==='scout')unit.cooldown*=.7;
  if(level>=9&&['grenadier','trebuchet'].includes(kind))unit.cooldown*=.75;
  return unit;
}
function SWTroopDamageFactor(attacker,target) {
  if(attacker.abilitiesVersion!==1)return 1;
  const kind=attacker.kind,level=attacker.level||1,weapons=['tower','mortar','bombtower','flame','bastion'];let factor=1;
  if(kind==='trebuchet'&&target.building)factor*=2.4;
  if(level>=6){
    if(kind==='cavalry'&&attacker.attackCount===0)factor*=1.75;
    if(kind==='spearman'&&['cavalry','knight'].includes(target.kind))factor*=1.5;
    if(kind==='scout'&&['farm','lumber','quarry','market'].includes(target.kind))factor*=1.65;
    if(kind==='crossbow'&&['keep','tower','bastion','shieldbearer','knight'].includes(target.kind))factor*=1.4;
    if(kind==='ram'&&['wall','gate'].includes(target.kind))factor*=1.5;
    if(kind==='knight'&&weapons.includes(target.kind))factor*=1.5;
  }
  if(level>=9){
    if(kind==='cavalry'&&weapons.includes(target.kind))factor*=1.25;
    if(kind==='cannon'&&target.building)factor*=1.35;
    if(kind==='crossbow'&&(attacker.attackCount+1)%3===0)factor*=1.75;
  }
  return factor;
}
function SWTroopIncomingFactor(unit,units) {
  let factor=1;
  if(unit.abilitiesVersion===1){
    if(unit.kind==='infantry'&&unit.level>=3)factor*=unit.level>=9?.75:.9;
    if(unit.level>=9&&['spearman','knight'].includes(unit.kind))factor*=.75;
    if(unit.kind==='shieldbearer')factor*=unit.level>=9?.65*.7:.65;
  }
  if(!unit.naval&&units.some(ally=>ally.id!==unit.id&&ally.hp>0&&ally.side===unit.side&&ally.kind==='shieldbearer'&&ally.abilitiesVersion===1&&ally.level>=6&&Math.hypot(ally.x-unit.x,ally.y-unit.y)<=1.8))factor*=.88;
  return factor;
}
function SWTroopSplash(attacker,target,units) {
  if(attacker.abilitiesVersion!==1)return [];
  const kind=attacker.kind,level=attacker.level||1;let radius=0,fraction=0,limit=Infinity;
  if(kind==='grenadier'){radius=level>=6?1:.7;fraction=level>=6?.9:.4;}
  if(kind==='trebuchet'){radius=level>=6?1.5:.8;fraction=level>=6?.65:.3;}
  if(level>=6&&kind==='infantry'){radius=.9;fraction=.35;limit=1;}
  if(level>=6&&kind==='cannon'){radius=.9;fraction=.45;}
  if(level>=9&&kind==='archer'){radius=1;fraction=.6;limit=1;}
  if(level>=9&&kind==='ram'){radius=1.05;fraction=.5;}
  return units.filter(u=>u.id!==target.id&&u.side!==attacker.side&&u.hp>0&&!u.naval&&Math.hypot(u.x-target.x,u.y-target.y)<=radius)
    .sort((a,b)=>Math.hypot(a.x-target.x,a.y-target.y)-Math.hypot(b.x-target.x,b.y-target.y)||(String(a.id)<String(b.id)?-1:1)).slice(0,limit).map(unit=>({unit,fraction}));
}
function SWMedicHeals(medic,target,units) {
  let amount=20*(1+.14*((medic.level||1)-1));
  if(medic.abilitiesVersion===1&&medic.level>=9&&target.hp/target.maxHp<.35)amount*=1.4;
  const heals=[{unit:target,amount}];
  if(medic.abilitiesVersion===1&&medic.level>=6){
    const next=units.filter(u=>u.id!==target.id&&u.id!==medic.id&&u.side===medic.side&&!u.building&&!u.naval&&u.hp>0&&u.hp<u.maxHp&&Math.hypot(u.x-target.x,u.y-target.y)<=1.8)
      .sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp||(String(a.id)<String(b.id)?-1:1))[0];
    if(next)heals.push({unit:next,amount:amount*.5});
  }
  return heals;
}
function SWNavalUnit(input) {
  const ship=input.navalSupport;
  if(input.navalVersion===3)return SWCreateNavalUnit(ship,'attack');
  if(input.navalVersion!==2||!ship||!['galley','bombard'].includes(ship.kind))return null;
  const level=Math.max(1,Math.min(10,Math.trunc(ship.level)||1)),bombard=ship.kind==='bombard';
  const hp=bombard?520+65*level:380+50*level;
  return {id:'naval-'+ship.id,shipId:ship.id,side:'attack',kind:ship.kind,naval:true,building:false,x:-3,y:3,hp,maxHp:hp,level,damage:bombard?90+18*level:55+12*level,range:16,speed:0,cooldown:bombard?7:5,nextAttack:1};
}
function SWNavalTarget(ship,units) {
  return units.filter(u=>u.side!==ship.side&&u.building&&u.hp>0&&!['wall','gate'].includes(u.kind)&&Math.hypot(u.x-ship.x,u.y-ship.y)<=ship.range)
    .sort((a,b)=>(['tower','mortar','bombtower','flame','bastion'].includes(a.kind)?0:1)-(['tower','mortar','bombtower','flame','bastion'].includes(b.kind)?0:1)||Math.hypot(a.x-ship.x,a.y-ship.y)-Math.hypot(b.x-ship.x,b.y-ship.y)||(String(a.id)<String(b.id)?-1:1))[0]||null;
}

// Naval version 3 keeps fleet duels offshore before either side supports the land battle.
function SWEnemyNavy(defense) {
  if(!defense)return [];
  const level=Math.max(1,Math.min(10,Math.trunc(defense.level)||1));
  return [{id:'coastal-patrol',kind:level>=7?'bombard':'galley',level:Math.ceil(level/2)}];
}
function SWCreateNavalUnit(ship,side,index=0) {
  if(!ship||!['galley','bombard'].includes(ship.kind))return null;
  const level=Math.max(1,Math.min(10,Math.trunc(ship.level)||1)),bombard=ship.kind==='bombard',friendly=side==='attack';
  const hp=friendly?(bombard?800+100*level:620+80*level):(bombard?340+65*level:250+55*level);
  return {id:(friendly?'naval-':'enemy-naval-')+ship.id,shipId:ship.id,side,kind:ship.kind,naval:true,navalVersion:3,building:false,x:-5-index*.65,y:friendly?3:-index*1.3,hp,maxHp:hp,level,damage:friendly?(bombard?90+18*level:55+12*level):(bombard?26+6*level:18+4*level),range:friendly?16:5.2,navalRange:2.3,speed:bombard?.34:.44,cooldown:friendly?(bombard?7:5):(bombard?7:5.5),nextAttack:1+index*.5,heading:friendly?-Math.PI/2:Math.PI/2,vx:0,vy:0};
}
function SWEnemyNavalUnits(input) {
  return input.navalVersion===3&&Array.isArray(input.enemyNavy)?input.enemyNavy.slice(0,2).map((ship,index)=>SWCreateNavalUnit(ship,'defend',index)).filter(Boolean):[];
}
function SWNavalStep(ship,units,time,step=.25) {
  ship.vx=0;ship.vy=0;
  if(ship.hp<=0)return null;
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),opponents=units.filter(u=>u.naval&&u.side!==ship.side&&u.hp>0);
  opponents.sort((a,b)=>distance(ship,a)-distance(ship,b)||(String(a.id)<String(b.id)?-1:1));
  const rival=opponents[0],station=ship.side==='attack'?{x:-3,y:3}:{x:-3.2,y:.8};
  const destination=rival||station,desired=rival?ship.navalRange*.92:.06,gap=distance(ship,destination);
  let dx=0,dy=0;
  if(gap>desired){
    const stride=Math.min(ship.speed*step,gap-desired);dx=(destination.x-ship.x)/gap*stride;dy=(destination.y-ship.y)/gap*stride;
  }else if(rival&&gap>.1){
    // Broadside maneuvers keep both hulls sailing while their guns track the opposing vessel.
    const stride=ship.speed*step*.3;dx=-(rival.y-ship.y)/gap*stride;dy=(rival.x-ship.x)/gap*stride;
  }
  if(dx||dy){const x=Math.max(-6.5,Math.min(rival?-4.9:-3,ship.x+dx)),y=Math.max(-1.5,Math.min(5.5,ship.y+dy));ship.vx=(x-ship.x)/step;ship.vy=(y-ship.y)/step;ship.x=x;ship.y=y;}
  let target=rival;
  if(!rival){
    if(ship.side==='attack')target=SWNavalTarget(ship,units);
    else target=units.filter(u=>u.side!==ship.side&&!u.naval&&!u.building&&u.hp>0&&distance(ship,u)<=ship.range)
      .sort((a,b)=>distance(ship,a)-distance(ship,b)||(String(a.id)<String(b.id)?-1:1))[0]||null;
  }
  if(ship.vx||ship.vy)ship.heading=Math.atan2(ship.vy,ship.vx);
  else if(target)ship.heading=Math.atan2(target.y-ship.y,target.x-ship.x);
  if(!target||distance(ship,target)>(target.naval?ship.navalRange:ship.range)||time<ship.nextAttack)return null;
  // A fleet wins its sea lane first. Land bombardment starts only after reaching the coastal station.
  if(!target.naval&&distance(ship,station)>.4)return null;
  ship.nextAttack=time+ship.cooldown;
  const damage=ship.damage*(!target.naval&&!target.building ? .45 : 1);
  return {target,damage,splash:ship.kind==='bombard'&&!target.naval?units.filter(u=>u.id!==target.id&&u.side!==ship.side&&!u.naval&&u.hp>0&&distance(u,target)<=1.15).map(unit=>({unit,damage:damage*.35})):[],shot:{x:ship.x,y:ship.y,tx:target.x,ty:target.y,side:ship.side,kind:'naval',navalVersion:3,sourceId:ship.id,targetId:target.id,impact:target.naval?'ship':target.building?'structure':'troop',heading:Math.atan2(target.y-ship.y,target.x-ship.x)}};
}
