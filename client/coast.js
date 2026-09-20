// Coastal gameplay uses the same world coordinates as the capital.
const SWCoast = Object.freeze({
  slots: [{x:-2,y:2},{x:-2,y:4},{x:-2,y:6}],
  focus: {x:350,y:220},
});
function SWIsCoastSlot(x,y) {
  return Number.isInteger(x) && Number.isInteger(y) && SWCoast.slots.some(s=>s.x===x&&s.y===y);
}
function SWWalkable(state,x,y) {
  return Vc(state,x,y) || (Number.isInteger(x)&&Number.isInteger(y)&&((x===-1&&y>=1&&y<=6)||SWIsCoastSlot(x,y)));
}
function SWCanPlace(state,kind,x,y,ignoreId) {
  return (kind==='harbor'?SWIsCoastSlot(x,y):Vc(state,x,y)&&!SWIsCoastSlot(x,y)) &&
    !al(state,x,y) && !state.buildings.some(b=>b.id!==ignoreId&&b.x===x&&b.y===y) && !(state.premium?.ornaments||[]).some(o=>o.x===x&&o.y===y);
}
function SWMigrateCoast(state) {
  if (state.coastVersion===1) return;
  const ports=state.buildings.filter(b=>b.kind==='harbor');
  const reserved=new Set(ports.filter(b=>SWIsCoastSlot(b.x,b.y)).map(b=>`${b.x},${b.y}`));
  for(const port of ports) {
    if(SWIsCoastSlot(port.x,port.y)) continue;
    const slot=SWCoast.slots.find(s=>!reserved.has(`${s.x},${s.y}`));
    if(!slot) continue;
    // Only relocate the port. Its identity, construction project and level survive.
    port.x=slot.x; port.y=slot.y; reserved.add(`${slot.x},${slot.y}`);
  }
  state.coastVersion=1;
}
function SWCoastBoats(buildings,fleet,now=Date.now()) {
  const ports=buildings.filter(b=>b.kind==='harbor');
  if(!ports.length) return [];
  return fleet.map((ship,index)=>{
    const port=ports[index%ports.length];
    const berth=vu(port.x-1.8,port.y+0.1+Math.floor(index/ports.length)*0.48);
    const away={x:Math.max(30,berth.x-120),y:Math.max(28,berth.y-70)};
    const voyage=ship.voyage;
    const progress=voyage?Math.max(0,Math.min(1,(now-voyage.startedAt)/(voyage.readyAt-voyage.startedAt))):0;
    const sailing=!!voyage&&voyage.readyAt>now;
    const distance=sailing?Math.sin(progress*Math.PI):0;
    return {ship,index,berth,away,sailing,returned:!!voyage&&!sailing,x:berth.x+(away.x-berth.x)*distance,y:berth.y+(away.y-berth.y)*distance};
  });
}
function SWCoastHit(x,y,buildings,fleet,now=Date.now()) {
  for(const boat of SWCoastBoats(buildings,fleet,now)) if(Math.abs(x-boat.x)<34&&y<boat.y+12&&y>boat.y-72) return {type:'ship',id:boat.ship.id};
  return null;
}
function SWDrawCoast(ctx,{buildings=[],fleet=[],naval,land,coastLand,time=0,placing}) {
  const shore=[];
  for(let x=-150;x<=950;x+=22) shore.push({x,y:338-x*0.519+Math.sin(x*0.027)*4+Math.cos(x*.013)*3});
  const path=()=>{ctx.beginPath();ctx.moveTo(-150,-350);ctx.lineTo(950,-350);for(let i=shore.length-1;i>=0;i--)ctx.lineTo(shore[i].x,shore[i].y);ctx.closePath()};
  if(!coastLand){
  ctx.save();path();ctx.clip();
  const sea=ctx.createLinearGradient(0,-40,300,380);sea.addColorStop(0,'#285c72');sea.addColorStop(.55,'#337f91');sea.addColorStop(1,'#57a6aa');ctx.fillStyle=sea;ctx.fillRect(-150,-350,1100,950);
  // Reuse the painted sea texture so water belongs to the same illustrated world.
  if(land){ctx.globalAlpha=.52;ctx.drawImage(land,35,4,170,70,-150,-350,1100,800);ctx.globalAlpha=1;}
  for(let i=0;i<42;i++){
    const x=(i*113)%900-90,y=(i*71)%480-100+Math.sin(time*.2+i)*3;
    ctx.strokeStyle=i%3?'#b4e5de22':'#cee9df44';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+13,y+3,x+28,y);ctx.stroke();
  }
  ctx.restore();
  // A continuous rocky bank and promenade connect the three berths to town.
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  for(const [width,color,dy] of [[15,'#69664edd',6],[8,'#b6af8999',3],[2,'#d5f1dfaa',-3]]){
    ctx.beginPath();shore.forEach((p,i)=>i?ctx.lineTo(p.x,p.y+dy):ctx.moveTo(p.x,p.y+dy));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
  }
  for(let i=0;i<shore.length;i++){
    const p=shore[i];
    if(naval){const rect=Yl.naval[5],size=14+(i%4)*4;ctx.save();ctx.filter='saturate(.35)';ctx.drawImage(naval,...rect,p.x-size/2,p.y-size*.4,size,size*.72);ctx.restore();}
  }
  ctx.restore();
  }
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
  SWDrawRoads(ctx,[...Array.from({length:6},(_,i)=>({kind:'road',x:-1,y:i+1})),...SWCoast.slots.filter(slot=>buildings.some(b=>b.kind==='harbor'&&b.x===slot.x&&b.y===slot.y)||placing==='harbor').map(slot=>({...slot,kind:'road'}))]);
  for(const slot of SWCoast.slots){
    const p=vu(slot.x,slot.y),end=vu(slot.x-1.6,slot.y),landEnd=vu(-1,slot.y),port=buildings.find(b=>b.kind==='harbor'&&b.x===slot.x&&b.y===slot.y);
    if(!port && placing!=='harbor') continue;
    const side={x:-14,y:7};
    ctx.beginPath();ctx.moveTo(p.x+side.x,p.y+side.y);ctx.lineTo(end.x+side.x,end.y+side.y);ctx.lineTo(end.x-side.x,end.y-side.y);ctx.lineTo(p.x-side.x,p.y-side.y);ctx.closePath();ctx.fillStyle='#756044';ctx.fill();ctx.strokeStyle='#403b2c';ctx.lineWidth=3;ctx.stroke();
    for(let j=0;j<=9;j++){const a=j/9,px=p.x+(end.x-p.x)*a,py=p.y+(end.y-p.y)*a;ctx.beginPath();ctx.moveTo(px+side.x,py+side.y);ctx.lineTo(px-side.x,py-side.y);ctx.strokeStyle=j%2?'#b29a71':'#9b805c';ctx.lineWidth=3;ctx.stroke();}
    for(const q of [p,end]) for(const sign of [-1,1]){ctx.fillStyle='#483e2d';ctx.fillRect(q.x+side.x*sign-2,q.y+side.y*sign-9,4,14);ctx.fillStyle='#d3b782';ctx.fillRect(q.x+side.x*sign-2,q.y+side.y*sign-10,4,3);}
    if(!port){ctx.beginPath();ctx.ellipse(p.x,p.y,24,13,0,0,Math.PI*2);ctx.fillStyle=placing==='harbor'?'#4387bddd':'#314852cc';ctx.fill();ctx.strokeStyle=placing==='harbor'?'#c0e6ff':'#a5b9b999';ctx.lineWidth=2;ctx.stroke();if(placing==='harbor'){ctx.fillStyle='#edf8ff';ctx.font='700 18px system-ui';ctx.textAlign='center';ctx.fillText('+',p.x,p.y+6);}}
  }
  ctx.restore();
  for(const boat of SWCoastBoats(buildings,fleet)){
    const {ship,index,x,y,berth,away,sailing,returned}=boat;
    if(!naval||!wc[ship.kind])continue;
    const rect=Yl.naval[wc[ship.kind].sprite],width=ship.kind==='cutter'?56:66,height=width*rect[3]/rect[2],bob=Math.sin(time*1.3+index)*1.5;
    ctx.save();
    if(sailing){ctx.setLineDash([4,9]);ctx.strokeStyle='#acd3d14d';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(berth.x,berth.y);ctx.lineTo(away.x,away.y);ctx.stroke();ctx.setLineDash([]);}
    ctx.beginPath();ctx.ellipse(x,y+2,width*.42,5,0,0,Math.PI*2);ctx.fillStyle='#0d465b66';ctx.fill();ctx.strokeStyle='#d4f6e688';ctx.lineWidth=1;ctx.stroke();
    ctx.globalAlpha=ship.level?1:.65;ctx.drawImage(naval,...rect,x-width/2,y-height+bob,width,height);ctx.globalAlpha=1;
    if(returned){ctx.beginPath();ctx.arc(x,y-height-6,7,0,Math.PI*2);ctx.fillStyle='#d3b76a';ctx.fill();ctx.fillStyle='#213a45';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText('✓',x,y-height-2);}
    ctx.restore();
  }
}
