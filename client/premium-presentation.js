// Premium presentation uses saved appearance only; previews never write to the kingdom.
const SWAppearanceColors={coastal:{cloth:'#3c6584',trim:'#c2a975'},ember:{cloth:'#8c4340',trim:'#d1aa6b'},forest:{cloth:'#426a57',trim:'#bcb588'},ivory:{cloth:'#d6ceb2',trim:'#987b4e'}};
const SWBannerColors={blue:'#426987',red:'#934b43',green:'#4c735a',ivory:'#d6cdb1',black:'#3c454b',linen:'#d9cfb3'};
function SWRenderAppearance(appearance={}) {return {palette:'coastal',banner:'blue',road:'earth',sail:'linen',commander:'standard',ornaments:[],...appearance};}
function SWColorBuildingTile(ctx,width,height,appearance={}) {
  const a=SWRenderAppearance(appearance);if(a.palette==='coastal')return;const color=SWAppearanceColors[a.palette]?.cloth;if(!color)return;
  const target=parseInt(color.slice(1),16),tr=target>>16,tg=(target>>8)&255,tb=target&255,pixels=ctx.getImageData(0,0,width,height),data=pixels.data;
  for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2];if(data[i+3]<20||b<r*1.12||g<r*1.02||b<g*.92)continue;const strength=Math.min(.8,(b-r)/55),light=(r*.2126+g*.7152+b*.0722)/93;data[i]=r+(Math.min(255,tr*light)-r)*strength;data[i+1]=g+(Math.min(255,tg*light)-g)*strength;data[i+2]=b+(Math.min(255,tb*light)-b)*strength;}
  ctx.putImageData(pixels,0,0);
}
function SWDrawBanner(ctx,x,y,width,height,color,time=0,crest=true) {
  ctx.save();ctx.strokeStyle='#594c37';ctx.lineWidth=Math.max(.7,width*.05);ctx.beginPath();ctx.moveTo(x,y+height*.27);ctx.lineTo(x,y-height);ctx.stroke();
  const wave=Math.sin(time*2+x*.025)*width*.09;ctx.beginPath();ctx.moveTo(x+1,y-height);ctx.bezierCurveTo(x+width*.35,y-height+wave,x+width*.72,y-height-wave,x+width,y-height+3);ctx.lineTo(x+width*.85,y-height*.5);ctx.bezierCurveTo(x+width*.5,y-height*.45-wave,x+width*.3,y-height*.5+wave,x+1,y-height*.48);ctx.closePath();const g=ctx.createLinearGradient(x,y,x+width,y);g.addColorStop(0,SWRigColor(color,.72));g.addColorStop(.43,color);g.addColorStop(1,SWRigColor(color,.85));ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#d1ba7b90';ctx.lineWidth=.6;ctx.stroke();
  if(crest){ctx.strokeStyle='#e1c88f';ctx.lineWidth=Math.max(.7,width*.06);const cx=x+width*.43,cy=y-height*.75;ctx.beginPath();ctx.moveTo(cx-width*.12,cy+2);ctx.lineTo(cx-width*.12,cy-3);ctx.lineTo(cx,cy-5);ctx.lineTo(cx+width*.12,cy-3);ctx.lineTo(cx+width*.12,cy+2);ctx.closePath();ctx.stroke();}ctx.restore();
}
function SWDrawTownAppearance(ctx,building,appearance={},time=0) {
  const a=SWRenderAppearance(appearance),point=vu(building.x,building.y),{width,height}=SWBuildingSize(building),color=SWBannerColors[a.banner]||SWBannerColors.blue;
  if(['keep','barracks','market','harbor','storehouse','tower'].includes(building.kind)){
    const side=(building.facing||0)%2?-1:1;SWDrawBanner(ctx,point.x+width*.24*side,point.y-height*.61,width*.17,height*.25,color,time);
  }
  if(a.festival&&['cottage','market','tavern'].includes(building.kind)){
    ctx.save();ctx.strokeStyle='#89764c';ctx.lineWidth=.75;ctx.beginPath();ctx.moveTo(point.x-width*.35,point.y-height*.43);ctx.quadraticCurveTo(point.x,point.y-height*.31,point.x+width*.35,point.y-height*.43);ctx.stroke();for(let i=0;i<7;i++){const t=i/6,x=point.x+(t-.5)*width*.7,y=point.y-height*(.43-.12*Math.sin(t*Math.PI));ctx.fillStyle=i%2?color:'#cbb783';ctx.beginPath();ctx.moveTo(x-2,y);ctx.lineTo(x+3,y+.8);ctx.lineTo(x+1,y+7);ctx.closePath();ctx.fill();}ctx.restore();
  }
}
function SWDrawOrnament(ctx,ornament,appearance={},time=0,ghost=false) {
  const point=vu(ornament.x,ornament.y),a=SWRenderAppearance(appearance),color=SWBannerColors[a.banner]||SWBannerColors.blue;
  ctx.save();if(ghost)ctx.globalAlpha=.7;ctx.fillStyle='#26342b36';ctx.beginPath();ctx.ellipse(point.x,point.y+2,12,5,0,0,Math.PI*2);ctx.fill();
  if(ornament.kind==='standard')SWDrawBanner(ctx,point.x-2,point.y,18,46,color,time);
  else if(ornament.kind==='lantern'){
    const m=SWRigMesh();m.cylinder(0,0,0,.15,.1,.12,'stone',8);m.cylinder(0,0,.1,.037,.025,1.1,'metal',8);m.box(0,0,1.15,.25,.25,.27,'gold');m.cylinder(0,0,1.41,.2,.06,.15,'metal',8);SWRigDraw(ctx,m,{x:point.x,y:point.y,scale:27});const g=ctx.createRadialGradient(point.x,point.y-31,1,point.x,point.y-31,17);g.addColorStop(0,'#ffda8660');g.addColorStop(1,'#ffc96b00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(point.x,point.y-31,17,0,Math.PI*2);ctx.fill();
  }else if(ornament.kind==='statue'){
    const m=SWRigMesh();m.box(0,0,0,.8,.7,.15,'stoneDark');m.box(0,0,.15,.56,.5,.55,'stone');SWRigDraw(ctx,m,{x:point.x,y:point.y,scale:24});SWRigDraw(ctx,SWRigSoldier('idle',0,7),{x:point.x,y:point.y-14,scale:18,yaw:(ornament.facing||0)*Math.PI/2,palette:{cloth:'#7d8f83',metal:'#889b8a',steel:'#9aab91',wood:'#6d8375',skin:'#91a28c',leather:'#73897a',gold:'#a1a88b'}});
  }else SWDrawGarden(ctx,{...ornament,kind:'garden',variant:'flowers'},time);
  ctx.restore();
}
const SWLandmarkCache=new Map();
function SWDrawLandmark(ctx,landmark,appearance={},time=0,reduced=false,images={}) {
  if(!landmark||landmark.kind!=='lighthouse'||landmark.stage<1)return;
  const point=vu(landmark.x??-1,landmark.y??7),a=SWRenderAppearance(appearance),palette=SWAppearanceColors[a.palette]||SWAppearanceColors.coastal,key=landmark.stage+':'+a.palette;
  let tile=SWLandmarkCache.get(key+':'+!!images.lighthouse12);if(!tile){tile=document.createElement('canvas');tile.width=280;tile.height=360;const painter=tile.getContext('2d');if(images.lighthouse12){const frame=SWAtlasFrame(images.lighthouse12,3,1,Math.min(3,landmark.stage)-1,0),scale=168/Math.max(...[0,1,2].map(col=>SWAtlasFrame(images.lighthouse12,3,1,col,0).w));painter.drawImage(images.lighthouse12,frame.x,frame.y,frame.w,frame.h,140-frame.w*scale/2,336-frame.h*scale,frame.w*scale,frame.h*scale);SWColorBuildingTile(painter,280,360,a);}else SWRigDraw(painter,SWRigLighthouse(landmark.stage),{x:140,y:336,scale:75,palette:{cloth:palette.cloth}});SWLandmarkCache.set(key+':'+!!images.lighthouse12,tile);}
  ctx.save();ctx.fillStyle='#2835293f';ctx.beginPath();ctx.ellipse(point.x,point.y+3,29,12,0,0,Math.PI*2);ctx.fill();ctx.drawImage(tile,point.x-70,point.y-168,140,180);
  if(landmark.stage>=3){const lantern={x:point.x,y:point.y-117},glow=ctx.createRadialGradient(lantern.x,lantern.y,0,lantern.x,lantern.y,15);glow.addColorStop(0,'#ffecb4a0');glow.addColorStop(.25,'#f9d58938');glow.addColorStop(1,'#f4cc7e00');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(lantern.x,lantern.y,15,0,Math.PI*2);ctx.fill();if(!reduced){const angle=time*.21,dx=Math.cos(angle)*140,dy=Math.sin(angle)*34,g=ctx.createLinearGradient(lantern.x,lantern.y,lantern.x+dx,lantern.y+dy);g.addColorStop(0,'#ffe7aa28');g.addColorStop(1,'#ffe7aa00');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(lantern.x,lantern.y);ctx.lineTo(lantern.x+dx,lantern.y+dy-18);ctx.lineTo(lantern.x+dx,lantern.y+dy+18);ctx.closePath();ctx.fill();}}
  ctx.restore();
}
function SWDrawHarborAppearance(ctx,buildings,fleet,appearance={},time=0,images={}) {
  const a=SWRenderAppearance(appearance);if(typeof SWCoastBoats!=='function')return;for(const boat of SWCoastBoats(buildings,fleet)){const width=boat.ship.kind==='cutter'?56:66,sculpted=SW13ShipArt(boat.ship.kind,boat.ship.level,images);SWDrawSail(ctx,boat.x,boat.y,width,SWBannerColors[a.sail]||SWBannerColors.linen,time,0,sculpted?.image||images.naval,sculpted?.rect||Yl.naval[wc[boat.ship.kind]?.sprite||0]);}
}
const SWNavalTintCache=new Map();
function SWDrawSail(ctx,x,y,width,color,time=0,heading=0,image=null,rect=null) {
  if(color===SWBannerColors.linen||!image||!rect)return;
  const key=rect.join(',')+':'+color;let tile=SWNavalTintCache.get(key);
  if(!tile){tile=document.createElement('canvas');tile.width=rect[2];tile.height=rect[3];const p=tile.getContext('2d');p.drawImage(image,...rect,0,0,tile.width,tile.height);const pixels=p.getImageData(0,0,tile.width,tile.height),data=pixels.data,n=parseInt(color.slice(1),16),rgb=[n>>16,(n>>8)&255,n&255];for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2];if(data[i+3]<10||b<r*1.14||b<g*.91)continue;const strength=Math.min(.94,(b-r)/36),light=(r*.21+g*.72+b*.07)/84;for(let j=0;j<3;j++)data[i+j]+=(Math.min(255,rgb[j]*light)-data[i+j])*strength;}p.putImageData(pixels,0,0);SWNavalTintCache.set(key,tile);}
  const height=width*rect[3]/rect[2];ctx.save();ctx.translate(x,y);if(Math.cos(heading)-Math.sin(heading)<0)ctx.scale(-1,1);ctx.drawImage(tile,-width/2,-height,width,height);ctx.restore();
}
function SWDrawCommanderAccessory(ctx,point,appearance={},height=57,time=0) {
  const a=SWRenderAppearance(appearance);if(a.commander==='standard')return;ctx.save();ctx.translate(point.x,point.y-height*.80);
  if(a.commander==='laurel'){for(const side of[-1,1])for(let i=0;i<4;i++){ctx.fillStyle=i%2?'#c6ad68':'#a58b51';ctx.beginPath();ctx.ellipse(side*(4+i*.55),-i*1.6,1.7,.75,side*(-.4-i*.1),0,Math.PI*2);ctx.fill();}}
  else{const color=(SWAppearanceColors[a.palette]||SWAppearanceColors.coastal).cloth;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-4,10);ctx.lineTo(3,12);ctx.quadraticCurveTo(9+Math.sin(time*2)*2,20,4,30);ctx.lineTo(-5,28);ctx.closePath();ctx.fill();ctx.strokeStyle='#c5aa6b';ctx.lineWidth=.8;ctx.stroke();ctx.fillStyle='#c7b37d';ctx.beginPath();ctx.arc(0,12,1.4,0,Math.PI*2);ctx.fill();}ctx.restore();
}
function SWDrawCombatEvent(ctx,event,age,reduced=false) {
  if(age<0||age>1800||!['impact','heal','breach','ability'].includes(event.type))return;const point=vu(event.tx??event.x,event.ty??event.y),heavy=['cannon','mortar','bombtower','grenadier','trebuchet','naval','ram'].includes(event.kind),water=event.impact==='ship'||event.targetNaval,heal=event.type==='heal',p=age/1800,seed=String(event.id||event.kind||'event').split('').reduce((s,c)=>s+c.charCodeAt(0),0);
  ctx.save();const ground=point.y-(water?3:18),radius=heavy?30:10;
  if(heal){const q=Math.min(1,age/700);ctx.strokeStyle=`rgba(151,196,157,${(1-q)*.8})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(point.x,point.y,10+q*8,4+q*3,0,0,Math.PI*2);ctx.stroke();ctx.restore();return;}
  if(age<180){const flash=ctx.createRadialGradient(point.x,ground,0,point.x,ground,radius);flash.addColorStop(0,`rgba(255,237,182,${(1-age/180)*.9})`);flash.addColorStop(.32,`rgba(232,163,82,${(1-age/180)*.7})`);flash.addColorStop(1,'#dda24d00');ctx.fillStyle=flash;ctx.beginPath();ctx.arc(point.x,ground,radius,0,Math.PI*2);ctx.fill();}
  if(reduced){ctx.restore();return;}
  if(age<500){const t=age/500;ctx.strokeStyle=water?`rgba(208,235,229,${(1-t)*.6})`:`rgba(183,164,126,${(1-t)*.4})`;ctx.lineWidth=heavy?2:1;ctx.beginPath();ctx.ellipse(point.x,ground+15,radius*t*1.7,radius*t*.5,0,0,Math.PI*2);ctx.stroke();}
  for(let i=0;i<(heavy?14:4);i++){const angle=i*2.399+seed*.07,life=700+(i%4)*180;if(age>life)continue;const t=age/life,speed=(heavy?32:11)*(0.6+(i%4)*.2),x=point.x+Math.cos(angle)*speed*t,y=ground+Math.sin(angle)*speed*t*.45-Math.sin(t*Math.PI)*(heavy?27:11);ctx.globalAlpha=(1-t)*.8;ctx.fillStyle=water?'#d7e9da':['#7d6b50','#b3a280','#655947'][i%3];ctx.save();ctx.translate(x,y);ctx.rotate(angle+t*4);ctx.fillRect(-1,-1,water?1.5:2.4,water?4:1.8);ctx.restore();}
  if(heavy&&!water){ctx.globalAlpha=1;for(let i=0;i<6;i++){const delay=i*75,t=Math.max(0,Math.min(1,(age-delay)/1450));if(age<delay)continue;const x=point.x+Math.sin(seed+i*13)*11+t*17,y=ground-12-t*38-(i%2)*8,r=4+t*18,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(93,86,70,${(1-t)*.30})`);g.addColorStop(1,'rgba(109,99,78,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}}
  ctx.restore();
}
function SWDrawEscortCue(ctx,unit,objective,time=0,scale=1,reduced=false) {
  if(!unit?.sagaEscort||unit.hp<=0)return;const point=vu(unit.x,unit.y),isShip=!!unit.naval,target=isShip?vu(-3.5,-1.1):vu(-2,3),height=isShip?80:35;
  ctx.save();ctx.strokeStyle=unit.rescued?'#a7d39ebd':'#d9c485b0';ctx.lineWidth=1.3/scale;ctx.beginPath();ctx.ellipse(point.x,point.y+3,isShip?29:12,isShip?9:5,0,0,Math.PI*2);ctx.stroke();
  if(!unit.rescued&&!unit.waitingForBattery){ctx.setLineDash([3/scale,7/scale]);ctx.strokeStyle='#dfd4a347';ctx.lineWidth=1/scale;ctx.beginPath();ctx.moveTo(point.x,point.y);ctx.lineTo(target.x,target.y);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='#d0c58fa0';ctx.beginPath();ctx.moveTo(target.x-5/scale,target.y-3/scale);ctx.lineTo(target.x,target.y);ctx.lineTo(target.x+5/scale,target.y-3/scale);ctx.stroke();}
  const bar=28/scale;ctx.fillStyle='#102524e6';ctx.fillRect(point.x-bar/2,point.y-height-7/scale,bar,3/scale);ctx.fillStyle=unit.hp/unit.maxHp<.35?'#c57864':'#cfbb7a';ctx.fillRect(point.x-bar/2,point.y-height-7/scale,bar*Math.max(0,unit.hp/unit.maxHp),3/scale);ctx.font=`600 ${9/scale}px system-ui`;ctx.textAlign='center';ctx.lineWidth=2.5/scale;ctx.strokeStyle='#17342dcc';ctx.strokeText(isShip?'Repair vessel':'Engineer',point.x,point.y-height-12/scale);ctx.fillStyle='#eee1b8';ctx.fillText(isShip?'Repair vessel':'Engineer',point.x,point.y-height-12/scale);ctx.restore();
}
function SWCosmeticPreview({state,item,appearance={}}) {
  const ref=C.useRef(null),a=SWRenderAppearance(appearance),key=JSON.stringify(a)+':'+(item?.id||'');
  C.useEffect(()=>{let alive=true,raf=0;const images={};Promise.all(Object.entries({...SWDirectionalFiles,...SWAnimationFiles,atlas:'buildings.webp',naval:'naval.webp',coastLand:'sculpted-coast-v13.png',commanders:'commanders.webp'}).map(async([name,file])=>images[name]=await _u('/art/'+file))).then(()=>{if(!alive||!ref.current)return;images.appearance=a;const c=ref.current,ctx=c.getContext('2d'),start=performance.now();const draw=now=>{if(!alive)return;const time=(now-start)/1000;ctx.clearRect(0,0,640,360);ctx.fillStyle='#23392f';ctx.fillRect(0,0,640,360);if(images.coastLand)ctx.drawImage(images.coastLand,120,70,880,640,0,0,640,360);ctx.fillStyle='#10231c35';ctx.fillRect(0,0,640,360);ctx.save();ctx.translate(-220,-15);SWDrawRoads(ctx,[{kind:'road',x:1,y:1},{kind:'road',x:2,y:1},{kind:'road',x:3,y:1},{kind:'road',x:3,y:2}],[],a);for(const b of[{id:'preview-keep',kind:'keep',level:7,facing:0,x:1,y:1},{id:'preview-home',kind:'cottage',level:5,facing:1,x:3,y:1}]){const point=vu(b.x,b.y);ctx.drawImage(SWBuildingTile(b,images),point.x-160,point.y-320,320,360);SWDrawTownAppearance(ctx,b,a,time);}SWDrawOrnament(ctx,{kind:item?.value&&['lantern','standard','planter','statue'].includes(item.value)?item.value:'standard',x:2,y:2},a,time);ctx.restore();
    const slot=item?.slot||item?.category||String(item?.id||'').split(':')[0];
    if(slot==='sail'||slot==='ship'){ctx.save();ctx.translate(145,185);ctx.scale(1.8,1.8);ctx.translate(-600,-175);SWDrawNavalUnit(ctx,{kind:'galley',x:0,y:0,level:7,hp:100,maxHp:100,side:'attack',heading:0},images,time);ctx.restore();}
    else if(slot==='commander'||slot==='outfit'){ctx.save();ctx.translate(522,334);const id=Oc[state?.commander]?state.commander:Object.keys(Oc)[0],rect=Ql.commanders[Oc[id].sprite],height=142,width=height*rect[2]/rect[3];ctx.drawImage(images.commanders,...rect,-width/2,-height,width,height);SWDrawCommanderAccessory(ctx,{x:0,y:0},a,143,time);ctx.restore();}
    else if(a.landmark?.stage||slot==='landmark'){ctx.save();ctx.translate(420,-85);SWDrawLandmark(ctx,{kind:'lighthouse',stage:a.landmark?.stage||3,x:-1,y:7},a,time,false,images);ctx.restore();}
    raf=requestAnimationFrame(draw);};draw(performance.now());}).catch(()=>{});return()=>{alive=false;cancelAnimationFrame(raf)};},[key]);
  return C.createElement('canvas',{ref,width:640,height:360,className:'cosmetic-preview-canvas',style:{display:'block',width:'100%',height:'100%',objectFit:'contain',borderRadius:'12px'},role:'img','aria-label':`${item?.name||'Town appearance'} preview`});
}
