// Real local service + D1 + production JavaScript bridge and UI. Native Apple
// identity and files are test fixtures; no deployed service or purchase is used.
const {chromium}=require('/opt/homebrew/lib/node_modules/openclaw/node_modules/playwright-core');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const save=JSON.parse(fs.readFileSync('/Users/chrismozer/Library/Developer/Stonewake-backups/post-install-build10-kingdom.json'));
(async()=>{
  const {createUIFixture}=await import('../backend/test/ui-fixture.mjs');
  const fixture=await createUIFixture();
  const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  const page=await browser.newPage({viewport:{width:393,height:760},hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const requests=()=>fixture.calls.filter(c=>c.method==='request').map(c=>c.payload);
  try {
    await page.exposeFunction('__nativeOnline',async(method,payload)=>{
      try{return {ok:true,...await fixture.call(method,payload)}}
      catch(e){return {ok:false,error:{code:e.code||'unavailable',message:e.message,details:e.details}}}
    });
    await page.route('**/assets/index-BPhrguZ3.js',route=>{
      let source=fs.readFileSync(path.join(root,'Stonewake/Web/assets/index-BPhrguZ3.js'),'utf8');
      assert(source.includes('  let kn = z?.frames.reduce'),'UI hook moved');
      source=source.replace('  let kn = z?.frames.reduce',"  window.__campaignDefense=I?.defense;window.__ui={state:r.current,mode:o,input:R,battle:L,result:B,reports:vt,returnLocal:SWReturnLocal,time:lt,queue:swOnlineQueue.current,deploy:Sn,finish:xn,refresh:SWRefreshOnline,local:SWEnvelope,act:mn};\n  let kn = z?.frames.reduce");
      return route.fulfill({contentType:'text/javascript',body:source+'\nwindow.__engine={Al,Y,Ul,Kl,pl,Bl,SWCivicProject};'});
    });
    await page.addInitScript(save=>{
      window.__STONEWAKE_SAVE__=save;window.__STONEWAKE_INTRO_SEEN__=true;window.__localWrites=[];
      window.webkit={messageHandlers:{stonewake:{postMessage(m){
        if(m.kind==='save'){window.__STONEWAKE_SAVE__=JSON.parse(m.payload);window.__localWrites.push(JSON.parse(m.payload))}
        if(m.kind==='online')window.__nativeOnline(m.method,m.payload).then(reply=>window.dispatchEvent(new CustomEvent('stonewake-online-reply',{detail:{id:m.id,...reply}})));
      }}}};
    },save);
    await page.goto('http://localhost:8768');
    await page.waitForFunction(()=>window.__ui?.mode==='practice'&&window.__engine&&window.SWOnline.state().signedIn);
    const account=async()=>{await page.getByRole('button',{name:'Kingdom menu',exact:true}).tap();await page.locator('.kingdom-menu').getByRole('button',{name:'Settings',exact:true}).tap();await page.getByRole('button',{name:'Account',exact:true}).tap()};
    const enter=async()=>{await account();await page.getByRole('button',{name:'Enter Online Kingdom',exact:true}).tap();assert.equal(await page.evaluate(()=>window.__ui.mode),'practice');await page.locator('.sw-account-confirm').getByRole('button',{name:'Enter Online Kingdom',exact:true}).tap();await page.waitForFunction(()=>window.__ui.mode==='cloud')};
    await account();await page.getByRole('button',{name:'Back up local kingdom',exact:true}).tap();await page.getByText('Cloud backup saved.',{exact:true}).waitFor();
    const cloud=await fixture.request('/v1/backup');assert.equal(cloud.revision,1);assert.equal(cloud.save.state.name,save.state.name);assert.equal((await fixture.request('/v1/game')).state.gems,100,'Backup gems leaked into competitive kingdom');
    // A separately chosen older backup must restore explicitly, after archiving.
    cloud.save.state.name='Restored Local';cloud.save.state.revision=1;
    await fixture.db.prepare('UPDATE backups SET payload=? WHERE account_id=?').bind(JSON.stringify(cloud.save),fixture.user.accountId).run();
    await page.getByRole('button',{name:'Restore backup',exact:true}).tap();await page.getByRole('button',{name:'Restore this backup',exact:true}).tap();await page.waitForFunction(()=>window.__ui.state.name==='Restored Local');
    assert.equal(fixture.archives.length,1);assert.equal(await page.evaluate(()=>window.__ui.state.revision),1);
    await enter();assert.equal(fixture.archives.length,2);assert.equal(await page.evaluate(()=>window.__ui.state.name),'Online Test');
    let baseline=await page.evaluate(()=>({save:JSON.stringify(window.__STONEWAKE_SAVE__),writes:window.__localWrites.length}));
    await account();await page.getByRole('button',{name:'Kingdom',exact:true}).tap();await page.locator('.sw-field input').fill('Online Renamed');await page.getByRole('button',{name:'Save name',exact:true}).tap();await page.waitForFunction(()=>window.__ui.state.name==='Online Renamed');await page.locator('[data-slot=dialog-close]').tap();
    const rename=requests().find(c=>c.path==='/v1/game/actions');assert.equal(rename.body.revision,0);assert.equal((await fixture.readState()).name,'Online Renamed');
    await page.getByRole('button',{name:'Kingdom menu',exact:true}).tap();await page.locator('.kingdom-menu').getByRole('button',{name:'Frontier',exact:true}).tap();await page.getByRole('tab',{name:'League',exact:true}).tap();await page.waitForTimeout(100);await page.getByRole('tab',{name:'Rivals',exact:true}).tap();await page.locator('.rival-card').filter({hasText:'Fixture Rival'}).tap();
    await page.getByRole('button',{name:'Attack',exact:true}).tap();await page.waitForFunction(()=>window.__ui.battle?.kind==='player');
    const battleId=await page.evaluate(()=>window.__ui.battle.id),initial=await fixture.request('/v1/game');
    assert.equal(initial.battle.id,battleId);assert.equal(initial.state.activeBattle,battleId);assert.equal(initial.battle.input.combatVersion,12);assert.equal(initial.battle.input.navalVersion,3);assert.deepEqual(initial.battle.input.enemyNavy,[],'A fleetless player was given invented ships');assert(await page.getByRole('button',{name:'Battle speed 1 times',exact:true}).isDisabled());
    const point=await page.evaluate(()=>{for(let x=-2;x<15;x++)for(let y=-2;y<15;y++)if(window.__engine.pl(window.__ui.input.defense,x,y))return{x,y}});
    fixture.dropNextCommandReply();await page.evaluate(p=>{window.__ui.deploy(p.x,p.y);window.__ui.deploy(p.x,p.y);window.__ui.deploy(p.x,p.y)},point);
    assert.equal(await page.evaluate(()=>window.__ui.input.orders.length),3);await page.getByRole('button',{name:'Retry connection',exact:true}).waitFor();await page.getByRole('button',{name:'Retry connection',exact:true}).tap();await page.waitForFunction(()=>window.__ui.queue.pending===0);
    const committed=await fixture.request('/v1/game');assert.equal(committed.battle.commandSeq,3);assert.equal(committed.battle.input.orders.length,3);
    const commands=requests().filter(c=>c.path==='/v1/battles/commands');assert.equal(commands.length,2);assert.equal(commands[0].body.requestId,commands[1].body.requestId);assert.equal(commands[0].body.commands.length,3);assert(!Object.hasOwn(commands[0].body.commands[0],'time'));
    fixture.delayCommands(900);await page.evaluate(p=>window.__ui.deploy(p.x,p.y),point);await page.waitForTimeout(90);await account();await page.getByRole('button',{name:'Return to local kingdom',exact:true}).tap();await page.waitForFunction(()=>window.__ui.mode==='practice');await page.waitForTimeout(1000);assert.equal(await page.evaluate(()=>window.__ui.state.name),'Restored Local');assert.equal(await page.evaluate(()=>window.__ui.input),null);
    fixture.delayCommands(0);await enter();await page.waitForFunction(id=>window.__ui.battle?.id===id,battleId);assert.equal(await page.evaluate(()=>window.__ui.input.orders.length),4);assert.equal((await fixture.request('/v1/game')).battle.commandSeq,4);
    baseline=await page.evaluate(()=>({save:JSON.stringify(window.__STONEWAKE_SAVE__),writes:window.__localWrites.length}));
    await page.setViewportSize({width:932,height:430});await page.screenshot({path:'/Users/chrismozer/Library/Developer/Stonewake-review/build11/interface/actual-service-player-battle.png'});
    await page.getByRole('button',{name:'Retreat',exact:true}).tap();await page.waitForFunction(()=>!!window.__ui.result);
    const settled=await fixture.request('/v1/game');assert.equal(settled.battle,null);assert.equal(settled.state.activeBattle,null);assert.equal((await fixture.request('/v1/reports')).reports.length,1);
    const duplicate=await fixture.request('/v1/battles/finish',{method:'POST',body:{battleId,retreat:true}});assert.equal(duplicate.revision,settled.revision);assert.equal((await fixture.readState()).revision,settled.revision);
    const defenderReport=JSON.parse((await fixture.db.prepare('SELECT payload FROM reports WHERE account_id=?').bind(fixture.rival.accountId).first()).payload);assert.equal(defenderReport.defending,true);assert.equal(defenderReport.input.defense.name,'Fixture Rival');assert(!Object.hasOwn(defenderReport.result,'frames'));
    assert.equal(await page.evaluate(()=>JSON.stringify(window.__STONEWAKE_SAVE__)),baseline.save);assert.equal(await page.evaluate(()=>window.__localWrites.length),baseline.writes);
    await page.getByRole('button',{name:'Return to your capital',exact:true}).tap();await fixture.makeRaidDue();await page.evaluate(()=>window.__ui.refresh());await page.waitForFunction(()=>window.__ui.state.city.raidSchedule.cycle===1);
    const raidGame=await fixture.request('/v1/game');assert.equal(raidGame.state.city.raidSchedule.cycle,1);assert(requests().some(c=>c.path==='/v1/raids/resolve'));const reports=await fixture.request('/v1/reports');assert.equal(reports.reports.length,2);assert(reports.reports.some(r=>r.kind==='defense'&&r.defending));await page.evaluate(()=>window.__ui.refresh());assert.equal((await fixture.request('/v1/reports')).reports.length,2,'Refresh settled a raid twice');
    await account();await page.getByRole('button',{name:'Return to local kingdom',exact:true}).tap();await page.waitForFunction(()=>window.__ui.mode==='practice');assert.equal(await page.evaluate(()=>window.__ui.state.name),'Restored Local');assert.equal(await page.evaluate(()=>window.__ui.state.gems),cloud.save.state.gems);
    assert.deepEqual(errors,[]);console.log('PASS actual local service + D1 + production browser bridge: backup CAS/isolation and explicit archive/restore; authoritative rename; real published rival; battle reservation, server timestamps, lost-ack retry dedup, local-return isolation, resume, retreat and duplicate settlement; defender report; scheduled raid once. Apple identity and file storage remain test fixtures; purchases disabled.');
  } catch(e){console.error('UI state',await page.evaluate(()=>({text:document.body.innerText.slice(-2500),mode:window.__ui?.mode,input:!!window.__ui?.input})));throw e}
  finally {await browser.close();await fixture.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
