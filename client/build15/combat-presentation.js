// @ts-nocheck
// Presentation only. Combat state, hit timing and replay outcomes stay in the rules.
import {SWBuildingSize, SWBuildingTile, vu} from '../../frontend/legacy/presentation.js';

const SWBattleEffectBudget15=Object.freeze({activeImpacts:18,activeCollapses:3,rubbleTiles:32,collapseFragments:8,impactFragments:8,dustPuffs:5,damageSmoke:2});
const SWRubbleTiles15=new Map();
const SWTimberStructures15=new Set(['lumber','farm','cottage','market','builder','storehouse','workshop','tavern','harbor','barracks']);

function SWDestructionPhase15(age,reduced=false){
 const time=Math.max(0,Number.isFinite(age)?age:2000),clamp=value=>Math.max(0,Math.min(1,value));
 return{time,roof:reduced?1:clamp(time/720),walls:reduced?1:clamp((time-120)/720),base:reduced?1:clamp((time-220)/720),dust:reduced||time>=1550?0:Math.sin(clamp(time/1550)*Math.PI)*.30,debris:reduced?1:clamp(time/1050),settled:reduced||time>=1050};
}

function SWDamageProfile15(ratio,reduced=false){
 const hp=Math.max(0,Math.min(1,Number.isFinite(ratio)?ratio:1));
 const stage=hp<=0||hp>=.85?0:hp<.3?3:hp<.58?2:1;
 return{stage,smoke:reduced?0:Math.max(0,stage-1),flames:!reduced&&stage===3,scorch:stage===3?.38:stage===2?.22:.12};
}

function SWCombatEffectProfile15(event){
 const heavy=['cannon','mortar','bombtower','grenadier','trebuchet','naval','ram','bombard','galley'].includes(event.kind),water=event.impact==='ship'||event.targetNaval===true||['cutter','cog','galley','bombard'].includes(event.targetKind),fire=['cannon','mortar','bombtower','grenadier','flame'].includes(event.kind);
 return{heavy,water,fire,heal:event.type==='heal',breach:event.type==='breach',timber:water||SWTimberStructures15.has(event.targetKind),life:heavy||event.type==='breach'?1500:700,radius:water?(heavy?29:16):heavy?25:8};
}

function SWImpactPhase17(age,heavy=false,reduced=false){
 const time=Math.max(0,Number.isFinite(age)?age:2000),life=heavy?1500:700;
 if(reduced)return{contact:time<140?.45:0,shock:0,fragments:0,dust:0,settled:time>=140};
 return{contact:time<110?Math.pow(1-time/110,2):0,shock:Math.max(0,1-Math.abs(time-140)/140),fragments:Math.max(0,Math.min(1,(time-35)/(heavy?830:470))),dust:heavy&&time>90?Math.sin(Math.min(1,(time-90)/1410)*Math.PI)*.26:0,settled:time>=life};
}

function SWSelectCombatEffects15(events,now){
 return [...events].filter(event=>{const age=now-event.born;return age>=0&&age<SWCombatEffectProfile15(event).life;}).sort((a,b)=>{
  const priority=event=>event.type==='breach'?4:SWCombatEffectProfile15(event).heavy?3:event.type==='heal'?2:1;
  return priority(b)-priority(a)||b.born-a.born;
 }).slice(0,SWBattleEffectBudget15.activeImpacts);
}

