const {chromium}=require('/opt/homebrew/lib/node_modules/openclaw/node_modules/playwright-core');
const fs=require('fs'),assert=require('assert'),path=require('path');
const asset=path.resolve(__dirname,'../Stonewake/Web/assets/index-BPhrguZ3.js');
const root='/Users/chrismozer/Library/Developer/Stonewake-review/after';
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{for(const size of [{width:840,height:360},{width:393,height:760}]){
 const page=await browser.newPage({viewport:size});page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/assets/index-BPhrguZ3.js',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync(asset,'utf8')+'\nwindow.__swTest={Al,Y,Ul,Gl,GemCost,Fu};'}));
 await page.addInitScript(()=>{window.__STONEWAKE_INTRO_SEEN__=true;window.__messages=[];window.webkit={messageHandlers:{stonewake:{postMessage(m){window.__messages.push(m);if(m.kind==='save'){window.__lastSave=JSON.parse(m.payload);setTimeout(()=>window.dispatchEvent(new CustomEvent('stonewake-save-status',{detail:{saved:true}})),0)}}}}};});
 await page.goto('http://localhost:8768');await page.waitForSelector('.map-holder canvas');await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
 const shot=async(name)=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await page.screenshot({path:`${root}/${name}-${size.width}.png`})};
 const closed=async()=>{await page.getByRole('button',{name:'Close',exact:true}).last().click();await page.locator('[role=dialog]').waitFor({state:'hidden'})};
 const menu=async(name)=>{await page.getByRole('button',{name:'Kingdom menu',exact:true}).click();await page.locator('.kingdom-menu-links button').filter({hasText:new RegExp('^'+name+'$')}).click()};
 await shot('map');
 await page.getByRole('button',{name:'Settings and help',exact:true}).click();await page.getByRole('slider',{name:'Music volume',exact:true}).waitFor();assert.equal(await page.getByRole('slider',{name:'Music volume',exact:true}).inputValue(),'12');await shot('settings');await closed();
 await menu('Army');await page.getByRole('button',{name:'Show locked',exact:true}).waitFor();await shot('army');await page.getByRole('button',{name:'Show locked',exact:true}).click();assert.equal(await page.locator('.sw-unit-choice').count(),12);await closed();
 await page.getByRole('button',{name:'Gems, 100 available',exact:true}).click();await shot('gems');await closed();
 await menu('Frontier');await page.locator('.campaign-node').first().waitFor();await shot('frontier');await page.locator('.campaign-node').first().click();await page.locator('.sw-scout .scout-map canvas').waitFor();await shot('scout');await closed();
 await menu('Capital');await menu('Build');await shot('build');await page.getByRole('button',{name:'Close build menu',exact:true}).click();
 const results=await page.evaluate(()=>{const {Al,Y,Ul,Gl,GemCost,Fu}=window.__swTest;const now=Date.now();const check=(x,m)=>{if(!x)throw Error(m)};const old=Al(now);delete old.gemVersion;delete old.gems;const migrated=Y(old,now);check(migrated.gems===100,'starter grant');check(Y(migrated,now).gems===100,'migration repeat');
 let s=Al(now);s.buildings.push({id:'pending',kind:'barracks',x:1,y:6,level:0,targetLevel:1,readyAt:now+120000,startedAt:now});s=Ul(s,{type:'speedup',target:'building',id:'pending',maxCost:2},now);check(s.gems===98,'exact deduction');check(s.buildings.find(b=>b.id==='pending').level===1,'complete building');let rejected=false;try{Ul(s,{type:'speedup',target:'building',id:'pending',maxCost:2},now)}catch{rejected=true}check(rejected,'duplicate blocked');
 s.trainingResearch={kind:'infantry',level:2,readyAt:now+60000};s=Ul(s,{type:'speedup',target:'research',id:'infantry',maxCost:1},now);check(s.gems===97&&s.unitLevels.infantry===2,'research');s.fleet=[{id:'ship',kind:'cog',level:0,targetLevel:1,readyAt:now+60000}];s=Ul(s,{type:'speedup',target:'ship',id:'ship',maxCost:1},now);check(s.gems===96&&s.fleet[0].level===1,'ship');
 const grouped=Al(now);grouped.buildings.push(...[1,2].map(i=>({id:'wall'+i,kind:'wall',x:i,y:7,level:0,projectId:'wall-project',targetLevel:1,readyAt:now+60000})));const g=Ul(grouped,{type:'speedup',target:'building',id:'wall1',maxCost:1},now);check(g.gems===99&&g.buildings.filter(b=>b.kind==='wall').every(b=>b.level===1),'group finishes once');
 const poor=Al(now);poor.gems=0;poor.buildings[0].readyAt=now+60000;poor.buildings[0].targetLevel=2;let denied=false;try{Ul(poor,{type:'speedup',target:'building',id:'keep',maxCost:1},now)}catch{denied=true}check(denied&&poor.gems===0,'insufficient gems');
 for(let stage=0;stage<10;stage++){const town=Gl(stage);check(new Set(town.buildings.map(b=>b.x+','+b.y)).size===town.buildings.length,'town overlaps');check(town.buildings.some(b=>b.kind==='gate'),'town gates');}
 const persisted=Y(JSON.parse(JSON.stringify(s)),now);check(persisted.gems===96,'gems persist');
 return {passed:true};});
 assert.equal(errors.length,0,errors.join('\n'));console.log('PASS screens and economy',size,results);await page.close();
 }}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
