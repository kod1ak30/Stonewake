const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let checks=0;
function rig(){
 let time=0,sequence=0,shots=[],preview=null,active=true,pinches=0;
 const handlers={},documentHandlers={},timers=new Map();
 const timer=(fn,ms,repeat)=>{const id=++sequence;timers.set(id,{fn,due:time+ms,ms,repeat});return id};
 const document={hidden:false,addEventListener:(k,fn)=>documentHandlers[k]=fn};
 const context={window:{addEventListener:(k,fn)=>handlers[k]=fn},document,performance:{now:()=>time},setTimeout:(fn,ms)=>timer(fn,ms,false),setInterval:(fn,ms)=>timer(fn,ms,true),clearTimeout:id=>timers.delete(id),clearInterval:id=>timers.delete(id),Map,Math};
 vm.createContext(context);vm.runInContext(fs.readFileSync('client/build14/gestures.js','utf8')+'\nthis.bridge=SWGestureBridge14;this.begin=SWBeginPointer14;SWInstallPointers14();',context);
 context.bridge.surface={active:()=>active,target:(x,y)=>x>=0&&x<400&&y<300&&y>=0?{x,y}:null,preview:t=>preview=t,fire:(t,k)=>{shots.push({t,k,time});return true},pinch:()=>pinches++,endPinch:()=>{}};
 const rail={scrollLeft:0};
 const event=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',button:0,preventDefault(){},currentTarget:{setPointerCapture(){},closest:()=>rail}});
 const down=(x,y,origin='map',id=1)=>{const e=event(id,x,y);handlers.pointerdown(e);context.begin(e,'archer',origin)};
 const move=(x,y,id=1)=>handlers.pointermove(event(id,x,y));
 const up=(x,y,id=1)=>handlers.pointerup(event(id,x,y));
 const tick=duration=>{const stop=time+duration;while(true){const next=[...timers].filter(([,t])=>t.due<=stop).sort((a,b)=>a[1].due-b[1].due)[0];if(!next)break;const[id,t]=next;time=t.due;if(t.repeat)t.due+=t.ms;else timers.delete(id);t.fn()}time=stop};
 return {down,move,up,tick,shots,rail,context,handlers,documentHandlers,document,event,get preview(){return preview},get pinches(){return pinches},deactivate(){active=false}};
}
const eq=(a,b,label)=>{assert.deepEqual(a,b,label);checks++};
let g=rig();g.down(30,30);g.tick(100);eq(g.shots.length,0);g.up(30,30);eq(g.shots.length,1,'tap must place exactly one');g.tick(1000);eq(g.shots.length,1,'release must stop');
g=rig();g.down(30,30);g.tick(219);eq(g.shots.length,0);g.tick(1);eq(g.shots.length,1);g.tick(450);eq(g.shots.length,4,'hold rate');g.up(30,30);g.tick(500);eq(g.shots.length,4,'no release burst');
g=rig();g.down(100,360,'tray');g.move(104,250);eq(g.shots.length,1,'card to map drag');g.move(115,200);g.tick(150);eq(g.shots.length,2);g.move(500,180);g.tick(500);eq(g.shots.length,2,'invalid region must pause');g.move(180,150);eq(g.shots.length,3,'return to valid ground resumes');g.up(180,150);g.tick(500);eq(g.shots.length,3);
g=rig();g.down(180,360,'tray');g.move(120,358);g.move(110,355);g.tick(800);eq(g.shots.length,0,'horizontal rail scroll must not become deployment');eq(g.rail.scrollLeft,70);g.up(110,355);
g=rig();g.down(30,360,'tray');g.move(400,180);eq(g.shots.length,0);g.move(300,160);eq(g.shots.length,1,'diagonal drag leaves rail to deploy');g.up(300,160);
g=rig();g.down(100,100);g.tick(220);eq(g.shots.length,1);g.handlers.pointerdown(g.event(2,200,200));g.move(200,220,2);g.tick(1000);eq(g.shots.length,1,'second finger stops deployment');eq(g.pinches,2);g.up(100,100);g.up(200,220,2);eq(g.shots.length,1,'pinch release cannot deploy');
for(const type of ['blur','pointercancel','visibilitychange']){g=rig();g.down(100,100);g.tick(220);if(type==='visibilitychange'){g.document.hidden=true;g.documentHandlers.visibilitychange()}else g.handlers[type](g.event(1,100,100));g.tick(1000);eq(g.shots.length,1,type+' stops repeat');eq(g.preview,null)}
g=rig();g.down(100,100);g.deactivate();g.tick(1000);g.up(100,100);eq(g.shots.length,0,'closed battle cannot receive troops');
console.log('PASS '+checks+' gesture checks: card handoff, tap, hold, paint, invalid crossings, rail scroll, pinch, cancellation and no release burst.');
