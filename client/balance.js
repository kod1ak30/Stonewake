// Build 10 economy: finite stores, scarce building slots and useful town planning.
function SWStorageContribution(level){return level>0?Math.round(800*Math.pow(1.5,Math.min(10,level)-1)):0;}
function SWCapacity(state){return 500+250*Ml(state)+state.buildings.filter(b=>b.kind==='storehouse').reduce((sum,b)=>sum+SWStorageContribution(b.level),0);}
function SWBuildingCount(state,kind){return state.buildings.filter(b=>b.kind===kind).length;}
function SWBuildingLimit(state,kind){
 const level=Math.max(1,Math.min(10,Ml(state)));
 const limits={keep:1,farm:1+Math.floor((level-1)/3),lumber:1+Math.floor((level-1)/3),quarry:1+Math.floor((level-1)/4),barracks:1+(level>=5),forge:1,market:1,harbor:1,workshop:1,tavern:1,monument:1,builder:1+(level>=4)+(level>=7),cottage:2+Math.floor((level-1)/2),tower:2+Math.floor((level-1)/2),wall:20+8*level,gate:2+Math.floor(level/3),storehouse:1+(level>=4)+(level>=7),well:1+(level>=6),mortar:1+(level>=6),bombtower:1+(level>=8),flame:1+(level>=8),bastion:1+(level>=9)};
 return limits[kind]??0;
}
function SWCanReceive(state,reward,cost={}){return xl.every(k=>state.resources[k]-(cost[k]||0)+(reward[k]||0)<=SWCapacity(state)+1e-6);}
function SWRequireRoom(state,reward,cost){if(!SWCanReceive(state,reward,cost))throw Error('Make room in your stores before collecting this reward.');}
function SWMigrateStorage(state){
 const cap=SWCapacity(state);state.reserveCrates||={gold:0,wood:0,stone:0,food:0};
 if(!state.storageVersion){for(const k of xl){const excess=Math.max(0,state.resources[k]-cap);state.reserveCrates[k]=(state.reserveCrates[k]||0)+excess;state.resources[k]-=excess;}state.storageVersion=1;}
 for(const k of xl){state.resources[k]=Math.max(0,Math.min(cap,state.resources[k]||0));state.reserveCrates[k]=Math.max(0,state.reserveCrates[k]||0);}
 for(const b of state.buildings)if(!Number.isInteger(b.facing))b.facing=b.axis==='y'?1:0;
}
function SWClaimReserve(state){let total=0;for(const k of xl){const value=Math.min(state.reserveCrates?.[k]||0,Math.max(0,SWCapacity(state)-state.resources[k]));state.resources[k]+=value;state.reserveCrates[k]-=value;total+=value;}if(total<.000001)throw Error('Spend supplies or expand storage to open space for reserve crates.');}
function SWFacing(value,fallback=0){if(value===undefined)return fallback;if(!Number.isInteger(value)||value<0||value>3)throw Error('Choose one of the four building directions.');return value;}
function SWLandStats(state){
 const key=(x,y)=>x+','+y,adj=p=>[[p.x-1,p.y],[p.x+1,p.y],[p.x,p.y-1],[p.x,p.y+1]],placedRoads=new Set((state.terrain||[]).filter(t=>t.kind==='road'&&!state.buildings.some(b=>b.x===t.x&&b.y===t.y)).map(t=>key(t.x,t.y))),roads=new Set([...placedRoads,...Array.from({length:6},(_,i)=>key(-1,i+1))]),keep=state.buildings.find(b=>b.kind==='keep'),reached=new Set(),queue=[];
 if(keep)for(const [x,y]of adj(keep)){const k=key(x,y);if(roads.has(k)){reached.add(k);queue.push({x,y});}}
 for(let i=0;i<queue.length;i++)for(const[x,y]of adj(queue[i])){const k=key(x,y);if(roads.has(k)&&!reached.has(k)){reached.add(k);queue.push({x,y});}}
 const connectedIds=state.buildings.filter(b=>b.kind!=='keep'&&b.level>0&&adj(b).some(([x,y])=>reached.has(key(x,y)))).map(b=>b.id);
 const gardens=(state.terrain||[]).filter(t=>t.kind==='garden'&&!state.buildings.some(b=>b.x===t.x&&b.y===t.y)),beneficial=gardens.filter(t=>state.buildings.some(b=>b.kind==='cottage'&&b.level>0&&Math.abs(b.x-t.x)+Math.abs(b.y-t.y)===1)).length;
 return {connectedIds,connectedCount:connectedIds.length,roadCount:placedRoads.size,connectedRoadCount:[...reached].filter(k=>placedRoads.has(k)).length,gardenCount:gardens.length,gardenBonus:Math.min(.1,beneficial*.02),incomeBonus:.1};
}
function SWRaidLoot(state,result){
 const protectedAmount=Math.floor(SWCapacity(state)*.2),fraction=.10*Math.max(0,Math.min(1,(result.destruction||0)/100))+(result.won?.08:0);
 return Object.fromEntries(xl.map(k=>[k,Math.floor(Math.max(0,state.resources[k]-protectedAmount)*fraction)]));
}
// The original province coordinates remain valid for old saves. New land adds the outer east/south frontier.
for(const province of Ac){const additions=[];for(let x=0;x<18;x++)for(let y=0;y<18;y++)if(x>=16||y>=16){const owner=x>=16&&y<6?'whisperwood':x>=16&&y<12?'sunmeadow':x>=16?'ironpass':x<6?'tidewatch':'highmarch';if(province.id===owner&&!province.tiles.some(t=>t.x===x&&t.y===y))additions.push({x,y});}province.tiles.push(...additions);}
// End build 10 economy.
