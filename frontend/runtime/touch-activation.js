/**
 * Native game buttons can receive a stationary touch release without WebKit's
 * compatibility click. Keep the original click command path, but complete only
 * an eligible, explicitly tracked touch. Form controls and gestures stay native.
 * @typedef {{identifier:number,clientX:number,clientY:number}} Contact
 * @typedef {{isTrusted?:boolean,defaultPrevented?:boolean,cancelable?:boolean,target?:EventTarget|null,touches:ArrayLike<Contact>,changedTouches:ArrayLike<Contact>,preventDefault:()=>void}} TouchInput
 * @typedef {{node:Element,x:number,y:number}} ScrollPoint
 * @typedef {{button:HTMLButtonElement,id:number,x:number,y:number,moved:boolean,scroll:ScrollPoint[],serial:number,pointerId:number|null,started:number}} Press
 * @typedef {{serial:number,pointerId:number|null,x:number,y:number,startX:number,startY:number}} Receipt
 */

const gameScope = '#root,.game-dialog,.sw-notice,.sw-adventure-feedback';
const excluded = '[data-touch-activation="native"],[data-pointer-control],[data-troop],.sw-deploy-strip14,[inert],a[href],input,select,textarea,[contenteditable="true"]';

/** @param {Element | null} element @returns {HTMLButtonElement | null} */
function actionButton(element) {
  if (!element || element.closest(excluded)) return null;
  const button = element.closest('button');
  if (!button || !button.closest(gameScope) || !button.isConnected || button.disabled || button.matches(':disabled') || button.getAttribute('aria-disabled') === 'true') return null;
  if (button.form || button.onpointerdown || button.onpointermove || button.onpointerup || button.ontouchstart || button.ontouchmove || button.ontouchend) return null;
  return button;
}

/** @param {HTMLButtonElement} button @returns {ScrollPoint[]} */
function scrollPositions(button) {
  const values = [];
  for (let node = button.parentElement; node && values.length < 32; node = node.parentElement) values.push({node,x:node.scrollLeft,y:node.scrollTop});
  return values;
}

/**
 * Pure gesture bookkeeping used by the document adapter and regression tests.
 * @param {{now:()=>number,resolve:(target:EventTarget|null|undefined)=>HTMLButtonElement|null,hit:(x:number,y:number)=>HTMLButtonElement|null,activate:(button:HTMLButtonElement)=>void,reject?:(button:HTMLButtonElement)=>void}} options
 */
export function createNativeTouchActivation({now,resolve,hit,activate,reject=()=>{}}) {
  /** @type {Press|null} */ let press = null;
  /** @type {Receipt[]} */ let receipts = [];
  /** @type {TouchInput|null} */ let lastStart = null;
  let serial = 0, blocked = false;
  /** @param {Press} value */
  const scrolled = value => value.scroll.some(point => !point.node.isConnected || point.node.scrollLeft !== point.x || point.node.scrollTop !== point.y);
  /** @param {Press} value @param {Contact=} touch */
  function receipt(value,touch) {
    // A stalled action can delay its native click arbitrarily. Retire this
    // bounded receipt on the next genuine input, never by elapsed wall time.
    receipts.push({serial,pointerId:value.pointerId,x:touch?.clientX??value.x,y:touch?.clientY??value.y,startX:value.x,startY:value.y});
    receipts=receipts.slice(-8);
  }
  /** Capture every new touch, including excluded controls that stop bubbling.
   * @param {TouchInput} event */
  function contacts(event) {
    if (event.isTrusted===false || event===lastStart) return;
    lastStart=event;serial++;receipts=[];
    if (event.touches.length>1) { blocked=true;if(press)press.moved=true; }
    else { press=null;blocked=false; }
  }
  /** @param {TouchInput} event @param {{pointerId?:number,prevented?:boolean}=} pointer */
  function start(event,pointer={}) {
    contacts(event);
    if (event.isTrusted===false || event.defaultPrevented || pointer.prevented || press) return;
    const button=resolve(event.target),touch=event.changedTouches[0];
    if (!button || !touch) return;
    press={button,id:touch.identifier,x:touch.clientX,y:touch.clientY,moved:blocked||event.touches.length!==1,scroll:scrollPositions(button),serial,pointerId:pointer.pointerId??null,started:now()};
  }
  /** @param {TouchInput} event */
  function move(event) {
    if (event.touches.length>1) blocked=true;
    if (!press) return;
    const touch=Array.from(event.touches).find(value=>value.identifier===press?.id);
    if (blocked || !touch || event.defaultPrevented || Math.hypot(touch.clientX-press.x,touch.clientY-press.y)>12 || scrolled(press)) press.moved=true;
  }
  function scroll() { if (press && scrolled(press)) press.moved=true; }
  /** @param {TouchInput} event */
  function end(event) {
    const value=press,touch=value&&Array.from(event.changedTouches).find(item=>item.identifier===value.id);
    if (value&&touch) {
      press=null;
      const valid=!blocked&&!value.moved&&event.touches.length===0&&event.isTrusted!==false&&!event.defaultPrevented&&event.cancelable!==false
        &&now()-value.started<1500&&Math.hypot(touch.clientX-value.x,touch.clientY-value.y)<=12&&!scrolled(value)
        &&resolve(value.button)===value.button&&hit(touch.clientX,touch.clientY)===value.button;
      // Also suppress a cancelled owned gesture. Otherwise its delayed native
      // click could still activate after a drag or after a button is re-enabled.
      if(event.isTrusted!==false){
        if(event.cancelable!==false)event.preventDefault();
        receipt(value,touch);
        if(valid)activate(value.button);else reject(value.button);
      }
    }
    if (!event.touches.length) { press=null;blocked=false; }
  }
  /** Preserve a cancellation receipt through blur, pointercancel and contextmenu. */
  function interrupt() {
    if(press){receipt(press);reject(press.button);press=null;}
    blocked=true;
  }
  /** @param {TouchInput} event */
  function cancel(event) { interrupt();blocked=event.touches.length>0; }
  function reset() { press=null;receipts=[];blocked=false;lastStart=null; }
  /** @param {MouseEvent & {pointerType?:string,pointerId?:number,sourceCapabilities?:{firesTouchEvents?:boolean}|null}} event */
  function compatibilityClick(event) {
    if(event.isTrusted===false||event.detail===0||event.pointerType==='mouse'||event.pointerType==='pen')return false;
    const id=event.pointerId;
    // If WebKit delivers a touch click before touchend, hold it for the same
    // validated release path rather than allowing a second action at touchend.
    if(press&&((typeof id==='number'&&id>0&&id===press.pointerId)||Math.hypot(event.clientX-press.x,event.clientY-press.y)<=16)){
      event.preventDefault();event.stopImmediatePropagation();return true;
    }
    let index=typeof id==='number'&&id>0?receipts.findIndex(value=>value.serial===serial&&value.pointerId===id):-1;
    // Older WebKit clicks have neither pointer ID nor sourceCapabilities.
    // Position also survives a closing dialog exposing another button beneath.
    if(index<0)index=receipts.findIndex(value=>value.serial===serial&&(Math.hypot(event.clientX-value.x,event.clientY-value.y)<=16||Math.hypot(event.clientX-value.startX,event.clientY-value.startY)<=16));
    if(index<0)return false;
    receipts.splice(index,1);event.preventDefault();event.stopImmediatePropagation();return true;
  }
  return {start,move,end,cancel,scroll,reset,interrupt,contacts,compatibilityClick};
}

