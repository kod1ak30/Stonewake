import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeTouchActivation, startNativeTouchActivation} from '../runtime/touch-activation.js';

function rig() {
  let time=0,current;
  const scroller={isConnected:true,scrollLeft:0,scrollTop:0,parentElement:null};
  const makeButton=()=>({isConnected:true,disabled:false,allowed:true,parentElement:scroller,actions:0,click(){this.actions++;}});
  const button=makeButton();current=button;
  const resolve=value=>value?.allowed&&value.isConnected&&!value.disabled?value:null;
  const activated=[],rejected=[];
  const controller=createNativeTouchActivation({now:()=>time,resolve,hit:()=>resolve(current),activate:button=>{button.click();activated.push(button);},reject:button=>rejected.push(button)});
  const contact=(x=20,y=30,identifier=1)=>({clientX:x,clientY:y,identifier});
  const event=(touches=[],changedTouches=[contact()],target=button)=>({touches,changedTouches,target,isTrusted:true,defaultPrevented:false,cancelable:true,preventDefault(){this.defaultPrevented=true;}});
  const click=(values={})=>({isTrusted:true,detail:1,clientX:20,clientY:30,prevented:false,stopped:false,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;},...values});
  const start=(target=button,id=1)=>controller.start(event([contact(20,30,id)],[contact(20,30,id)],target),{pointerId:id});
  const end=(target=button,id=1)=>{const e=event([],[contact(20,30,id)],target);controller.end(e);return e;};
  return {controller,button,scroller,activated,rejected,makeButton,contact,event,click,start,end,setHit:value=>{current=value;},setTime:value=>{time=value;}};
}

test('stationary touch activates once through the existing click path and suppresses its late compatibility click',()=>{
  const h=rig();h.start();const end=h.end();
  assert.equal(end.defaultPrevented,true);assert.equal(h.button.actions,1);
  const compatibility=h.click({pointerType:'touch',pointerId:1});
  assert.equal(h.controller.compatibilityClick(compatibility),true);assert.equal(compatibility.stopped,true);
  assert.equal(h.button.actions,1);
  assert.equal(h.controller.compatibilityClick(h.click({pointerType:'touch',pointerId:1})),false,'receipt is consumed exactly once');
});

test('opening a confirmation cannot turn the old compatibility click into a purchase',()=>{
  const h=rig(),confirm=h.makeButton();let gems=100,orders=0;
  h.button.click=()=>{h.button.actions++;h.button.isConnected=false;h.setHit(confirm);};
  confirm.click=()=>{gems-=20;orders++;};
  h.start();h.end();
  assert.equal(h.button.actions,1);assert.equal(gems,100);
  // Older WebKit may retarget a plain MouseEvent to the newly exposed button.
  const oldClick=h.click({target:confirm});
  if(!h.controller.compatibilityClick(oldClick))confirm.click();
  assert.equal(gems,100);assert.equal(orders,0);
  h.start(confirm,2);h.end(confirm,2);
  assert.equal(gems,80);assert.equal(orders,1);
  const delayed=h.click({pointerType:'touch',pointerId:2,target:confirm});
  if(!h.controller.compatibilityClick(delayed))confirm.click();
  assert.equal(gems,80,'a settled synchronous local purchase cannot debit twice');
  assert.equal(orders,1);
});

test('quick genuine repeat touches each activate once while keyboard and mouse clicks remain native',()=>{
  const h=rig();
  for(let id=1;id<=3;id++){h.start(h.button,id);h.end(h.button,id);assert.equal(h.controller.compatibilityClick(h.click({pointerType:'touch',pointerId:id})),true);}
  assert.equal(h.button.actions,3);
  h.start(h.button,4);h.end(h.button,4);
  for(const click of [h.click({detail:0}),h.click({pointerType:'mouse'}),h.click({pointerType:'pen'}),h.click({isTrusted:false})])assert.equal(h.controller.compatibilityClick(click),false);
  assert.equal(h.button.actions,4);
});

test('a new excluded touch cannot inherit suppression even when WebKit reuses its pointer ID',()=>{
  const h=rig();h.start();h.end();
  const native=h.makeButton();native.allowed=false;
  h.controller.start(h.event([h.contact()],[h.contact()],native),{pointerId:1});
  assert.equal(h.controller.compatibilityClick(h.click({pointerType:'touch',pointerId:1,target:native})),false);
});

test('dragging out and back or scrolling out and back never activates',()=>{
  for(const kind of ['move','scroll','final-scroll']){
    const h=rig();h.start();
    if(kind==='move'){h.controller.move(h.event([h.contact(40,30)]));h.controller.move(h.event([h.contact()]));}
    else{h.scroller.scrollTop=20;if(kind==='scroll'){h.controller.scroll();h.scroller.scrollTop=0;h.controller.scroll();}}
    const end=h.end();assert.equal(h.button.actions,0,kind);assert.equal(end.defaultPrevented,true,kind);
    const click=h.click({pointerType:"touch",pointerId:1});if(!h.controller.compatibilityClick(click))h.button.click();assert.equal(h.button.actions,0,kind);assert.equal(h.rejected.length,1,kind);
  }
});

