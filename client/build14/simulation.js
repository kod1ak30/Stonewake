// @ts-nocheck
// Recovered as an ES module for build 15. Preserve saved-state and replay semantics.
import { SWCreateShip14, SWFleetUnits14, SWNavalStep, SWOrders14, SWSeaEnemyUnits14, SWSeaObjective14, SWSeaStep14, SWValidateShipOrders14 } from "./naval.js";
import { Cc, J, Nl, Oc, SWApplyTroopStats, SWEnemyNavalUnits, SWMedicHeals, SWMedicTarget, SWNavalStrike, SWNavalTarget, SWNavalUnit, SWSagaObjective, SWSagaSpawn, SWSagaStep, SWTroopDamageFactor, SWTroopIncomingFactor, SWTroopSplash, dl, fl, jl, ll, ml, sl, ul, wl } from "../../frontend/core/rules.js";
function gl(e) {
  if(e.navalVersion===4)e={...e,shipOrders14:SWValidateShipOrders14(e,e.shipOrders14||[])};
  const swSea=e.campaignType==='sea'&&e.navalVersion===4;
  const swModern=e.presentationVersion===12,swSagaMode=e.saga?.mode;let swEventId=0,swEvents=[];
  const swTelemetry=e.defenseTelemetryVersion===1?{towerDamage:0,wallDamageAbsorbed:0,wallDelaySeconds:0,attackersDefeated:0}:null;
  const swPathBounds=e.combatVersion>=11?fl(e.defense):{minX:-5,minY:-5,maxX:14,maxY:14};
  const swMedicAssignments = new Map();
  const swMedicRules = e.healerTacticsVersion === 1;
  let swNavalFired = false;
  const swAbilities = e.troopAbilitiesVersion === 1;
  let t = [],
    n = e.seed >>> 0,
    r = () => ((n = (1664525 * n + 1013904223) >>> 0), n / 4294967296);
  for (let n of e.defense.buildings) {
    let e = sl(n),
      i = Cc.includes(n.kind),
      a = i
        ? e.hp
        : (n.kind === `keep`
            ? 1050
            : n.kind === `wall`
              ? 500
              : n.kind === `gate`
                ? 330
                : 300) *
          (1 + (n.level - 1) * 0.35);
    t.push({
      id: n.id,
      side: `defend`,
      kind: n.kind,
      x: n.x,
      y: n.y,
      hp: a,
      maxHp: a,
      damage: i ? e.damage : n.kind === `keep` ? 7 + 1.5 * n.level : 0,
      range: i ? e.range : 2.3,
      speed: 0,
      cooldown: i ? e.cooldown : 1.6,
      nextAttack: r(),
      building: !0,
      level: n.level,
      specialty: n.specialty,
    });
  }
  const swFleet=swSea?SWFleetUnits14(e):[];
  const swNaval=swSea?swFleet[0]:SWNavalUnit(e);if(swSea)t.push(...swFleet);else if(swNaval)t.push(swNaval);
  const swEnemyNavy=swSea?SWSeaEnemyUnits14(e):SWEnemyNavalUnits(e);t.push(...swEnemyNavy);
  if(swSea&&e.seaMode==='convoy'){const convoy=SWCreateShip14({id:'relief',kind:'cog',level:2},'attack');Object.assign(convoy,{id:'relief-convoy',x:-8,y:-1,hp:650,maxHp:650,damage:0,sagaEscort:true});t.push(convoy);}
  if(swSea)for(const unit of t)if(unit.id==='shore-battery'){unit.range=7;unit.damage=18+4*unit.level;unit.cooldown=2.2;}
  const swEscort=e.saga?SWSagaSpawn(e):null;if(swEscort)t.push(swEscort);
  if(e.saga?.version===12){for(const unit of t){if(e.saga.mode==='escort'&&unit.id==='shore-battery'){unit.hp=unit.maxHp=850;unit.damage=28;unit.range=8;unit.cooldown=1.8;}if(e.saga.mode==='blockade'&&unit.shipId==='flagship'){unit.hp=unit.maxHp=950;unit.damage=55;unit.cooldown=6;}if(e.saga.mode==='blockade'&&unit.kind==='keep'){unit.hp=unit.maxHp=2200;}if(e.saga.mode==='rescue'&&unit.id==='prison')unit.hp=unit.maxHp=650;}}
  let i = swSea?SWOrders14(e,e.orders||[]):ml(e, e.orders || []),
    a = 0,
    o = (n, i) => {
      if (n.kind === `hero`) {
        let r = e.commander,
          i = Oc[r.id],
          a =
            i.hp * (1 + (r.level - 1) * 0.15) * (r.gear === `armor` ? 1.25 : 1);
        t.push({
          id: `commander`,
          side: `attack`,
          kind: `hero`,
          commander: r.id,
          x: n.x,
          y: n.y,
          hp: a,
          maxHp: a,
          damage:
            i.damage *
            (1 + (r.level - 1) * 0.12) *
            (r.gear === `blade` ? 1.15 : 1) *
            e.bonus,
          range: i.range,
          speed: i.speed,
          cooldown: 1.1,
          nextAttack: n.time,
          building: !1,
          level: r.level,
        });
        return;
      }
      let a = J[n.kind],
        o = Math.max(1, Math.min(10, e.unitLevels?.[n.kind] || 1)),
        s = a.hp * (1 + 0.16 * (o - 1));
      t.push({
        id: `a-${i}`,
        side: `attack`,
        kind: n.kind,
        x: n.x + (r() - 0.5) * 0.25,
        y: n.y + (r() - 0.5) * 0.25,
        hp: s,
        maxHp: s,
        damage: a.damage * e.bonus * (1 + 0.14 * (o - 1)),
        range: a.range,
        speed: a.speed,
        cooldown: a.cooldown,
        nextAttack: n.time + r() * 0.35,
        building: !1,
        level: o,
      });
      if(swAbilities)SWApplyTroopStats(t[t.length-1]);
    },
    s = new Map(t.filter((e) => e.building).map((e) => [dl(e.x, e.y), e])),
    c = Math.min(
      10,
      2 +
        e.defense.buildings.filter((e) => e.kind === `barracks`).length * 2 +
        Math.floor(e.defense.level / 2),
    );
  for (let n = 0; n < c; n++) {
    let i = [
      { x: 3, y: 4 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
      { x: 3, y: 2 },
      { x: 1, y: 3 },
    ].find((e) => !s.has(dl(e.x, e.y))) || { x: 0, y: 3 };
    t.push({
      id: `guard-${n}`,
      side: `defend`,
      kind: `infantry`,
      x: i.x + (n % 2) * 0.23,
      y: i.y + Math.floor(n / 2) * 0.18,
      hp: 95 + e.defense.level * 16,
      maxHp: 95 + e.defense.level * 16,
      damage: 8 + e.defense.level * 1.2,
      range: 0.85,
      speed: 0.8,
      cooldown: 1.4,
      nextAttack: r(),
      building: !1,
      level: e.defense.level,
    });
  }
  let l = new Map(),
    u = new Map(),
    d = 0,
    f = new Map(),
    p = (e, t) => {
      let n = s.get(dl(e, t));
      return n && n.hp > 0 ? n : void 0;
    },
    m = (e, t, n, r = !1) => {
      if (n > 1.3) return !0;
      let i = ul(e, t),
        a = Math.ceil(i * 5);
      for (let n = 1; n < a; n++) {
        let i = p(e.x + ((t.x - e.x) * n) / a, e.y + ((t.y - e.y) * n) / a);
        if (i && i.id !== t.id && !(r && ll(i))) return !1;
      }
      return !0;
    },
    h = (e, t) => {
      let n = { x: Math.round(e.x), y: Math.round(e.y) },
        r = `${d}:${e.id}:${dl(n.x, n.y)}:${t.id}:${dl(t.x, t.y)}`,
        i = f.get(r);
      if (i) return i;
      let a = [n],
        o = new Map([[dl(n.x, n.y), 0]]),
        s = new Map(),
        c,
        l = (n) => Math.max(0, ul(n, t) - e.range - (t.building ? 0.35 : 0));
      for (let n = 0; a.length && n < (swPathBounds.maxX>14||swPathBounds.maxY>14?1600:400); n++) {
        let n = 0;
        for (let e = 1; e < a.length; e++)
          o.get(dl(a[e].x, a[e].y)) + l(a[e]) <
            o.get(dl(a[n].x, a[n].y)) + l(a[n]) && (n = e);
        let r = a.splice(n, 1)[0],
          i = dl(r.x, r.y);
        if (
          ul(r, t) <= e.range + (t.building ? 0.35 : 0) &&
          m(r, t, e.range, e.side === `attack`)
        ) {
          c = r;
          break;
        }
        for (let [t, n] of [
          [0, -1],
          [-1, 0],
          [1, 0],
          [0, 1],
        ]) {
          let c = { x: r.x + t, y: r.y + n };
          if (c.x < swPathBounds.minX || c.y < swPathBounds.minY || c.x > swPathBounds.maxX || c.y > swPathBounds.maxY) continue;
          let l = p(c.x, c.y),
            u = 0;
          if (l)
            if (e.side === `defend` && l.kind === `gate`) u = 0;
            else if (e.side === `attack` && ll(l))
              u = (l.hp / Math.max(10, e.damage)) * 0.35;
            else continue;
          let d = dl(c.x, c.y),
            f = o.get(i) + 1 + u;
          f < (o.get(d) ?? 1 / 0) &&
            (o.set(d, f),
            s.set(d, r),
            a.some((e) => e.x === c.x && e.y === c.y) || a.push(c));
        }
      }
      let u = [];
      if (c) {
        let e = c;
        for (let t = 0; t < 210 && dl(e.x, e.y) !== dl(n.x, n.y); t++) {
          u.unshift(e);
          let t = s.get(dl(e.x, e.y));
          if (!t) break;
          e = t;
        }
      }
      return (f.set(r, u), u);
    },
    g = (e, t) => {
      let n = `${d}:${t.id}:${dl(t.x, t.y)}`,
        r = u.get(e.id);
      if (r?.signature === n && r.points.length) return r.points;
      let i = h(e, t).map((e) => ({ ...e })),
        a = { x: Math.round(e.x), y: Math.round(e.y) };
      return (
        i.length && ul(a, e) > 0.05 && !p(a.x, a.y) && i.unshift(a),
        u.set(e.id, { signature: n, points: i }),
        i
      );
    },
    _ = [],
    v = [],
    y = 0,
    b = !1,
    x = !1,
    S = -1,
    C,
    swAllUnits=t,
    w = (e, t, source) => {
      if (e.hp <= 0) return;
      if(e.navalVersion===4&&y<(e.coverUntil||0))t*=.65;
      e.side === `attack` && !e.naval &&
        y < S &&
        C &&
        C.hp > 0 &&
        ul(e, C) < 3.6 &&
        (t *= 0.5);
      if(swAbilities)t*=SWTroopIncomingFactor(e,swAllUnits);
      if(swSagaMode==='blockade'&&e.shipId==='flagship'&&swAllUnits.some(u=>u.kind==='keep'&&u.building&&u.hp>0))t*=.55;
      if(swSagaMode==='escort'&&e.id==='shore-battery'&&source?.naval)t*=.08;
      let n = e.hp;
      ((e.hp = Math.max(0, n - t)),
        n > 0 && e.hp === 0 && e.building && (d++, f.clear()));
      if(swModern){const actual=n-e.hp;if(actual>0)swEvents.push({id:'event-'+swEventId++,type:e.hp===0?(e.building?'breach':'death'):'impact',sourceId:source?.id,targetId:e.id,kind:source?.kind||'impact',targetKind:e.kind,x:source?.x??e.x,y:source?.y??e.y,tx:e.x,ty:e.y,time:y,amount:Math.round(actual)});}
      if(swTelemetry){const damage=n-e.hp;if(e.side==='defend'&&e.building&&ll(e))swTelemetry.wallDamageAbsorbed+=damage;if(e.side==='attack'&&source?.side==='defend'&&source.building&&Cc.includes(source.kind))swTelemetry.towerDamage+=damage;if(e.side==='attack'&&!e.building&&!e.naval&&e.kind!=='hero'&&n>0&&e.hp===0)swTelemetry.attackersDefeated++;}
      if(e.navalVersion>=3&&n>0&&e.hp===0){e.sunkAt=y;e.vx=0;e.vy=0;}
    },
    T = (t, n) => {
      if (y < t.nextAttack) return;
      let r =
        t.damage *
        (t.kind === `cannon` && n.building
          ? 2
          : t.kind === `ram` && ll(n)
            ? 4
            : t.kind === `spearman` && [`cavalry`, `knight`].includes(n.kind)
              ? 2
              : 1);
      r*=SWTroopDamageFactor(t,n);
      if(swModern){t.lastAttackAt=y;t.targetId=n.id;t.heading=Math.atan2(n.y-t.y,n.x-t.x);}
      (t.kind === `crossbow` && n.kind === `shieldbearer` && (r /= 0.65),
        t.side === `attack` && n.building && (r *= e.structureBonus || 1),
        t.side === `attack` && b && y < (e.rallyAt || 0) + 7 && (r *= 1.3),
        w(n, r, t),
        (t.nextAttack = y + t.cooldown),
        v.push({
          ...(swModern?{sourceId:t.id,targetId:n.id,firedAt:Math.max(0,y-(['cannon','trebuchet','archer','crossbow','grenadier'].includes(t.kind)?.35:.12)),impactAt:y}:{}),
          x: t.x,
          y: t.y,
          tx: n.x,
          ty: n.y,
          side: t.side,
          kind:
            t.kind === `hero`
              ? t.commander === `ranger`
                ? `archer`
                : t.commander === `engineer`
                  ? `cannon`
                  : `infantry`
              : t.kind,
        }));
      if(t.abilitiesVersion===1){for(const hit of SWTroopSplash(t,n,swAllUnits))w(hit.unit,r*hit.fraction,t);t.attackCount++;}
      if(e.combatVersion>=11&&t.building&&!n.naval){const radius=sl(t).splash;if(radius>0)for(const other of swAllUnits)if(other.id!==n.id&&other.side!==t.side&&!other.naval&&other.hp>0&&ul(other,n)<=radius)w(other,r*.55,t);}
    },
    ee = t.filter((e) => e.building && !ll(e)).length;
  for (let n = 0; n <= 480; n++) {
    y=n*.25;
    if(swSea)SWSeaStep14(e,t,y,i,o,swEvents);
    else for(;a<i.length&&i[a].time<=y;)(o(i[a],a),a++);
    if (
      ((C = t.find((e) => e.kind === `hero`)),
      e.rallyAt !== void 0 && !b && y >= e.rallyAt)
    ) {
      for (let e of t.filter((e) => e.side === `attack` && !e.naval && e.hp > 0))
        e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.3);
      b = !0;
    }
    if (C && C.hp > 0 && e.heroAt !== void 0 && !x && y >= e.heroAt) {
      x = !0;
      let n = e.commander?.gear === `manual` ? 1.4 : 1;
      if (C.commander === `captain`) {
        S = y + 6 * n;
        for (let e of t.filter(
          (e) => e.side === `attack` && !e.naval && e.hp > 0 && ul(e, C) < 3.6,
        ))
          e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.12 * n);
      } else {
        let e = t
          .filter(
            (e) =>
              e.side === `defend` &&
              e.hp > 0 &&
              (C.commander === `ranger` || ll(e) || Cc.includes(e.kind)),
          )
          .sort(
            (e, t) =>
              ul(e, C) +
              (Cc.includes(e.kind) ? -3 : 0) -
              (ul(t, C) + (Cc.includes(t.kind) ? -3 : 0)),
          );
        for (let t of e.slice(0, C.commander === `engineer` ? 1 : 3))
          (w(
            t,
            (C.commander === `engineer`
              ? 200 + C.level * 40
              : 80 + C.level * 15) * n,
          ),
            v.push({
              x: C.x,
              y: C.y,
              tx: t.x,
              ty: t.y,
              side: `attack`,
              kind: C.commander === `engineer` ? `cannon` : `archer`,
            }));
      }
    }
    if (!swNavalFired) {
      const strike = SWNavalStrike(e,t,y);
      if (strike) { swNavalFired = true; for (const hit of strike.hits) w(hit.unit,hit.damage); v.push(strike.shot); }
    }
    if(e.saga)SWSagaStep(e,t,y);
    let r = t.filter((e) => e.hp > 0);
    for (let n of r) {
      if (n.hp <= 0 || n.sagaEscort) continue;
      if(n.navalVersion>=3){const strike=SWNavalStep(n,t,y);if(strike){w(strike.target,strike.damage,n);for(const hit of strike.splash)w(hit.unit,hit.damage,n);v.push({...strike.shot,...(swModern?{firedAt:Math.max(0,y-.4),impactAt:y}: {})});if(swModern){n.lastAttackAt=y;n.targetId=strike.target.id;}}continue;}
      if(n.naval){const target=SWNavalTarget(n,t);if(target&&y>=n.nextAttack){w(target,n.damage);if(n.kind==='bombard')for(const other of t.filter(u=>u.id!==target.id&&u.side==='defend'&&u.hp>0&&ul(u,target)<=1.15))w(other,n.damage*.4);n.nextAttack=y+n.cooldown;v.push({x:n.x,y:n.y,tx:target.x,ty:target.y,side:n.side,kind:'naval'});}continue;}
      if (n.kind === `healer` && swMedicRules) {
        const ally = SWMedicTarget(n,t,swMedicAssignments,y);
        if (ally) {
          const previous = swMedicAssignments.get(n.id);
          n.healTargetId=ally.id;
          swMedicAssignments.set(n.id,{targetId:ally.id,until:previous?.targetId===ally.id?previous.until:y+2});
          const missing = ally.maxHp-ally.hp;
          if (missing>0 && ul(n,ally)<=n.range && y>=n.nextAttack) {
            for(const heal of SWMedicHeals(n,ally,t)){const before=heal.unit.hp;heal.unit.hp=Math.min(heal.unit.maxHp,heal.unit.hp+heal.amount);v.push({x:n.x,y:n.y,tx:heal.unit.x,ty:heal.unit.y,side:n.side,kind:`heal`,healerId:n.id,targetId:heal.unit.id,...(swModern?{firedAt:y,impactAt:y}: {})});if(swModern)swEvents.push({id:'event-'+swEventId++,type:'heal',sourceId:n.id,targetId:heal.unit.id,kind:'healer',x:n.x,y:n.y,tx:heal.unit.x,ty:heal.unit.y,time:y,amount:Math.round(heal.unit.hp-before)});}
            n.nextAttack=y+n.cooldown;
          } else if (ul(n,ally)>n.range*.8) {
            const route=g(n,ally),point=route[0];
            if(point&&!p(point.x,point.y)){const distance=ul(n,point),step=Math.min(n.speed*.25,distance);if(distance){n.x+=(point.x-n.x)/distance*step;n.y+=(point.y-n.y)/distance*step;if(ul(n,point)<.025)route.shift();}}
          }
        } else { swMedicAssignments.delete(n.id); delete n.healTargetId; }
        continue;
      }
      if (n.kind === `healer`) {
        let e = t.filter(
            (e) =>
              e.side === n.side && !e.building && e.hp > 0 && e.id !== n.id,
          ),
          r = e
            .filter((e) => e.hp < e.maxHp)
            .sort((e, t) => ul(n, e) - ul(n, t)),
          i = r[0] || e.sort((e, t) => ul(n, e) - ul(n, t))[0];
        if (i) {
          if (r.length && ul(n, i) <= n.range && y >= n.nextAttack)
            ((i.hp = Math.min(i.maxHp, i.hp + 20 * (1 + 0.14 * (n.level - 1)))),
              (n.nextAttack = y + n.cooldown),
              v.push({
                x: n.x,
                y: n.y,
                tx: i.x,
                ty: i.y,
                side: n.side,
                kind: `heal`,
              }));
          else if (ul(n, i) > n.range * 0.8) {
            let e = g(n, i),
              t = e[0];
            if (t && !p(t.x, t.y)) {
              let r = ul(n, t),
                i = Math.min(n.speed * 0.25, r);
              r &&
                ((n.x += ((t.x - n.x) / r) * i),
                (n.y += ((t.y - n.y) / r) * i),
                ul(n, t) < 0.025 && e.shift());
            }
          }
        }
        continue;
      }
      if (!n.damage) continue;
      let i = r.filter(
        (e) =>
          e.side !== n.side &&
          e.hp > 0 && (!e.naval || n.building || (e.navalVersion>=3&&n.range>=2&&ul(n,e)<=n.range+.35)) &&
          (n.side !== `attack` || !ll(e) || n.kind === `ram`),
      );
      if (!i.length) continue;
      let a = (e) =>
        n.kind === `ram` && ll(e)
          ? -12
          : n.kind === `knight` && Cc.includes(e.kind)
            ? -3
            : n.kind === `scout` &&
                [`farm`, `lumber`, `quarry`, `market`].includes(e.kind)
              ? -4
              : n.kind === `cannon` && !e.building
                ? 3
                : 0;
      i.sort((e, t) => ul(n, e) + a(e) - ul(n, t) - a(t));
      let o = i[0];
      if (n.building) {
        let e = sl(n).minRange,
          t =
            (swSagaMode==='escort'&&n.id==='shore-battery'&&y>=12?i.find(t=>t.sagaEscort&&ul(n,t)<=n.range):null) || i.find(
              (t) =>
                t.id === l.get(n.id) && ul(n, t) <= (t.naval?Math.max(t.navalVersion===3?5.75:7,n.range):n.range) && ul(n, t) >= e,
            ) || i.find((t) => ul(n, t) <= (t.naval?Math.max(t.navalVersion===3?5.75:7,n.range):n.range) && ul(n, t) >= e);
        (t && l.set(n.id, t.id), t && T(n, t));
        continue;
      }
      if (ul(n, o) <= n.range + (o.building ? 0.35 : 0) && m(n, o, n.range)) {
        if(swTelemetry&&n.side==='attack'&&ll(o))swTelemetry.wallDelaySeconds+=.25;
        T(n, o);
        continue;
      }
      let s = g(n, o);
      if (!s.length) {
        for (let e of i.slice(1, 5))
          if (((s = g(n, e)), s.length)) {
            o = e;
            break;
          }
      }
      if (!s.length) continue;
      let c = s[0],
        u = p(c.x, c.y),
        d = c,
        f = 0;
      if (u && n.side === `attack` && ll(u)) {
        if (ul(n, u) <= n.range + 0.35) {
          if(swTelemetry)swTelemetry.wallDelaySeconds+=.25;
          T(n, u);
          continue;
        }
        ((d = u), (f = n.range + 0.3));
      }
      let h = d.x - n.x,
        _ = d.y - n.y,
        x = Math.hypot(h, _),
        S =
          n.speed *
          0.25 *
          (n.side === `attack` && b && y < (e.rallyAt || 0) + 7 ? 1.25 : 1),
        C = Math.max(0, Math.min(S, x - f));
      x &&
        ((n.x += (h / x) * C),
        (n.y += (_ / x) * C),
        ul(n, c) < 0.025 && s.shift());
    }
    let s = t.filter((e) => !e.building && !e.naval && !e.sagaEscort && e.hp > 0);
    for (let e = 0; e < s.length; e++)
      for (let t = e + 1; t < s.length; t++) {
        let n = s[e],
          r = s[t],
          i = n.x - r.x,
          a = n.y - r.y,
          o = Math.hypot(i, a);
        const spacing = swMedicRules && n.kind === `healer` && r.kind === `healer` && n.side === r.side ? .9 : .38;
        if (o > 0.001 && o < spacing) {
          let e = (spacing - o) * 0.16;
          for (let [t, s] of [
            [n, 1],
            [r, -1],
          ]) {
            let n = t.x + (i / o) * e * s,
              r = t.y + (a / o) * e * s,
              c = p(n, r);
            (!c || (t.side === `defend` && c.kind === `gate`)) &&
              ((t.x = n), (t.y = r));
          }
        }
      }
    let c = t.filter((e) => e.building && !ll(e) && e.hp > 0).length,
      u = Math.round(((ee - c) / Math.max(1, ee)) * 100);
    if (
      (n % 2 == 0 &&
        (_.push({ time: y, units: jl(t), shots: v, destruction: u,...(swModern?{events:swEvents}:{}),...(swSea?{objective:SWSeaObjective14(e,t)}:e.saga?{objective:SWSagaObjective(e,t,y)}:{}) }), (v = []), (swEvents=[])),
      (t.filter((e) => e.side === `attack` && e.kind !== `hero` && !e.naval).length >=
        Object.values(e.army).reduce((e, t) => e + t, 0) &&
        !t.some((e) => e.side === `attack` && e.hp > 0)) ||
        (!e.saga && !swSea && c === 0) || (swSea&&(SWSeaObjective14(e,t).won||SWSeaObjective14(e,t).failed)) ||
        (e.saga && SWSagaObjective(e,t,y).complete) ||
        (e.retreatAt !== void 0 && y >= e.retreatAt))
    )
      break;
  }
  let E = t.find((e) => e.kind === `keep` && e.building),
    D = !!E && E.hp <= 0,
    te = Math.round(
      (t.filter((e) => e.building && !ll(e) && e.hp <= 0).length /
        Math.max(1, ee)) *
        100,
    ),
    ne = wl();
  for (let e of t)
    e.side === `attack` &&
      e.hp > 0 &&
      Object.hasOwn(ne, e.kind) &&
      ne[e.kind]++;
  for (let n of Object.keys(J))
    ne[n] += Math.max(
      0,
      (e.army[n] || 0) -
        t.filter((e) => e.side === `attack` && e.kind === n).length,
    );
  if(!Object.hasOwn(e.army,'trebuchet'))delete ne.trebuchet;
  return (
    _.push({ time: y, units: jl(t), shots: v, destruction: te,...(swModern?{events:swEvents}:{}),...(swSea?{objective:SWSeaObjective14(e,t)}:e.saga?{objective:SWSagaObjective(e,t,y,true)}:{}) }),
    {
      won: swSea?SWSeaObjective14(e,t).won:e.saga?SWSagaObjective(e,t,y,true).won:D,
      stars: swSea?(SWSeaObjective14(e,t).won?(te===100?3:2):+(te>=50)):e.saga?(SWSagaObjective(e,t,y,true).won?3:0):D ? (te === 100 ? 3 : 2) : +(te >= 50),
      ...(swSea?{objective:SWSeaObjective14(e,t)}:e.saga?{objective:SWSagaObjective(e,t,y,true)}:{}),
      destruction: te,
      survivors: ne,
      frames: _,
      duration: y,
      ...(swTelemetry?{defenseStats:Object.fromEntries(Object.entries(swTelemetry).map(([key,value])=>[key,key==='wallDelaySeconds'?Math.round(value*4)/4:Math.round(value)]))}:{}),
      ...(swSea?{landedTroops:i.filter(o=>o.landed14&&o.kind!=='hero').length,rescuedTroops:Nl(e.army)-i.filter(o=>o.landed14&&o.kind!=='hero').length,navalSurvivors:Object.fromEntries(swFleet.map(s=>[s.shipId,s.hp>0])),navalHealth:Object.fromEntries(swFleet.map(s=>[s.shipId,Math.max(0,s.hp/s.maxHp)]))}:swNaval?{navalSurvivors:{[swNaval.shipId]:swNaval.hp>0},navalHealth:{[swNaval.shipId]:Math.max(0,swNaval.hp/swNaval.maxHp)}}:{}),
      ...(swEnemyNavy.length?{enemyNavalSurvivors:Object.fromEntries(swEnemyNavy.map(ship=>[ship.shipId,ship.hp>0])),enemyNavalHealth:Object.fromEntries(swEnemyNavy.map(ship=>[ship.shipId,Math.max(0,ship.hp/ship.maxHp)]))}:{}),
    }
  );
}

export { gl };