function SWDrawRubble15(ctx,building,images,point,width){
 const timber=SWTimberStructures15.has(building.kind),variant=Math.abs((building.x||0)*31+(building.y||0)*17)%3,key=[building.kind,building.level,building.facing||0,variant,width,images.appearance?.palette,!!images.buildings13,!!images.utilities13].join(':');
 let tile=SWRubbleTiles15.get(key);
 if(!tile){
  tile=document.createElement('canvas');tile.width=256;tile.height=144;const p=tile.getContext('2d'),w=Math.min(width,190),seed=variant*19+building.kind.length*7,noise=i=>{const value=Math.sin(seed+i*37.17)*8317;return value-Math.floor(value);};p.translate(128,95);
  p.fillStyle='#302d2348';p.beginPath();p.ellipse(1,4,w*.44,w*.17,-.08,0,Math.PI*2);p.fill();
  const corners=[[-w*.37,0],[0,-w*.18],[w*.37,0],[0,w*.18]],footprint=()=>{p.beginPath();corners.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y));p.closePath();};
  footprint();p.fillStyle=timber?'#5d4b348f':'#747160a8';p.fill();p.strokeStyle='#4c493b7a';p.lineWidth=2;p.stroke();
  // Retain the original building's material and roof color in its fallen silhouette.
  // The authored artwork is clipped to its occupied footprint, not replaced by a new building.
  p.save();footprint();p.clip();p.globalAlpha=.48;p.filter='saturate(.60) brightness(.72)';p.scale(1,.24);p.drawImage(SWBuildingTile(building,images),-160,-320,320,360);p.restore();
  if(!timber){
   for(const side of[-1,1]){p.fillStyle=side<0?'#8d8671':'#aaa18a';p.beginPath();p.moveTo(side*w*.30,0);p.lineTo(side*w*.20,-w*.045);p.lineTo(side*w*.20,-12);p.lineTo(side*w*.25,-15);p.lineTo(side*w*.30,-9);p.closePath();p.fill();p.strokeStyle='#5d594959';p.lineWidth=.7;p.stroke();}
  }
  for(let i=0;i<14;i++){
   const angle=i*2.399,r=Math.sqrt(noise(i))*w*.31,x=Math.cos(angle)*r,y=Math.sin(angle)*r*.46;
   p.save();p.translate(x,y);p.rotate((noise(i+30)-.5)*1.1);
   if(timber&&i%3!==0){p.fillStyle=i%2?'#87613e':'#4f3e2c';p.fillRect(-7,-2,11+noise(i+10)*9,3.1);p.strokeStyle='#bf976157';p.lineWidth=.65;p.beginPath();p.moveTo(-6,-1);p.lineTo(8,-1);p.stroke();}
   else{const size=3+noise(i+20)*5;p.fillStyle=['#aaa087','#736d5b','#8d8773'][i%3];p.beginPath();p.moveTo(-size,0);p.lineTo(-size*.4,-size*.7);p.lineTo(size*.6,-size*.4);p.lineTo(size,.7);p.lineTo(0,size*.35);p.closePath();p.fill();p.strokeStyle='#ddd1aa4d';p.lineWidth=.6;p.stroke();}
   p.restore();
  }
  if(SWRubbleTiles15.size>=SWBattleEffectBudget15.rubbleTiles)SWRubbleTiles15.delete(SWRubbleTiles15.keys().next().value);SWRubbleTiles15.set(key,tile);
 }
 ctx.drawImage(tile,point.x-128,point.y-95,256,144);
}

function SWDrawStructureCollapse15(ctx,building,images,point,age,reduced){
 const {width,height}=SWBuildingSize(building),phase=SWDestructionPhase15(age,reduced),timber=SWTimberStructures15.has(building.kind);
 SWDrawRubble15(ctx,building,images,point,width);
 if(!phase.settled){
  const tile=SWBuildingTile(building,images),bands=[{top:-height-16,bottom:-height*.60,p:phase.roof},{top:-height*.60,bottom:-height*.20,p:phase.walls},{top:-height*.20,bottom:14,p:phase.base}];
  bands.forEach((band,index)=>{const progress=band.p,fall=Math.max(0,-band.bottom+3)*progress*progress;ctx.save();ctx.translate(point.x+(index-1)*width*.025*progress,point.y+fall);ctx.globalAlpha*=Math.min(1,(1-progress)*3.3);ctx.beginPath();ctx.rect(-width*.63,band.top,width*1.26,band.bottom-band.top);ctx.clip();ctx.drawImage(tile,-160,-320,320,360);ctx.restore();});
  for(let i=0;i<SWBattleEffectBudget15.collapseFragments;i++){const t=phase.debris,angle=i*2.399,travel=width*(.15+(i%3)*.045)*t,x=point.x+Math.cos(angle)*travel,y=point.y+Math.sin(angle)*travel*.42-Math.sin(t*Math.PI)*(11+(i%3)*4);ctx.save();ctx.globalAlpha*=1-t*.7;ctx.translate(x,y);ctx.rotate(angle+t*(i%2?1:-1)*1.5);ctx.fillStyle=timber?(i%2?'#946c47':'#5c4633'):(i%2?'#b3a78d':'#777260');ctx.fillRect(-3,-1.5,timber?9:5,timber?2.5:4);ctx.restore();}
 }
 if(phase.dust>0){ctx.save();for(let i=0;i<SWBattleEffectBudget15.dustPuffs;i++){const t=Math.min(1,phase.time/1550),angle=i*2.399,x=point.x+Math.cos(angle)*width*.31*t,y=point.y+Math.sin(angle)*width*.10*t-t*height*.12,r=7+t*width*.12,gradient=ctx.createRadialGradient(x,y,0,x,y,r);gradient.addColorStop(0,'rgba(153,138,109,'+phase.dust+')');gradient.addColorStop(1,'rgba(153,138,109,0)');ctx.fillStyle=gradient;ctx.beginPath();ctx.ellipse(x,y,r,r*.62,0,0,Math.PI*2);ctx.fill();}ctx.restore();}
}