test('multitouch stays cancelled until every finger lifts, including a map finger plus menu finger',()=>{
  const h=rig();h.start();
  const two=h.event([h.contact(),h.contact(60,60,2)],[h.contact(60,60,2)]);
  h.controller.contacts(two);h.controller.start(two,{pointerId:2});
  h.controller.end(h.event([h.contact()],[h.contact(60,60,2)]));
  h.end();assert.equal(h.button.actions,0);
  h.start(h.button,3);h.end(h.button,3);assert.equal(h.button.actions,1);
});

test('cancel, reset, prevented events, disabled controls, unmount, outside hit and long press do not activate',()=>{
  for(const kind of ['cancel','reset','prevented','disabled','unmount','outside','long','pointer-veto']){
    const h=rig();
    if(kind==='pointer-veto')h.controller.start(h.event([h.contact()]),{pointerId:1,prevented:true});else h.start();
    if(kind==='cancel')h.controller.cancel(h.event());
    if(kind==='reset')h.controller.reset();
    if(kind==='disabled')h.button.disabled=true;
    if(kind==='unmount')h.button.isConnected=false;
    if(kind==='outside')h.setHit(h.makeButton());
    if(kind==='long')h.setTime(1600);
    const end=h.event();if(kind==='prevented')end.defaultPrevented=true;
    h.controller.end(end);assert.equal(h.button.actions,0,kind);
  }
});

function domRig(context) {
  const listeners=[],winListeners=[],activations=[];
  class Node {
    constructor(tag='BUTTON'){this.tagName=tag;this.isConnected=true;this.disabled=false;this.form=null;this.parentElement=null;this.scrollLeft=0;this.scrollTop=0;this.actions=0;}
    closest(selector){if(selector==='button')return this.tagName==='BUTTON'?this:this.button||null;if(selector.startsWith('#root'))return this.inGame===false?null:this;if(selector.startsWith('[data-touch-activation'))return this.excluded?this:null;return null;}
    matches(selector){return selector===':disabled'&&!!this.fieldsetDisabled;}
    getAttribute(name){return name==='aria-disabled'&&this.ariaDisabled?'true':null;}
    click(){this.actions++;}
  }
  const original=globalThis.Element;globalThis.Element=Node;
  context.after(()=>{if(original===undefined)delete globalThis.Element;else globalThis.Element=original;});
  const button=new Node();let hit=button;
  const doc={hidden:false,elementFromPoint:()=>hit,dispatchEvent:event=>activations.push(event),addEventListener:(name,fn,options)=>listeners.push({name,fn,options}),removeEventListener:(name,fn,capture)=>{const index=listeners.findIndex(e=>e.name===name&&e.fn===fn&&e.options.capture===capture);assert.ok(index>=0);listeners.splice(index,1);},defaultView:{addEventListener:(name,fn)=>winListeners.push({name,fn}),removeEventListener:(name,fn)=>{const index=winListeners.findIndex(e=>e.name===name&&e.fn===fn);winListeners.splice(index,1);}}};
  const dispose=startNativeTouchActivation({document:doc,now:()=>0});
  const fire=(name,event,capture)=>listeners.filter(e=>e.name===name&&(capture===undefined||e.options.capture===capture)).forEach(e=>e.fn(event));
  const contact={identifier:1,clientX:20,clientY:30};
  const touch=(ended=false,target=button)=>({target,touches:ended?[]:[contact],changedTouches:[contact],isTrusted:true,cancelable:true,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;}});
  const down=(target=button,prevented=false)=>{fire('pointerdown',{pointerId:1,pointerType:'touch',target,defaultPrevented:prevented},true);fire('touchstart',touch(false,target));};
  return {Node,button,doc,listeners,activations,dispose,fire,touch,down,setHit:value=>{hit=value;}};
}

test('document adapter is scoped, respects native controls and pointer veto, and cleans up every listener',context=>{
  const h=domRig(context);
  for(const flag of ['excluded','inGame','disabled','fieldsetDisabled','ariaDisabled','form','onpointerdown']){
    const button=new h.Node();button[flag]=flag==='inGame'?false:flag==='onpointerdown'?()=>{}:true;h.setHit(button);h.down(button);const end=h.touch(true,button);h.fire('touchend',end);assert.equal(button.actions,0,flag);assert.equal(end.defaultPrevented,false,flag);
  }
  h.setHit(h.button);h.down(h.button,true);h.fire('touchend',h.touch(true));assert.equal(h.button.actions,0);
  // stopPropagation on pointerdown is intentionally not a veto for dismissals.
  h.down();h.fire('touchend',h.touch(true));assert.equal(h.button.actions,1);
  assert.equal(h.activations.length,1);assert.equal(h.activations[0].detail.control,h.button);
  assert.equal(h.listeners.find(e=>e.name==='touchend').options.passive,false);
  assert.ok(h.listeners.filter(e=>['touchstart','touchmove'].includes(e.name)).every(e=>e.options.passive));
  h.dispose();h.dispose();assert.equal(h.listeners.length,0);
});

