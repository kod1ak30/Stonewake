const {chromium}=require('/opt/homebrew/lib/node_modules/openclaw/node_modules/playwright-core');
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const fixture=JSON.parse(fs.readFileSync('/Users/chrismozer/Library/Developer/Stonewake-backups/pre-build7-kingdom.json','utf8'));
const out='/Users/chrismozer/Library/Developer/Stonewake-review/build7';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:430,height:800},hasTouch:true});page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/assets/index-BPhrguZ3.js',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(root,'Stonewake/Web/assets/index-BPhrguZ3.js'),'utf8')+'\nwindow.__swTest={Al,Y,Ul,Gl,Kl,Fu,SWCanPlace,SWMigrateCoast,SWCoast,SWCoastBoats,vu};'}));
 await page.addInitScript(save=>{window.__STONEWAKE_SAVE__=save;window.__STONEWAKE_INTRO_SEEN__=true;window.__nativeMessages=[];window.webkit={messageHandlers:{stonewake:{postMessage(m){window.__nativeMessages.push(m);if(m.kind==='save'){window.__lastSave=JSON.parse(m.payload);setTimeout(()=>window.dispatchEvent(new CustomEvent('stonewake-save-status',{detail:{saved:true}})),0)}}}}};},fixture);
 const shot=async(name)=>{await page.screenshot({path:path.join(out,name+'.png')})};
 const close=async()=>{await page.getByRole('button',{name:'Close',exact:true}).last().click();await page.locator('[role=dialog]').waitFor({state:'hidden'})};
 const menu=async(name)=>{await page.getByRole('button',{name:'Kingdom menu',exact:true}).click();await page.locator('.kingdom-menu').getByRole('button',{name,exact:true}).click()};
 const fit=async()=>{const data=await page.evaluate(()=>{const v=document.querySelector('[role=dialog]');const target=v||document.querySelector('.topbar');const r=target.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,w:innerWidth,h:innerHeight,scroll:document.documentElement.scrollWidth}});assert(data.left>=-1&&data.right<=data.w+1&&data.top>=-1&&data.bottom<=data.h+1,JSON.stringify(data));assert(data.scroll<=data.w+1,'horizontal page overflow');};
 await page.goto('http://localhost:8768');await page.waitForSelector('.map-holder canvas');await page.waitForTimeout(450);await fit();await shot('capital-portrait');
 await page.waitForFunction(()=>window.__lastSave?.state?.coastVersion===1);const saved=await page.evaluate(()=>window.__lastSave.state);
 assert.equal(saved.gems,fixture.state.gems);assert.equal(saved.campaign,fixture.state.campaign);assert.equal(saved.buildings.length,fixture.state.buildings.length);
 for(const before of fixture.state.buildings){const after=saved.buildings.find(b=>b.id===before.id);assert(after);assert.equal(after.level,before.level);if(before.kind!=='harbor'){assert.equal(after.x,before.x);assert.equal(after.y,before.y)}}
 assert.deepEqual(saved.fleet,fixture.state.fleet);console.log('PASS actual phone save migration preserves kingdom, gems and fleet');
 for(const [name,label] of [['settings','Settings and help'],['achievements','Open achievements'],['commanders','Open commanders']]){await page.getByRole('button',{name:label,exact:true}).click();await page.locator('[role=dialog]').waitFor();await fit();await shot(name+'-portrait');await page.setViewportSize({width:840,height:360});await page.waitForTimeout(100);await fit();await shot(name+'-landscape');await close();await page.setViewportSize({width:430,height:800});}
 await menu('Frontier');await page.locator('.campaign-node').nth(2).click();await page.locator('.sw-scout .map-holder').waitFor();await page.waitForTimeout(200);await shot('scout-portrait');
 const holder=page.locator('.sw-scout .map-holder'),canvas=holder.locator('canvas');const box=await canvas.boundingBox(),zoom=await holder.getAttribute('data-camera-zoom');assert(zoom!==null,'camera diagnostics present');
 const cdp=await page.context().newCDPSession(page);const cx=box.x+box.width*.5,cy=box.y+box.height*.5;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx-28,y:cy,id:0},{x:cx+28,y:cy,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx-75,y:cy-15,id:0},{x:cx+75,y:cy+15,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(100);
 assert.equal(await holder.getAttribute('data-camera-zoom'),zoom,'pinch changed camera');assert.equal(await page.evaluate(()=>visualViewport.scale),1,'pinch changed page zoom');
 await page.getByRole('button',{name:'Zoom in',exact:true}).click();assert(Number(await holder.getAttribute('data-camera-zoom'))>Number(zoom),'explicit zoom failed');await page.getByRole('button',{name:'Center map',exact:true}).click();assert.equal(Number(await holder.getAttribute('data-camera-zoom')),1);console.log('PASS two-finger pinch ignored and explicit camera controls work');
 await close();await menu('Capital');await menu('Fleet');await page.locator('[role=dialog]').waitFor();await fit();await shot('fleet-portrait');await page.setViewportSize({width:840,height:360});await page.waitForTimeout(100);await fit();await shot('fleet-landscape');await close();
 assert.equal(errors.length,0,errors.join('\n'));console.log('PASS actual-save menus, rotation and runtime');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
