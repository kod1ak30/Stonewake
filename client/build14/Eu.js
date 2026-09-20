function Eu({
  buildings: e,
  provinces: t = [],
  commander: n,
  livery: r,
  wallDraft: i = [],
  onWallDraft: a,
  onCommander: o,
  army: s = xu,
  selected: c,
  placing: l,
  ghost: u,
  onSelect: d,
  onPlace: f,
  frame: p,
  nextFrame: m,
  battleTime: h = 0,
  playbackSpeed: g = 1,
  enemy: _ = !1,
  front: v,
  onFront: y,
  terrain: b = [],
  fleet: x = [],
  editing: S = !1,
  onTerrain: w,
  deployment: T = !1,
  onDeploy: ee,
  coastFocus: E = 0,
  onFleet: D,
  commanderLevel: te = 1,
  unitLevels: ne = {},
  navalSupport = null,
  selectedTroop = null,
  reserveCount,
  defending = false,
  city = {},
  appearance = null,
  fleetAppearance = null,
  ornamentGhost = null, battleInput14=null,navalTool14=null,onNavalMap14,layoutOverlay14=null,
}) {
  appearance=appearance||p?.appearance||{};
  let O = (0, C.useRef)(null),
    re = (0, C.useRef)(null),
    k = (0, C.useRef)({}),
    [ie, ae] = (0, C.useState)(0),
    [A, j] = (0, C.useState)(_ ? (battleInput14?.campaignType==='sea'&&p?1.65:1.2) : 1),
    [oe, se] = (0, C.useState)({ x: 0, y: 0 }),
    [ce, le] = (0, C.useState)(null),
    [M, N] = (0, C.useState)({ w: 1200, h: 800 }),
    [P, fe] = (0, C.useState)(null),
    pe = (0, C.useRef)([]),
    me = (0, C.useRef)(null),
    ge = (0, C.useRef)(new Map()),
    _e = (0, C.useRef)(null),
    ve = (0, C.useRef)(!1),
    ye = (0, C.useRef)([]),
    swRenderPositions = (0, C.useRef)(new Map()),
    swGesture = (0, C.useRef)({mode:`idle`,multi:false,hold:null,repeat:null,held:false,wall:[]}),
    swAllPointers = (0, C.useRef)(new Set()),
    swOrderAck = (0, C.useRef)(null),
    swLastSelection = (0, C.useRef)(selectedTroop),
    swDeploy = (0, C.useRef)(ee),
    swPreview = (0, C.useRef)(null),
    swDeploymentState = (0, C.useRef)({active:T,selectedTroop,reserveCount});
  k.current.appearance=appearance;
  k.current.fleetAppearance=fleetAppearance||appearance;
  const swPresentationEvents=C.useRef(new Map()),swPresentationTime=C.useRef(-1);
  swDeploy.current=ee;
  swDeploymentState.current={active:T,selectedTroop,reserveCount};
  const swCancelHold=()=>{clearTimeout(swGesture.current.hold);clearInterval(swGesture.current.repeat);swGesture.current.hold=null;swGesture.current.repeat=null;};
  (0,C.useEffect)(()=>()=>swCancelHold(),[]);
  (0,C.useEffect)(()=>{
    const cancel=()=>{swCancelHold();swPreview.current=null;swGesture.current.mode=`cancelled`;swGesture.current.multi=true;me.current=null;Ce.current=null;};
    const down=event=>{swAllPointers.current.add(event.pointerId);if(swAllPointers.current.size>1&&ge.current.size)cancel();};
    const up=event=>{swAllPointers.current.delete(event.pointerId);if(!swAllPointers.current.size&&!ge.current.size){swGesture.current.multi=false;swGesture.current.mode=`idle`;}};
    const lost=()=>{cancel();swAllPointers.current.clear();ge.current.clear();_e.current=null;};
    const hidden=()=>{if(document.hidden)lost();};
    window.addEventListener(`pointerdown`,down,true);window.addEventListener(`pointerup`,up,true);window.addEventListener(`pointercancel`,up,true);window.addEventListener(`blur`,lost);document.addEventListener(`visibilitychange`,hidden);
    return()=>{window.removeEventListener(`pointerdown`,down,true);window.removeEventListener(`pointerup`,up,true);window.removeEventListener(`pointercancel`,up,true);window.removeEventListener(`blur`,lost);document.removeEventListener(`visibilitychange`,hidden);};
  },[]);
  (0,C.useEffect)(()=>{if(swLastSelection.current!==selectedTroop){swLastSelection.current=selectedTroop;swCancelHold();if(ge.current.size){swGesture.current.mode=`cancelled`;swPreview.current=null;}}if(!T||reserveCount===0)swCancelHold();},[selectedTroop,T,reserveCount]);

  (0, C.useEffect)(() => {
    let e = () => {
      ve.current =
        document.documentElement.dataset.gameMotion === `reduced` ||
        matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    };
    (e(), window.addEventListener(`hearth-motion`, e));
    let t = (e) => {
      let t = e.detail;
      (_ && !p) ||
        !t ||
        !Number.isFinite(t.x) ||
        !Number.isFinite(t.y) ||
        (ye.current = [
          ...ye.current.slice(-20),
          {
            x: t.x,
            y: t.y,
            born: performance.now(),
            label: String(t.label ?? `Complete!`),
            kind: `build`,
          },
        ]);
    };
    return (
      window.addEventListener(`hearth-burst`, t),
      () => {
        (window.removeEventListener(`hearth-motion`, e),
          window.removeEventListener(`hearth-burst`, t));
      }
    );
  }, [_, !!p]);
  let be = (0, C.useRef)({
    frame: p,
    nextFrame: m,
    battleTime: h,
    playbackSpeed: g,
    received: 0,
  });
  be.current = {
    frame: p,
    nextFrame: m,
    battleTime: h,
    playbackSpeed: g,
    received:
      be.current.battleTime === h && be.current.frame === p
        ? be.current.received
        : typeof performance < `u`
          ? performance.now()
          : 0,
  };
  let xe = t.map((e) => e.id + `:` + e.level).join(`|`),
    Se = i.map((e) => `${e.x},${e.y}`).join(`|`),
    Ce = (0, C.useRef)(null),
    we = (0, C.useRef)(null),
    Te = e
      .map(
        (e) =>
          `${e.id}:${e.x},${e.y},${e.level},${!!e.readyAt},${e.axis},${e.specialty},${e.facing||0}`,
      )
      .join(`|`),
    Ee = (0, C.useMemo)(() => wu(e, s, t), [Te, xe, JSON.stringify(s)]),
    [Oe, ke] = (0, C.useState)(0),
    [Ae, Me] = (0, C.useState)(0);
  ((0, C.useEffect)(() => {
    let e = !0;
    Me(0);
    for (let [t, n] of Object.entries({
      ...SWDirectionalFiles,
      ...SWAnimationFiles,
      land: `valley`,
      coastLand: `coastal-valley.png`,
      worldLand: `sculpted-coast-v13.png`,
      well: `village-well-v1.png`,
      trebuchet: `trebuchet-v1.png`,
      atlas: `buildings`,
      civic: `civic-buildings`,
      people: `people`,
      combat: `combat-units`,
      fortifications: `fortifications`,
      upgrades: `upgrades`,
      commanders: `commanders`,
      arsenal: `arsenal`,
      naval: `naval`,
      evolution: `evolution`,
    }))
      _u(`/art/` + n + (n.includes(`.`) ? `` : `.webp`))
        .then((n) => {
          e && ((k.current[t] = n), ae((e) => e + 1));
        })
        .catch(() => {
          e && Me((e) => e + 1);
        });
    return () => {
      e = !1;
    };
  }, [Oe]),
    (0, C.useEffect)(() => {
      let e = re.current;
      if (!e) return;
      let t = new ResizeObserver((e) => {
        let t = e[0].contentRect;
        N({ w: t.width, h: t.height });
      });
      return (t.observe(e), () => t.disconnect());
    }, []));
  const townRects=e.map(building=>{
    const point=vu(building.x,building.y), wall=building.kind===`wall`||building.kind===`gate`, art=$l(building);
    const width=wall?64:SWBuildingSize(building).width;
    const height=wall?60:SWBuildingSize(building).height;
    return {left:point.x-width/2,right:point.x+width/2,top:point.y-height,bottom:point.y+22};
  });
  const navalPresent=battleInput14?.campaignType==='sea'||!!navalSupport||!!p?.units?.some(unit=>unit.naval);
  if(_&&navalPresent)for(const tile of(battleInput14?.campaignType==='sea'?[{x:-11,y:0},{x:-11,y:8},{x:-2.4,y:8}]:[{x:-5,y:0},{x:-5,y:3},{x:-3,y:3}])){const point=vu(tile.x,tile.y);townRects.push({left:point.x-48,right:point.x+48,top:point.y-100,bottom:point.y+18});}
  const townBounds={left:Math.min(...townRects.map(p=>p.left))-48,right:Math.max(...townRects.map(p=>p.right))+48,top:Math.min(...townRects.map(p=>p.top))-24,bottom:Math.max(...townRects.map(p=>p.bottom))+35};
  const cameraX=_?(townBounds.left+townBounds.right)/2:540, cameraY=_?(townBounds.top+townBounds.bottom)/2:340;
  const swBattleBottom=p?(M.w<M.h?(battleInput14?.campaignType==='sea'?176:130):(battleInput14?.campaignType==='sea'?131:90)):0;
  let Ne = _
      ? Math.max(0.15, Math.min(M.w/(townBounds.right-townBounds.left+20), Math.max(140,M.h-(p?swBattleBottom+44:10))/(townBounds.bottom-townBounds.top+20)))
      : Math.max(M.w / 1200, M.h / 800),
    Pe = Ne * A,
    Fe = _ && p ? Math.max(0,(swBattleBottom-20)/2)+(battleInput14?.campaignType==='sea'&&M.w>M.h?24:0) : 0,
    Ie = _ ? (A>1?Math.max(0,(1200*Math.max(M.w/1200,(M.h+2*Fe)/800)*A-M.w)/2):0) : Math.max(0, (1200 * Pe - M.w) / 2),
    Le = _ ? (A>1?Math.max(0,(800*Math.max(M.w/1200,(M.h+2*Fe)/800)*A-M.h)/2-Math.abs(Fe)):0) : Math.max(0, (800 * Pe - M.h) / 2),
    swWorld = {left:-410,right:1610,top:-140,bottom:1260},
    swMinZoom = _ ? .72 : Math.min(M.w/(swWorld.right-swWorld.left),M.h/(swWorld.bottom-swWorld.top))/Ne,
    swPanBounds = (min,max,center,span,offset=0) => (max-min)*Pe<span ? {min:(center-(min+max)/2)*Pe+offset,max:(center-(min+max)/2)*Pe+offset} : {min:span/2-(max-center)*Pe+offset,max:(center-min)*Pe-span/2+offset},
    swPanX = swPanBounds(swWorld.left,swWorld.right,cameraX,M.w),
    swPanY = swPanBounds(swWorld.top,swWorld.bottom,cameraY,M.h,Fe),
    swMinPanX = _ ? -Ie : swPanX.min,
    swMaxPanX = _ ? Ie : swPanX.max,
    swMinPanY = _ ? -Le : swPanY.min,
    swMaxPanY = _ ? Le : swPanY.max,
    Re = Math.max(swMinPanX, Math.min(swMaxPanX, oe.x)),
    ze = Math.max(swMinPanY, Math.min(swMaxPanY, oe.y)),
    Be = JSON.stringify(b),
    Ve = JSON.stringify(x),
    He = JSON.stringify(ne),
    Ue = { name: ``, level: 1, rating: 0, buildings: e };
  ((0, C.useEffect)(() => {
    if (E && typeof SWCoast !== `undefined`) { const zoom=1.2; j(zoom); se({x:(cameraX-SWCoast.focus.x)*Ne*zoom,y:(cameraY-SWCoast.focus.y)*Ne*zoom}); }
  }, [E]),
    (0, C.useEffect)(() => {
      let e = O.current;
      if (!e) return;
      let t = () => ae((e) => e + 1),
        n = (e) => {
          (e.preventDefault(), Me(1));
        };
      return (
        e.addEventListener(`contextrestored`, t),
        e.addEventListener(`contextlost`, n),
        () => {
          (e.removeEventListener(`contextrestored`, t),
            e.removeEventListener(`contextlost`, n));
        }
      );
    }, []));
  let We = (e, t) => {
    let n = O.current.getBoundingClientRect();
    return {
      x: (e - n.left - M.w / 2 - Re) / Pe + cameraX,
      y: (t - n.top - M.h / 2 - ze + Fe) / Pe + cameraY,
    };
  };
  (0, C.useEffect)(() => {
    let a = O.current;
    if (!a) return;
    let o = a.getContext(`2d`);
    if (!o) return;
    let s = Math.min(window.devicePixelRatio || 1, 1.5);
    ((a.width = M.w * s), (a.height = M.h * s));
    let d = 0,
      f = 0,
      p = -1,
      m = new Map(),
      swBuildings = e,
      swWalls = new Map([...e,...i].filter(b=>b.kind===`wall`||b.kind===`gate`||!b.kind).map(b=>[`${b.x},${b.y}`,b])),
      swFrameUnits = new Map(),
      swLastPaint = 0,
      h = e.find((e) => e.kind === `keep`),
      g = h
        ? e
            .filter((e) => e.id !== h.id && e.kind !== `wall`)
            .map((n) => Cu(Su(h, e, t), Su(n, e, t), e, t))
        : [],
      C = (e, t, n, r) => {
        let i = vu(e, t);
        (o.beginPath(),
          o.moveTo(i.x, i.y - 25),
          o.lineTo(i.x + 49, i.y),
          o.lineTo(i.x, i.y + 25),
          o.lineTo(i.x - 49, i.y),
          o.closePath(),
          (o.fillStyle = n),
          o.fill(),
          (o.strokeStyle = r),
          (o.lineWidth = 1.5),
          o.stroke());
      },
      w = (e, t = 1) => {
        if(e.kind===`wall`||e.kind===`gate`){ const fall=ye.current.find(v=>v.kind===`fall`&&v.x===e.x&&v.y===e.y); SWDrawWall(o,e,swWalls,swFrameUnits,t,fall&&!ve.current?performance.now()-fall.born:2000); return; }
        let n = be.current.frame,
          i = vu(e.x, e.y),
          a = n?.units.find((t) => t.id === e.id),
          s = a && a.hp <= 0,
          l = $l(e),
          u = k.current[l.sheet] ? l : $l({ ...e, level: 1 }),
          d = k.current[u.sheet],
          f = e.kind === `wall` || e.kind === `gate`,
          p = SWBuildingSize(e).width,
          m = SWBuildingSize(e).height;
        o.save();
        let h = [...ye.current]
            .reverse()
            .find((t) => t.x === e.x && t.y === e.y && t.kind === `build`),
          g = [...ye.current]
            .reverse()
            .find((t) => t.x === e.x && t.y === e.y && t.kind === `fall`);
        if (!ve.current && h) {
          let e = Math.min(1, (performance.now() - h.born) / 700),
            t = 1 + Math.sin(e * Math.PI) * 0.1;
          (o.translate(i.x, i.y), o.scale(t, t), o.translate(-i.x, -i.y));
        }
        if (s) {
          o.restore();
          SWDrawCollapse(o,e,k.current,i,g?performance.now()-g.born:2000,ve.current);
          return;
        }
        o.globalAlpha=t*(e.level===0?.55:1);
        const damageFilter=a&&a.hp<a.maxHp*.3?`saturate(.52) brightness(.68)`:a&&a.hp<a.maxHp*.58?`saturate(.74) brightness(.82)`:``;
        o.filter=(_&&!defending?`hue-rotate(340deg) `:``)+damageFilter||`none`;
        if (
          (d && o.drawImage(SWBuildingTile(e,k.current),i.x-160,i.y-320,320,360),
          o.restore(),
          SWDrawBuildingDamage(o,e,a,k.current,i,performance.now()/1000,ve.current),
          !(t < 1 || s))
        ) {
          if (
            (r === `azure` && [`keep`, `monument`].includes(e.kind)) ||
            (r === `crimson` &&
              [`keep`, `tower`, `barracks`, `monument`, `gate`].includes(
                e.kind,
              ))
          ) {
            let t = i.x + p * 0.37,
              n = i.y - (e.kind === `keep` ? 78 : 58),
              a = e.kind === `keep` ? 18 : 13,
              s = e.kind === `keep` ? 28 : 23;
            ((o.strokeStyle = `#e6ca84`),
              (o.lineWidth = 2),
              o.beginPath(),
              o.moveTo(t, i.y + 8),
              o.lineTo(t, n - 4),
              o.stroke(),
              (o.fillStyle = r === `crimson` ? `#b83b51` : `#7554bc`),
              o.beginPath(),
              o.moveTo(t, n),
              o.lineTo(t + a, n + 2),
              o.lineTo(t + a, n + s),
              o.lineTo(t + a / 2, n + s - 6),
              o.lineTo(t, n + s),
              o.closePath(),
              o.fill(),
              (o.strokeStyle = r === `azure` ? `#e5e4fa` : `#f3d28d`),
              (o.lineWidth = 1),
              o.stroke(),
              (o.fillStyle = `#f3d28d`),
              o.beginPath(),
              o.arc(t + a / 2, n + 9, 2.5, 0, Math.PI * 2),
              o.fill());
          }
          if (a && a.hp < a.maxHp && a.hp > 0)
            ((o.fillStyle = `#172237`),
              o.fillRect(i.x - 48 / 2, i.y - m * 0.77, 48, 5),
              (o.fillStyle = `#f06c5e`),
              o.fillRect(
                i.x - 48 / 2,
                i.y - m * 0.77,
                (48 * a.hp) / a.maxHp,
                5,
              ));
          else if (c === e.id || e.readyAt) {
            let t = e.readyAt ? `Building…` : `${Sl[e.kind].name} · ${e.level}`;
            o.font = `600 13px system-ui`;
            let n = o.measureText(t).width + 18;
            ((o.fillStyle = `#182338ed`),
              o.beginPath(),
              o.roundRect(i.x - n / 2, i.y + 13, n, 25, 6),
              o.fill(),
              (o.fillStyle = `#fff`),
              (o.textAlign = `center`),
              o.fillText(t, i.x, i.y + 30));
          }
        }
      },
      ee = (e, t, n, r, i, a, s = !1, c, l = !1, u, d = 1, swAttackPhase = 0) => {
        if(a&&u&&J[u]){const point=vu(e.x,e.y);SWDrawTroopRig14(o,{kind:u,level:d,x:point.x+(e.swHit?.x||0),y:point.y,scale:['ram','trebuchet','cannon'].includes(u)?1.25:1,heading:e.heading??(i?2.3:-.8),phase:ve.current?0:s?swAttackPhase:n,state:s?'attack':r?'walk':'idle',enemy:l});if(c!==undefined&&c<.85){o.fillStyle='#102936';o.fillRect(point.x-10,point.y-55,20,3);o.fillStyle=l?'#dc7368':'#7dcfc3';o.fillRect(point.x-10,point.y-55,20*Math.max(0,c),3)}return;}
        let f = vu(e.x, e.y),
          p = t === 7,
          m = u === `trebuchet` ? 72 : Zl[u] !== void 0 ? (u === `ram` || u === `knight` ? 56 : 48) : p ? 60 : a ? 52 : 35;
        ((o.fillStyle = `#16231944`),
          o.beginPath(),
          o.ellipse(f.x, f.y + 1, p ? 12 : 6, p ? 4 : 2.5, 0, 0, Math.PI * 2),
          o.fill(),
          o.save(),
          o.translate(f.x, f.y),
          i && o.scale(-1, 1),
          l && (o.filter = `hue-rotate(140deg) saturate(.8)`));
        if(e.swHit&&!ve.current){o.translate(e.swHit.x,e.swHit.y);o.rotate(e.swHit.angle);}
        let h = k.current.combat,
          g = k.current.people,
          _ = u === void 0 ? void 0 : Zl[u],
          v = 1 + Math.min(9, d - 1) * 0.022;
        if(a&&u!==`trebuchet`)o.scale(v,v);
        if(a)SWTroopTier(o,u||`infantry`,d,m,true);
        if(a&&u===`worker`){o.save();o.translate(-600,-175);SWDrawPaintedWorker(o,{sprite:0,id:0},{x:0,y:0,working:!r,flip:false},k.current,n,ve.current);o.restore();}
        else if(a&&u===`trebuchet`){SWDrawTrebuchet(o,d,n,r,s,swAttackPhase,k.current.trebuchet);}
        else if(a&&SWDrawPaintedUnit(o,u,k.current,m*.80,n,r,s,swAttackPhase,ve.current)){}
        else if (a && _ !== void 0 && k.current.arsenal) {
          let e = Yl.arsenal[_],
            t = u === `ram` || u === `knight` ? 56 : 48,
            i = (t * e[2]) / e[3];
          (ve.current ||
            (o.translate(
              s ? Math.sin(swAttackPhase * Math.PI) * 2 : 0,
              r ? -Math.abs(Math.sin(n * 9)) * 2 : 0,
            ),
            o.rotate(
              s ? Math.sin(swAttackPhase * Math.PI) * 0.025 : r ? Math.sin(n * 9) * 0.012 : 0,
            )),
            o.drawImage(k.current.arsenal, ...e, -i / 2, -t, i, t));
        } else if (a && h) {
          let e = t === 6 ? 1 : t === 7 ? 2 : t === 4 ? 3 : 0,
            i = ve.current
              ? 0
              : s
                ? 4 + Math.min(3, Math.floor(swAttackPhase * 4))
                : r
                  ? Math.floor(n * 8) % 4
                  : 0;
          r &&
            !ve.current &&
            (o.translate(0, -Math.abs(Math.sin(n * 8)) * 1.6),
            o.rotate(Math.sin(n * 8) * 0.02));
          if(s&&!ve.current)o.translate((e===3?-3:3)*Math.sin(swAttackPhase*Math.PI),0);
          let a = h.width / 8,
            c = h.height / 4,
            l = m * .75;
          o.drawImage(h, i * a, e * c, a, c, -l / 2, -m, l, m);
        } else if (g) {
          let e = g.width / 4,
            i = g.height / 2,
            a = r && !ve.current ? Math.abs(Math.sin(n * 9)) * 1.6 : 0;
          o.rotate(r && !ve.current ? Math.sin(n * 9) * 0.028 : 0);
          let s = p ? 37 : 24;
          o.drawImage(
            g,
            (t % 4) * e,
            Math.floor(t / 4) * i,
            e,
            i,
            -s / 2,
            -m - a,
            s,
            m,
          );
        }
        if(a&&u!==`trebuchet`)SWTroopTier(o,u||`infantry`,d,m,false);
        o.restore();
        c !== void 0 && c < .85 &&
          ((o.fillStyle = `#102136`),
          o.fillRect(f.x - 10, f.y - m - 5, 20, 3),
          (o.fillStyle = l ? `#f06c5e` : `#61b8ff`),
          o.fillRect(f.x - 10, f.y - m - 5, 20 * Math.max(0, c), 3));
      },
      E = (e, t, n, r = !1, i = !1, a, s = 1) => {
        let c = vu(e.x, e.y),
          l = k.current.commanders,
          u = Ql.commanders[Oc[t].sprite + (i ? 3 : 0)];
        (o.save(),
          o.translate(c.x, c.y),
          (o.fillStyle =
            s >= 8 ? `#ebc15b99` : s >= 5 ? `#b9d8f099` : `#dfbb6580`),
          o.beginPath(),
          o.ellipse(0, 1, 13 + s, 5 + s * 0.3, 0, 0, Math.PI * 2),
          o.fill(),
          (o.strokeStyle = s >= 8 ? `#f4d781` : `#d6eaff`),
          (o.lineWidth = 1));
        for (let e = 0; e < s; e++) {
          let t = (e * Math.PI * 2) / s;
          (o.beginPath(),
            o.moveTo(Math.cos(t) * (15 + s), Math.sin(t) * (6 + s * 0.3)),
            o.lineTo(Math.cos(t) * (18 + s), Math.sin(t) * (7 + s * 0.3)),
            o.stroke());
        }
        r &&
          !ve.current &&
          (o.translate(0, -Math.abs(Math.sin(n * 7)) * 2),
          o.rotate(Math.sin(n * 7) * 0.025));
        let d = 65 * (1 + 0.018 * (s - 1)),
          f = (d * u[2]) / u[3];
        (l && o.drawImage(l, ...u, -f / 2, -d, f, d),
          o.restore(),
          SWDrawCommanderAccessory(o,c,fleetAppearance||appearance,d,n),
          a === void 0
            ? ((o.fillStyle = `#17304bed`),
              o.beginPath(),
              o.roundRect(c.x - 36, c.y + 7, 72, 17, 5),
              o.fill(),
              (o.fillStyle = `#f9df9b`),
              (o.font = `700 10px system-ui`),
              (o.textAlign = `center`),
              o.fillText(Oc[t].name.split(` `)[0], c.x, c.y + 19))
            : ((o.fillStyle = `#15233b`),
              o.fillRect(c.x - 16, c.y - 72, 32, 4),
              (o.fillStyle = `#f4cb67`),
              o.fillRect(c.x - 16, c.y - 72, 32 * Math.max(0, a), 4)));
      },
      D = (r) => {
        if (((d = requestAnimationFrame(D)), document.hidden || r - f < 15))
          return;
        const swDelta = Math.min(.05, Math.max(0,(r-swLastPaint)/1000)); swLastPaint=r;
        f = r;
        let {
            frame: a,
            nextFrame: O,
            battleTime: re,
            playbackSpeed: ie,
            received: ae,
          } = be.current,
          A = Math.min(O?.time ?? re + .5, re + (Math.max(0, r - ae) / 1e3) * ie);
        swFrameUnits=new Map(a?.units.map(u=>[u.id,u])||[]);
        if (a && a.time !== p) {
          if (p >= 0 && a.time > p) {
            for (let e of a.units) {
              let t = m.get(e.id);
              if(t>0&&e.hp<=0&&!e.building&&!e.naval){const last=swRenderPositions.current.get(e.id);ye.current.push({kind:`unit-fall`,x:last?.x??e.x,y:last?.y??e.y,unit:e,flip:last?.flip||false,enemy:defending?e.side===`attack`:e.side===`defend`,born:r});}
              if (
                (t === void 0 &&
                  e.side === `attack` &&
                  !e.building &&
                  ye.current.push({
                    x: e.x,
                    y: e.y,
                    born: r,
                    label: ``,
                    kind: `deploy`,
                  }),
                t !== void 0 && t !== e.hp)
              ) {
                let n = Math.round(e.hp - t);
                (n > 0 || e.hp <= 0 && (e.building||e.naval)) &&
                  ye.current.push({
                    x: e.x,
                    y: e.y,
                    born: r,
                    targetKind:e.kind,
                    label:
                      e.hp <= 0 && e.building
                        ? ``
                        : `${n > 0 ? `+` : ``}${n}`,
                    kind:
                      e.hp <= 0 && e.naval ? `sink` : e.hp <= 0 && e.building
                        ? `fall`
                        : n > 0
                          ? `heal`
                          : `damage`,
                  });
              }
            }
            ye.current = ye.current.slice(-20);
          }
          ((m = new Map(a.units.map((e) => [e.id, e.hp]))), (p = a.time));
        }
        let j = ve.current ? 0 : r / 1e3;
        if (
          (o.setTransform(s, 0, 0, s, 0, 0),
          o.clearRect(0, 0, M.w, M.h),
          k.current.land)
        ) {
          let e = Math.max(M.w / 1200, (M.h + (_ ? 2*Math.abs(Fe) : 0)) / 800) * (_ ? Pe / Ne : 1);
          o.drawImage(
            _ && !navalSupport ? k.current.land : k.current.coastLand || k.current.land,
            (M.w - 1200 * e) / 2 + (_ ? Re : 0),
            (M.h - 800 * e) / 2 + (_ ? ze-Fe : 0),
            1200 * e,
            800 * e,
          );
        }
        (o.save(),
          o.translate(M.w / 2 + Re, M.h / 2 + ze - Fe),
          o.scale(Pe, Pe),
          o.translate(-cameraX, -cameraY),
          k.current.land
            ? (_ && !navalSupport) || o.drawImage(k.current.coastLand || k.current.land, 0, 0, 1200, 800)
            : ((o.fillStyle = `#4c684a`), o.fillRect(0, 0, 1200, 800)),
          (o.lineJoin = `round`),
          (o.lineCap = `round`));
        if(_&&battleInput14?.campaignType==='sea')SWDrawSeaGround14(o,k.current.coastLand||k.current.land);
        else if(k.current.worldLand)SWDrawWorldTerrain(o,k.current.worldLand,{left:cameraX+(-M.w/2-Re)/Pe,top:cameraY+(-M.h/2-ze+Fe)/Pe,right:cameraX+(M.w/2-Re)/Pe,bottom:cameraY+(M.h/2-ze+Fe)/Pe});
        else if(_)SWDrawBattleTerrain(o,k.current.coastLand||k.current.land,cameraX,cameraY,M.w,M.h,Ne,Fe,true);
        else SWDrawCapitalTerrain(o,k.current.coastLand||k.current.land,{left:cameraX+(-M.w/2-Re)/Pe,top:cameraY+(-M.h/2-ze+Fe)/Pe,right:cameraX+(M.w/2-Re)/Pe,bottom:cameraY+(M.h/2-ze+Fe)/Pe});
        if(battleInput14?.campaignType==='sea')SWDrawSea14(o,j,battleInput14.defense,k.current.coastLand);
        if(layoutOverlay14)SWDrawLayoutOverlay14(o,{buildings:e,provinces:t,terrain:b},layoutOverlay14);
        const navalUnits=a?.units.filter(unit=>unit.naval)||[];
        for(const unit of navalUnits){
          const sink=ye.current.find(event=>event.kind===`sink`&&event.x===unit.x&&event.y===unit.y),next=O?.units.find(v=>v.id===unit.id)||unit,progress=O&&O.time>a.time?Math.max(0,Math.min(1,(A-a.time)/(O.time-a.time))):0,position=unit.hp>0?{...unit,x:unit.x+(next.x-unit.x)*progress,y:unit.y+(next.y-unit.y)*progress}:unit;
          SWDrawNavalUnit(o,position,k.current,j,unit.sunkAt!==undefined?(A-unit.sunkAt)*1000:sink?r-sink.born:2000,ve.current);SWDrawEscortCue(o,position,a?.objective,j,Pe,ve.current);
        }
        if(navalSupport&&battleInput14?.campaignType!=='sea'&&!navalUnits.length&&!a?.units.some(unit=>unit.id===`naval-`+navalSupport.id)){
          SWDrawNavalUnit(o,{...navalSupport,x:-3,y:3,hp:1,maxHp:1,side:`attack`},k.current,j,2000,ve.current);
        }
        if (!_ && typeof SWDrawCoast === `function`) SWDrawCoast(o,{buildings:e,fleet:x,naval:k.current.naval,ships13:k.current.ships13,land:k.current.land,coastLand:k.current.coastLand,time:j,placing:l});
        if(!_)SWDrawHarborAppearance(o,e,x,appearance,j,k.current);
        if(l||S)for (let e of t) {
          let t = Ac.find((t) => t.id === e.id);
          if (t) for (let e of t.tiles) C(e.x, e.y, `#e5d39a17`, `#e5c58660`);
        }
        if (i.length)
          for (let n of i) {
            let r =
              Vc({ provinces: t }, n.x, n.y) &&
              !b.some(
                (e) =>
                  e.x === n.x &&
                  e.y === n.y &&
                  [`tree`, `rock`].includes(e.kind),
              ) &&
              !e.some((e) => e.x === n.x && e.y === n.y);
            C(
              n.x,
              n.y,
              r ? `#74a6ed88` : `#d5424277`,
              r ? `#dceaff` : `#ffbaba`,
            );
          }
        SWDrawRoads(o,b,_?g:[],appearance);
        if (T && (swDeploymentState.current.reserveCount===undefined||swDeploymentState.current.reserveCount>0)){if(battleInput14?.campaignType==='sea')SWDrawLandingEdge14(o,battleInput14,Pe,swPreview.current);else SWDrawDeploymentEdge(o,Ue,Pe,swPreview.current);}
        if(swOrderAck.current){const age=r-swOrderAck.current.born;if(age<420){const point=vu(swOrderAck.current.x,swOrderAck.current.y),progress=age/420;o.save();o.globalAlpha=(1-progress)*.8;o.strokeStyle=`#d9e5cf`;o.lineWidth=1.4/Pe;o.beginPath();o.ellipse(point.x,point.y,(9+progress*10)/Pe,(4+progress*5)/Pe,0,0,Math.PI*2);o.stroke();o.restore();}else swOrderAck.current=null;}
        if(a&&!ve.current)for(const breach of ye.current.filter(event=>event.kind===`fall`&&(event.targetKind===`wall`||event.targetKind===`gate`))){
          const point=vu(breach.x,breach.y),age=(r-breach.born)/1800;o.save();o.strokeStyle=`rgba(231,194,122,${(1-age)*.65})`;o.lineWidth=2/Pe;o.beginPath();o.ellipse(point.x,point.y+2,17+age*12,7+age*5,0,0,Math.PI*2);o.stroke();o.restore();
        }
        if (l || S)
          for (let n = -2; n < 18; n++)
            for (let r = 0; r < 18; r++)
              (typeof SWCanPlace === `function` && l ? SWCanPlace({buildings:e,terrain:b,provinces:t,premium:{ornaments:appearance.ornaments||[]}},Sl[l]?l:e.find(v=>v.id===l)?.kind,n,r,l) : Vc({ provinces:t },n,r)) &&
                !e.some((e) => e.x === n && e.y === r) &&
                C(
                  n,
                  r,
                  ce?.x === n && ce?.y === r ? `#75b6ff80` : `#ffffff15`,
                  ce?.x === n && ce?.y === r ? `#fff` : `#ffffff55`,
                );
        let oe = e.find((e) => e.id === c);
        if (
          oe &&
          (C(oe.x, oe.y, `#4a9bff44`, `#eff8ff`), Cc.includes(oe.kind))
        ) {
          let e = vu(oe.x, oe.y);
          (o.save(),
            o.translate(e.x, e.y),
            o.scale(1, 0.52),
            o.beginPath(),
            o.arc(0, 0, sl(oe).range * 73, 0, Math.PI * 2),
            (o.strokeStyle = `#ffffff70`),
            o.setLineDash([7, 7]),
            o.stroke(),
            o.restore());
        }
        let se = e.map((e) => ({ depth: e.x + e.y, draw: () => {w(e);if(!e.readyAt&&(!a||!(swFrameUnits.get(e.id)?.hp<=0))){if(!_)SWDrawCivicProject(o,e,city,k.current,j);SWDrawTownAppearance(o,e,appearance,j);}} }));
        if(!_){for(const ornament of appearance.ornaments||[])se.push({depth:ornament.x+ornament.y+.05,draw:()=>SWDrawOrnament(o,ornament,appearance,j)});if(appearance.landmark?.stage>0){const landmark=appearance.landmark;se.push({depth:(landmark.x??-1)+(landmark.y??7),draw:()=>SWDrawLandmark(o,landmark,appearance,j,ve.current,k.current)});}}
        for (let t of b.filter((e) =>
          [`tree`, `rock`, `garden`].includes(e.kind),
        ))
          e.some((e) => e.x === t.x && e.y === t.y) ||
            se.push({
              depth: t.x + t.y,
              draw: () => {
                if(t.kind===`garden`){SWDrawGarden(o,t,j,k.current);return;}
                let e = k.current.naval;
                if (!e) return;
                let n =
                    Yl.naval[t.kind === `tree` ? 4 : t.kind === `rock` ? 5 : 7],
                  r = vu(t.x, t.y),
                  i = t.kind === `tree` ? 70 : t.kind === `rock` ? 55 : 90,
                  a = (i * n[3]) / n[2];
                o.drawImage(e, ...n, r.x - i / 2, r.y - a + 12, i, a);
              },
            });
        ((pe.current = []), (we.current = null));
        for (let e of t) {
          let t = Ac.find((t) => t.id === e.id);
          t && !swBuildings.some(building=>building.x===t.anchor.x&&building.y===t.anchor.y) &&
            se.push({
              depth: t.anchor.x + t.anchor.y,
              draw: () => {
                w({
                  id: `outpost-${t.id}`,
                  kind: `monument`,
                  ...t.anchor,
                  level: e.level,
                });
                let n = vu(t.anchor.x, t.anchor.y);
                ((o.font = `700 12px system-ui`),
                  (o.textAlign = `center`),
                  (o.lineWidth = 3),
                  (o.strokeStyle = `#24382b`),
                  (l||S)&&o.strokeText(`${t.name} · ${e.level}`, n.x, n.y + 29),
                  (o.fillStyle = `#fff1c6`),
                  (l||S)&&o.fillText(`${t.name} · ${e.level}`, n.x, n.y + 29));
              },
            });
        }
        if (!a && !_ && n && h) {
          let r = Su(h, e, t),
            i = { x: r.x + 0.23, y: r.y + 0.22 };
          ((we.current = vu(i.x, i.y)),
            se.push({
              depth: i.x + i.y + 0.2,
              draw: () => E(i,n,j,!1,!1,void 0,te),
            }));
        }
        if (!a && !_)
          for (let e of Ee.filter(person=>!person.soldier&&person.id<15&&(person.sprite!==5||person.id<4))) {
            let t = e.soldier?Tu(e,j):SWCitizenPosition(e,j);
            if (!t) continue;
            let n = vu(t.x, t.y);
            (pe.current.push({
              x: n.x,
              y: n.y - 17,
              depth: t.x + t.y + 0.1,
              c: e,
            }),
              se.push({
                depth: t.x + t.y + 0.1,
                draw: () => !e.soldier ? SWDrawCitizen(o,e,t,k.current.people,j,ve.current,k.current) :
                  ee(
                    t,
                    e.sprite,
                    j + e.id,
                    t.moving,
                    t.flip,
                    e.soldier,
                    !1,
                    void 0,
                    !1,
                    e.unitKind,
                    ne[e.unitKind] || 1,
                  ),
              }));
          }
        if (a) {
          let e =
            O && O.time > a.time
              ? Math.max(0, Math.min(1, (A - a.time) / (O.time - a.time)))
              : 0;
          for (let t of a.units.filter((e) => !e.building && !e.naval && e.hp > 0)) {
            let n = O?.units.find((e) => e.id === t.id) || t,
              target = { x: t.x + (n.x - t.x) * e, y: t.y + (n.y - t.y) * e },
              previous = swRenderPositions.current.get(t.id),
              blend = ve.current ? 1 : 1-Math.exp(-24*swDelta),
              r = previous && Math.hypot(target.x-previous.x,target.y-previous.y)<2 ? {x:previous.x+(target.x-previous.x)*blend,y:previous.y+(target.y-previous.y)*blend} : target,
              motionChanged = previous && Math.hypot(t.x-(previous.frameX??t.x),t.y-(previous.frameY??t.y))>.008,
              i = Math.hypot(n.x - t.x, n.y - t.y) > 0.008 || (!O&&(motionChanged||performance.now()<(previous?.movingUntil||0))),
              o = [...a.shots,...(O?.shots||[])].find(
                (e) =>
                  (e.firedAt===undefined||A>=e.firedAt-.12)&&(e.impactAt===undefined||A<e.impactAt+.24)&&
                  (e.sourceId?e.sourceId===t.id:(e.kind === t.kind || t.kind === `hero` || t.kind===`healer`&&e.kind===`heal`)) &&
                  Math.hypot(e.x - t.x, e.y - t.y) < 0.8,
              ),
              s = o ? o.tx - o.ty < t.x - t.y : O&&i ? n.x - n.y < t.x - t.y : motionChanged ? t.x-t.y<previous.frameX-previous.frameY : previous?.flip || false,
              attackElapsed = (t.cooldown || 1.2) - (t.nextAttack - A),
              attackPhase = o?.impactAt!==undefined?Math.max(0,Math.min(1,(A-o.impactAt+.18)/.36)):Math.max(0,Math.min(1,attackElapsed/.48)),
              attacking = !!o || attackElapsed>=0&&attackElapsed<.48,
              c =
                t.kind === `archer`
                  ? 6
                  : t.kind === `cavalry`
                    ? 7
                    : t.kind === `cannon`
                      ? 4
                      : 5;
            r.heading=o?Math.atan2(o.ty-t.y,o.tx-t.x):i?Math.atan2(n.y-t.y,n.x-t.x):previous?.heading??-.8;
            const hit=(a.events||[]).find(event=>event.type===`impact`&&event.targetId===t.id&&A>=event.time&&A-event.time<.20);if(hit){const strength=Math.sin((A-hit.time)/.20*Math.PI);r.swHit={x:(t.x>=hit.x?1:-1)*strength*1.6,y:strength*.6,angle:strength*.018};}
            swRenderPositions.current.set(t.id,{...r,flip:s,frameX:t.x,frameY:t.y,movingUntil:motionChanged?performance.now()+550:previous?.movingUntil||0});
            se.push({
              depth: r.x + r.y + 0.1,
              draw: () =>
                t.kind === `hero` && t.commander
                  ? E(
                      r,
                      t.commander,
                      A,
                      i,
                      attacking,
                      t.hp / t.maxHp,
                      t.level,
                    )
                  : ee(
                      r,
                      c,
                      A + Number(t.id.replace(/\D/g, ``)) * 0.13,
                      i,
                      s,
                      !0,
                      attacking,
                      t.hp / t.maxHp,
                      defending ? t.side === `attack` : t.side === `defend`,
                      t.kind,
                      t.level,
                      attackPhase,
                    ),
            });
          }
        }
        if(a)for(const unit of a.units.filter(unit=>unit.sagaEscort&&!unit.naval&&unit.hp>0))se.push({depth:unit.x+unit.y+.11,draw:()=>SWDrawEscortCue(o,unit,a.objective,j,Pe,ve.current)});
        for(const event of ye.current.filter(event=>event.kind===`unit-fall`))se.push({depth:event.x+event.y+.08,draw:()=>SWDrawUnitFall(o,event,k.current,r-event.born,ve.current)});
        if ((se.sort((e, t) => e.depth - t.depth).forEach((e) => e.draw()), !a))
          for (let t of e.filter(
            (e) => e.level > 0 && [`cottage`, `forge`, `keep`].includes(e.kind),
          )) {
            let e = vu(t.x, t.y);
            for (let n = 0; n < 3; n++) {
              let r = (j * 0.23 + n / 3 + t.x * 0.1) % 1;
              ((o.fillStyle = `rgba(237,233,221,${0.22 * (1 - r)})`),
                o.beginPath(),
                o.ellipse(
                  e.x + 14 + Math.sin(r * 3) * 9,
                  e.y - 82 - r * 40,
                  3 + r * 9,
                  3 + r * 5,
                  0,
                  0,
                  Math.PI * 2,
                ),
                o.fill());
            }
          }
        if (a) {
          if(a.events!==undefined){
            if(A<swPresentationTime.current-.1)swPresentationEvents.current.clear();swPresentationTime.current=A;
            for(const event of [...(a.events||[]),...(O?.events||[])])if(event.time<=A&&!swPresentationEvents.current.has(event.id))swPresentationEvents.current.set(event.id,{...event,targetNaval:a.units.some(unit=>unit.id===event.targetId&&unit.naval),born:r-Math.max(0,A-event.time)*1000});
            if(swPresentationEvents.current.size>192)for(const [id,event] of swPresentationEvents.current)if(r-event.born>2400)swPresentationEvents.current.delete(id);
            const shown=new Set();for(const shot of [...(a.shots||[]),...(O?.shots||[])]){const id=shot.sourceId+':'+shot.targetId+':'+shot.impactAt;if(shown.has(id))continue;shown.add(id);const start=shot.firedAt??(shot.impactAt??A)-.35,end=shot.impactAt??a.time;if(A>=start&&A<end)SWDrawProjectile(o,{...shot,presentationOnly:true},Math.max(0,Math.min(.779,(A-start)/Math.max(.01,end-start)*.78)),ve.current);}
            for(const event of swPresentationEvents.current.values())SWDrawCombatEvent(o,event,r-event.born,ve.current);
          }else{const progress=Math.max(0,Math.min(1,(A-a.time)/Math.max(.25,(O?.time||a.time+.5)-a.time)));for(const shot of a.shots)SWDrawProjectile(o,shot,progress,ve.current);}
        }
        if (
          ((ye.current = ye.current.filter(
            (e) => r - e.born < (e.kind===`unit-fall`?2600:e.kind === `build` ? 2200 : (e.kind === `fall`||e.kind===`sink`) ? 1800 : 1100),
          )),
          !ve.current)
        )
          for (let e of ye.current.filter(e=>e.kind!==`fall`&&e.kind!==`sink`&&e.kind!==`unit-fall`)) {
            let t = (r - e.born) / (e.kind === `build` ? 2200 : 1100),
              n = vu(e.x, e.y),
              i = e.kind === `build`;
            (o.save(), (o.globalAlpha = Math.max(0, 1 - t)));
            let a =
              e.kind === `heal`
                ? `#a4efb2`
                : e.kind === `damage`
                  ? `#fff4d7`
                  : e.kind === `fall`
                    ? `#ffbc70`
                    : `#ffdc81`;
            if (i) {
              ((o.strokeStyle = a),
                (o.lineWidth = 2.5 * (1 - t)),
                o.beginPath(),
                o.ellipse(n.x, n.y, 18 + t * 72, 9 + t * 36, 0, 0, Math.PI * 2),
                o.stroke());
              for (let e = 0; e < 16; e++) {
                let r = (e * Math.PI * 2) / 16,
                  i = t * 75;
                ((o.fillStyle = e % 3 == 0 ? `#fff` : a),
                  o.fillRect(
                    n.x + Math.cos(r) * i,
                    n.y - 20 + Math.sin(r) * i * 0.45 - t * 38,
                    3,
                    4,
                  ));
              }
            }
            if (e.kind === `deploy` || e.kind === `fall`) {
              ((o.strokeStyle = e.kind === `deploy` ? `#b9e6ff` : `#d4bc92`),
                (o.lineWidth = 2 * (1 - t)),
                o.beginPath(),
                o.ellipse(n.x, n.y, 8 + t * 30, 4 + t * 14, 0, 0, Math.PI * 2),
                o.stroke());
              for (let r = 0; r < 7; r++) {
                let i = (r * Math.PI * 2) / 7,
                  a = t * (e.kind === `fall` ? 45 : 20);
                ((o.fillStyle = e.kind === `fall` ? `#c0a78666` : `#b0d6e455`),
                  o.beginPath(),
                  o.ellipse(
                    n.x + Math.cos(i) * a,
                    n.y + Math.sin(i) * a * 0.4 - t * 12,
                    3 + t * 7,
                    2 + t * 5,
                    0,
                    0,
                    Math.PI * 2,
                  ),
                  o.fill());
              }
            }
            ((o.font = `800 ${i ? 16 : 15}px system-ui`),
              (o.textAlign = `center`),
              (o.lineWidth = 3),
              (o.strokeStyle = `#193047`));
            let s = n.y - (i ? 108 : 54) - t * 28;
            (o.strokeText(e.label, n.x, s),
              (o.fillStyle = a),
              o.fillText(e.label, n.x, s),
              o.restore());
          }
        if (
          (l === `wall` &&
            i.forEach((e, t) => {
              let n = i[t + 1] || i[t - 1];
              w(
                {
                  id: `wall-ghost-` + t,
                  kind: `wall`,
                  ...e,
                  level: 1,
                  axis: n && n.x !== e.x ? `x` : `y`,
                },
                0.65,
              );
            }),
          u && !ornamentGhost &&
            l !== `wall` &&
            (C(u.x,u.y,SWCanPlace({buildings:e,terrain:b,provinces:t,premium:{ornaments:appearance.ornaments||[]}},u.kind,u.x,u.y,l)?`#377df260`:`#b94a4960`,SWCanPlace({buildings:e,terrain:b,provinces:t,premium:{ornaments:appearance.ornaments||[]}},u.kind,u.x,u.y,l)?`#b7d8ff`:`#eca39b`),
            w({ id: `ghost`, kind: u.kind, x: u.x, y: u.y, facing:u.facing||0, axis:u.axis||(u.facing%2?`y`:`x`), level: 1 }, 0.65)),
          !a && y)
        )
          for (let [e, t, n] of [
            [`left`, -0.4, 6.6],
            [`center`, 7, 7],
            [`right`, 6.6, -0.4],
          ]) {
            let r = vu(t, n);
            (o.beginPath(),
              o.arc(r.x, r.y, 22, 0, Math.PI * 2),
              (o.fillStyle = v === e ? `#347cf5` : `#19283ee6`),
              o.fill(),
              (o.strokeStyle = `#fff`),
              (o.lineWidth = 2),
              o.stroke(),
              (o.fillStyle = `#fff`),
              (o.textAlign = `center`),
              (o.font = `700 14px system-ui`),
              o.fillText(e[0].toUpperCase(), r.x, r.y + 5));
          }
        if(ornamentGhost){const valid=SWCanPlace({buildings:e,terrain:b,provinces:t,premium:{ornaments:appearance.ornaments||[]}},`monument`,ornamentGhost.x,ornamentGhost.y);C(ornamentGhost.x,ornamentGhost.y,valid?`#377df240`:`#b94a4960`,valid?`#b7d8ff`:`#eca39b`);SWDrawOrnament(o,ornamentGhost,appearance,j,true);}
        o.restore();
      };
    return ((d = requestAnimationFrame(D)), () => cancelAnimationFrame(d));
  }, [
    Te,
    JSON.stringify(city),
    JSON.stringify(appearance),
    JSON.stringify(fleetAppearance),
    JSON.stringify(ornamentGhost),
    xe,
    Se,
    n,
    r,
    Ee,
    c,
    l,
    u,
    ie,
    Pe,
    oe,
    M,
    ce,
    !!p,
    _,
    v,
    y,
    Be,
    Ve,
    S,
    T,
    te,
    He,
    navalSupport?.id,
    navalSupport?.kind,
    defending,layoutOverlay14,battleInput14?.campaignType,
  ]);
  let Ge = (t, n) => {
    let r = We(t, n),
      i = yu(r.x, r.y);
    if (T) {
      const target=SWDeploymentTarget(Ue,r,Pe);
      target&&swDeploy.current?.(target.x,target.y);
      return;
    }
    if (S) {
      w?.(Math.round(i.x), Math.round(i.y));
      return;
    }
    if (!_ && typeof SWCoastHit === `function` && SWCoastHit(r.x,r.y,e,x,Date.now())) {
      D?.();
      return;
    }
    if (
      !l &&
      we.current &&
      Math.abs(r.x - we.current.x) < 25 &&
      r.y < we.current.y + 10 &&
      r.y > we.current.y - 70
    ) {
      o?.();
      return;
    }
    if (y)
      for (let [e, t, n] of [
        [`left`, -0.4, 6.6],
        [`center`, 7, 7],
        [`right`, 6.6, -0.4],
      ]) {
        let i = vu(t, n);
        if (Math.hypot(i.x - r.x, i.y - r.y) < 40) {
          y(e);
          return;
        }
      }
    let a = yu(r.x, r.y);
    if (l) {
      f?.(Math.round(a.x), Math.round(a.y));
      return;
    }
    let s = [...e]
      .sort((e, t) => t.x + t.y - e.x - e.y)
      .find((e) => {
        let t = vu(e.x, e.y);
        return (
          Math.abs(r.x - t.x) <
            (e.kind === `keep`
              ? 65
              : e.kind === `wall` || e.kind === `gate`
                ? 30
                : 50) &&
          r.y >
            t.y -
              (e.kind === `keep`
                ? 150
                : e.kind === `wall` || e.kind === `gate`
                  ? 65
                  : 105) &&
          r.y < t.y + 12
        );
      });
    if (!_) {
      let e = [...pe.current]
        .sort((e, t) => t.depth - e.depth)
        .find((e) => Math.hypot(e.x - r.x, e.y - r.y) < 13);
      if (e && (!s || e.depth > s.x + s.y)) {
        fe(e.c);
        return;
      }
    }
    (fe(null), s && d?.(s));
  };
  const swFireDeployment=(target,silent=true)=>{
    const state=swDeploymentState.current,gesture=swGesture.current;
    if(!state.active||!target||gesture.multi||gesture.mode===`cancelled`||state.reserveCount===0){swCancelHold();return false;}
    const accepted=swDeploy.current?.(target.x,target.y,{silent});
    if(accepted===false){swCancelHold();return false;}
    swOrderAck.current={...target,born:performance.now()};
    if(!gesture.deployedTiles)gesture.deployedTiles=new Set();gesture.deployedTiles.add(`${target.x},${target.y}`);
    gesture.held=true;gesture.lastTime=performance.now();gesture.lastTile=`${target.x},${target.y}`;
    return true;
  };
  SWInstallPointers14();
  const bridge14=C.useRef(null);bridge14.current={
    active:()=>swDeploymentState.current.active,
    target:(x,y)=>{const rect=O.current?.getBoundingClientRect();if(!rect||x<rect.left||x>rect.right||y<rect.top||y>rect.bottom||document.elementFromPoint(x,y)!==O.current)return null;return SWDeploymentTarget14(battleInput14,Ue,We(x,y),Pe)},
    fire:(target,kind)=>{const accepted=swDeploy.current?.(target.x,target.y,{silent:true,kind});if(accepted)swOrderAck.current={...target,born:performance.now()};return accepted},
    preview:target=>{swPreview.current=target;},
    pinch:points=>{if(points.length<2)return;swCancelHold();swGesture.current.multi=true;swGesture.current.mode='cancelled';me.current=null;swPreview.current=null;const [a,b]=points,cx=(a.x+b.x)/2,cy=(a.y+b.y)/2,rect=O.current.getBoundingClientRect();if(!_e.current)_e.current={distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),zoom:A,world:We(cx,cy)};const base=_e.current,zoom=Math.max(swMinZoom,Math.min(3.2,base.zoom*Math.hypot(a.x-b.x,a.y-b.y)/base.distance)),scale=Ne*zoom;j(zoom);se({x:cx-rect.left-M.w/2-(base.world.x-cameraX)*scale,y:cy-rect.top-M.h/2+Fe-(base.world.y-cameraY)*scale});},
    endPinch:points=>{if(swGesture.current.multi){ge.current=new Map(points);if(!points.length){_e.current=null;me.current=null;swGesture.current.multi=false;swGesture.current.mode='idle';}}}
  };
  C.useEffect(()=>{if(T){SWGestureBridge14.surface=bridge14.current;return()=>{if(SWGestureBridge14.surface===bridge14.current)SWGestureBridge14.surface=null}}},[T]);
  if(T)SWGestureBridge14.surface=bridge14.current;
  return (0, F.jsxs)(`div`, {
    ref: re,
    className: `map-holder`,
    "data-camera-zoom": A,
    "data-camera-min-zoom": swMinZoom,
    "data-world-bounds": `${swWorld.left},${swWorld.top},${swWorld.right},${swWorld.bottom}`,
    "data-camera-scale": Pe,
    "data-camera-center": `${cameraX},${cameraY}`,
    "data-camera-pan": `${Re},${ze-Fe}`,
    children: [
      Ae > 0 &&
        (0, F.jsxs)(`div`, {
          className: `art-status`,
          children: [
            `Some artwork could not load.`,
            (0, F.jsx)(`button`, {
              onClick: () => ke((e) => e + 1),
              children: `Reload artwork`,
            }),
          ],
        }),
      (0, F.jsx)(`canvas`, {
        ref: O,
        "aria-label": _
          ? `Enemy stronghold and fighting troops`
          : `Your village with working citizens and patrolling soldiers. Drag to explore; select a building to manage it.`,
        role: `img`,
        onPointerDown: (event) => {
          if(event.pointerType===`mouse`&&event.button!==0)return;
          event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);
          ge.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
          if(SWGestureBridge14.points.size>=2)for(const[id,point]of SWGestureBridge14.points)ge.current.set(id,point);
          if(ge.current.size>=2){
            swCancelHold();swPreview.current=null;swGesture.current.multi=true;me.current=null;Ce.current=null;
            if(l===`wall`)a?.(swGesture.current.wall);
            const points=[...ge.current.values()],cx=(points[0].x+points[1].x)/2,cy=(points[0].y+points[1].y)/2;
            _e.current={distance:Math.max(1,Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y)),zoom:A,world:We(cx,cy)};return;
          }
          if(swAllPointers.current.size>1){swCancelHold();swGesture.current.multi=true;swGesture.current.mode=`cancelled`;me.current=null;Ce.current=null;swPreview.current=null;return;}
          if(navalTool14){const world=We(event.clientX,event.clientY),tile=yu(world.x,world.y);if(navalTool14.type==='focus'){const target=p?.units.filter(u=>u.side==='defend'&&u.hp>0&&Math.hypot(u.x-tile.x,u.y-tile.y)<1.5).sort((a,b)=>Math.hypot(a.x-tile.x,a.y-tile.y)-Math.hypot(b.x-tile.x,b.y-tile.y))[0];if(target)onNavalMap14?.(tile.x,tile.y,target.id)}else if(tile.x<=-2.4&&!(tile.x>-6.7&&tile.x<-5.7&&tile.y>3.05&&tile.y<5.85))onNavalMap14?.(Math.max(-12,Math.min(-2.4,tile.x)),Math.max(-2,Math.min(11,tile.y)));swGesture.current.mode='cancelled';return;}
          if(T&&SWBeginPointer14(event,selectedTroop,'map')){swGesture.current.mode='shared-deploy';me.current=null;return;}
          const world=We(event.clientX,event.clientY),tile=yu(world.x,world.y),target=null;
          const canDeploy=target&&(reserveCount===undefined||reserveCount>0);
          Object.assign(swGesture.current,{multi:false,held:false,wall:[...i],mode:canDeploy?`pending-deploy`:l===`wall`?`wall`:`pan`,target,path:target?[target]:[],started:performance.now(),lastTime:0,lastTile:null,deployedTiles:new Set()});
          swPreview.current=canDeploy?target:null;
          me.current={x:event.clientX,y:event.clientY,ox:Re,oy:ze,moved:false};
          if(l===`wall`)Ce.current=i[0]||{x:Math.round(tile.x),y:Math.round(tile.y)};
          if(canDeploy){
            swGesture.current.hold=setTimeout(()=>{
              if(swGesture.current.multi||ge.current.size!==1||!swGesture.current.mode.endsWith(`deploy`))return;
              if(!swFireDeployment(swGesture.current.target))return;
              swGesture.current.mode=`hold-deploy`;
              swGesture.current.repeat=setInterval(()=>swFireDeployment(swGesture.current.target),140);
            },260);
          }
        },
        onPointerMove: (event) => {
          if(ge.current.size&&!ge.current.has(event.pointerId))return;
          if(ge.current.has(event.pointerId))ge.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
          if(T&&SWGestureBridge14.points.size>1)return;
          if(swGesture.current.mode==='shared-deploy')return;
          if(swGesture.current.multi){
            if(ge.current.size<2||!_e.current)return;
            const points=[...ge.current.values()],pinch=_e.current,rect=O.current.getBoundingClientRect();
            const zoom=Math.max(swMinZoom,Math.min(3.2,pinch.zoom*Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y)/pinch.distance));
            const scale=Ne*zoom,cx=(points[0].x+points[1].x)/2-rect.left,cy=(points[0].y+points[1].y)/2-rect.top;
            j(zoom);se({x:cx-M.w/2-(pinch.world.x-cameraX)*scale,y:cy-M.h/2+Fe-(pinch.world.y-cameraY)*scale});return;
          }
          if(me.current){
            const dx=event.clientX-me.current.x,dy=event.clientY-me.current.y,gesture=swGesture.current;
            if(Math.abs(dx)+Math.abs(dy)>8)me.current.moved=true;
            if(gesture.mode.endsWith(`deploy`)){
              const target=SWDeploymentTarget(Ue,We(event.clientX,event.clientY),Pe);gesture.target=target;swPreview.current=target;
              if(target&&(gesture.path.at(-1)?.x!==target.x||gesture.path.at(-1)?.y!==target.y))gesture.path.push(target);
              if(me.current.moved){
                if(!target&&!gesture.held&&gesture.path.length===1){swCancelHold();gesture.mode=`pan`;se({x:Math.max(swMinPanX,Math.min(swMaxPanX,me.current.ox+dx)),y:Math.max(swMinPanY,Math.min(swMaxPanY,me.current.oy+dy))});return;}
                gesture.mode=`paint-deploy`;
                if(target&&performance.now()-gesture.started>=260&&performance.now()-gesture.lastTime>100)swFireDeployment(target);
              }
              return;
            }
            if(l===`wall`&&Ce.current&&me.current.moved){const world=We(event.clientX,event.clientY),tile=yu(world.x,world.y);a?.(Xc(Ce.current,{x:Math.round(tile.x),y:Math.round(tile.y)}));return;}
            if(S&&w&&me.current.moved){const world=We(event.clientX,event.clientY),tile=yu(world.x,world.y),key=Math.round(tile.x)+','+Math.round(tile.y);if(swGesture.current.paint14!==key){swGesture.current.paint14=key;w(Math.round(tile.x),Math.round(tile.y))}return;}
            if(me.current.moved)se({x:Math.max(swMinPanX,Math.min(swMaxPanX,me.current.ox+dx)),y:Math.max(swMinPanY,Math.min(swMaxPanY,me.current.oy+dy))});
          }else if(l){const world=We(event.clientX,event.clientY),tile=yu(world.x,world.y);le({x:Math.round(tile.x),y:Math.round(tile.y)});}
        },
        onPointerUp: (event) => {
          swCancelHold();ge.current.delete(event.pointerId);
          const gesture=swGesture.current;
          if(!gesture.multi&&me.current){
            if(gesture.mode.endsWith(`deploy`)){
              if(me.current.moved){
                // Placements commit under the finger; release adds no trail.
              }else if(!gesture.held)swFireDeployment(gesture.target,false);
            }else if(gesture.mode!==`cancelled`&&!me.current.moved){
              if(l===`wall`){const world=We(event.clientX,event.clientY),tile=yu(world.x,world.y);a?.(Xc(Ce.current||tile,{x:Math.round(tile.x),y:Math.round(tile.y)}));}
              else Ge(event.clientX,event.clientY);
            }
          }
          swPreview.current=null;me.current=null;Ce.current=null;
          if(!ge.current.size){_e.current=null;if(!swAllPointers.current.size){gesture.multi=false;gesture.mode=`idle`;}}
        },
        onPointerCancel: () => {
          swCancelHold();swPreview.current=null;if(l===`wall`)a?.(swGesture.current.wall);
          me.current=null;Ce.current=null;ge.current.clear();_e.current=null;swGesture.current.multi=swAllPointers.current.size>0;swGesture.current.mode=`cancelled`;
        },
      }),
      P &&
        !l &&
        !p &&
        (0, F.jsxs)(`div`, {
          className: `citizen-card`,
          children: [
            (0, F.jsx)(De, { size: 20 }),
            (0, F.jsxs)(`div`, {
              children: [
                (0, F.jsxs)(`strong`, {
                  children: [
                    P.name,
                    ` `,
                    (0, F.jsx)(`span`, { children: P.role }),
                  ],
                }),
                (0, F.jsx)(`p`, { children: P.activity }),
              ],
            }),
            (0, F.jsx)(`button`, {
              "aria-label": `Close citizen details`,
              onClick: () => fe(null),
              children: (0, F.jsx)(je, { size: 16 }),
            }),
          ],
        }),
      (0, F.jsxs)(`div`, {
        className: `map-controls`,
        children: [
          (0, F.jsx)(`button`, {
            "aria-label": `Center map`,
            onClick: () => {
              if(_&&be.current.frame){
                const units=be.current.frame.units.filter(unit=>unit.hp>0&&!unit.building&&!unit.naval),points=units.map(unit=>vu(unit.x,unit.y));
                if(points.length){
                  const center={x:points.reduce((sum,p)=>sum+p.x,0)/points.length,y:points.reduce((sum,p)=>sum+p.y,0)/points.length};
                  const spread=Math.max(180,...points.map(p=>Math.hypot(p.x-center.x,(p.y-center.y)*1.7))),zoom=Math.max(1.2,Math.min(2.2,Math.min(M.w,Math.max(140,M.h-swBattleBottom))/(spread*2.5*Ne)));
                  j(zoom);se({x:(cameraX-center.x)*Ne*zoom,y:(cameraY-center.y)*Ne*zoom});return;
                }
              }
              j(_ ? 1.2 : 1);se({ x: 0, y: 0 });
            },
            children: (0, F.jsx)(ue, { size: 20 }),
          }),
        ],
      }),
    ],
  });
}
