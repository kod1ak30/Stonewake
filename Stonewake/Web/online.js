// Native account credentials never cross this bridge. Only the bundled main frame can invoke it.
(function(){
 const pending=new Map();let serial=0,current={configured:false,signedIn:false,status:'unavailable',message:'Online services are not connected yet. Your kingdom stays on this iPhone.',products:[],busy:false,backup:null,onlineKingdom:false};
 const emit=()=>window.dispatchEvent(new CustomEvent('stonewake-online-status',{detail:{...current}}));
 window.addEventListener('stonewake-online-reply',e=>{const m=e.detail||{},job=pending.get(m.id);if(!job)return;clearTimeout(job.timer);pending.delete(m.id);current.busy=pending.size>0;if(m.state)current={...current,...m.state};emit();m.ok?job.resolve(m.result||{}):job.reject(Object.assign(new Error(m.error?.message||'Online request failed.'),{code:m.error?.code||'unavailable',details:m.error?.details}));});
 window.addEventListener('stonewake-online-native-status',e=>{current={...current,...e.detail};emit()});
 function call(method,payload={}){const handler=window.webkit?.messageHandlers?.stonewake;if(!handler)return Promise.reject(Object.assign(new Error(current.message),{code:'unavailable'}));const id='online-'+Date.now()+'-'+(++serial);current.busy=true;emit();return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(id);current.busy=pending.size>0;emit();reject(Object.assign(new Error('The service did not respond. Your saved kingdom is safe.'),{code:'timeout'}))},method==='signIn'||method==='purchase'?180000:45000);pending.set(id,{resolve,reject,timer});handler.postMessage({kind:'online',id,method,payload});});}
 window.SWOnline={state:()=>({...current}),call,request:(path,options={})=>call('request',{path,method:options.method||'GET',body:options.body}),refresh:()=>call('status')};
 call('status').catch(()=>{});
})();
// End online bridge.
