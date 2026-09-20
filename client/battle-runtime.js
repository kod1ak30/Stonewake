// Run deterministic forecasts away from the touch/render thread. Coalesce queued forecasts, never orders.
function SWBattleWorker() {
 const functions=[gl,ml,pl,fl,wl,sl,jl,SWMedicTarget,SWNavalStrike,SWApplyTroopStats,SWTroopDamageFactor,SWTroopIncomingFactor,SWTroopSplash,SWMedicHeals,SWNavalUnit,SWNavalTarget,SWCreateNavalUnit,SWEnemyNavalUnits,SWNavalStep,SWSagaSpawn,SWSagaStep,SWSagaObjective,Nl];
 const source='const J='+JSON.stringify(J)+',Cc='+JSON.stringify(Cc)+',Oc='+JSON.stringify(Oc)+';const ul='+ul.toString()+',ll='+ll.toString()+',dl='+dl.toString()+';\n'+functions.map(fn=>fn.toString()).join('\n')+'\nonmessage=e=>{try{postMessage({id:e.data.id,result:gl(e.data.input)})}catch(error){postMessage({id:e.data.id,error:error.message})}};';
 let worker=null,url=null,busy=false,pending=null,current=null,generation=0,closed=false,reported=false;
 const run=()=>{if(busy||!pending||closed)return;current=pending;pending=null;busy=true;
  if(worker)worker.postMessage({id:current.id,input:current.input});
  else setTimeout(()=>{if(closed)return;try{complete({id:current.id,result:Kl(current.input)})}catch(error){complete({id:current.id,error:error.message})}},0);
 };
 const complete=message=>{if(closed)return;if(!reported){reported=true;window.webkit?.messageHandlers?.stonewake?.postMessage({kind:'runtimeStatus',engine:worker?'worker':'fallback'});}busy=false;const job=current;if(message.id===generation&&!pending){if(message.error)job.onError?.(message.error);else job.callback(message.result)}run();};
 try{url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));worker=new Worker(url);worker.onmessage=e=>complete(e.data);worker.onerror=()=>{worker.terminate();worker=null;busy=false;if(current&&!pending)pending=current;run()};}catch{}
 return {request(input,callback,onError){pending={id:++generation,input,callback,onError};run();},cancel(){generation++;pending=null;},close(){closed=true;worker?.terminate();if(url)URL.revokeObjectURL(url)},get threaded(){return !!worker}};
}
// End battle runtime.
