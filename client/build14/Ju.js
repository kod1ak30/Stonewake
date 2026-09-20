function Ju({ deviceOnly: e = !1 } = {}) {
  const [battlePrep14,setBattlePrep14]=C.useState(null),[selectedShip14,setSelectedShip14]=C.useState(null),[navalTool14,setNavalTool14]=C.useState(null);
  const [layout14,setLayout14]=C.useState(null),layoutRef14=C.useRef(null),[layoutOverlay14,setLayoutOverlay14]=C.useState('plots'),navHistory14=C.useRef(['capital']),scoutReturn14=C.useRef(null),requirementTrail14=C.useRef([]);layoutRef14.current=layout14;
  function SWStartLayout14(){const base=Y(r.current);const draft={base,states:[base],actions:[],index:0};layoutRef14.current=draft;setLayout14(draft);p('capital');ee('road');}
  function SWEditAct14(action,message){
   const draft=layoutRef14.current;if(!draft||!['move','rotate','landscape'].includes(action.type))return mn(action,message);
   try{const next=Ul(draft.states[draft.index],action,draft.base.lastTick),updated={...draft,states:[...draft.states.slice(0,draft.index+1),next],actions:[...draft.actions.slice(0,draft.index),action],index:draft.index+1};layoutRef14.current=updated;setLayout14(updated);He('click');return Promise.resolve(next)}catch(error){ic.error(error.message,{id:'layout-message'});return Promise.resolve(null)}
  }
  function SWLayoutTravel14(delta){const draft=layoutRef14.current;if(!draft)return;const index=Math.max(0,Math.min(draft.actions.length,draft.index+delta));const next={...draft,index};layoutRef14.current=next;setLayout14(next);}
  function SWCancelLayout14(){layoutRef14.current=null;setLayout14(null);ee(null);h(null);y(null);Ft(null);}
  async function SWSaveLayout14(){const draft=layoutRef14.current;if(!draft)return;const result=await mn({type:'commitLayout',actions:draft.actions.slice(0,draft.index)},'Layout saved');if(result)SWCancelLayout14();}
  function SWRequire14(action){
   if(H?.id&&requirementTrail14.current.at(-1)!==H.id)requirementTrail14.current.push(H.id);
   if(action.type==='build'){gn(action.kind);return}
   if(action.type==='buildingKind'){const candidates=V.buildings.filter(b=>b.kind===action.kind).sort((a,b)=>b.level-a.level);if(candidates[0]){SWNavigate('capital');h(candidates[0].id)}else gn(action.kind);return}
   if(action.type==='land'){SWNavigate('frontier');nt('campaign');return}
   if(action.type==='projects'){setGemShopOpen(true);return}
   SWNavigate('storage');
  }
  function SWShipCommand14(command){
   if(St||B)return;
   if(['move','focus'].includes(command.type)){setNavalTool14(command);return}
   const input=swBattleInput.current;if(!input||input.navalVersion!==4||B||St)return;
   const order={...command,time:Math.min(119.5,Math.ceil(lt*4)/4)};
   if(c.current==='cloud'&&L?.kind!=='practice'){swOnlineQueue.current?.enqueue({type:'ship',order});return}
   const next={...input,shipOrders14:[...(input.shipOrders14||[]),order]};try{SWValidateShipOrders14(next,next.shipOrders14);SWQueueSimulation(next);He('click')}catch(error){ic.error(error.message)}setNavalTool14(null);
  }
  function SWNavalMap14(x,y,targetId){if(!navalTool14||St||B)return;const command={...navalTool14,...(navalTool14.type==='focus'?{targetId}:{x,y})};setNavalTool14(null);const input=swBattleInput.current;if(!input)return;const order={...command,time:Math.min(119.5,Math.ceil(lt*4)/4)};try{SWValidateShipOrders14(input,[...(input.shipOrders14||[]),order]);if(c.current==='cloud'&&L?.kind!=='practice')swOnlineQueue.current?.enqueue({type:'ship',order});else SWQueueSimulation({...input,shipOrders14:[...(input.shipOrders14||[]),order]})}catch(error){ic.error(error.message)}}

  const [cityOpen,setCityOpen]=C.useState(false);
  const [premiumStore,setPremiumStore]=C.useState(null),[chronicleTab,setChronicleTab]=C.useState(null),[ornamentPlacement,setOrnamentPlacement]=C.useState(null);
  const swFeedback=C.useRef({haptics:true,replay:false});
  const [haptics,setHaptics]=C.useState(()=>{try{return localStorage.getItem('stonewake-haptics')!=='off'}catch{return true}}),[reducedEffects,setReducedEffects]=C.useState(()=>{try{return localStorage.getItem('stonewake-reduced-effects')==='on'}catch{return false}});
  C.useEffect(()=>{window.webkit?.messageHandlers?.stonewake?.postMessage({kind:'feedbackSettings',haptics,reducedEffects});try{localStorage.setItem('stonewake-haptics',haptics?'on':'off');localStorage.setItem('stonewake-reduced-effects',reducedEffects?'on':'off')}catch{}},[haptics,reducedEffects]);
  function SWHaptic(event,eventId){if(swFeedback.current.haptics&&!swFeedback.current.replay)window.webkit?.messageHandlers?.stonewake?.postMessage({kind:'haptic',event,eventId})}

  const [settingsSection,setSettingsSection]=C.useState('Audio');
  const swOnlineEpoch=C.useRef(0),swOnlineQueue=C.useRef(null),swOnlineRevision=C.useRef(0),swOnlineOffset=C.useRef(null),swLocalEnvelope=C.useRef(null),swOnlineRetreat=C.useRef(false);
  const [onlineBattleError,setOnlineBattleError]=C.useState('');
  const swBattleInput=C.useRef(null),swBattleRuntime=C.useRef(null),swSimulationPending=C.useRef(false),swFinishing=C.useRef(false);
  const swRaidRuntime=C.useRef(null),swRaidPending=C.useRef(false),swRaidFailure=C.useRef(0),swCurrentBattle=C.useRef(null);
  C.useEffect(()=>()=>{swBattleRuntime.current?.close();swRaidRuntime.current?.close()},[]);
  const [gemShopOpen, setGemShopOpen] = C.useState(false);
  const [storageOpen,setStorageOpen]=C.useState(false),[buildFacing,setBuildFacing]=C.useState(0);
  const [navalId, setNavalId] = C.useState('');
  const [musicVolume, setMusicVolume] = C.useState(() => {
    try { const v=localStorage.getItem('stonewake-music-volume'); return v===null?0.12:Math.max(0,Math.min(1,Number(v)||0)); } catch { return 0.12; }
  });
  const [battleMusicVolume,setBattleMusicVolume]=C.useState(()=>{try{const v=localStorage.getItem('stonewake-battle-music-volume');return v===null?.14:Math.max(0,Math.min(1,Number(v)||0))}catch{return .14}});
  const [stonewakeMusic, setStonewakeMusic] = (0, C.useState)(() => {
    try {
      return localStorage.getItem(`stonewake-music`) !== `off`;
    } catch {
      return true;
    }
  });
  (0, C.useEffect)(() => {
    window.webkit?.messageHandlers?.stonewake?.postMessage({
      kind: `musicSettings`,
      enabled: stonewakeMusic,
      volume: musicVolume, battleVolume:battleMusicVolume,
    });
    try {
      localStorage.setItem(`stonewake-music`, stonewakeMusic ? `on` : `off`);
      localStorage.setItem(`stonewake-music-volume`, String(musicVolume));
      localStorage.setItem(`stonewake-battle-music-volume`,String(battleMusicVolume));
    } catch {}
  }, [stonewakeMusic, musicVolume,battleMusicVolume]);
  const [stonewakeMenuOpen, setStonewakeMenuOpen] = (0, C.useState)(false),
    [stonewakeObjectiveOpen, setStonewakeObjectiveOpen] = (0, C.useState)(
      false,
    );
  let [t, n] = (0, C.useState)(() => Al()),
    r = (0, C.useRef)(t);
  r.current = t;
  let [i, a] = (0, C.useState)(Date.now()),
    [o, s] = (0, C.useState)(`loading`),
    c = (0, C.useRef)(o);
  c.current = o;
  let [l, u] = (0, C.useState)(!1),
    d = (0, C.useRef)(!1),
    [f, p] = (0, C.useState)(`capital`),
    [m, h] = (0, C.useState)(null),
    [g, _] = (0, C.useState)(null),
    [v, y] = (0, C.useState)(null),
    [b, x] = (0, C.useState)(!1),
    [S, w] = (0, C.useState)(!1),
    [T, ee] = (0, C.useState)(null),
    [E, D] = (0, C.useState)(0),
    [le, M] = (0, C.useState)(`infantry`),
    [ue, de] = (0, C.useState)(!1),
    [fe, _e] = (0, C.useState)(!1),
    [Se, Ce] = (0, C.useState)(!1);
  ((0, C.useEffect)(() => {
    if (
      !e ||
      Au() ||
      !(`serviceWorker` in navigator) ||
      location.protocol !== `https:`
    )
      return;
    let t = !0;
    return (
      navigator.serviceWorker
        .register(`/sw.js`)
        .then(() => navigator.serviceWorker.ready)
        .then(() => {
          t && Ce(!0);
        })
        .catch(() => {}),
      () => {
        t = !1;
      }
    );
  }, [e]),
    (0, C.useEffect)(() => {
      _e(!Nu());
    }, []));
  let Ae = (0, C.useCallback)(() => {
      (_e(!1), Pu());
    }, []),
    [Me, Ne] = (0, C.useState)(!1),
    [Pe, Fe] = (0, C.useState)(!1),
    [Ie, Le] = (0, C.useState)(`Havencrest`),
    {
      sound: Re,
      volume: ze,
      reduced: Be,
      event: Ve,
      dismiss: dismissNotice,
      chime: He,
      celebrate: Ue,
      toggleSound: We,
      changeVolume: Ge,
      toggleMotion: Ke,
    } = Hu(),
    [qe, Je] = (0, C.useState)(!1),
    [Ye, Xe] = (0, C.useState)([]),
    [Ze, Qe] = (0, C.useState)(!1),
    [$e, et] = (0, C.useState)(``),
    [tt, nt] = (0, C.useState)(`campaign`),
    [I, rt] = (0, C.useState)(null),
    [it, at] = (0, C.useState)(`center`),
    [L, ot] = (0, C.useState)(null),
    [R, st] = (0, C.useState)(null),
    [z, ct] = (0, C.useState)(null),
    [lt, ut] = (0, C.useState)(0),
    [dt, ft] = (0, C.useState)(1),
    [B, pt] = (0, C.useState)(null),
    [mt, ht] = (0, C.useState)(!1),
    [gt, _t] = (0, C.useState)(``),
    [vt, yt] = (0, C.useState)([]),
    [bt, xt] = (0, C.useState)(``),
    [St, Ct] = (0, C.useState)(!1),
    [wt, Tt] = (0, C.useState)(!1),
    Et = (0, C.useRef)(!1),
    [Dt, Ot] = (0, C.useState)(!0),
    [kt, At] = (0, C.useState)(!1),
    [jt, Mt] = (0, C.useState)(!1),
    Nt = (0, C.useRef)(!1),
    [Pt, Ft] = (0, C.useState)(null),
    [It, Lt] = (0, C.useState)(!1),
    [Rt, zt] = (0, C.useState)(1),
    [Bt, Vt] = (0, C.useState)(`all`),
    [Ht, Ut] = (0, C.useState)(!1),
    [Wt, Gt] = (0, C.useState)([]),
    [Kt, qt] = (0, C.useState)({}),
    V = layout14?layout14.states[layout14.index]:Y(t, i),
    Jt = Ml(V),
    Yt = Il(V),
    H = V.buildings.find((e) => e.id === m),
    Xt = Rl(V),
    Zt = V.buildings.find((e) => e.readyAt),
    Qt = Nl(V.army),
    $t = Rc(V),
    en = Ic(V),
    tn = Gc(V),
    nn =
      Wt.length > 0 &&
      Wt.every(
        (e) =>
          Vc(V, e.x, e.y) &&
          !al(V, e.x, e.y) &&
          !V.buildings.some((t) => t.x === e.x && t.y === e.y),
      ),
    rn = Dl.filter((e) => Ol(V, e) >= e.target),
    an = rn.filter((e) => !V.honors?.includes(e.id)),
    on =
      Jt >= 10
        ? `Emperor`
        : Jt >= 7
          ? `Sovereign`
          : Jt >= 4
            ? `Warden`
            : Jt >= 2
              ? `Townkeeper`
              : `Settler`,
    sn = (0, C.useRef)(null),
    cn = (0, C.useRef)(null);
  SWUseMusic(B?(B.result.won?'victory':'calm'):L?'battle':I?'scout':'calm',stonewakeMusic,L?battleMusicVolume:musicVolume);
  swFeedback.current={haptics,replay:St};
  swBattleInput.current=R;
  C.useEffect(()=>{if(o==='practice'&&V.city?.raidSchedule?.eligibleAt&&!t.city?.raidSchedule?.eligibleAt){r.current=V;n(V)}},[o,V.city?.raidSchedule?.eligibleAt,t.city?.raidSchedule?.eligibleAt]);
  swCurrentBattle.current=L;
  C.useEffect(()=>{
    if(o!=='practice'||L||d.current||swRaidPending.current||document.hidden||Date.now()<swRaidFailure.current)return;
    const now=Date.now(),state=Y(r.current,now);
    if(state.activeBattle||SWRaidStatus(state,now).phase!=='ready')return;
    const input=SWRaidInput(state,now,true);swRaidPending.current=true;swRaidRuntime.current ||= SWBattleWorker();
    swRaidRuntime.current.request(input,fullResult=>{
      swRaidPending.current=false;
      if(c.current!=='practice'||swCurrentBattle.current||r.current.activeBattle||d.current)return;
      const current=Y(r.current),{frames,...result}=fullResult,outcome=SWSettleScheduledRaid(current,input,result,Date.now());
      if(!outcome)return;
      current.revision++;r.current=current;n(current);
      yt(reports=>[{id:input.raidId,kind:'defense',input,result,reward:outcome.reward,lost:outcome.lost,loot:outcome.loot,defenseReport:outcome.defenseReport,createdAt:Date.now(),defending:true},...reports].slice(0,20));
      Ue({title:outcome.won?'Your city repelled the raiders':'Raid resolved',detail:outcome.won?'Your defenses held. Open City to see the report.':'Open City to see losses and improve your defenses.',icon:'shield'});He(outcome.won?'win':'defeat');
    },()=>{swRaidPending.current=false;swRaidFailure.current=Date.now()+60000});
  },[o,i,!!L]);
  (0, C.useEffect)(() => {
    if (o !== `cloud` && o !== `practice`) return;
    let e = sn.current;
    if (((sn.current = new Map(V.buildings.map((e) => [e.id, e.level]))), !e))
      return;
    let t = V.buildings.filter(
      (t) => t.kind === `wall` && e.has(t.id) && t.level > (e.get(t.id) || 0),
    );
    for (let n of V.buildings) {
      let r = e.get(n.id);
      if (r !== void 0 && n.level > r) {
        if (n.kind === `wall` && t[0]?.id !== n.id) continue;
        let e = n.kind === `keep`;
        (Ue({
          title: e
            ? `Welcome to Age ${n.level}`
            : n.kind === `wall`
              ? `${t.length} wall ${t.length === 1 ? `segment` : `segments`} complete!`
              : r === 0
                ? `${Sl[n.kind].name} complete!`
                : `${Sl[n.kind].name} leveled up!`,
          detail: e
            ? n.level === 2
              ? `Cavalry, shieldbearers and scouts are ready to recruit.`
              : `Level ${n.level} upgrades are now open across your kingdom.`
            : Bl(n),
          icon: e ? `crown` : `hammer`,
          building: { x: n.x, y: n.y },
          grand: e,
        }),
          He(e ? `achievement` : `complete`));
      }
    }
  }, [V.buildings.map((e) => `${e.id}:${e.level}`).join(`|`), o, Ue, He]);
  let ln = (0, C.useRef)(null),
    un = JSON.stringify(V.unitLevels),
    dn = JSON.stringify(
      Object.fromEntries((V.fleet || []).map((e) => [e.id, e.level])),
    );
  ((0, C.useEffect)(() => {
    let e = ln.current;
    ((ln.current = { units: un, ships: dn, mode: o }),
      !(!e || o === `loading` || e.mode !== o) &&
        (e.units !== un &&
          (Ue({
            title: `Troop upgrade complete!`,
            detail: `Your troops have stronger health and attack.`,
            icon: `swords`,
            grand: !0,
          }),
          He(`complete`)),
        e.ships !== dn &&
          Object.entries(JSON.parse(dn)).some(
            ([t, n]) => n > (JSON.parse(e.ships)[t] || 0),
          ) &&
          (Ue({
            title: `Your ship is ready!`,
            detail: `Open Fleet to send it on a voyage.`,
            icon: `flag`,
            grand: !0,
          }),
          He(`complete`))));
  }, [un, dn, o, Ue, He]),
    (0, C.useEffect)(() => {
      if ((o !== `cloud` && o !== `practice`) || L) return;
      let e = cn.current;
      if (((cn.current = new Set(rn.map((e) => e.id))), e))
        for (let t of rn)
          e.has(t.id) ||
            (Ue({
              title: `Achievement unlocked: ${t.title}`,
              detail: `Your medal is earned. Collect its reward in Achievements.`,
              icon: t.icon,
              grand: !0,
            }),
            He(`achievement`));
    }, [rn.map((e) => e.id).join(`|`), o, !!L, Ue, He]));
  function SWEnvelope() {
    return c.current==='practice'?{state:r.current,reports:vt,battle:r.current.activeBattle?L:null,input:r.current.activeBattle?swBattleInput.current:null,time:Math.floor(lt)}:swLocalEnvelope.current||ju();
  }
  function SWValidateEnvelope(save) {
    if(save?.state?.schema!==1||!Array.isArray(save.state.buildings)||!save.state.resources)throw Error('That backup does not contain a valid kingdom. Your local kingdom is unchanged.');
    return save;
  }
  function SWApplyOnlineGame(game) {
    if(c.current!=='cloud'||!game?.state)return;
    if(game.revision<swOnlineRevision.current)return;
    swOnlineRevision.current=game.revision??game.state.revision;
    if(game.serverTime){const offset=game.serverTime-Date.now();swOnlineOffset.current=swOnlineOffset.current===null?offset:Math.max(swOnlineOffset.current,offset)}
    r.current=game.state;n(game.state);Le(game.state.name);a(Date.now()+swOnlineOffset.current);
    window.SWOnline.call('cacheOnline',{game}).catch(()=>{});
  }
  function SWBeginOnlineBattle(battle,serverTime) {
    swOnlineQueue.current?.stop();swOnlineRetreat.current=false;setOnlineBattleError('');
    swOnlineQueue.current=window.SWOnlineGame.battleQueue({battle,serverTime,onInput:SWQueueSimulation,onState:SWApplyOnlineGame,onError:error=>setOnlineBattleError(error.message||'Orders are waiting for a connection. Retry to continue.')});
    swBattleInput.current=battle.input;ot(battle);st(battle.input);ct(Kl(battle.input));ut(swOnlineQueue.current.elapsed());ft(1);pt(null);Ct(false);Et.current=false;
    M(Object.keys(J).find(kind=>hl(battle.input)[kind]>0)||'infantry');
  }
  async function SWRefreshOnline() {
    const epoch=swOnlineEpoch.current;let game=await window.SWOnline.request('/v1/game');
    if(c.current!=='cloud'||epoch!==swOnlineEpoch.current)return;
    SWApplyOnlineGame(game);
    if(!game.battle&&SWRaidStatus(game.state,game.serverTime).phase==='ready') {
      const outcome=await window.SWOnline.request('/v1/raids/resolve',{method:'POST',body:{requestId:window.SWOnlineGame.requestId(),revision:game.revision}});
      if(c.current!=='cloud'||epoch!==swOnlineEpoch.current)return;
      SWApplyOnlineGame(outcome);if(outcome.report)yt(reports=>[outcome.report,...reports.filter(report=>report.id!==outcome.report.id)].slice(0,20));
      Ue({title:outcome.outcome?.won?'Your city repelled the raiders':'Raid resolved',detail:'Open City to review your defenses.',icon:'shield'});
    }
    return game;
  }
  async function SWBackupLocal() {
    if(c.current!=='practice')throw Error('Return to your local kingdom before backing it up.');
    const save=SWValidateEnvelope(SWEnvelope());
    return window.SWOnline.call('backup',{save,expectedRevision:window.SWOnline.state().backup?.revision||0});
  }
  async function SWRestoreBackup() {
    if(c.current!=='practice'||r.current.activeBattle)throw Error('Finish the current battle before restoring a backup.');
    const backup=await window.SWOnline.call('restoreBackup'),save=SWValidateEnvelope(backup.save);
    await window.SWOnline.call('archiveLocal',{save:SWValidateEnvelope(SWEnvelope())});
    Mu(save);swLocalEnvelope.current=save;fn(true);SWNavigate('capital');
  }
  async function SWEnterOnline() {
    if(r.current.activeBattle)throw Error('Finish the current battle before switching kingdoms.');
    const save=SWValidateEnvelope(SWEnvelope());
    await window.SWOnline.call('archiveLocal',{save});
    const game=await window.SWOnline.request('/v1/game');
    if(!game?.state)throw Error('Your Online Kingdom could not be loaded. Your local kingdom is unchanged.');
    if(!window.SWOnline.state().signedIn)throw Error('Sign in again to open your Online Kingdom.');
    swOnlineEpoch.current++;swLocalEnvelope.current=save;swOnlineRevision.current=0;swOnlineOffset.current=null;c.current='cloud';s('cloud');SWNavigate('capital');yt([]);SWApplyOnlineGame(game);
    if(game.battle)SWBeginOnlineBattle(game.battle,game.serverTime);else En();
  }
  async function SWReturnLocal() {
    // Dropped client previews are never resubmitted after switching kingdoms.
    swOnlineEpoch.current++;c.current='practice';swOnlineQueue.current?.stop();swOnlineQueue.current=null;setOnlineBattleError('');swOnlineRetreat.current=false;
    d.current=false;u(false);swFinishing.current=false;ht(false);En();fn(true);SWNavigate('capital');
  }
  C.useEffect(()=>{
    const purchase=event=>{if(c.current==='cloud'&&event.detail?.game)SWApplyOnlineGame(event.detail.game)};
    const status=event=>{if(c.current==='cloud'&&event.detail?.signedIn===false){void SWReturnLocal();ic('Your online session ended. Your local kingdom is ready.')}};
    window.addEventListener('stonewake-online-purchase',purchase);window.addEventListener('stonewake-online-status',status);
    return()=>{window.removeEventListener('stonewake-online-purchase',purchase);window.removeEventListener('stonewake-online-status',status)};
  },[]);
  function fn(force=false) {
    try {
      let e = ju() || (force?swLocalEnvelope.current:null);
      if (
        e?.state?.schema === 1 &&
        Array.isArray(e.state.buildings) &&
        (force || e.state.revision >= r.current.revision)
      ) {
        let t = Y(e.state);
        (n(t),
          (r.current = t),
          Le(t.name),
          yt(e.reports || []),
          (!e.battle || !e.input) && (ot(null),st(null),ct(null),pt(null)),
          e.battle &&
            e.input &&
            t.activeBattle === e.battle.id &&
            (ot(e.battle),
            st(e.input),
            ct(Kl(e.input)),
            ut(e.time || 0),
            (Et.current = !1)));
      }
    } catch {}
    ((Nt.current = !0), (c.current = `practice`), s(`practice`));
  }
  async function pn() { fn(); }
  ((0, C.useEffect)(() => {
    if (o === `practice`)
      try {
        let e = ju();
        if (e?.state?.revision > t.revision) {
          (n(Y(e.state)), yt(e.reports || []));
          return;
        }
        if (
          e?.state?.activeBattle === t.activeBattle &&
          e?.input?.orders?.length > (R?.orders?.length || 0) &&
          L
        )
          return;
        Mu({
          state: t,
          reports: vt,
          battle: t.activeBattle ? L : null,
          input: t.activeBattle ? R : null,
          time: Math.floor(lt),
        }) === `saved` && Mt(!0);
      } catch {
        Mt(!1);
      }
  }, [o, t, vt, L, R, Math.floor(lt / 3)]),
    (0, C.useEffect)(() => {
      let e = (e) => Mt(e.detail?.saved === !0);
      return (
        window.addEventListener(`stonewake-save-status`, e),
        () => window.removeEventListener(`stonewake-save-status`, e)
      );
    }, []),
    (0, C.useEffect)(() => {
      let e = (e) => {
        if (!(e.key !== `hearth-device-kingdom-v1` || c.current !== `practice`))
          try {
            let t = JSON.parse(e.newValue || `null`);
            t?.state?.revision > r.current.revision &&
              (n(Y(t.state)),
              yt(t.reports || []),
              t.battle && t.input
                ? (ot(t.battle), st(t.input), ct(Kl(t.input)), ut(t.time || 0))
                : t.state.activeBattle || (ot(null), st(null), ct(null)));
          } catch {}
      };
      return (
        window.addEventListener(`storage`, e),
        () => window.removeEventListener(`storage`, e)
      );
    }, []),
    (0, C.useEffect)(() => {
      pn();
      let e = setInterval(() => a(Date.now()+(c.current==='cloud'?swOnlineOffset.current:0)), 1e3);
      return () => clearInterval(e);
    }, []),
    (0, C.useEffect)(() => {
      if (o !== `cloud` || L) return;
      let e = setInterval(()=>{if(!d.current)SWRefreshOnline().catch(()=>{})},30000);
      return () => clearInterval(e);
    }, [o, L]));
  let mn = (0, C.useCallback)(
    async (e, t) => {
      if (d.current) return null;
      const epoch=swOnlineEpoch.current;
      ((d.current = !0), u(!0));
      try {
        let i = Y(r.current),
          o;
        if (c.current === `practice`) o = Ul(r.current, e);
        else if (c.current === `cloud`) {
          let response;
          try {response=await window.SWOnline.request('/v1/game/actions',{method:'POST',body:{requestId:window.SWOnlineGame.requestId(),revision:swOnlineRevision.current,action:e}})}
          catch(error){if(error.code?.includes('conflict'))await SWRefreshOnline();throw error;}
          if(c.current!=='cloud'||epoch!==swOnlineEpoch.current)return null;
          SWApplyOnlineGame(response);o=response.state;
        } else throw Error(`Wait for your kingdom to connect.`);
        if (
          (n(o),
          (r.current = o),
          a(Date.now()),
          e.type === `claim` ||
            e.type === `claimAchievement` ||
            ['claimMission','claimChapter','claimResidentStory','claimEvent','claimEraFinale'].includes(e.type) || e.type === `collectVoyage` || e.type === `cityRequest` || e.type === `collectCraft` || e.type === `claimReserve` || e.type === `marketTrade` || e.type === `claimCivicProject`)
        ) {
          let t = Object.fromEntries(
              xl.map((e) => [
                e,
                Math.max(0, Math.floor(o.resources[e] - i.resources[e] + 1e-6)),
              ]),
            ),
            n = Dl.find((t) => t.id === e.id),
            r = El.find((t) => t.id === e.id);
          window.dispatchEvent(new CustomEvent('stonewake-reward',{detail:{reward:t,gems:Math.max(0,o.gems-i.gems)}}));
          (Ue({
            title:
              ['claimMission','claimChapter','claimResidentStory','claimEvent','claimEraFinale'].includes(e.type) ? 'Reward collected' : e.type === `claimCivicProject` ? `${SWCivicProject(o,e.id).stageName} complete!` : e.type === `claimReserve` ? `Supplies unpacked!` : e.type === `marketTrade` ? `Trade complete!` : e.type === `cityRequest` ? `Request fulfilled!` : e.type === `collectCraft` ? `Crafting complete!` : e.type === `collectVoyage`
                ? `Cargo delivered!`
                : e.type === `claimAchievement`
                  ? `${n?.title || `Achievement`} collected!`
                  : `Objective complete!`,
            detail:
              ['claimMission','claimChapter','claimResidentStory','claimEvent','claimEraFinale'].includes(e.type) ? (xl.some(key=>(o.reserveCrates?.[key]||0)>(i.reserveCrates?.[key]||0))?'Extra supplies are safe in Storage.':'Your progress and rewards are saved.') : e.type === `claimCivicProject` ? SWCivicProject(o,e.id).benefit : e.type === `collectVoyage`
                ? `Your fleet brings home the harvest of the sea.`
                : e.type === `claimAchievement`
                  ? `Medal secured. Your kingdom keeps growing.`
                  : e.type === `cityRequest` ? `Your residents thank you. Every fifth request earns 3 gems.` : e.type === `collectCraft` ? `Fresh goods from your artisans.` : r?.title || `On to your next chapter.`,
            icon: e.type === `claimAchievement` ? `trophy` : `flag`,
            reward: t,
            grand: !0,
          }),
            He(`reward`),SWHaptic('reward'));
        } else
          e.type === `recruit`
            ? (Ue({
                title: `${e.count || 1} ${e.kind === `archer` ? ((e.count || 1) === 1 ? `archer` : `archers`) : e.kind === `cavalry` ? ((e.count || 1) === 1 ? `rider` : `riders`) : e.kind === `cannon` ? ((e.count || 1) === 1 ? `cannon` : `cannons`) : (e.count || 1) === 1 ? `soldier` : `soldiers`} ready!`,
                detail: `${Nl(o.army)} troops stand with your banner.`,
                icon: `swords`,
              }),
              He(`recruit`))
            : [
                  `claimCosmetic`,
                  `developProvince`,
                  `specialize`,
                  `commander`,
                ].includes(e.type)
              ? (Ue({
                  title: t || `A new chapter for your kingdom`,
                  detail:
                    e.type === `developProvince`
                      ? `Your province now produces more resources.`
                      : e.type === `claimCosmetic`
                        ? `Your achievement is now part of your capital.`
                        : `Ready for your next battle.`,
                  icon: e.type === `commander` ? `swords` : `flag`,
                  grand: !0,
                }),
                He(`achievement`))
              : (t && ic.success(t),
                He(
                  e.type === `build` || e.type === `upgrade`
                    ? `build`
                    : `click`,
                ));
        if(e.type==='festival'){Ue({title:'The town is celebrating!',detail:'+15% resource production for '+(10+SWCivicBonuses(o).festivalMinutes)+' minutes.',icon:'users',grand:true});He('achievement');}
        if(e.type==='landscape'){He('build');window.dispatchEvent(new CustomEvent('hearth-burst',{detail:{x:e.x,y:e.y,label:Tc[e.kind].name}}));}
        return o;
      } catch (e) {
        return (
          ic.error(e instanceof Error ? e.message : `Something went wrong.`),
          null
        );
      } finally {
        if(epoch===swOnlineEpoch.current)((d.current = !1), u(!1));
      }
    },
    [He, Ue],
  );
  ((0, C.useEffect)(() => {
    let e = document.modelContext;
    if (!e?.registerTool) return;
    let t = new AbortController();
    for (let n of [
      {
        name: `read_kingdom`,
        title: `Read kingdom`,
        description: `Read current kingdom resources, buildings, army, and campaign progress.`,
        inputSchema: {
          type: `object`,
          properties: {},
          additionalProperties: !1,
        },
        annotations: { readOnlyHint: !0 },
        execute: () => ({ mode: c.current, state: Y(r.current) }),
      },
      {
        name: `build_structure`,
        title: `Build structure`,
        description: `Spend resources to start construction on an empty tile of the capital.`,
        inputSchema: {
          type: `object`,
          properties: {
            kind: {
              type: `string`,
              enum: Object.keys(Sl).filter((e) => e !== `keep`),
            },
            x: { type: `integer`, minimum: 0, maximum: 7 },
            y: { type: `integer`, minimum: 0, maximum: 7 },
          },
          required: [`kind`, `x`, `y`],
          additionalProperties: !1,
        },
        annotations: { readOnlyHint: !1 },
        execute: async (e) => {
          if (
            !e ||
            typeof e.kind != `string` ||
            !Number.isInteger(e.x) ||
            !Number.isInteger(e.y)
          )
            throw Error(`Invalid building location.`);
          let t = await mn(
            { type: `build`, kind: e.kind, x: e.x, y: e.y },
            `Construction started`,
          );
          if (!t) throw Error(`Construction failed.`);
          return (
            p(`capital`),
            { buildings: t.buildings, resources: t.resources }
          );
        },
      },
      {
        name: `recruit_soldiers`,
        title: `Recruit soldiers`,
        description: `Spend resources to add soldiers to your army.`,
        inputSchema: {
          type: `object`,
          properties: {
            kind: { type: `string`, enum: Object.keys(J) },
            count: { type: `integer`, minimum: 1, maximum: 10 },
          },
          required: [`kind`, `count`],
          additionalProperties: !1,
        },
        annotations: { readOnlyHint: !1 },
        execute: async (e) => {
          if (!e || !Number.isInteger(e.count))
            throw Error(`Invalid troop count.`);
          let t = await mn(
            { type: `recruit`, kind: e.kind, count: e.count },
            `Soldiers recruited`,
          );
          if (!t) throw Error(`Recruitment failed.`);
          return { army: t.army };
        },
      },
    ])
      Promise.resolve(e.registerTool(n, { signal: t.signal })).catch(() => {});
    return () => t.abort();
  }, [mn]),
    (0, C.useEffect)(() => {
      if (
        !L ||
        !z ||
        B ||
        (R?.rulesVersion === 4 &&
          !St &&
          o !== 'cloud' &&
          !R.orders?.length &&
          R.navalAt === void 0 && !(R.navalVersion>=2&&(R.navalSupport||R.fleet14?.length)) &&
          R.retreatAt === void 0)
      )
        return;
      if(o==='cloud'&&!St&&L.kind!=='practice') {
        const timer=setInterval(()=>ut(Math.min(z.duration,swOnlineQueue.current?.elapsed()??Math.max(0,(Date.now()+swOnlineOffset.current-L.createdAt)/1000))),50);
        return()=>clearInterval(timer);
      }
      let e = performance.now(),
        t = setInterval(() => {
          let t = performance.now(),
            n = Math.min(0.3, (t - e) / 1e3) * dt;
          ((e = t), ut((e) => Math.min(z.duration, e + n)));
        }, 50);
      return () => clearInterval(t);
    }, [L, z, B, dt, R?.orders?.length, R?.navalAt, R?.navalSupport, R?.fleet14, St, o]),
    (0, C.useEffect)(() => {
      z && L && !swSimulationPending.current && lt >= z.duration && !Et.current && ((Et.current = !0), xn());
    }, [lt, z, L]),
    (0, C.useEffect)(()=>()=>{swOnlineQueue.current?.stop()},[]));
  async function hn() {
    if (o !== `cloud`) {
      Xe([]);
      return;
    }
    (Qe(!0), et(``));
    try {
      const t=await window.SWOnline.request('/v1/rivals');
      Xe(t.rivals);
    } catch (e) {
      et(e instanceof Error ? e.message : `Unable to load opponents.`);
    } finally {
      Qe(!1);
    }
  }
  (0, C.useEffect)(() => {
    f === `frontier` && tt === `rivals` && hn();
  }, [f, tt, o]);
  function SWNavigate(destination) {
    if(layoutRef14.current&&destination!=='capital'){ic('Save or cancel your layout first.',{id:'layout-navigation'});return;}
    if(destination==='close'){navHistory14.current=['capital'];requirementTrail14.current=[];destination='capital';}
    if(destination==='back'){if(requirementTrail14.current.length)destination='building:'+requirementTrail14.current.pop();else{navHistory14.current.pop();destination=navHistory14.current.pop()||'capital';}}
    if(navHistory14.current.at(-1)!==destination)navHistory14.current.push(destination);
    setStonewakeMenuOpen(false);setPremiumStore(null);setChronicleTab(null);setOrnamentPlacement(null); x(false); w(false); Ut(false); Je(false); Fe(false); de(false); Ne(false); Lt(false); setCityOpen(false); setStorageOpen(false); setGemShopOpen(false); setStonewakeObjectiveOpen(false); rt(null);
    h(null); _(null); y(null); Ft(null); Gt([]); ee(null); He('click');SWHaptic('select');
    if(destination==='capital'||destination==='build'||destination==='frontier')p(destination);
    else if(destination.startsWith('building:')){p('capital');h(destination.slice(9))}
    else if(destination==='sea'){p('frontier');nt('sea')}
    else if(destination==='harborUpgrade'){p('capital');h(V.buildings.filter(b=>b.kind==='harbor').sort((a,b)=>b.level-a.level)[0]?.id||null)}
    else if(destination==='scout'&&scoutReturn14.current)rt(scoutReturn14.current);
    else if(destination==='army')x(true);
    else if(destination==='city')setCityOpen(true);
    else if(destination==='fleet')w(true);
    else if(destination==='storage')setStorageOpen(true);
    else if(destination==='gems'||destination==='store'||destination==='wardrobe')setPremiumStore({tab:destination==='gems'?'Gems':'Wardrobe',owned:destination==='wardrobe'});
    else if(['chronicle','events','residents'].includes(destination))setChronicleTab(destination==='events'?'Events':destination==='residents'?'Residents':'Chapter');
    else if(destination==='town')Lt(true);
    else if(destination==='plan')SWStartLayout14();
    else if(destination==='commander')Ut(true);
    else if(destination==='achievements'){dismissNotice();setChronicleTab('Achievements');}
    else if(destination==='reports')void Dn();
    else if(destination==='objectives')setStonewakeObjectiveOpen(true);
    else if(destination==='settings'||destination==='account'){setSettingsSection(destination==='account'?'Account':'Audio');Le(V.name);de(true)}
    else if(destination==='help')Ne(true);
  }
  function SWAdventureRequirement(requirement) {
    if(requirement.action==='build'){SWNavigate('capital');gn(requirement.buildKind);return}
    if(requirement.action==='building'){SWNavigate('capital');const b=V.buildings.find(b=>b.kind===requirement.buildKind);if(b)h(b.id);return}
    SWNavigate(requirement.action==='chronicle'?'chronicle':requirement.action||'city');
  }
  function SWStartAdventure(scout){setChronicleTab(null);setStonewakeMenuOpen(false);yn(scout)}
  function SWPlaceDecoration(id){SWNavigate('capital');setOrnamentPlacement(id);setBuildFacing(0);Ft(null)}
  function SWOpenCoast() {
    p(`capital`); h(null); _(null); y(null); ee(null); Ft(null); Gt([]); D(value=>value+1);
  }
  function gn(e) {
    setOrnamentPlacement(null);setBuildFacing(0);
    if (e === `harbor`) D(value=>value+1);
    (ee(null),
      Gt([]),
      Ft(null),
      _(e),
      y(null),
      h(null),
      p(`capital`),
      Ot(!0),
      He());
  }
  function _n(e, t) {
    if(ornamentPlacement){if(!SWCanPlaceOrnament(V,ornamentPlacement,e,t)){ic('Choose an empty land or road plot.',{id:'ornament-placement',duration:1000});return}Ft({x:e,y:t});return}

    if (g === `wall`) {
      Gt(Wt.length ? Xc(Wt[0], { x: e, y: t }) : [{ x: e, y: t }]);
      return;
    }
    if (
      !SWCanPlace(V, g || V.buildings.find(b=>b.id===v)?.kind, e, t, v)
    ) {
      ic.error((g || V.buildings.find(b=>b.id===v)?.kind) === `harbor` ? `Choose one of the three coastal berths.` : `Choose an empty land plot.`);
      return;
    }
    Ft({ x: e, y: t });
  }
  async function vn(e, t) {
    if(ornamentPlacement){const next=await mn({type:'placeOrnament',id:ornamentPlacement,x:e,y:t,facing:buildFacing},'Decoration placed');if(next){setOrnamentPlacement(null);Ft(null);SWHaptic('place')}return}

    if (g) {
      let n = g,
        r = await mn(
          { type: `build`, kind: n, x: e, y: t, facing: buildFacing },
          `${Sl[n].name} construction started`,
        );
      r && (_(null), Ft(null), h(r.buildings[r.buildings.length - 1].id));
    } else
      v &&
        (await SWEditAct14({ type: `move`, id: v, x: e, y: t, facing: buildFacing }, `Building moved`)) &&
        (y(null), Ft(null), h(v));
  }
  function yn(e) {
    setBattlePrep14(null);setSelectedShip14(null);setNavalTool14(null);setNavalId('');
    (rt(e),
      at(`center`),
      qt({
        infantry: `center`,
        archer: `center`,
        cavalry: `center`,
        cannon: `center`,
      }));
  }
  async function bn() {
    if (!(!I || d.current)) {
      if (Qt < 3 && !I.fixedArmy) {
        ic.error(`Recruit at least three soldiers first.`);
        return;
      }
      const epoch=swOnlineEpoch.current;
      ((d.current = !0), u(!0));
      try {
        let e;
        if (o === 'practice' && ['saga','trial'].includes(I.kind)) {
          const state=Y(r.current),now=Date.now(),input=SWSagaInput(state,I.missionId,I.trialId||false,now);
          e={id:'expedition-'+now,kind:I.kind,missionId:I.missionId,trialId:I.trialId,input,createdAt:now};
          state.activeBattle=e.id;state.revision++;r.current=state;n(state);
        } else if (o === `practice` || I.kind === `practice`) {
          let t = SWCreateBattle14(I.practiceKind?{...Y(r.current),army:{...wl(),[I.practiceKind]:Math.min(12,Pl(Y(r.current)))}}:Y(r.current),I,I.practiceKind?{army:{...wl(),[I.practiceKind]:Math.min(12,Pl(Y(r.current)))}}:battlePrep14,Math.floor(Math.random()*4294967295));
          if (
            ((e = {
              id: `practice-${Date.now()}`,
              kind: I.kind,
              campaignIndex: I.campaignIndex,
              input: t,
              createdAt: Date.now(),
            }),
            I.kind !== `practice`)
          ) {
            let t = Y(r.current);
            for(const vessel of e.input.fleet14||[]){const ship=t.fleet.find(s=>s.id===vessel.id);if(ship)ship.combatBattleId=e.id;}
            (Object.keys(J).forEach(k=>{t.army[k]=Math.max(0,(t.army[k]||0)-(e.input.army[k]||0))}), (t.activeBattle=e.id),t.revision++,r.current=t,n(t));
          }
        } else {
          const response=await window.SWOnline.request('/v1/battles/start',{method:'POST',body:{requestId:window.SWOnlineGame.requestId(),revision:swOnlineRevision.current,kind:I.kind,missionId:I.missionId,trialId:I.trialId,campaignIndex:I.campaignIndex,provinceId:I.provinceId,targetId:I.rivalId||I.id,army:battlePrep14?.army||SWSelectedArmy14(V),fleet:battlePrep14?.fleet,navalShipId:navalId||undefined,combatVersion:14}});
          if(c.current!=='cloud'||epoch!==swOnlineEpoch.current)return;
          SWApplyOnlineGame(response);e=response.battle;SWBeginOnlineBattle(e,response.serverTime);
        }
        (M(Object.keys(J).find((t) => e.input.army[t] > 0) || `infantry`),
          ot(e),
          st(e.input),
          ct(Kl(e.input)),
          ut(o==='cloud'&&e.kind!=='practice'?(swOnlineQueue.current?.elapsed()||0):0),
          ft(1),
          pt(null),
          rt(null),
          Ct(!1),
          _t(``),
          (Et.current = !1),
          He(`march`));
      } catch (e) {
        ic.error(e instanceof Error ? e.message : `Unable to start battle.`);
      } finally {
        if(epoch===swOnlineEpoch.current)((d.current = !1), u(!1));
      }
    }
  }
  function SWStartDefense() {
    if(c.current==='cloud'){void SWRefreshOnline().catch(error=>ic.error(error.message));return;}
    const state=Y(r.current);
    if(state.activeBattle||(SWCity(state).raidReadyAt||0)>Date.now())return;
    if(c.current!=='practice'){ic('Computer raids are available in your local kingdom.');return;}
    const input=SWRaidInput(state,Date.now(),false),battle={id:input.raidId,kind:'defense',input,createdAt:Date.now()};
    state.activeBattle=battle.id;state.revision++;n(state);r.current=state;
    setCityOpen(false);ot(battle);st(input);ct(Kl(input));ut(0);ft(1);pt(null);Ct(false);Et.current=false;He('march');
  }
  async function xn() {
    if (!(!L || !R || !z)) {
      if(swFinishing.current)return;
      const onlineEpoch=swOnlineEpoch.current,battleStartingGems=r.current.gems;
      swFinishing.current=true;
      (ht(!0), _t(``));
      try {
        let e,
          t = Gu,
          { frames: i, ...a } = Kl(R);
        e=a;
        if(o==='practice'&&!St&&L.kind!=='practice'&&r.current.activeBattle!==L.id){
          const saved=vt.find(report=>report.id===L.id);
          if(saved)pt({result:saved.kind==='defense'?{...saved.result,won:!saved.result.won,stars:saved.result.won?0:3,destruction:100-saved.result.destruction}:saved.result,reward:saved.reward,practice:false,defense:saved.kind==='defense',lost:saved.lost||0,loot:saved.loot,defenseReport:saved.defenseReport,saga:!!saved.input?.saga,missionId:saved.input?.saga?.missionId,trialId:saved.input?.saga?.trialId});
          return;
        }
        if(R.saga && o==='practice' && !St){
          const state=Y(r.current),beforeGems=state.gems,outcome=SWSagaSettle(state,R,e,Date.now());
          state.activeBattle=null;state.revision++;r.current=state;n(state);
          yt(reports=>[{id:L.id,kind:L.kind,input:R,result:e,reward:outcome.reward,createdAt:Date.now(),defending:false},...reports].slice(0,20));
          window.dispatchEvent(new CustomEvent('stonewake-reward',{detail:{reward:outcome.reward,gems:state.gems-beforeGems}}));
          pt({result:e,reward:outcome.reward,practice:false,saga:true,missionId:R.saga.missionId,trialId:R.saga.trialId,firstClear:outcome.firstClear,earnedGems:state.gems-beforeGems});return;
        }
        if(L.kind==='defense'&&!St){
          const state=Y(r.current),outcome=R.raidId?SWSettleScheduledRaid(state,R,e,Date.now()):SWResolveDefense(state,R,e);
          if(!outcome)return;
          state.activeBattle=null;state.revision++;n(state);r.current=state;
          const result={...e,won:outcome.won,stars:outcome.won?3:0,destruction:100-e.destruction};
          yt(reports=>[{id:L.id,kind:'defense',input:R,result:e,reward:outcome.reward,lost:outcome.lost,loot:outcome.loot,defenseReport:outcome.defenseReport,createdAt:Date.now(),defending:true},...reports].slice(0,20));
          pt({result,reward:outcome.reward,practice:false,defense:true,lost:outcome.lost,loot:outcome.loot,defenseReport:outcome.defenseReport});
          window.dispatchEvent(new CustomEvent('stonewake-reward',{detail:{reward:outcome.reward,gems:outcome.won?2:0}}));
          return;
        }
        if (St || L.kind === `practice`) {
          pt({ result: e, reward: t, practice: !0, saga:!!R.saga,missionId:R.saga?.missionId,trialId:R.saga?.trialId,earnedGems:0 });
          return;
        }
        if (o === `practice`) {
          let i = Y(r.current),
            a = Jl(R.army, e.survivors, R.rulesVersion === 4 ? 0.45 : 0.65);
          for (let e of Object.keys(J))
            i.army[e] = (i.army[e] || 0) + (a[e] || 0);
          ((t = Fu(i, L.kind, L.campaignIndex, R, e)),
            (i.activeBattle = null),
            i.fleet.forEach(ship=>{if(ship.combatBattleId===L.id){delete ship.combatBattleId;if(e.navalSurvivors?.[ship.id]===false)ship.wrecked=true;}}),
            i.revision++,
            r.current=i,
            n(i),
            yt((n) =>
              [
                {
                  id: L.id,
                  kind: L.kind,
                  input: R,
                  result: e,
                  reward: t,
                  createdAt: Date.now(),
                  defending: !1,
                },
                ...n,
              ].slice(0, 20),
            ));
        } else {
          await swOnlineQueue.current?.flush();
          if(c.current!=='cloud'||onlineEpoch!==swOnlineEpoch.current)return;
          const response=await window.SWOnline.request('/v1/battles/finish',{method:'POST',body:{battleId:L.id,...(swOnlineRetreat.current?{retreat:true}:{})}});
          if(c.current!=='cloud'||onlineEpoch!==swOnlineEpoch.current)return;
          SWApplyOnlineGame(response);e=response.result;t=response.reward;
          if(response.report)yt(reports=>[response.report,...reports.filter(report=>report.id!==response.report.id)].slice(0,20));
          swOnlineQueue.current?.stop();swOnlineQueue.current=null;setOnlineBattleError('');
        }
        window.dispatchEvent(new CustomEvent('stonewake-reward',{detail:{reward:t,gems:Math.max(0,r.current.gems-battleStartingGems)}}));
        pt({ result: e, reward: t, practice: !1, saga:!!R.saga,missionId:R.saga?.missionId,trialId:R.saga?.trialId,earnedGems:Math.max(0,r.current.gems-battleStartingGems),earnedXP:R.commanderStartingXP14===undefined?0:Math.max(0,(Wc(r.current,R.commander?.id)?.xp||0)-R.commanderStartingXP14) });
      } catch (e) {
        if(onlineEpoch===swOnlineEpoch.current)_t(e instanceof Error ? e.message : `Unable to save battle.`);
      } finally {
        if(onlineEpoch===swOnlineEpoch.current){swFinishing.current=false;ht(!1);}
      }
    }
  }
  function SWQueueSimulation(input) {
    swBattleInput.current=input;
    st(input);
    if(input.rulesVersion!==4){ct(Kl(input));return;}
    swSimulationPending.current=true;
    swBattleRuntime.current ||= SWBattleWorker();
    swBattleRuntime.current.request(input,(result,meta)=>{swSimulationPending.current=!!meta?.pending;ct(result)},error=>{swSimulationPending.current=false;_t(error)});
  }
  function Sn(e, t, options = {}) {
    const input=swBattleInput.current,kind=options.kind||le;
    if (!input || input.rulesVersion !== 4 || St || B || mt || lt >= 119.5 || (L?.kind==='defense'||input.saga?.mode==='hold')) return false;
    if (!SWCanDeploy14(input, e, t)) {
      if (!options.silent) ic(input.campaignType==='sea'?`Choose a beach along the western shore.`:`Deploy along the outside edge.`, {id:`deployment-hint`, duration:1000});
      return false;
    }
    if(!hl(input)[kind])return false;
    let carrier=options.shipId;
    if(input.campaignType==='sea'){
      const candidates=(input.fleet14||[]).filter(ship=>{
        const live=kn?.units.find(unit=>unit.shipId===ship.id&&unit.side==='attack');
        return (!carrier||ship.id===carrier)&&(!live||(live.hp>0&&live.command?.type!=='withdraw'))&&(kind==='hero'||(ship.cargo[kind]||0)>(input.orders||[]).filter(order=>order.shipId===ship.id&&order.kind===kind).length);
      });
      const transport=candidates.find(ship=>ship.id===selectedShip14)||candidates[0];
      if(!transport){if(!options.silent)ic('No active transport has this troop available.',{id:'deployment-hint',duration:1400});return false;}
      carrier=transport.id;
    }
    const order=SWDeploymentOrder14(input,kind,e,t,lt,carrier);if(!order)return false;
    if(order.shipId&&kn?.units.some(u=>u.shipId===order.shipId&&u.hp<=0)){if(!options.silent)ic('That transport was sunk. Its remaining troops will return home.');return false;}
    if(c.current==='cloud'&&L.kind!=='practice') {
      if(!swOnlineQueue.current?.enqueue({type:'deploy',kind,x:e,y:t,shipId:order.shipId}))return false;
      He('march');SWHaptic('deploy');window.dispatchEvent(new CustomEvent('hearth-burst',{detail:{x:e,y:t,label:'',kind:'deploy'}}));return true;
    }
    const next={...input,orders:[...(input.orders||[]),order]};
    SWQueueSimulation(next);
    He('march');SWHaptic('deploy');
    window.dispatchEvent(new CustomEvent('hearth-burst',{detail:{x:e,y:t,label:'',kind:'deploy'}}));
    return true;
  }
  function Cn() {
    if (!R || St || B) return;
    if(c.current==='cloud'&&L.kind!=='practice'){swOnlineRetreat.current=true;void xn();return;}
    let e = { ...R, retreatAt: Math.ceil(lt * 2) / 2 };
    (SWQueueSimulation(e), ut(e.retreatAt));
  }
  function wn() {
    if (!R || R.rallyAt !== void 0 || St || B || R.saga?.mode==='hold') return;
    if(c.current==='cloud'&&L.kind!=='practice'){if(swOnlineQueue.current?.enqueue({type:'rally'}))He('rally');return;}
    let e = { ...R, rallyAt: Math.round(lt * 2) / 2 };
    (SWQueueSimulation(e),
      He(`rally`),
      window.dispatchEvent(
        new CustomEvent(`hearth-burst`, {
          detail: { x: 4.5, y: 4.5, label: `RALLY!` },
        }),
      ),
      ic(`Rally! Your troops recover health and fight harder for 7 seconds.`));
  }
  function Tn() {
    if (!R?.commander || R.heroAt !== void 0 || St || B || R.saga?.mode==='hold') return;
    if(c.current==='cloud'&&L.kind!=='practice'){if(swOnlineQueue.current?.enqueue({type:'ability'}))He('rally');return;}
    let e = { ...R, heroAt: Math.round(lt * 2) / 2 };
    (SWQueueSimulation(e), He(`rally`));
    let t = kn?.units.find((e) => e.kind === `hero`);
    window.dispatchEvent(
      new CustomEvent(`hearth-burst`, {
        detail: {
          x: t?.x || 4,
          y: t?.y || 4,
          label: Oc[R.commander.id].ability.toUpperCase(),
        },
      }),
    );
  }
  function SWFireBroadside() {
    if(!R?.navalSupport || R.navalAt!==undefined || St || B || mt || lt>=119.5) return;
    const input={...R,navalAt:Math.ceil(lt*2)/2};
    st(input);ct(Kl(input));He('cannon');
  }
  function En() {
    swBattleRuntime.current?.cancel();swSimulationPending.current=false;
    (ot(null),
      ct(null),
      st(null),
      pt(null),
      p(`capital`),
      h(null),
      Ot(!1),
      Ct(!1),
      Tt(!1),
      (Et.current = !1));
  }
  async function Dn() {
    if ((setChronicleTab('Reports'), xt(``), o === `cloud`))
      try {
        const t=await window.SWOnline.request('/v1/reports');
        yt(t.reports);
      } catch (e) {
        xt(e instanceof Error ? e.message : `Unable to load reports.`);
      }
  }
  function On(e) {
    (Tt(e.defending&&!e.input?.saga),
      Fe(!1),
      ot({ id: e.id, kind: e.kind, input: e.input, createdAt: e.createdAt }),
      st(e.input),
      ct(Kl(e.input)),
      ut(0),
      pt(null),
      Ct(!0),
      ft(1),
      (Et.current = !1));
  }
  let kn = z?.frames.reduce((e, t) => (t.time <= lt ? t : e), z.frames[0]),
    An = z?.frames.find((e) => e.time > (kn?.time ?? 0)),
    jn = (0, C.useRef)(``);
  const swPreviousCombatFrame=C.useRef(null);
  (0, C.useEffect)(() => {
    if(!kn||!L||B){swPreviousCombatFrame.current=null;return;}
    const stamp=L.id+':'+kn.time;if(jn.current===stamp)return;jn.current=stamp;
    const previous=swPreviousCombatFrame.current;
    if(previous?.battleId===L.id&&kn.time>previous.frame.time){
      const destroyed=kn.units.filter(unit=>unit.hp<=0&&previous.frame.units.some(old=>old.id===unit.id&&old.hp>0));
      if(destroyed.some(unit=>unit.naval)){He('water-splash');SWHaptic('destroy',stamp)}
      else if(destroyed.some(unit=>unit.building)){He('building-destroy');SWHaptic('destroy',stamp)}
      else if(kn.shots.some(shot=>shot.kind==='naval'&&shot.impact==='ship')){He('naval-impact');SWHaptic('naval',stamp)}
      else if(kn.shots.some(shot=>shot.kind==='naval'))He('naval-fire');
      else if(kn.shots.some(shot=>['cannon','trebuchet','mortar','bombtower'].includes(shot.kind)))He('cannon');
      else if(kn.shots.some(shot=>shot.kind!=='heal')){He('hit');SWHaptic('impact',stamp)}
    }
    swPreviousCombatFrame.current={battleId:L.id,frame:kn};
  },[L?.id,kn?.time,!!B,He]);
  let Mn = (0, C.useRef)(null);
  (0, C.useEffect)(() => {
    if (!B) {
      Mn.current = null;
      return;
    }
    Mn.current !== L?.id &&
      ((Mn.current = L?.id || `result`),
      He((St && wt ? !B.result.won : B.result.won) ? `win` : `defeat`),SWHaptic(B.result.won?'victory':'defeat',L?.id+'-result'));
  }, [B, L?.id, St, wt, He]);
  let Nn = Xt ? kl(V, Xt.id) : null,
    Pn = H?.readyAt ? H : Zt,
    Fn = Pn
      ? Math.max(
          0,
          100 -
            ((Pn.readyAt - i) /
              (Pn.readyAt -
                (Pn.startedAt ||
                  Pn.readyAt - Zc(V, Pn.kind, Pn.targetLevel || 1) * 1e3))) *
              100,
        )
      : 0;
  SWNavigate.canGoBack=navHistory14.current.length>1||requirementTrail14.current.length>0;
  return (0, F.jsxs)(SWAppFrame, {
    navigate: SWNavigate,
    className: `game-shell toolbar-layout${L ? ` battle-active` : ``}${stonewakeMenuOpen ? ` menu-open` : ``}${stonewakeObjectiveOpen ? ` objective-open` : ``}`,
    "data-effects": Be || reducedEffects ? `reduced` : `full`,
    children: [
      fe &&
        o !== `loading` &&
        !L &&
        (0, F.jsx)(Ou, { onFinish: Ae, reduced: Be }),
      !L && (0, F.jsx)(SWNotice, { event: Ve, onDismiss: dismissNotice }),
      (0, F.jsx)(yc, {
        position: `top-center`,
        theme: `dark`,
        richColors: !0,
        closeButton: !0,
        duration: 1800,
        visibleToasts: 1,
      }),
      (0, F.jsxs)(`header`, {
        className: `topbar`,
        children: [
          (0, F.jsxs)(`button`, {
            className: `brand`,
            onClick: () => {
              L || SWNavigate('capital');
            },
            "aria-label": `Stonewake capital`,
            children: [
              (0, F.jsx)(`span`, {
                className: `brand-mark`,
                children: (0, F.jsx)(ne, { size: 24 }),
              }),
              (0, F.jsx)(`span`, { children: `Stonewake` }),
            ],
          }),
          swElement(SWResourceBar,{state:V,income:Yt,onStorage:()=>SWNavigate('storage'),onGems:()=>SWNavigate('gems')}),
          (0, F.jsxs)(`div`, {
            className: `toolbar-menu-anchor`,
            children: [
              (0, F.jsx)(`button`, {
                className: `toolbar-menu-toggle`,
                "aria-label": `Kingdom menu`,
                "aria-expanded": stonewakeMenuOpen,
                onClick: () => setStonewakeMenuOpen(!stonewakeMenuOpen),
                children: stonewakeMenuOpen ? `Close` : `Menu`,
              }),
              stonewakeMenuOpen &&
                (0, F.jsx)(`button`, {
                  className: `menu-backdrop`,
                  "aria-label": `Close kingdom menu`,
                  onClick: () => setStonewakeMenuOpen(!1),
                }),
              stonewakeMenuOpen && swElement(SWMainMenu,{state:V,navigate:SWNavigate,battle:!!L,sound:Re,onSound:We,rewards:an.length}),
            ],
          }),
          (0, F.jsx)(`button`, {
            className: `icon-btn settings-button`,
            "aria-label": `Settings and help`,
            onClick: () => SWNavigate('settings'),
            children: (0, F.jsx)(ye, { size: 21 }),
          }),
        ],
      }),
          !L && f!=='frontier' && !layout14 && !g && !v && !ornamentPlacement && swElement(SWQuickNav,{state:V,navigate:SWNavigate,current:b?'army':cityOpen?'city':chronicleTab?'chronicle':f}),
      L && R && z
        ? (0, F.jsxs)(`section`, {
            className: `battle-world ${R.rulesVersion === 4 ? `deploy-mode` : ``}`,
            children: [
              (0, F.jsx)(Eu, {
                buildings: R.defense.buildings,
                provinces: R.defense.provinces,
                livery: R.defense.livery,
                appearance:R.defense.appearance,fleetAppearance:R.appearance||SWAppearance(V),
                frame: kn,
                nextFrame: An,
                battleTime: lt,
                playbackSpeed: dt,
                enemy: !0,
                deployment: !navalTool14 && R.rulesVersion === 4 && !St && !B && L.kind!=='defense' && R.saga?.mode!=='hold',
                onDeploy: Sn,
                selectedTroop:le,reserveCount:R?hl(R)[le]:0,defending:L.kind==='defense'||R.saga?.mode==='hold',
                navalSupport:R.navalSupport||R.fleet14?.[0],battleInput14:R,navalTool14,onNavalMap14:SWNavalMap14,
              }),
              (0, F.jsxs)(`div`, {
                className: `battle-title`,
                children: [
                  (0, F.jsx)(`span`, {
                    children: R.saga ? (R.saga.trialId?'SKILL TRIAL':'THE BROKEN BEACON') : St
                      ? `BATTLE REPLAY`
                      : L.kind === `player`
                        ? `PLAYER STRONGHOLD`
                        : L.kind === `defense` ? `DEFEND YOUR CITY` : L.kind === `practice`
                          ? `DEFENSE DRILL`
                          : L.kind === `province`
                            ? `PROVINCE CONQUEST`
                            : `CAMPAIGN BATTLE`,
                  }),
                  (0, F.jsx)(`h1`, { children: R.defense.name }),
                  (0, F.jsx)(`p`, {
                    children: R.campaignType==='sea'?SWSeaChapters14[R.seaIndex]?.objective:R.saga?.label || (L.kind==='defense'?`Hold your keep against the coastal raiders.`:`Destroy the enemy keep to win.`),
                  }),
                ],
              }),
              (0, F.jsxs)(`div`, {
                className: `battle-stats`,
                children: [
                  (0, F.jsxs)(`span`, {
                    children: [
                      (0, F.jsx)(k, { size: 16 }),
                      Math.max(
                        0,
                        (R.rulesVersion === 4
                          ? 120
                          : R.rulesVersion === 3
                            ? 90
                            : 45) - Math.floor(lt),
                      ),
                      `s`,
                    ],
                  }),
                  (0, F.jsxs)(`span`, {
                    children: [
                      (0, F.jsx)(ce, { size: 17 }),
                      kn?.destruction || 0,
                      `%`,
                    ],
                  }),
                  (0, F.jsxs)(`span`, {
                    children: [
                      (0, F.jsx)(be, { size: 17 }),
                      kn?.units.filter((e) => e.side === `attack` && !e.naval && e.hp > 0)
                        .length || 0,
                    ],
                  }),
                ],
              }),
              kn?.objective && !B && swElement('div',{className:'sw-saga-objective',role:'status'},swElement('span',null,kn.objective.label),swElement('progress',{max:R.campaignType==='sea'?100:1,value:kn.objective.progress,'aria-label':'Mission progress'}),kn.objective.escortHealth!=null&&swElement('small',null,'Escort '+Math.round(kn.objective.escortHealth*100)+'%')),
              !B && (L.kind==='defense'||R.saga?.mode==='hold') ? swElement('div',{className:'sw-defense-controls'},swElement('strong',null,'Defend the keep'),swElement('span',null,'Your walls and towers fight automatically'),swElement('button',{className:'secondary',onClick:()=>ft(dt===1?2:1)},dt+'× speed'),St&&swElement('button',{className:'secondary',onClick:()=>{En();setChronicleTab('Reports')}},'Exit replay')) : !B && (0, F.jsx)(SWBattleControls, {
                input: R, frame: kn, selected: le, onSelect: M, onRetreat: Cn,onExitReplay:()=>{En();setChronicleTab('Reports')},
                disabled: mt||!!onlineBattleError, replay: St, speed: dt, onSpeed: o==='cloud'&&!St&&L.kind!=='practice'?null:() => ft(e => e === 1 ? 2 : 1),
                onRally: wn, onAbility: Tn,onShipCommand:SWShipCommand14,selectedShip14,onSelectShip14:setSelectedShip14,navalTool14,onCancelShipCommand:()=>setNavalTool14(null), onNaval: SWFireBroadside, navalHull:kn?.units.find(u=>u.naval),
              }),
              (gt||onlineBattleError) &&
                (0, F.jsxs)(`div`, {
                  className: `battle-error`,
                  role: `alert`,
                  children: [
                    (0, F.jsx)(`p`, { children: onlineBattleError||gt }),
                    (0, F.jsx)(`button`, {
                      className: `primary`,
                      onClick: () => onlineBattleError?void swOnlineQueue.current?.flush().then(()=>setOnlineBattleError('')).catch(error=>setOnlineBattleError(error.message)):void xn(),
                      children: onlineBattleError?'Retry connection':`Retry saving result`,
                    }),
                  ],
                }),
              mt &&
                !gt &&
                !B &&
                (0, F.jsx)(`div`, {
                  className: `saving-result`,
                  children: `Recording the battle…`,
                }),
            ],
          })
        : f === `frontier`
          ? (0, F.jsxs)(`section`, {
              className: `frontier-world`,
              children: [
                (0, F.jsx)(`div`, { className: `frontier-background` }),
                (0, F.jsxs)(`div`, {
                  className: `frontier-heading`,
                  children: [
                    (0, F.jsxs)(`div`, {
                      children: [
                        (0, F.jsx)(`span`, {
                          className: `eyebrow`,
                          children: `Your kingdom. A wider world.`,
                        }),
                        (0, F.jsx)(`h1`, { children: `Battle` }),
                        (0, F.jsx)(`p`, {
                          children: `Two campaigns. One growing kingdom.`,
                        }),
                      ],
                    }),
                    (0, F.jsx)(Ls, {
                      value: tt,
                      onValueChange: nt,
                      children: (0, F.jsxs)(zs, {
                        className: `segment-control`,
                        children: [
                          (0, F.jsxs)(Bs, {
                            value: `campaign`,
                            children: [(0, F.jsx)(j, { size: 16 }), `Land`],
                          }),
                          swElement(Bs,{value:'sea'},swElement(xe,{size:16}),'Sea'),
                          (0, F.jsxs)(Bs, {
                            value: `provinces`,
                            children: [
                              (0, F.jsx)(se, { size: 16 }),
                              `Provinces`,
                            ],
                          }),
                          (0, F.jsxs)(Bs, {
                            value: `rivals`,
                            children: [(0, F.jsx)(De, { size: 16 }), `Rivals`],
                          }),
                          (0, F.jsxs)(Bs, {
                            value: `league`,
                            children: [(0, F.jsx)(Ee, { size: 16 }), `League`],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                tt === `campaign` || tt === 'sea'
                  ? swElement(SWCampaignBoard14,{state:V,sea:tt==='sea',onScout:yn,onHarbor:()=>SWNavigate('fleet')})
                  : tt === `provinces`
                    ? (0, F.jsx)(au, {
                        state: V,
                        act: mn,
                        busy: l,
                        onScout: (e, t) =>
                          yn({ kind: `province`, provinceId: e, defense: t }),
                      })
                    : tt === `league`
                      ? (0, F.jsx)(ou, {
                          state: V,
                          act: mn,
                          busy: l,
                          cloud: o === `cloud`,
                          onRivals: () => nt(`rivals`),
                        })
                      : o !== `cloud` ? swElement(SWOnlineFrontierGate) : (0, F.jsxs)(`div`, {
                          className: `rivals-surface`,
                          children: [
                            (0, F.jsxs)(`div`, {
                              className: `rivals-toolbar`,
                              children: [
                                (0, F.jsxs)(`div`, {
                                  children: [
                                    (0, F.jsx)(`h2`, {
                                      children: `Asynchronous battles`,
                                    }),
                                    (0, F.jsx)(`p`, {
                                      children: `Attack a player’s saved defenses. They can watch the replay afterward.`,
                                    }),
                                  ],
                                }),
                                (0, F.jsxs)(`button`, {
                                  className: `secondary`,
                                  onClick: () => void hn(),
                                  disabled: Ze,
                                  children: [
                                    (0, F.jsx)(ge, { size: 16 }),
                                    Ze ? `Looking…` : `Refresh`,
                                  ],
                                }),
                              ],
                            }),
                            (0, F.jsxs)(`div`, {
                              className: `defense-strip`,
                              children: [
                                (0, F.jsx)(be, { size: 25 }),
                                (0, F.jsxs)(`div`, {
                                  children: [
                                    (0, F.jsx)(`strong`, {
                                      children: V.published
                                        ? `Your defenses are published`
                                        : `Prepare your defenses`,
                                    }),
                                    (0, F.jsx)(`p`, {
                                      children: V.published
                                        ? `Other players with access to this game can challenge your saved layout.`
                                        : `Build a watchtower, then publish your capital for player challenges.`,
                                    }),
                                  ],
                                }),
                                (0, F.jsx)(`button`, {
                                  className: `primary`,
                                  disabled: l || o !== `cloud`,
                                  onClick: () =>
                                    void mn(
                                      { type: `publish` },
                                      `Defenses published`,
                                    ),
                                  children: V.published
                                    ? `Update defenses`
                                    : `Publish defenses`,
                                }),
                              ],
                            }),
                            $e
                              ? (0, F.jsxs)(`div`, {
                                  className: `empty-state`,
                                  children: [
                                    (0, F.jsx)(ie, {}),
                                    (0, F.jsx)(`h3`, {
                                      children: `Unable to load kingdoms`,
                                    }),
                                    (0, F.jsx)(`p`, { children: $e }),
                                    (0, F.jsx)(`button`, {
                                      onClick: () => void hn(),
                                      className: `secondary`,
                                      children: `Try again`,
                                    }),
                                  ],
                                })
                              : Ye.length
                                ? (0, F.jsx)(`div`, {
                                    className: `rival-grid`,
                                    children: Ye.map((e) =>
                                      (0, F.jsxs)(
                                        `button`,
                                        {
                                          className: `rival-card`,
                                          onClick: () =>
                                            yn({
                                              kind: `player`,
                                              rivalId: e.id,
                                              defense: e.defense,
                                            }),
                                          children: [
                                            (0, F.jsx)(qu, { kind: `keep` }),
                                            (0, F.jsxs)(`div`, {
                                              children: [
                                                (0, F.jsx)(`span`, {
                                                  className: `eyebrow`,
                                                  children: `PLAYER KINGDOM`,
                                                }),
                                                (0, F.jsx)(`h3`, {
                                                  children: e.name,
                                                }),
                                                (0, F.jsxs)(`p`, {
                                                  children: [
                                                    `Keep `,
                                                    e.level,
                                                    ` · `,
                                                    e.rating,
                                                    ` renown`,
                                                  ],
                                                }),
                                                (0, F.jsxs)(`span`, {
                                                  className: `text-gold`,
                                                  children: [
                                                    `Scout defenses `,
                                                    (0, F.jsx)(te, {
                                                      size: 15,
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        },
                                        e.id,
                                      ),
                                    ),
                                  })
                                : (0, F.jsxs)(`div`, {
                                    className: `empty-state`,
                                    children: [
                                      (0, F.jsx)(De, { size: 34 }),
                                      (0, F.jsx)(`h3`, {
                                        children: Ze
                                          ? `Scouting the realm…`
                                          : `No rival kingdoms yet`,
                                      }),
                                      (0, F.jsx)(`p`, {
                                        children:
                                          o === `practice`
                                            ? `Sign in to publish your kingdom and find player defenses.`
                                            : `No other kingdoms have published defenses yet. Player battles appear here as other players join and publish.`,
                                      }),
                                      (0, F.jsxs)(`button`, {
                                        className: `secondary`,
                                        onClick: () =>
                                          yn({
                                            kind: `practice`,
                                            defense: Wl(V),
                                          }),
                                        children: [
                                          (0, F.jsx)(be, { size: 17 }),
                                          `Test my own defenses`,
                                        ],
                                      }),
                                      (0, F.jsx)(`small`, {
                                        children: `Training drill · no resources or troops lost`,
                                      }),
                                    ],
                                  }),
                          ],
                        }),
              ],
            })
          : (0, F.jsxs)(`section`, {
              className: `world${layout14?' layout-active14':''}`,
              children: [
                (0, F.jsx)(Eu, {
                  buildings: V.buildings,
                    city: V.city,
                  provinces: V.provinces,
                  commander: tn.id,
                  commanderLevel: tn.level,
                  livery: V.livery,
                  terrain: V.terrain,
                  fleet: V.fleet,
                  coastFocus: E,
                  onFleet: () => w(!0),
                  editing:!!T,layoutOverlay14:layout14?layoutOverlay14:null,
                  onTerrain: (e, t) =>
                    T &&
                    void SWEditAct14(
                      { type: `landscape`, kind: T, x: e, y: t },
                      undefined,
                    ),
                  wallDraft: Wt,
                  onWallDraft: Gt,
                  onCommander: () => Ut(!0),
                  army: V.army,
                  unitLevels: V.unitLevels,
                  selected: m,
                  placing: ornamentPlacement?'monument':g || v,
                  appearance:SWAppearance(V),
                  ornamentGhost:ornamentPlacement&&Pt?{...Pt,id:ornamentPlacement,kind:SWPremiumCatalog.find(item=>item.id===ornamentPlacement)?.value,facing:buildFacing}:null,
                  ghost:
                    Pt && (g || v)
                      ? {
                          ...Pt,
                          facing: buildFacing,
                          kind: g || V.buildings.find((e) => e.id === v).kind,
                        }
                      : null,
                  onSelect: (e) => {
                    (h(e.id), p(`capital`), He());
                    if(e.kind === `harbor` && !e.readyAt && !layout14) w(true);
                  },
                  onPlace: _n,
                }),
                layout14 && swElement(SWLayoutBar14,{tool:T,overlay:layoutOverlay14,onOverlay:setLayoutOverlay14,onTool:ee,onBuildings:()=>{ee(null);h(null)},onUndo:()=>SWLayoutTravel14(-1),onRedo:()=>SWLayoutTravel14(1),onCancel:SWCancelLayout14,onCommit:SWSaveLayout14,canUndo:!!layout14?.index,canRedo:layout14&&layout14.index<layout14.actions.length,count:layout14?.index||0,busy:l}),
                g === `wall`
                    ? (0, F.jsxs)(`div`, {
                        className: `placement-banner wall-banner`,
                        children: [
                          (0, F.jsxs)(`div`, {
                            className: `placement-copy`,
                            children: [
                              (0, F.jsx)(`strong`, {
                                children: `Draw your defenses`,
                              }),
                              Wt.length > 0 &&
                                !nn &&
                                (0, F.jsx)(`span`, {
                                  className: `wall-error`,
                                  children: `Adjust the red plots to keep your wall on empty land.`,
                                }),
                              (0, F.jsx)(`span`, {
                                children: `Drag across empty plots, or tap the first and last plot. Each wall section uses one crew.`,
                              }),
                              (0, F.jsx)(Ku, {
                                cost: Yc(X(`wall`), Wt.length),
                                available: V.resources,
                              }),
                            ],
                          }),
                          (0, F.jsxs)(`button`, {
                            className: `primary`,
                            disabled:
                              !nn ||
                              l ||
                              $t < 1 ||
                              !Z(V, Yc(X(`wall`), Wt.length)),
                            onClick: async () => {
                              (await mn(
                                { type: `walls`, tiles: Wt },
                                `${Wt.length} wall segments started`,
                              )) && (Gt([]), _(null));
                            },
                            children: [
                              (0, F.jsx)(N, { size: 17 }),
                              `Build `,
                              Wt.length,
                              ` `,
                              Wt.length === 1 ? `wall` : `walls`,
                            ],
                          }),
                          (0, F.jsx)(`button`, {
                            className: `icon-btn`,
                            "aria-label": `Cancel wall drawing`,
                            onClick: () => {
                              (_(null), Gt([]));
                            },
                            children: (0, F.jsx)(je, { size: 20 }),
                          }),
                        ],
                      })
                    : g || v || ornamentPlacement
                      ? (0, F.jsxs)(`div`, {
                          className: `placement-banner`,
                          children: [
                            (0, F.jsxs)(`div`, {
                              className: `placement-copy`,
                              children: [
                                (0, F.jsx)(`strong`, {
                                  children: ornamentPlacement ? 'Place '+SWPremiumCatalog.find(item=>item.id===ornamentPlacement)?.name : v
                                    ? `Move building`
                                    : `Place ${Sl[g].name}`,
                                }),
                                (0, F.jsx)(`span`, {
                                  children: Pt
                                    ? `Plot selected. Confirm when you’re ready.`
                                    : (g || V.buildings.find(b=>b.id===v)?.kind) === `harbor`
                                      ? `Tap a highlighted berth on your coast.`
                                      : `Tap an empty plot to preview your building.`,
                                }),
                                g &&
                                  (0, F.jsx)(Ku, {
                                    cost: X(g),
                                    available: V.resources,
                                  }),
                              ],
                            }),
                            swElement('button',{className:'secondary sw-placement-rotate','aria-label':'Rotate preview 90 degrees',onClick:()=>setBuildFacing(value=>(value+1)%4)},swElement(ge,{size:16}),buildFacing*90+'°'),
                            (0, F.jsxs)(`button`, {
                              className: `primary`,
                              disabled: !Pt || l,
                              onClick: () => Pt && void vn(Pt.x, Pt.y),
                              children: [
                                (0, F.jsx)(O, { size: 18 }),
                                ornamentPlacement?'Place here':v ? `Confirm move` : `Build here`,
                              ],
                            }),
                            (0, F.jsx)(`button`, {
                              className: `icon-btn`,
                              "aria-label": `Cancel placement`,
                              onClick: () => {
                                const wasNew=!!g;setOrnamentPlacement(null); _(null); y(null); Ft(null); if(requirementTrail14.current.length)SWNavigate('back');else if(wasNew)p('build');
                              },
                              children: (0, F.jsx)(je, { size: 20 }),
                            }),
                          ],
                        })
                      : H
                        ? swElement(SWBuildingDetails14,{state:V,building:H,busy:l,layout:!!layout14,act:SWEditAct14,onClose:()=>{h(null);requirementTrail14.current=[]},onBack:requirementTrail14.current.length?()=>SWNavigate('back'):null,onMove:()=>{y(H.id);setBuildFacing(H.facing||0);h(null);ee(null)},onRequirement:SWRequire14})
                        : null,
                Zt &&
                  !m &&
                  !g &&
                  !v &&
                  (0, F.jsxs)(`div`, {
                    className: `builder-status`,
                    children: [
                      (0, F.jsx)(N, { size: 15 }),
                      (0, F.jsxs)(`span`, {
                        children: [
                          Lc(V),
                          ` / `,
                          en,
                          ` crews working · `,
                          Qc(Math.max(0, (Zt.readyAt - i) / 1e3)),
                        ],
                      }),
                      (0, F.jsx)(Vs, { value: Fn }),
                    ],
                  }),
                (0, F.jsxs)(`div`, {
                  className: `world-caption`,
                  children: [
                    (0, F.jsxs)(`span`, {
                      children: [
                        `Haven Valley`,
                        V.provinces?.length
                          ? ` · ${V.provinces.length} ${V.provinces.length === 1 ? `province` : `provinces`}`
                          : ``,
                      ],
                    }),
                    (0, F.jsx)(`span`, {
                      children: `Drag to explore · tap a villager or building`,
                    }),
                  ],
                }),
                f === 'build' && swElement(SWBuildMenu14,{state:V,busy:l,category:Bt,onCategory:Vt,onBuild:gn,onClose:()=>SWNavigate('close')}),
              ],
            }),
      !L &&
        (0, F.jsxs)(F.Fragment, {
          children: [
            (0, F.jsx)(`div`, {
              className: `connection-state`,
              children:
                o === `cloud`
                  ? (0, F.jsxs)(F.Fragment, {
                      children: [(0, F.jsx)(ae, { size: 13 }), `Kingdom saved`],
                    })
                  : o === `practice`
                    ? (0, F.jsxs)(`button`, {
                        onClick: () => de(!0),
                        children: [
                          (0, F.jsx)(ie, { size: 13 }),
                          jt
                            ? Au()
                              ? `Saved on this iPhone`
                              : `Saved on this device`
                            : `Device storage unavailable`,
                        ],
                      })
                    : o === `error`
                      ? (0, F.jsxs)(`button`, {
                          onClick: () => void pn(),
                          children: [
                            (0, F.jsx)(ie, { size: 13 }),
                            `Connection failed · retry`,
                          ],
                        })
                      : (0, F.jsxs)(F.Fragment, {
                          children: [
                            (0, F.jsx)(ae, { size: 13 }),
                            `Opening kingdom…`,
                          ],
                        }),
            }),
            (0, F.jsx)(Ls, {
              value:
                f === `build`
                  ? `build`
                  : f === `frontier`
                    ? `frontier`
                    : `capital`,
              onValueChange: (e) => {
                (p(e),
                  ee(null),
                  h(null),
                  _(null),
                  y(null),
                  Ft(null),
                  Gt([]),
                  He());
              },
              className: `navigation-shell`,
              children: (0, F.jsxs)(zs, {
                className: `bottom-nav`,
                children: [
                  (0, F.jsxs)(Bs, {
                    value: `capital`,
                    children: [(0, F.jsx)(ne, {}), `Capital`],
                  }),
                  (0, F.jsxs)(Bs, {
                    value: `build`,
                    children: [(0, F.jsx)(N, {}), `Build`],
                  }),
                  (0, F.jsxs)(`button`, {
                    className: `army-nav`,
                    onClick: () => x(!0),
                    children: [
                      (0, F.jsx)(we, {}),
                      `Army `,
                      (0, F.jsx)(`span`, {
                        className: `nav-count`,
                        children: Qt,
                      }),
                    ],
                  }),
                  (0, F.jsxs)(Bs, {
                    value: `frontier`,
                    children: [(0, F.jsx)(j, {}), `Frontier`],
                  }),
                ],
              }),
            }),
          ],
        }),
      (0, F.jsx)(pu, {
        open: S,
        onOpenChange: w,
        state: V,
        act: mn,
        busy: l,
        onBuildPort: () => gn(`harbor`),
        onViewCoast: SWOpenCoast,
      }),
      (0, F.jsx)(iu, {
        open: Ht,
        onOpenChange: Ut,
        state: V,
        act: mn,
        busy: l,
      }),
      swElement(SWObjectives, {open:stonewakeObjectiveOpen,onClose:()=>{setStonewakeObjectiveOpen(false);try{localStorage.setItem('stonewake-objectives-dismissed','true')}catch{}},state:V,act:mn,busy:l,onFrontier:()=>{setStonewakeObjectiveOpen(false);p('frontier');nt('campaign')},onAction:id=>{setStonewakeObjectiveOpen(false);if(['quarry','barracks','forge'].includes(id))gn(id);else if(id==='army')x(true);else if(id==='age2'){p('capital');h('keep')}else p('frontier')}}),
      swElement(SWArmy, {open:b,onClose:()=>x(false),state:V,act:mn,busy:l,onFrontier:()=>SWNavigate('frontier'),onCommander:()=>SWNavigate('commander'),onPractice:kind=>{x(false);const army={...wl(),[kind]:Math.min(12,Pl(V))};setBattlePrep14({army,fleet:[]});yn({kind:'practice',defense:Gl(0),practiceKind:kind})}}),
      swElement(SWScout, {open:!!I,onClose:()=>rt(null),scout:I,state:V,busy:l,navalId,onNavalChange:setNavalId,onPreparation:setBattlePrep14,onAttack:()=>void bn(),onTrain:()=>{scoutReturn14.current=I;navHistory14.current.push('scout');SWNavigate('army')}}),
      (0, F.jsx)(As, {
        open: !!B,
        onOpenChange: (e) => {
          !e && B && En();
        },
        children:
          !!B &&
          (0, F.jsx)(SWResultContent, {
            defenseReport: B.defenseReport,storesFull:!St&&!B.practice&&!B.defense&&!B.saga&&B.result.won&&!xl.some(k=>B.reward[k]>0),onRepair:()=>{En();SWNavigate('fleet')},objective:B.result.objective||null,seaResult:R?.campaignType==='sea'?B.result:null,earnedGems:B.earnedGems,onRetry:B.saga&&!St&&(!B.result.won||B.trialId)?()=>{const missionId=R.saga.missionId,trialId=R.saga.trialId;En();SWStartAdventure(SWMissionScout(Y(r.current),missionId,trialId))}:null,
            className: `game-dialog result-dialog ${(St && wt ? !B?.result.won : B?.result.won) ? `result-victory` : ``}`,
            showCloseButton: !1,
            children:
              B &&
              (0, F.jsxs)(F.Fragment, {
                children: [
                  (0, F.jsx)(`div`, {
                    className: `victory-rays`,
                    "aria-hidden": `true`,
                  }),
                  (0, F.jsx)(`div`, {
                    className: `victory-seal ${(St && wt ? !B.result.won : B.result.won) ? `` : `defeat`}`,
                    children: B.result.won
                      ? (0, F.jsx)(oe, { size: 42 })
                      : (0, F.jsx)(be, { size: 42 }),
                  }),
                  (0, F.jsxs)(Ps, {
                    children: [
                      (0, F.jsx)(`span`, {
                        className: `eyebrow`,
                        children: St
                          ? `BATTLE REPLAY`
                          : B.practice
                            ? `TRAINING COMPLETE`
                            : `BATTLE COMPLETE`,
                      }),
                      (0, F.jsx)(Fs, {
                        children:
                          B.saga ? (B.result.won?'Mission complete':'Try another approach') : B.defense
                            ? B.result.won ? `Your city held` : `The keep was breached`
                            : St && wt
                            ? B.result.won
                              ? `Your defenses were breached`
                              : `Your defenses held`
                            : B.result.won
                              ? `Victory is yours`
                              : `Regroup and return`,
                      }),
                      (0, F.jsx)(Is, {
                        children:
                          B.saga ? (B.result.objective?.label||R.saga.label) : B.defense
                            ? B.result.won ? `Your walls and garrison repelled the raiders.` : `Strengthen the walls and towers before the next raid.`
                            : St && wt
                            ? B.result.won
                              ? `The attacking army destroyed your keep. Adjust your layout and strengthen your towers.`
                              : `Your garrison repelled the attacking army.`
                            : B.result.won
                              ? R?.seaMode==='convoy'?'The relief vessel reached safe harbor. The sea route is open.':`${R?.defense.name} is yours. Your banner flies higher.`
                              : B.result?.objective&&B.result?.landedTroops!=null ? (B.result.objective?.label||'Regroup your fleet and try another approach.') : `The enemy keep still stands. Try a different approach or strengthen your army.`,
                      }),
                    ],
                  }),
                  (0, F.jsx)(`div`, {
                    className: `stars`,
                    children: [0, 1, 2].map((e) =>
                      (0, F.jsx)(
                        `span`,
                        {
                          style: { animationDelay: `${0.2 + e * 0.25}s` },
                          className: e < B.result.stars ? `earned` : ``,
                          children: `✦`,
                        },
                        e,
                      ),
                    ),
                  }),
                  (0, F.jsxs)(`div`, {
                    className: `result-stats`,
                    children: [
                      (0, F.jsxs)(`span`, {
                        children: [
                          (0, F.jsxs)(`strong`, {
                            children: [
                              (0, F.jsx)(Ru, { value: B.result.destruction }),
                              `%`,
                            ],
                          }),
                          B.defense ? `city intact` : `destruction`,
                        ],
                      }),
                      (0, F.jsxs)(`span`, {
                        children: [
                          (0, F.jsxs)(`strong`, {
                            children: [Math.round(B.result.duration), `s`],
                          }),
                          `battle time`,
                        ],
                      }),
                      (0, F.jsxs)(`span`, {
                        children: [
                          (0, F.jsx)(`strong`, {
                            children: B.defense||B.saga ? `Safe` : Nl(B.result.survivors),
                          }),
                          B.defense||B.saga ? `home army` : `returning safely`,
                        ],
                      }),
                    ],
                  }),
                  !B.practice &&
                    xl.some((e) => B.reward[e] > 0) &&
                    (0, F.jsxs)(`div`, {
                      className: `victory-loot`,
                      children: [
                        (0, F.jsx)(`span`, { children: `Victory spoils` }),
                        (0, F.jsx)(zu, { reward: B.reward, animate: !0 }),
                      ],
                    }),
                  !B.practice && !B.defense && !B.saga && B.earnedXP>0 &&
                    R?.commander &&
                    (R.rulesVersion !== 4 ||
                      (B.result.duration >= 10 &&
                        R.orders?.some((e) => e.kind !== `hero`))) &&
                    (0, F.jsxs)(`div`, {
                      className: `battle-progression`,
                      children: [
                        (0, F.jsx)(oe, { size: 19 }),
                        (0, F.jsxs)(`strong`, {
                          children: [
                            `+`,
                            B.earnedXP,
                            ` commander XP`,
                          ],
                        }),
                        B.result.won &&
                          L?.kind === `province` &&
                          (0, F.jsxs)(`span`, {
                            children: [
                              (0, F.jsx)(se, { size: 16 }),
                              `New land is open in your capital`,
                            ],
                          }),
                      ],
                    }),
                  (0, F.jsx)(`p`, {
                    className: `recovery-note`,
                    children: B.saga ? (B.result.won ? (B.trialId ? 'Trial complete. First-clear rewards are added once. Improve your best time whenever you like.' : 'Mission complete. Collect your reward in the Journal.') : (B.result.objective?.label || 'The mission objective was not met. Your home army and fleet are safe.')) : B.defense ? (B.lost?`Raiders took ${B.loot?xl.filter(k=>B.loot[k]>0).map(k=>B.loot[k]+` `+Wu[k].toLowerCase()).join(`, `):B.lost+` gold`}. Buildings recover and your army is safe.`:(B.result.won?`Your keep held. Buildings recover and your home army is safe. +2 gems.`:`Your stores were protected. Buildings recover and your home army is safe.`)) : B.practice
                      ? `Your kingdom and army are unchanged.`
                      : R?.rulesVersion === 4
                        ? `Survivors, unused reserves, and 45% of fallen troops return. Wounded recovery rounds down per troop type.`
                        : `Survivors and 65% of fallen troops return, rounded up per troop type.`,
                  }),
                  (0, F.jsxs)(`button`, {
                    className: `primary wide`,
                    onClick: ()=>{const saga=B.saga;En();if(saga)setChronicleTab(B.trialId?'Trials':'Chapter')},
                    children: [
                      B.saga?'Return to Journal ':`Return to your capital `,
                      (0, F.jsx)(ne, { size: 18 }),
                    ],
                  }),
                ],
              }),
          }),
      }),
      swElement(SWSettings, {initialTab:settingsSection,onlineMode:o==='cloud',onlineBattle:!!t.activeBattle,onBackup:SWBackupLocal,onRestoreBackup:SWRestoreBackup,onEnterOnline:SWEnterOnline,onReturnLocal:SWReturnLocal,open:ue,onClose:()=>de(false),busy:l,name:Ie,onName:Le,onSaveName:async()=>{await mn({type:'rename',name:Ie},'Kingdom renamed')},sound:Re,onSound:We,volume:ze,onVolume:Ge,onTest:()=>He('complete'),music:stonewakeMusic,onMusic:()=>setStonewakeMusic(!stonewakeMusic),musicVolume,onMusicVolume:setMusicVolume,battleMusicVolume,onBattleMusicVolume:setBattleMusicVolume,reduced:Be,onMotion:Ke,haptics,onHaptics:()=>setHaptics(!haptics),reducedEffects,onReducedEffects:()=>setReducedEffects(!reducedEffects),onGuide:()=>{de(false);Ne(true)}}),
      swElement(SWPremiumStore,{open:!!premiumStore,onClose:()=>setPremiumStore(null),state:V,act:mn,busy:l,onlineMode:o==='cloud',onOnlineGame:SWApplyOnlineGame,initialTab:premiumStore?.tab||'Wardrobe',ownedOnly:premiumStore?.owned||false,onPlace:SWPlaceDecoration,onProjects:()=>{setPremiumStore(null);setGemShopOpen(true)}}),
      swElement(SWChronicle,{open:!!chronicleTab,onClose:()=>setChronicleTab(null),initialTab:chronicleTab||'Chapter',state:V,act:mn,busy:l,onStart:SWStartAdventure,onRequirement:SWAdventureRequirement,reports:vt,onReplay:report=>{setChronicleTab(null);On(report)}}),
      swElement(SWCityHub,{onlineMode:o==='cloud',reports:vt,onBuilding:id=>{setCityOpen(false);p('capital');h(id)},open:cityOpen,onClose:()=>setCityOpen(false),state:V,act:mn,busy:l,onBuild:kind=>{setCityOpen(false);gn(kind)},onDefense:SWStartDefense}),
      swElement(SWStorage,{open:storageOpen,onClose:()=>setStorageOpen(false),state:V,act:mn,busy:l,onBuilding:id=>{setStorageOpen(false);p('capital');h(id)},onBuild:()=>{setStorageOpen(false);gn('storehouse')}}),
      swElement(SWGems, {onlineMode:o==='cloud',onOnlineGame:SWApplyOnlineGame,open:gemShopOpen,onClose:()=>setGemShopOpen(false),state:V,act:mn,busy:l}),
      (0, F.jsx)(As, {
        open: Me,
        onOpenChange: Ne,
        children:
          Me &&
          (0, F.jsxs)(SWLegacyContent, {
            className: `game-dialog sw-help-dialog`,
            children: [
              (0, F.jsxs)(Ps, {
                children: [
                  (0, F.jsx)(`span`, {
                    className: `eyebrow`,
                    children: `Stonewake`,
                  }),
                  (0, F.jsx)(Fs, { children: `How to play` }),
                  (0, F.jsx)(Is, {
                    children: `Build, recruit, and take your place in the frontier.`,
                  }),
                ],
              }),
              (0, F.jsxs)(`div`, {
                className: `help-steps`,
                children: [
                  (0, F.jsxs)(`div`, {
                    children: [
                      (0, F.jsx)(N, {}),
                      (0, F.jsxs)(`section`, {
                        children: [
                          (0, F.jsx)(`h3`, { children: `Grow your capital` }),
                          (0, F.jsx)(`p`, {
                            children: `Open Build and place structures on highlighted plots. Tap a building to upgrade or move it. Edit land clears obstacles and places roads, trees, and gardens. Open Fleet to build ships and send voyages. Resources are collected automatically. Builder’s lodges add permanent crews; drag to draw walls, then tap a wall to add a gate.`,
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, F.jsxs)(`div`, {
                    children: [
                      (0, F.jsx)(we, {}),
                      (0, F.jsxs)(`section`, {
                        children: [
                          (0, F.jsx)(`h3`, { children: `Raise an army` }),
                          (0, F.jsx)(`p`, {
                            children: `Complete a barracks and recruit infantry and archers. Upgrade your keep and build a foundry to unlock cavalry and cannons.`,
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, F.jsxs)(`div`, {
                    children: [
                      (0, F.jsx)(se, {}),
                      (0, F.jsxs)(`section`, {
                        children: [
                          (0, F.jsx)(`h3`, {
                            children: `Conquer the frontier`,
                          }),
                          (0, F.jsx)(`p`, {
                            children: `Scout a stronghold, select troops, and tap outside the walls to deploy. Keep reserves and breach gates to reach the keep. Use Rally and your commander’s special ability once each. Provinces add land and income.`,
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, F.jsxs)(`div`, {
                    children: [
                      (0, F.jsx)(De, {}),
                      (0, F.jsxs)(`section`, {
                        children: [
                          (0, F.jsx)(`h3`, {
                            children: `Challenge other players`,
                          }),
                          (0, F.jsx)(`p`, {
                            children: `Build watchtowers and publish your defenses under Rival kingdoms. Players attack saved layouts while their opponents are offline. Use battle reports for revenge and win weekly league cosmetics.`,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, F.jsxs)(`button`, {
                className: `primary wide`,
                onClick: () => Ne(!1),
                children: [`Back to my kingdom `, (0, F.jsx)(ne, { size: 17 })],
              }),
            ],
          }),
      }),
      (0, F.jsx)(As, {
        open: Pe,
        onOpenChange: Fe,
        children:
          Pe &&
          (0, F.jsxs)(SWLegacyContent, {
            className: `game-dialog reports-dialog`,
            children: [
              (0, F.jsxs)(Ps, {
                children: [
                  (0, F.jsx)(`span`, {
                    className: `eyebrow`,
                    children: `Your battles`,
                  }),
                  (0, F.jsx)(Fs, { children: `Battle reports` }),
                  (0, F.jsx)(Is, {
                    children: `Review your campaigns and attacks against your defenses.`,
                  }),
                ],
              }),
              bt
                ? (0, F.jsx)(`p`, { className: `inline-note`, children: bt })
                : vt.length
                  ? (0, F.jsx)(`div`, {
                      className: `report-list`,
                      children: vt.map((e) =>
                        (0, F.jsxs)(
                          `div`,
                          {
                            className: `report-entry`,
                            children: [
                              (0, F.jsxs)(`button`, {
                                className: `report-card`,
                                onClick: () => On(e),
                                children: [
                                  (0, F.jsx)(`span`, {
                                    className: `report-symbol ${e.result.won ? `won` : ``}`,
                                    children: e.defending
                                      ? (0, F.jsx)(be, {})
                                      : (0, F.jsx)(we, {}),
                                  }),
                                  (0, F.jsxs)(`span`, {
                                    children: [
                                      (0, F.jsx)(`strong`, {
                                        children: e.input?.saga ? SWChapter(V).missions.find(m=>m.id===e.input.saga.missionId)?.title : e.defending
                                          ? e.attackerName || `Incoming army`
                                          : e.input.defense.name,
                                      }),
                                      (0, F.jsxs)(`small`, {
                                        children: [
                                          e.input?.saga ? (e.input.saga.trialId?'Skill trial':'The Broken Beacon') : e.defending
                                            ? `Defense`
                                            : e.kind === `player`
                                              ? `Player battle`
                                              : e.kind === `province`
                                                ? `Province conquest`
                                                : `Campaign`,
                                          ` · `,
                                          e.result.destruction,
                                          `% destruction`,
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, F.jsxs)(`span`, {
                                    className: `report-result`,
                                    children: [
                                      e.input?.saga ? (e.result.won?'Completed':'Retry') : e.result.won
                                        ? e.defending
                                          ? `Defeated`
                                          : `Victory`
                                        : e.defending
                                          ? `Held`
                                          : `Defeat`,
                                      (0, F.jsx)(me, { size: 15 }),
                                    ],
                                  }),
                                ],
                              }),
                              e.revenge &&
                                (0, F.jsxs)(`button`, {
                                  className: `revenge-button`,
                                  onClick: () => {
                                    (Fe(!1),
                                      yn({
                                        kind: `player`,
                                        rivalId: e.revenge.id,
                                        defense: e.revenge.defense,
                                        revengeReportId: e.id,
                                      }));
                                  },
                                  children: [
                                    (0, F.jsx)(we, { size: 15 }),
                                    `Launch revenge`,
                                    (0, F.jsx)(`span`, {
                                      children: `+10 league points on victory`,
                                    }),
                                  ],
                                }),
                            ],
                          },
                          e.id,
                        ),
                      ),
                    })
                  : (0, F.jsxs)(`div`, {
                      className: `empty-state compact`,
                      children: [
                        (0, F.jsx)(ve, { size: 32 }),
                        (0, F.jsx)(`h3`, { children: `No battles yet` }),
                        (0, F.jsx)(`p`, {
                          children: `Fight your first campaign battle to create a report.`,
                        }),
                      ],
                    }),
            ],
          }),
      }),
      (0, F.jsx)(SWAchievements, {open:qe,onClose:()=>{Je(!1);dismissNotice();},state:V,act:mn,busy:l}),
      (0, F.jsx)(As, {
        open: It,
        onOpenChange: Lt,
        children:
          It &&
          (0, F.jsxs)(Ns, {
            className: `game-dialog town-dialog`,
            children: [
              (0, F.jsxs)(Ps, {
                children: [
                  (0, F.jsx)(`span`, {
                    className: `eyebrow`,
                    children: `Village life`,
                  }),
                  (0, F.jsx)(Fs, { children: V.name }),
                  (0, F.jsx)(Is, {
                    children: `Your people keep the town working while you plan its next chapter.`,
                  }),
                ],
              }),
              (0, F.jsxs)(`div`, {
                className: `town-numbers`,
                children: [
                  (0, F.jsxs)(`div`, {
                    children: [
                      (0, F.jsx)(De, {}),
                      (0, F.jsx)(`strong`, { children: zl(V) }),
                      (0, F.jsx)(`span`, { children: `Residents` }),
                    ],
                  }),
                  (0, F.jsxs)(`div`, {
                    children: [
                      (0, F.jsx)(ne, {}),
                      (0, F.jsx)(`strong`, {
                        children: V.buildings.filter((e) => e.level > 0).length,
                      }),
                      (0, F.jsx)(`span`, { children: `Buildings` }),
                    ],
                  }),
                  (0, F.jsxs)(`div`, {
                    children: [
                      (0, F.jsx)(be, {}),
                      (0, F.jsx)(`strong`, { children: Qt }),
                      (0, F.jsx)(`span`, { children: `Soldiers` }),
                    ],
                  }),
                ],
              }),
              (0, F.jsx)(`p`, {
                className: `inline-note`,
                children: `Cottages add eight residents and four gold per minute at each level. Workers and merchants travel between your buildings; your army gathers at the barracks.`,
              }),
              (0, F.jsx)(`h3`, {
                className: `section-label`,
                children: `Income per minute`,
              }),
              (0, F.jsx)(`div`, {
                className: `income-grid`,
                children: xl.map((e) => {
                  let t = Uu[e];
                  return (0, F.jsxs)(
                    `div`,
                    {
                      children: [
                        (0, F.jsx)(t, { size: 18 }),
                        (0, F.jsx)(`span`, { children: Wu[e] }),
                        (0, F.jsxs)(`strong`, { children: [`+`, Yt[e]] }),
                      ],
                    },
                    e,
                  );
                }),
              }),
              swElement(SWMarketTrade,{state:V,act:mn,busy:l}),
              (0, F.jsx)(`h3`, {
                className: `section-label`,
                children: `Manage buildings`,
              }),
              (0, F.jsx)(`div`, {
                className: `town-building-list`,
                children: V.buildings.map((e) =>
                  (0, F.jsxs)(
                    `button`,
                    {
                      onClick: () => {
                        (Lt(!1), p(`capital`), h(e.id));
                      },
                      children: [
                        (0, F.jsx)(qu, { kind: e.kind }),
                        (0, F.jsxs)(`span`, {
                          children: [
                            (0, F.jsx)(`strong`, { children: Sl[e.kind].name }),
                            (0, F.jsx)(`small`, {
                              children: e.readyAt
                                ? `Under construction`
                                : Bl(e),
                            }),
                          ],
                        }),
                        (0, F.jsx)(re, { size: 18 }),
                      ],
                    },
                    e.id,
                  ),
                ),
              }),
            ],
          }),
      }),
      o === `error` &&
        (0, F.jsxs)(`div`, {
          className: `connection-error panel`,
          children: [
            (0, F.jsx)(ie, { size: 25 }),
            (0, F.jsx)(`h2`, { children: `Your kingdom couldn’t load` }),
            (0, F.jsx)(`p`, {
              children: `Your saved progress is safe. Reconnect to continue.`,
            }),
            (0, F.jsx)(`button`, {
              className: `primary`,
              onClick: () => void pn(),
              children: `Reconnect`,
            }),
          ],
        }),
    ],
  });
}