function SWDrawBuildingDamage15(ctx,building,unit,images,point,time,reduced=false){
 if(!unit||unit.hp<=0)return;const profile=SWDamageProfile15(unit.hp/unit.maxHp,reduced);if(!profile.stage)return;
 const {width,height}=SWBuildingSize(building),seed=(building.x||0)*17+(building.y||0)*29,timber=SWTimberStructures15.has(building.kind);
 ctx.save();ctx.translate(point.x,point.y);
 for(let i=0;i<profile.stage;i++){
  const x=Math.sin(seed+i*7)*width*.22,y=-height*(.18+(i%2)*.21);ctx.fillStyle='rgba(38,33,26,'+profile.scorch+')';ctx.beginPath();ctx.ellipse(x,y,6+i*2,9+i*3,-.3,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#342e278f';ctx.lineWidth=timber?1.2:1.65;ctx.beginPath();ctx.moveTo(x-3,y-8);ctx.lineTo(x+2,y-2);ctx.lineTo(x-1,y+3);ctx.lineTo(x+3,y+8);ctx.stroke();
 }
 for(let i=0;i<Math.min(profile.smoke,SWBattleEffectBudget15.damageSmoke);i++){
  const phase=((time*.26+i*.5+seed*.031)%1+1)%1,x=Math.sin(seed+i*7)*width*.22+phase*7,y=-height*(.34+i*.1)-phase*29,r=3+phase*10,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(54,50,41,'+((1-phase)*.30)+')');g.addColorStop(1,'rgba(54,50,41,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 }
 if(profile.flames){const x=Math.sin(seed)*width*.22,y=-height*.18,flicker=.84+.16*Math.sin(time*7.5+seed);ctx.fillStyle='#c87639bd';ctx.beginPath();ctx.moveTo(x-3,y+3);ctx.quadraticCurveTo(x-5,y-3,x+Math.sin(time*4+seed),y-13*flicker);ctx.quadraticCurveTo(x+4,y-1,x+3,y+3);ctx.fill();ctx.fillStyle='#efd080bd';ctx.beginPath();ctx.ellipse(x,y,1.3,3.3*flicker,0,0,Math.PI*2);ctx.fill();}
 ctx.restore();
}

function SWDrawCombatEvent15(ctx,event,age,reduced=false){
 const effect=SWCombatEffectProfile15(event);if(age<0||age>=effect.life||!['impact','heal','breach','ability'].includes(event.type))return;
 const point=vu(event.tx??event.x,event.ty??event.y),ground=point.y-(effect.water?8:18),seed=String(event.id||event.kind||'event').split('').reduce((sum,char)=>sum+char.charCodeAt(0),0),radius=effect.radius;
 ctx.save();
 if(effect.heal){const t=Math.min(1,age/650);ctx.strokeStyle='rgba(154,208,176,'+((1-t)*.65)+')';ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(point.x,point.y,reduced?12:10+t*7,reduced?4:4+t*2,0,0,Math.PI*2);ctx.stroke();ctx.restore();return;}
 // Restrained contact cue remains in reduced motion; never animate smoke or spray.
 if(reduced){if(age<220){ctx.strokeStyle=effect.water?'#c3e4dfaa':'#e1d2a6bb';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(point.x,ground,radius*.36,radius*.18,0,0,Math.PI*2);ctx.stroke();}ctx.restore();return;}
 const phase=SWImpactPhase17(age,effect.heavy,reduced);
 if(phase.contact>0){const alpha=phase.contact*.86;ctx.fillStyle=effect.fire?'rgba(255,218,145,'+alpha+')':effect.water?'rgba(226,248,245,'+alpha+')':'rgba(237,221,181,'+(alpha*.75)+')';ctx.beginPath();ctx.ellipse(point.x,ground,radius*.32,radius*.23,0,0,Math.PI*2);ctx.fill();}
 if(phase.shock>0&&effect.heavy){ctx.save();ctx.globalAlpha*=phase.shock*.55;ctx.strokeStyle=effect.water?'#c7edf0':effect.fire?'#e7b96c':'#cdb88f';ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(point.x,ground+4,radius*(.2+age/340),radius*(.08+age/920),0,0,Math.PI*2);ctx.stroke();ctx.restore();}
 if(effect.water){
  const t=Math.min(1,age/1000);for(let i=0;i<2;i++){const q=Math.max(0,t-i*.10);ctx.strokeStyle='rgba(204,231,226,'+((1-t)*(.57-i*.15))+')';ctx.lineWidth=1.4-i*.3;ctx.beginPath();ctx.ellipse(point.x,point.y+2,(8+radius*q)*(1+i*.3),3+radius*q*.28,0,0,Math.PI*2);ctx.stroke();}
 }
 const fragments=effect.heavy?SWBattleEffectBudget15.impactFragments:3;
 for(let i=0;i<fragments;i++){
  const delay=35+(i%3)*12,life=520+(i%3)*170;if(age<delay||age-delay>life)continue;const t=(age-delay)/life,angle=i*2.399+seed*.07,spread=radius*(.6+(i%3)*.19)*t,x=point.x+Math.cos(angle)*spread,y=ground+Math.sin(angle)*spread*.45-Math.sin(t*Math.PI)*(effect.water?26:effect.heavy?17:8);
  ctx.save();ctx.globalAlpha*=1-t;ctx.translate(x,y);ctx.rotate(angle+t*2);const spray=effect.water&&i%3!==0;ctx.fillStyle=spray?'#d7ece4':effect.timber?'#997247':i%2?'#a99d82':'#736d5c';ctx.fillRect(-1,-1,spray?1.25:effect.timber?4.5:2.7,spray?3.8:1.9);ctx.restore();
 }
 if(effect.heavy&&!effect.water&&phase.dust>0){const t=Math.min(1,age/1500);for(let i=0;i<2;i++){const x=point.x+(i?1:-1)*8+t*8,y=ground+5-t*18,r=5+t*13,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(130,117,92,'+phase.dust+')');g.addColorStop(1,'rgba(130,117,92,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,r,r*.65,0,0,Math.PI*2);ctx.fill();}}
 ctx.restore();
}

function SWDrawDeploymentCue17(ctx,target,scale,time,reduced=false){
 if(!target||!Number.isFinite(target.x)||!Number.isFinite(target.y))return;
 const point=vu(target.x,target.y),valid=target.valid!==false,color=valid?'#a6e3cc':'#e8a297',pulse=reduced?0:Math.sin(time/160)*1.5,carrier=target.carrier;
 ctx.save();ctx.lineWidth=1.8/scale;ctx.strokeStyle=color;
 if(valid&&carrier){
  const from=vu(carrier.x,carrier.y),destination=vu(-2.6,target.y),bend={x:from.x+(destination.x-from.x)*.45,y:from.y+(destination.y-from.y)*.25};
  ctx.setLineDash([7/scale,6/scale]);ctx.lineDashOffset=reduced?0:-time/55/scale;ctx.globalAlpha=.65;ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.quadraticCurveTo(bend.x,bend.y,destination.x,destination.y);ctx.lineTo(point.x,point.y);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
  ctx.beginPath();ctx.ellipse(from.x,from.y,20/scale,8/scale,0,0,Math.PI*2);ctx.stroke();
 }
 ctx.beginPath();ctx.ellipse(point.x,point.y,(16+pulse)/scale,(7+pulse*.4)/scale,0,0,Math.PI*2);ctx.stroke();
 if(!valid){ctx.beginPath();ctx.moveTo(point.x-5/scale,point.y-5/scale);ctx.lineTo(point.x+5/scale,point.y+5/scale);ctx.moveTo(point.x+5/scale,point.y-5/scale);ctx.lineTo(point.x-5/scale,point.y+5/scale);ctx.stroke();}
 else{ctx.beginPath();ctx.moveTo(point.x,point.y-17/scale);ctx.lineTo(point.x-5/scale,point.y-24/scale);ctx.lineTo(point.x+5/scale,point.y-24/scale);ctx.closePath();ctx.fillStyle=color;ctx.fill();}
 const label=String(target.label||'Deploy');let x=point.x,y=point.y-45/scale;ctx.font='650 '+12/scale+'px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';const width=Math.min(240/scale,ctx.measureText(label).width+20/scale),matrix=ctx.getTransform?.();if(matrix&&ctx.canvas&&matrix.a>0&&matrix.d>0){const left=-matrix.e/matrix.a+8/scale,right=(ctx.canvas.width-matrix.e)/matrix.a-8/scale,top=-matrix.f/matrix.d+16/scale;x=Math.max(left+width/2,Math.min(right-width/2,x));y=Math.max(top,y);}
 ctx.fillStyle='#102a32ee';ctx.beginPath();ctx.roundRect(x-width/2,y-12/scale,width,24/scale,7/scale);ctx.fill();ctx.fillStyle=color;ctx.fillText(label,x,y,width-12/scale);ctx.restore();
}

function SWDrawNavalIntent17(ctx,ship,frame,input,time,scale,selected=false,reduced=false){
 if(!ship.naval||ship.hp<=0||ship.side!=='attack')return;
 const point=vu(ship.x,ship.y),color=ship.command?.type==='withdraw'?'#d7ad72':'#83d3ce';
 ctx.save();
 if(selected){ctx.strokeStyle=color;ctx.lineWidth=1.5/scale;ctx.beginPath();ctx.ellipse(point.x,point.y+3,28/scale,12/scale,0,0,Math.PI*2);ctx.stroke();}
 const queued=(input?.orders||[]).filter(order=>order.shipId===ship.shipId&&order.time<=time&&order.time>time-1.5),target=ship.targetId&&frame.units.find(unit=>unit.id===ship.targetId&&unit.hp>0);
 if(selected&&target){const end=vu(target.x,target.y);ctx.globalAlpha=.3;ctx.strokeStyle='#e9b074';ctx.lineWidth=1/scale;ctx.setLineDash([4/scale,7/scale]);ctx.beginPath();ctx.moveTo(point.x,point.y-12);ctx.lineTo(end.x,end.y-12);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=.8;ctx.beginPath();ctx.ellipse(end.x,end.y,12/scale,5/scale,0,0,Math.PI*2);ctx.stroke();}
 if(selected&&ship.command?.type==='move'&&Number.isFinite(ship.command.x)){const destination=vu(ship.command.x,ship.command.y);ctx.strokeStyle=color;ctx.lineWidth=1.2/scale;ctx.setLineDash([5/scale,6/scale]);ctx.beginPath();ctx.moveTo(point.x,point.y);for(const waypoint of ship.detour14?.points||[]){const via=vu(waypoint.x,waypoint.y);ctx.lineTo(via.x,via.y);}ctx.lineTo(destination.x,destination.y);ctx.stroke();ctx.setLineDash([]);}
 if(queued.length){const latest=queued.at(-1),end=vu(latest.x,latest.y),age=Math.max(0,time-latest.time);ctx.globalAlpha=Math.max(0,1-age/1.5)*.7;ctx.strokeStyle=color;ctx.lineWidth=2/scale;ctx.beginPath();ctx.ellipse(end.x,end.y,(12+(reduced?0:age*8))/scale,(5+(reduced?0:age*3))/scale,0,0,Math.PI*2);ctx.stroke();}
 ctx.restore();
}

export {SWBattleEffectBudget15, SWDestructionPhase15, SWDamageProfile15, SWCombatEffectProfile15, SWSelectCombatEffects15, SWDrawRubble15, SWDrawStructureCollapse15, SWDrawBuildingDamage15, SWDrawCombatEvent15, SWImpactPhase17, SWDrawDeploymentCue17, SWDrawNavalIntent17};
