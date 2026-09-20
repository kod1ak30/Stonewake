// Extracted once from the preserved shipped simulator; version gates preserve old replays.
const fs=require('fs'),acorn=require('../backend/node_modules/acorn'),base=fs.readFileSync('client/build14/engine13.js','utf8'),node=acorn.parse(base,{ecmaVersion:2022,sourceType:'module'}).body.find(n=>n.type==='FunctionDeclaration'&&n.id.name==='gl');let s=base.slice(node.start,node.end);
function replace(a,b){if(!s.includes(a))throw Error('Missing simulation anchor: '+a.slice(0,80));s=s.replace(a,b);}
replace('function gl(e) {',`function gl(e) {
  if(e.navalVersion===4)e={...e,shipOrders14:SWValidateShipOrders14(e,e.shipOrders14||[])};
  const swSea=e.campaignType==='sea'&&e.navalVersion===4;`);
replace('const swNaval = SWNavalUnit(e); if(swNaval)t.push(swNaval);',`const swFleet=swSea?SWFleetUnits14(e):[];
  const swNaval=swSea?swFleet[0]:SWNavalUnit(e);if(swSea)t.push(...swFleet);else if(swNaval)t.push(swNaval);`);
replace('const swEnemyNavy=SWEnemyNavalUnits(e);t.push(...swEnemyNavy);',`const swEnemyNavy=swSea?SWSeaEnemyUnits14(e):SWEnemyNavalUnits(e);t.push(...swEnemyNavy);
  if(swSea&&e.seaMode==='convoy'){const convoy=SWCreateShip14({id:'relief',kind:'cog',level:2},'attack');Object.assign(convoy,{id:'relief-convoy',x:-8,y:-1,hp:650,maxHp:650,damage:0,sagaEscort:true});t.push(convoy);}
  if(swSea)for(const unit of t)if(unit.id==='shore-battery'){unit.range=7;unit.damage=18+4*unit.level;unit.cooldown=2.2;}`);
replace('let i = ml(e, e.orders || []),','let i = swSea?SWOrders14(e,e.orders||[]):ml(e, e.orders || []),');
replace('if(e.navalVersion===3&&n>0&&e.hp===0)','if(e.navalVersion>=3&&n>0&&e.hp===0)');
replace('for (y = n * 0.25; a < i.length && i[a].time <= y; ) (o(i[a], a), a++);',`y=n*.25;
    if(swSea)SWSeaStep14(e,t,y,i,o,swEvents);
    else for(;a<i.length&&i[a].time<=y;)(o(i[a],a),a++);`);
replace('if(n.navalVersion===3){','if(n.navalVersion>=3){');
replace('(e.navalVersion===3&&n.range>=2','(e.navalVersion>=3&&n.range>=2');
replace('(!e.saga && c === 0)',`(!e.saga && !swSea && c === 0) || (swSea&&(SWSeaObjective14(e,t).won||SWSeaObjective14(e,t).failed))`);
s=s.replaceAll('...(e.saga?{objective:SWSagaObjective(e,t,y)}:{})','...(swSea?{objective:SWSeaObjective14(e,t)}:e.saga?{objective:SWSagaObjective(e,t,y)}:{})');
s=s.replaceAll('...(e.saga?{objective:SWSagaObjective(e,t,y,true)}:{})','...(swSea?{objective:SWSeaObjective14(e,t)}:e.saga?{objective:SWSagaObjective(e,t,y,true)}:{})');
replace('won: e.saga?','won: swSea?SWSeaObjective14(e,t).won:e.saga?');
replace('stars: e.saga?','stars: swSea?(SWSeaObjective14(e,t).won?(te===100?3:2):+(te>=50)):e.saga?');
replace('...(swNaval?{navalSurvivors:',`...(swSea?{landedTroops:i.filter(o=>o.landed14&&o.kind!=='hero').length,rescuedTroops:Nl(e.army)-i.filter(o=>o.landed14&&o.kind!=='hero').length,navalSurvivors:Object.fromEntries(swFleet.map(s=>[s.shipId,s.hp>0])),navalHealth:Object.fromEntries(swFleet.map(s=>[s.shipId,Math.max(0,s.hp/s.maxHp)]))}:swNaval?{navalSurvivors:`);
fs.writeFileSync('client/build14/simulation.js',s+'\n');