/** Call only for the native Stonewake host. Returns an idempotent disposer.
 * @param {{document?:Document,now?:()=>number,onActivate?:(button:HTMLButtonElement)=>void}} options
 */
export function startNativeTouchActivation({document:doc=document,now=()=>performance.now(),onActivate=()=>{}}={}) {
  let live=true;
  /** @type {{event:PointerEvent,at:number}|null} */ let pointer=null;
  const resolve = (/** @type {EventTarget|null|undefined} */ target) => actionButton(target instanceof Element?target:null);
  const controller=createNativeTouchActivation({now,resolve,hit:(x,y)=>actionButton(doc.elementFromPoint(x,y)),activate:button=>{
    doc.dispatchEvent(new CustomEvent('stonewake-touch-activated',{detail:{control:button}}));
    button.click();
    onActivate(button);
  },reject:button=>doc.dispatchEvent(new CustomEvent('stonewake-touch-rejected',{detail:{control:button}}))});
  const pointerCapture=(/** @type {Event} */ event)=>{const value=/** @type {PointerEvent} */(event);if(value.pointerType==='touch')pointer={event:value,at:now()};else if(value.pointerType==='mouse'||value.pointerType==='pen'){pointer=null;controller.reset();}};
  const contacts=(/** @type {Event} */ event)=>controller.contacts(/** @type {TouchEvent} */(event));
  const start=(/** @type {Event} */ event)=>{const related=pointer&&now()-pointer.at<150?pointer:null;controller.start(/** @type {TouchEvent} */(event),{pointerId:related?.event.pointerId,prevented:related?.event.defaultPrevented});};
  const move=(/** @type {Event} */ event)=>controller.move(/** @type {TouchEvent} */(event));
  const end=(/** @type {Event} */ event)=>controller.end(/** @type {TouchEvent} */(event));
  const cancel=(/** @type {Event} */ event)=>controller.cancel(/** @type {TouchEvent} */(event));
  const click=(/** @type {Event} */ event)=>controller.compatibilityClick(/** @type {MouseEvent} */(event));
  const reset=()=>{pointer=null;controller.reset();};
  const interrupt=()=>{pointer=null;controller.interrupt();};
  const hidden=()=>{if(doc.hidden)interrupt();};
  // Observe React's pointer handling before choosing the fallback. End is a
  // bubbling, non-passive listener so existing touch handlers may veto it.
  /** @type {[string,EventListener,boolean,boolean][]} */
  const listeners=[['pointerdown',pointerCapture,true,true],['pointercancel',interrupt,true,true],['touchstart',contacts,true,true],['touchstart',start,false,true],['touchmove',move,true,true],['touchend',end,false,false],['touchcancel',cancel,true,true],['click',click,true,false],['scroll',controller.scroll,true,true],['contextmenu',interrupt,true,true],['visibilitychange',hidden,false,true]];
  for(const[name,fn,capture,passive]of listeners)doc.addEventListener(name,fn,{capture,passive});
  doc.defaultView?.addEventListener('blur',interrupt);
  return()=>{if(!live)return;live=false;for(const[name,fn,capture]of listeners)doc.removeEventListener(name,fn,capture);doc.defaultView?.removeEventListener('blur',interrupt);reset();};
}
