const {chromium}=require('/opt/homebrew/lib/node_modules/openclaw/node_modules/playwright-core');
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const fixture=JSON.parse(fs.readFileSync('/Users/chrismozer/Library/Developer/Stonewake-backups/pre-build8-kingdom.json','utf8'));
const out='/Users/chrismozer/Library/Developer/Stonewake-review/build8';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:393,height:760}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/assets/index-BPhrguZ3.js',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(root,'Stonewake/Web/assets/index-BPhrguZ3.js'),'utf8')+'\nwindow.__swTest={Al,Y,Ul,Il,X,Fl,Bc,Vc,Ac,SWCanPlace,SWTradeQuote};'}));
 await page.addInitScript(save=>{window.__STONEWAKE_SAVE__=save;window.__STONEWAKE_INTRO_SEEN__=true;window.webkit={messageHandlers:{stonewake:{postMessage(m){if(m.kind==='save'){window.__lastSave=JSON.parse(m.payload);setTimeout(()=>window.dispatchEvent(new CustomEvent('stonewake-save-status',{detail:{saved:true}})),0)}}}}};},fixture);
 await page.goto('http://localhost:8768');await page.waitForSelector('.map-holder canvas');
 const checks=await page.evaluate(fixture=>{
  const {Al,Y,Ul,Il,X,Fl,Bc,Vc,Ac,SWCanPlace,SWTradeQuote}=window.__swTest,check=(v,m)=>{if(!v)throw Error(m)},reject=(fn,m)=>{let did=false;try{fn()}catch{did=true}check(did,m)};
  const now=fixture.state.lastTick,s=Y(fixture.state,now),original=JSON.stringify(s);
  check(JSON.stringify(s.resources)===JSON.stringify(fixture.state.resources),'resources changed during migration');
  check(JSON.stringify(s.buildings)===JSON.stringify(fixture.state.buildings),'buildings moved or leveled by migration');
  check(s.gems===fixture.state.gems&&s.campaign===fixture.state.campaign,'progress changed');
  let count=0;for(let x=0;x<10;x++)for(let y=0;y<10;y++)count+=Bc(x,y);check(count===100,'home must have 100 plots');
  check(!Bc(10,3)&&!Bc(-1,2)&&!Bc(.5,2),'land bounds invalid');
  const expanded={...s,provinces:Ac.map(p=>({id:p.id,level:1}))};let total=0;for(let x=0;x<12;x++)for(let y=0;y<12;y++)total+=Vc(expanded,x,y);check(total===144,'province expansion ring incomplete');
  check(SWCanPlace(s,'cottage',9,9),'new home plot not usable');check(!SWCanPlace(s,'harbor',9,9),'shipyard can be placed inland');
  let built=Ul(s,{type:'build',kind:'cottage',x:9,y:9},now);check(built.buildings.some(b=>b.x===9&&b.y===9&&b.readyAt),'new plot does not build');
  check(built.resources.food<s.resources.food&&built.resources.wood<s.resources.wood,'crew food/material costs missing');
  let moved=Ul(s,{type:'move',id:'farm',x:8,y:8},now);check(moved.buildings.find(b=>b.id==='farm').x===8,'existing building cannot move to expansion');
  for(const resource of ['wood','stone','gold']){let a=Y(s,now);a.resources={gold:100,wood:100,stone:100,food:2000};const q=SWTradeQuote(a,resource,100),b=Ul(a,{type:'marketTrade',resource,amount:100},now);check(b.resources[resource]===200&&b.resources.food===2000-q.food,'trade accounting');check(b.revision===a.revision+1,'trade revision');}
  reject(()=>Ul(s,{type:'marketTrade',resource:'gems',amount:100},now),'gems trade accepted');reject(()=>Ul(s,{type:'marketTrade',resource:'wood',amount:-100},now),'negative trade accepted');
  let poor=Y(s,now);poor.resources.food=10;reject(()=>Ul(poor,{type:'marketTrade',resource:'wood',amount:100},now),'insufficient food trade accepted');
  let full=Y(s,now);full.resources.wood=Fl(full)-50;const before=JSON.stringify(full);reject(()=>Ul(full,{type:'marketTrade',resource:'wood',amount:100},now),'overflow trade accepted');check(JSON.stringify(full)===before,'rejected trade mutated resources');
  let noMarket=Y(s,now);noMarket.buildings=noMarket.buildings.filter(b=>b.kind!=='market');reject(()=>Ul(noMarket,{type:'marketTrade',resource:'wood',amount:100},now),'trade without marketplace accepted');
  check(JSON.stringify(s)===original,'actions mutated input');
  return {plots:count,expandedPlots:total,income:Il(s),keep5:X('keep',5),farm3:X('farm',3),trade:'200 food to 100 timber'};
 },fixture);console.log('PASS economy accounting, migration, actual progression, expansion building/movement',checks);
 await page.locator('.resource').first().click();await page.getByRole('dialog').waitFor();await page.getByText('Trade surplus food',{exact:true}).click();
 await page.getByRole('button',{name:'Trade 200 food for 100 timber',exact:true}).scrollIntoViewIfNeeded();
 const before=await page.evaluate(()=>window.__lastSave.state);await page.getByRole('button',{name:'Trade 200 food for 100 timber',exact:true}).click();await page.waitForFunction(r=>window.__lastSave?.state?.revision>r,before.revision);
 const after=await page.evaluate(()=>window.__lastSave);assert(after.state.resources.food<before.resources.food-190);assert(after.state.resources.wood>=before.resources.wood+100);await page.screenshot({path:out+'/market-393.png'});
 await page.addInitScript(save=>window.__STONEWAKE_SAVE__=save,after);await page.reload();await page.waitForSelector('.map-holder canvas');await page.waitForFunction(r=>window.__lastSave?.state?.revision>=r,after.state.revision);assert(await page.evaluate(()=>window.__lastSave.state.resources.wood)>=after.state.resources.wood);
 assert.equal(errors.length,0,errors.join('\n'));console.log('PASS actual trade button, save message and reload');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
