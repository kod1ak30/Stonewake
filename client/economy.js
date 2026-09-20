// Explicit, lossy exchange. Validate payment and destination space before either changes.
const SWTradeRates = Object.freeze({wood:2,stone:3,gold:2});
function SWTradeQuote(state,resource,amount,payWith='food') {
  if(!xl.includes(resource)||!xl.includes(payWith)||payWith===resource||![50,100,250].includes(amount))throw Error('Choose two different resources and a trade amount.');
  const payment=amount*(payWith==='food'&&resource==='stone'?3:2);
  const reason=!state.buildings.some(b=>b.kind==='market'&&b.level>0)?'Complete a marketplace first.':state.resources[payWith]<payment?'More '+(payWith==='wood'?'timber':payWith)+' needed.':state.resources[resource]+amount>Fl(state)?'Make room in storage first.':null;
  return {resource,amount,payWith,payment,food:payWith==='food'?payment:0,reason};
}
function SWApplyTrade(state,action) {
  if(action.type!=='marketTrade')return false;
  const quote=SWTradeQuote(state,action.resource,action.amount,action.payWith||'food');
  if(quote.reason)throw Error(quote.reason);
  state.resources[quote.payWith]-=quote.payment;state.resources[quote.resource]+=quote.amount;return true;
}
function SWMarketTrade({state,act,busy}) {
  const [resource,setResource]=C.useState('wood'),[payWith,setPayWith]=C.useState('food'),[amount,setAmount]=C.useState(100);
  const quote=SWTradeQuote(state,resource,amount,payWith);
  return swElement('details',{className:'sw-disclosure sw-market'},
    swElement('summary',null,'Trade surplus supplies'),
    swElement('p',{className:'sw-muted'},'Exchange surplus at a loss, never for free. Upgrade producers and stores for lasting growth.'),
    swElement('div',{className:'sw-market-fields'},
      swElement('label',null,'Give',swElement('select',{'aria-label':'Pay with',value:payWith,onChange:e=>{const next=e.target.value;setPayWith(next);if(next===resource)setResource(payWith);}},xl.map(k=>swElement('option',{key:k,value:k},Wu[k])))),
      swElement('label',null,'Receive',swElement('select',{'aria-label':'Trade resource',value:resource,onChange:e=>setResource(e.target.value)},
        xl.filter(k=>k!==payWith).map(k=>swElement('option',{key:k,value:k},Wu[k])))),
      swElement('label',null,'Amount',swElement('select',{'aria-label':'Trade amount',value:amount,onChange:e=>setAmount(Number(e.target.value))},
        [50,100,250].map(n=>swElement('option',{key:n,value:n},n))))),
    swElement('button',{className:'secondary wide',disabled:busy||!!quote.reason,onClick:()=>act({type:'marketTrade',resource,amount,payWith},'Trade complete')},
      quote.reason||'Trade '+quote.payment+' '+Wu[payWith].toLowerCase()+' for '+amount+' '+Wu[resource].toLowerCase()));
}
