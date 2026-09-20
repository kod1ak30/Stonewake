// A single pointer session follows the finger from the troop rail into the map.
const SWGestureBridge14={surface:null,session:null,points:new Map(),installed:false};
function SWInstallPointers14(){
 if(SWGestureBridge14.installed)return;SWGestureBridge14.installed=true;
 const cancel=()=>{const g=SWGestureBridge14.session;if(g){clearTimeout(g.hold);clearInterval(g.repeat);g.cancelled=true;g.surface.preview(null);SWGestureBridge14.session=null;}};
 window.addEventListener('pointerdown',event=>{SWGestureBridge14.points.set(event.pointerId,{x:event.clientX,y:event.clientY});if(SWGestureBridge14.points.size>1){cancel();SWGestureBridge14.surface?.pinch?.([...SWGestureBridge14.points.values()])}},true);
 window.addEventListener('pointermove',event=>{if(SWGestureBridge14.points.has(event.pointerId))SWGestureBridge14.points.set(event.pointerId,{x:event.clientX,y:event.clientY});if(SWGestureBridge14.points.size>1){SWGestureBridge14.surface?.pinch?.([...SWGestureBridge14.points.values()]);return;}const g=SWGestureBridge14.session;if(!g||g.pointer!==event.pointerId||g.cancelled)return;
  g.x=event.clientX;g.y=event.clientY;const dx=g.x-g.startX,dy=g.y-g.startY;
  if(g.origin==='tray'&&!g.recognized){const bounds=g.rail?.getBoundingClientRect?.(),leftRail=bounds?g.y<bounds.top-6||g.y>bounds.bottom+6:Math.abs(dy)>=24;
   if(leftRail&&Math.abs(dy)>=24){g.recognized=true;g.scrolling=false;}
   else{if(Math.abs(dx)>14&&Math.abs(dx)>Math.abs(dy)*1.45)g.scrolling=true;if(g.scrolling&&g.rail)g.rail.scrollLeft=g.scroll-dx;return;}}
  if(Math.hypot(dx,dy)>8)g.moved=true;
  const target=g.surface.target(g.x,g.y);g.target=target;g.surface.preview(target);
  if((g.origin==='tray'&&g.recognized||g.moved)&&target){if(!g.started){g.started=true;clearTimeout(g.hold);SWFirePointer14(g);g.repeat=setInterval(()=>SWFirePointer14(g),150)}else if(performance.now()-g.lastTime>=145)SWFirePointer14(g);}
 },true);
 window.addEventListener('pointerup',event=>{const g=SWGestureBridge14.session;SWGestureBridge14.points.delete(event.pointerId);SWGestureBridge14.surface?.endPinch?.([...SWGestureBridge14.points]);if(!g||g.pointer!==event.pointerId)return;if(!g.cancelled&&g.origin==='map'&&!g.moved&&!g.started&&g.target)SWFirePointer14(g);cancel()},true);
 window.addEventListener('pointercancel',event=>{SWGestureBridge14.points.delete(event.pointerId);SWGestureBridge14.surface?.endPinch?.([...SWGestureBridge14.points]);cancel()},true);window.addEventListener('blur',()=>{cancel();SWGestureBridge14.points.clear()});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancel();SWGestureBridge14.points.clear()}});
}
function SWFirePointer14(g){
 if(g.cancelled||SWGestureBridge14.points.size>1||!g.surface.active())return false;
 const target=g.surface.target(g.x,g.y);g.target=target;g.surface.preview(target);if(!target)return false;
 const accepted=g.surface.fire(target,g.kind);if(accepted){g.started=true;g.lastTime=performance.now();}return accepted;
}
function SWBeginPointer14(event,kind,origin='map'){
 SWInstallPointers14();const surface=SWGestureBridge14.surface;if(!surface?.active()||SWGestureBridge14.points.size>1)return false;
 if(event.pointerType==='mouse'&&event.button!==0)return false;
 const previous=SWGestureBridge14.session;if(previous){clearTimeout(previous.hold);clearInterval(previous.repeat);previous.cancelled=true;}
 const target=surface.target(event.clientX,event.clientY);if(origin==='map'&&!target)return false;
 event.preventDefault();event.currentTarget.setPointerCapture?.(event.pointerId);const rail=event.currentTarget.closest?.('.sw-deploy-strip14');
 const g={surface,pointer:event.pointerId,kind,origin,x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,target,recognized:origin==='map',started:false,cancelled:false,moved:false,lastTime:0,rail,scroll:rail?.scrollLeft||0};SWGestureBridge14.session=g;surface.preview(target);
 if(origin==='map')g.hold=setTimeout(()=>{if(g.cancelled)return;if(SWFirePointer14(g))g.repeat=setInterval(()=>SWFirePointer14(g),150)},220);return true;
}
function SWStartTrayDrag14(event,kind,onSelect){onSelect(kind);SWBeginPointer14(event,kind,'tray');}
function SWDeploymentTarget14(input,defense,world,scale){
 if(input?.campaignType!=='sea')return SWDeploymentTarget(defense,world,scale);
 const tile=yu(world.x,world.y),y=Math.round(tile.y),target={x:-1,y};if(!SWSeaLanding14(input.defense,-1,y))return null;const p=vu(-1,y);return Math.hypot(p.x-world.x,p.y-world.y)*scale<46?target:null;
}
function SWBattleWorker(){
 const functions=[gl,ml,pl,fl,wl,sl,jl,SWMedicTarget,SWNavalStrike,SWApplyTroopStats,SWTroopDamageFactor,SWTroopIncomingFactor,SWTroopSplash,SWMedicHeals,SWNavalUnit,SWNavalTarget,SWCreateNavalUnit,SWEnemyNavalUnits,SWNavalStep,SWLegacyNavalStep13,SWSagaSpawn,SWSagaStep,SWSagaObjective,Nl,SWFleetUnits14,SWCreateShip14,SWSeaEnemyUnits14,SWOrders14,SWSeaLanding14,SWValidateShipOrders14,SWSeaStep14,SWSeaObjective14];
 const source='const J='+JSON.stringify(J)+',Cc='+JSON.stringify(Cc)+',Oc='+JSON.stringify(Oc)+',SWShipRoles14='+JSON.stringify(SWShipRoles14)+';const ul='+ul.toString()+',ll='+ll.toString()+',dl='+dl.toString()+';\n'+functions.map(fn=>fn.toString()).join('\n')+'\nonmessage=e=>{try{postMessage({id:e.data.id,result:gl(e.data.input)})}catch(error){postMessage({id:e.data.id,error:error.message})}};';
 let worker=null,url=null,busy=false,pending=null,current=null,generation=0,closed=false,lastPublished=0,cancelledBefore=0;
 const run=()=>{if(busy||!pending||closed)return;current=pending;pending=null;busy=true;if(worker)worker.postMessage({id:current.id,input:current.input});else setTimeout(()=>{if(closed)return;try{complete({id:current.id,result:Kl(current.input)})}catch(error){complete({id:current.id,error:error.message})}},0)};
 const complete=message=>{if(closed||message.id!==current?.id)return;busy=false;const job=current;
  // Publish completed prefixes during painting, so a stream of new orders never freezes animation.
  if(message.id>lastPublished&&message.id>cancelledBefore){if(message.error)job.onError?.(message.error);else{lastPublished=message.id;job.callback(message.result,{pending:!!pending})}}run();};
 try{url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));worker=new Worker(url);worker.onmessage=e=>complete(e.data);worker.onerror=()=>{worker.terminate();worker=null;busy=false;if(current&&!pending)pending=current;run()}}catch{}
 return {request(input,callback,onError){pending={id:++generation,input,callback,onError};run()},cancel(){cancelledBefore=++generation;pending=null},close(){closed=true;worker?.terminate();if(url)URL.revokeObjectURL(url)},get threaded(){return!!worker}};
}