test('native pointer cancellation and genuine mouse down clear touch candidates and stale receipts',context=>{
  const h=domRig(context);h.down();h.fire('pointercancel',{});h.fire('touchend',h.touch(true));assert.equal(h.button.actions,0);
  const cancelled={isTrusted:true,detail:1,clientX:20,clientY:30,preventDefault(){this.prevented=true;},stopImmediatePropagation(){}};h.fire('click',cancelled);assert.equal(cancelled.prevented,true);
  h.down();h.fire('touchend',h.touch(true));assert.equal(h.button.actions,1);
  h.fire('pointerdown',{pointerType:'mouse'},true);
  const click={isTrusted:true,detail:1,clientX:20,clientY:30,preventDefault(){assert.fail('real mouse must stay native');},stopImmediatePropagation(){assert.fail('real mouse must stay native');}};
  h.fire('click',click);h.dispose();
});


test('handled receipts survive slow actions and lifecycle interruptions until a new input',()=>{
  for(const kind of ['slow','interrupt']){
    const h=rig();h.start();h.end();h.setTime(5000);
    if(kind==='interrupt')h.controller.interrupt();
    const click=h.click({pointerType:'touch',pointerId:1});
    if(!h.controller.compatibilityClick(click))h.button.click();
    assert.equal(h.button.actions,1,kind);
  }
});

test('disabled, covered, detached and cancelled releases cannot later fall through to a native action',()=>{
  for(const kind of ['disabled','covered','detached','cancel','interrupt']){
    const h=rig();h.start();
    if(kind==='disabled')h.button.disabled=true;
    if(kind==='covered')h.setHit(h.makeButton());
    if(kind==='detached')h.button.isConnected=false;
    if(kind==='cancel')h.controller.cancel(h.event());
    if(kind==='interrupt')h.controller.interrupt();
    h.end();h.button.disabled=false;h.button.isConnected=true;
    if(!h.controller.compatibilityClick(h.click({pointerType:'touch',pointerId:1})))h.button.click();
    assert.equal(h.button.actions,0,kind);
    h.setHit(h.button);h.start(h.button,2);h.end(h.button,2);assert.equal(h.button.actions,1,'next deliberate touch works');
  }
});

test('capture retires old receipts even when an excluded native control stops touchstart bubbling',context=>{
  const h=domRig(context);h.down();h.fire('touchend',h.touch(true));
  const native=new h.Node('INPUT');native.excluded=true;
  h.fire('touchstart',h.touch(false,native),true);
  const click={isTrusted:true,detail:1,pointerType:'touch',pointerId:1,clientX:20,clientY:30,preventDefault(){assert.fail('excluded new touch must stay native');},stopImmediatePropagation(){}};
  h.fire('click',click);h.dispose();
});

test('an early native touch click cannot precede a second fallback action',()=>{
  const h=rig();h.start();
  if(!h.controller.compatibilityClick(h.click({pointerType:'touch',pointerId:1})))h.button.click();
  h.end();assert.equal(h.button.actions,1);
});

test('activation receipt is emitted before an action can stop diagnostics or detach its button',context=>{
  const h=domRig(context);h.button.click=()=>{assert.equal(h.activations.at(-1).type,'stonewake-touch-activated');h.button.isConnected=false;h.button.actions++;};
  h.down();h.fire('touchend',h.touch(true));assert.equal(h.button.actions,1);h.dispose();
});

test('a map finger plus an ordinary menu finger is rejected until all contacts lift',()=>{
  const h=rig(),map=h.makeButton();map.allowed=false;
  h.start(map);
  const menu=h.event([h.contact(),h.contact(60,60,2)],[h.contact(60,60,2)]);
  h.controller.contacts(menu);h.controller.start(menu,{pointerId:2});
  h.controller.end(h.event([h.contact()],[h.contact(60,60,2)]));
  const click=h.click({pointerType:'touch',pointerId:2,clientX:60,clientY:60});if(!h.controller.compatibilityClick(click))h.button.click();
  h.end();assert.equal(h.button.actions,0);h.start(h.button,3);h.end(h.button,3);assert.equal(h.button.actions,1);
});

test('movement within the diagnostic 12px slop remains one valid action',()=>{
  const h=rig();h.start();h.controller.move(h.event([h.contact(31,30)]));h.controller.end(h.event([],[h.contact(31,30)]));assert.equal(h.button.actions,1);
});
