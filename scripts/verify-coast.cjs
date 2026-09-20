const {chromium}=require('/opt/homebrew/lib/node_modules/openclaw/node_modules/playwright-core');
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),out='/Users/chrismozer/Library/Developer/Stonewake-review/build7';
fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
const page=await browser.newPage({viewport:{width:840,height:360}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('**/assets/index-BPhrguZ3.js',route=>route.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(root,'Stonewake/Web/assets/index-BPhrguZ3.js'),'utf8').replace('  let We = (e, t) => {','  window.__coastCamera={cameraX,cameraY,Pe,Re,ze,Fe,M};\n  let We = (e, t) => {')+'\nwindow.__swTest={Al,Y,Ul,SWCoast,SWCanPlace,SWCoastBoats,SWCoastHit,SWWalkable,Cu,Su};'}));
await page.addInitScript(()=>{window.__STONEWAKE_INTRO_SEEN__=true;window.webkit={messageHandlers:{stonewake:{postMessage(m){if(m.kind==='save'){window.__lastSave=JSON.parse(m.payload);setTimeout(()=>window.dispatchEvent(new CustomEvent('stonewake-save-status',{detail:{saved:true}})),0)}}}}};});
await page.goto('http://localhost:8768');await page.waitForSelector('.map-holder canvas');
const fixture=await page.evaluate(()=>{
 const {Al,Y,Ul,SWCoast,SWCanPlace,SWCoastBoats,SWCoastHit,SWWalkable,Cu,Su}=window.__swTest,now=Date.now(),check=(value,message)=>{if(!value)throw Error(message)};
 let s=Al(now);s.buildings[0].level=3;s.resources={gold:5000,wood:5000,stone:5000,food:5000};s.buildings.push({id:'existing-port',kind:'harbor',x:7,y:5,level:2,startedAt:now-1000,targetLevel:3,readyAt:now+45000},{id:'barracks',kind:'barracks',x:1,y:5,level:2});
 s.fleet=[{id:'current-cutter',kind:'cutter',level:1,voyage:{route:'coast',startedAt:now-90000,readyAt:now+90000,reward:{gold:25,wood:40,stone:0,food:120}}}];
 const old=JSON.stringify(s),m=Y(s,now),port=m.buildings.find(b=>b.id==='existing-port');
 check(JSON.stringify(s)===old,'migration mutated original');check(m.coastVersion===1&&port.x===-2&&port.y===2,'legacy port relocated');check(port.level===2&&port.targetLevel===3&&port.readyAt===now+45000,'port level/timer not preserved');check(JSON.stringify(m.fleet)===JSON.stringify(s.fleet),'legacy fleet changed');check(JSON.stringify(Y(m,now))===JSON.stringify(m),'migration not idempotent');
 const restored=Y(JSON.parse(JSON.stringify(m)),now);check(restored.buildings.find(b=>b.id==='existing-port').x===-2,'saved coast did not persist');
 check(!SWCanPlace(m,'harbor',4,6),'inland port accepted');check(!SWCanPlace(m,'farm',-2,4),'farm on pier accepted');check(!SWCanPlace(m,'harbor',-2,2),'occupied pier accepted');check(SWCanPlace(m,'harbor',-2,4),'empty pier rejected');
 check(SWWalkable(m,-1,2)&&!SWWalkable(m,-3,2),'walkable shore/sea wrong');const path=Cu(Su(m.buildings[0],m.buildings,m.provinces),Su(port,m.buildings,m.provinces),m.buildings,m.provinces);check(path.length>1&&path[path.length-1].x===-1,'no path to port');
 let ready=Y(m,now+60000),denied=false;try{Ul(ready,{type:'build',kind:'harbor',x:5,y:5},now+60000)}catch{denied=true}check(denied,'inland build reducer accepted');
 let built=Ul(ready,{type:'build',kind:'harbor',x:-2,y:4},now+60000);check(built.buildings.some(b=>b.kind==='harbor'&&b.x===-2&&b.y===4&&b.readyAt),'coastal build did not start');
 let moved=Ul(ready,{type:'move',id:'existing-port',x:-2,y:6},now+60000);check(moved.buildings.find(b=>b.id==='existing-port').y===6,'port move failed');denied=false;try{Ul(ready,{type:'move',id:'existing-port',x:4,y:6},now+60000)}catch{denied=true}check(denied,'inland move reducer accepted');
 const boats=SWCoastBoats(ready.buildings,ready.fleet,now+60000);check(boats[0].sailing&&SWCoastHit(boats[0].x,boats[0].y-15,ready.buildings,ready.fleet,now+60000)?.id==='current-cutter','saved sailing ship not interactive');
 const returned=SWCoastBoats(ready.buildings,ready.fleet,now+100000);check(returned[0].returned&&!returned[0].sailing,'ship does not return');let collected=Ul(ready,{type:'collectVoyage',id:'current-cutter'},now+100000);check(!collected.fleet[0].voyage,'cargo not collected');denied=false;try{Ul(collected,{type:'collectVoyage',id:'current-cutter'},now+100000)}catch{denied=true}check(denied,'cargo can be double collected');
 // Use a legacy inland port and existing ship to exercise real startup migration.
 s.buildings.find(b=>b.id==='existing-port').readyAt=undefined;s.buildings.find(b=>b.id==='existing-port').targetLevel=undefined;
 delete s.fleet[0].voyage;return s;
});
console.log('PASS migration, coastal placement/movement, connected footpath, persisted fleet, sailing/returning/cargo and repeat collection');
await page.addInitScript(state=>window.__STONEWAKE_SAVE__={state,reports:[]},fixture);await page.reload();await page.waitForSelector('.map-holder canvas');await page.waitForTimeout(500);await page.screenshot({path:out+'/coast-default-840.png'});
await page.getByRole('button',{name:'Kingdom menu',exact:true}).click();await page.locator('.kingdom-menu').getByRole('button',{name:'Fleet',exact:true}).click();await page.getByRole('button',{name:'View coast',exact:true}).click();await page.waitForTimeout(250);await page.screenshot({path:out+'/coast-focus-840.png'});
await page.setViewportSize({width:393,height:760});await page.waitForTimeout(250);await page.screenshot({path:out+'/coast-focus-393.png'});
// Tap the actual canvas through its live camera projection, not the hit-test helper.
const tapWorld=async(x,y)=>{const camera=await page.evaluate(()=>window.__coastCamera),rect=await page.locator('.map-holder canvas').boundingBox();const px=rect.x+camera.M.w/2+camera.Re+(x-camera.cameraX)*camera.Pe,py=rect.y+camera.M.h/2+camera.ze-camera.Fe+(y-camera.cameraY)*camera.Pe;assert(px>=rect.x&&px<rect.x+rect.width&&py>=rect.y&&py<rect.y+rect.height,'tap must be visible');await page.mouse.click(px,py)};
await tapWorld(392,140);await page.getByRole('dialog').waitFor();assert(await page.getByRole('heading',{name:'Fleet',exact:true}).isVisible(),'harbor canvas tap must open fleet');await page.getByRole('button',{name:'Close',exact:true}).last().click();
const detailClose=page.getByRole('button',{name:'Close building details',exact:true});if(await detailClose.isVisible())await detailClose.click();
const boat=await page.evaluate(()=>{const save=window.__lastSave.state;return window.__swTest.SWCoastBoats(save.buildings,save.fleet)[0]});await tapWorld(boat.x,boat.y-24);await page.getByRole('heading',{name:'Fleet',exact:true}).waitFor();await page.getByRole('button',{name:'Close',exact:true}).last().click();
await page.getByRole('button',{name:'Kingdom menu',exact:true}).click();await page.locator('.kingdom-menu').getByRole('button',{name:'Build',exact:true}).click();await page.locator('.build-card').filter({hasText:'Shipyard'}).click();await page.getByText('Place Shipyard',{exact:true}).waitFor();await page.waitForTimeout(150);await page.screenshot({path:out+'/coast-placement-393.png'});
await tapWorld(288,229);const buildButton=page.getByRole('button',{name:'Build here',exact:true});await buildButton.waitFor();assert(await buildButton.isEnabled(),'coastal berth must allow build confirmation');await buildButton.click();await page.waitForFunction(()=>window.__lastSave?.state?.buildings.filter(b=>b.kind==='harbor').length===2);assert(await page.evaluate(()=>window.__lastSave.state.buildings.some(b=>b.kind==='harbor'&&b.x===-2&&b.y===4&&b.readyAt)),'coastal build must persist');
console.log('PASS real canvas harbor/ship taps open fleet; build menu focuses reachable berth; confirmed shipyard persisted');
assert.equal(errors.length,0,errors.join('\n'));console.log('PASS coast rendering both orientations, runtime errors',errors);
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
