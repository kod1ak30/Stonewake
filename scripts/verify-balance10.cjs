const {chromium}=require('/opt/homebrew/lib/node_modules/openclaw/node_modules/playwright-core');
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),fixture=JSON.parse(fs.readFileSync('/Users/chrismozer/Library/Developer/Stonewake-backups/pre-build10-kingdom.json','utf8'));
const out='/Users/chrismozer/Library/Developer/Stonewake-review/build10';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('**/assets/index-BPhrguZ3.js',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.join(root,'Stonewake/Web/assets/index-BPhrguZ3.js'),'utf8')+'\nwindow.__test={Al,Y,Ul,Il,X,Fl,Bc,Vc,Ac,Sl,J,SWCanPlace,SWTradeQuote,SWCapacity,SWBuildingCount,SWBuildingLimit,SWStorageContribution,SWCanReceive,SWLandStats,SWCityRequest,SWResolveDefense,SWDefenseInput,SWRaidLoot,SWCity,SWCityRecipes,Wl,el,tl,nl,Pl,Ic,Ll};'}));
await page.addInitScript(save=>{save.state.lastTick=Date.now();window.__STONEWAKE_SAVE__=save;window.__STONEWAKE_INTRO_SEEN__=true;window.webkit={messageHandlers:{stonewake:{postMessage(m){if(m.kind==='save'){window.__lastSave=JSON.parse(m.payload);window.dispatchEvent(new CustomEvent('stonewake-save-status',{detail:{saved:true}}));}}}}};},fixture);
await page.goto('http://localhost:8768');await page.waitForSelector('.map-holder canvas');
const checks=await page.evaluate(fixture=>{
 const api=window.__test,{Al,Y,Ul,Il,X,Fl,Bc,Vc,Ac,Sl,J,SWCanPlace,SWTradeQuote,SWCapacity,SWBuildingCount,SWBuildingLimit,SWStorageContribution,SWCanReceive,SWLandStats,SWCityRequest,SWResolveDefense,SWDefenseInput,SWRaidLoot,SWCity,SWCityRecipes,Wl,tl,nl,Pl,Ic,Ll}=api;
 const check=(v,m)=>{if(!v)throw Error(m)},reject=(fn,m)=>{let threw=false;try{fn()}catch{threw=true}check(threw,m)},clone=s=>JSON.parse(JSON.stringify(s)),now=fixture.state.lastTick,s=Y(fixture.state,now),cap=Fl(s),zero={gold:0,wood:0,stone:0,food:0},keys=Object.keys(zero);
 // A real old save migrates exactly once, with no disappearing resources or possessions.
 for(const k of keys)check(Math.abs(s.resources[k]+s.reserveCrates[k]-fixture.state.resources[k])<1e-6,'migration lost '+k);
 check(s.gems===fixture.state.gems&&s.campaign===fixture.state.campaign,'migration changed progress');
 for(const b of fixture.state.buildings){const next=s.buildings.find(n=>n.id===b.id);for(const k of Object.keys(b))check(JSON.stringify(b[k])===JSON.stringify(next[k]),'building migration changed '+k);}
 const again=Y(s,now);check(JSON.stringify(again.reserveCrates)===JSON.stringify(s.reserveCrates),'migration duplicated reserve');
 let claim=clone(s);claim.resources.wood-=100;let claimed=Ul(claim,{type:'claimReserve'},now);check(Math.abs(claimed.resources.wood-cap)<1e-6&&Math.abs(claimed.reserveCrates.wood-claim.reserveCrates.wood+100)<1e-6,'reserve withdrawal');
 reject(()=>Ul(s,{type:'claimReserve'},now),'withdraw at full stores');
 let production=Y(s,now+3600000);for(const k of keys)check(production.resources[k]<=cap&&production.reserveCrates[k]===s.reserveCrates[k],'passive overflow incorrectly saved');
 const credited=Ll(production,{gold:100,wood:100,stone:100,food:100});check(Object.values(credited).every(v=>v===0),'full stores accepted loot');
 // All 256 home plots and every province expansion can actually place and move buildings.
 let home=0,all=0;const expanded={...s,provinces:Ac.map(p=>({id:p.id,level:1}))};for(let x=0;x<18;x++)for(let y=0;y<18;y++){home+=Bc(x,y)?1:0;all+=Vc(expanded,x,y)?1:0;}check(home===256&&all===324,'land area');
 check(!Bc(.5,1)&&!Bc(-1,1)&&!Bc(16,1),'home boundary');let moved=Ul(s,{type:'move',id:s.buildings.find(b=>b.kind==='farm').id,x:15,y:15,facing:3},now);check(moved.buildings.find(b=>b.kind==='farm').facing===3,'move rotation not persisted');
 for(let facing=0;facing<4;facing++)moved=Ul(moved,{type:'rotate',id:moved.buildings.find(b=>b.kind==='farm').id},now);check(moved.buildings.find(b=>b.kind==='farm').facing===3,'rotation cycle');check(Wl(moved).buildings.find(b=>b.kind==='farm').facing===3,'defense facing snapshot');
 // Count construction against caps and preserve grandfathered excess.
 let capState=clone(s);capState.buildings=capState.buildings.filter(b=>b.kind!=='quarry');const limit=SWBuildingLimit(capState,'quarry');for(let i=0;i<limit;i++)capState.buildings.push({id:'test-quarry-'+i,kind:'quarry',level:0,targetLevel:1,x:12,y:i,readyAt:now+999999});
 reject(()=>Ul(capState,{type:'build',kind:'quarry',x:13,y:14},now),'unfinished copies bypass cap');
 const tooMany=clone(s);for(let i=0;i<5;i++)tooMany.buildings.push({id:'old-'+i,kind:'barracks',level:1,x:13,y:i});check(Y(tooMany,now).buildings.length===tooMany.buildings.length,'migration deleted excess buildings');reject(()=>Ul(tooMany,{type:'build',kind:'barracks',x:14,y:14},now),'grandfathered limit bypass');
 // Network must really reach Keep. Isolated roads do nothing; nearby gardens improve housing.
 let town=Al(now);town.storageVersion=1;town.buildings=[{id:'k',kind:'keep',level:1,x:2,y:2},{id:'mill',kind:'lumber',level:1,x:5,y:2},{id:'home',kind:'cottage',level:1,x:3,y:4}];town.terrain=[{x:4,y:2,kind:'road'}];const base=Il(town,now);check(SWLandStats(town).connectedCount===0,'isolated road connected');town.terrain.push({x:3,y:2,kind:'road'});check(SWLandStats(town).connectedIds.includes('mill'),'connected mill missing');check(Math.abs(Il(town,now).wood-base.wood-2.8)<1e-6,'road income bonus');town.terrain.push({x:3,y:3,kind:'garden'});check(SWLandStats(town).gardenBonus===.02&&Il(town,now).gold>base.gold,'garden housing bonus');
 // All exchanges lose value, take the selected supply and cannot exceed capacity.
 let trades=0;for(const give of keys)for(const receive of keys)if(give!==receive){let before=clone(s);before.resources=Object.fromEntries(keys.map(k=>[k,1000]));const quote=SWTradeQuote(before,receive,100,give),after=Ul(before,{type:'marketTrade',resource:receive,amount:100,payWith:give},now);check(after.resources[give]===1000-quote.payment&&after.resources[receive]===1100,'exchange '+give+' '+receive);check(quote.payment>=200,'trade arbitrage');trades++;}
 reject(()=>Ul(s,{type:'marketTrade',resource:'gems',amount:100},now),'invalid trade');
 // Storage blocking must not consume a resident request, its supplies, or a cargo claim.
 let req=SWCityRequest(s,0);reject(()=>Ul(s,{type:'cityRequest',slot:0,id:req.id},now),'full request accepted');
 let voyage=clone(s);voyage.fleet=[{id:'test',kind:'cutter',level:1,voyage:{readyAt:now-1,reward:{gold:50,wood:50,stone:50,food:50}}}];reject(()=>Ul(voyage,{type:'collectVoyage',id:'test'},now),'full voyage accepted');check(voyage.fleet[0].voyage,'rejected voyage removed');
 // Four resources are at risk; protection scales with capacity; gems are never loot.
 let raided=clone(s);raided.resources=Object.fromEntries(keys.map(k=>[k,cap]));const risk=SWRaidLoot(raided,{won:true,destruction:100});for(const k of keys)check(risk[k]===Math.floor((cap-Math.floor(cap*.2))*.18),'loot risk '+k);
 const gems=raided.gems,result=SWResolveDefense(raided,{defenseRaidLevel:1,defenseEconomyVersion:2},{won:true,destruction:100},now);for(const k of keys)check(raided.resources[k]===cap-risk[k],'loot deduction');check(raided.gems===gems&&result.lost===Object.values(risk).reduce((a,b)=>a+b,0),'raid settlement');
 let safe=clone(s);safe.resources=Object.fromEntries(keys.map(k=>[k,Math.floor(cap*.2)]));check(Object.values(SWRaidLoot(safe,{won:true,destruction:100})).every(n=>n===0),'protected stocks stolen');
 // Check every level gate and all building, ship and troop costs for a storage softlock.
 const progression=[];for(let level=1;level<=10;level++){let age=Al(now);age.buildings=[{id:'keep',kind:'keep',level,x:2,y:2}];for(let j=0;j<SWBuildingLimit(age,'storehouse');j++)age.buildings.push({id:'store'+j,kind:'storehouse',level,x:j,y:0});const max=SWCapacity(age),costs=[];for(const[k,spec]of Object.entries(Sl))if(spec.unlock<=level)costs.push({name:k,cost:X(k,level)});if(level<10)costs.push({name:'next keep',cost:X('keep',level+1)});for(const c of costs)check(Math.max(...Object.values(c.cost))<=max,'storage softlock Keep'+level+' '+c.name+' max '+max+' need '+JSON.stringify(c.cost));progression.push({keep:level,stores:SWBuildingLimit(age,'storehouse'),capacity:max,nextKeep:level<10?X('keep',level+1):null,limits:Object.fromEntries(['farm','lumber','quarry','barracks','tower','wall'].map(k=>[k,SWBuildingLimit(age,k)]))});}
 return {homePlots:home,totalPlots:all,actualSaveCapacity:cap,preservedReserve:s.reserveCrates,income:Il(s,now),trades,risk,progression};
},fixture);
fs.writeFileSync(out+'/balance-verification.json',JSON.stringify(checks,null,2));console.log('PASS saved progress, finite stores, reserve accounting, 256/324 plots, facing, caps, road connectivity, all trades, claim safety, raid theft and level1-10 affordability');console.log(JSON.stringify(checks,null,2));assert.equal(errors.length,0,errors.join('\n'));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
