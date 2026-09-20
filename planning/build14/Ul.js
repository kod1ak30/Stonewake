function Ul(e, t, n = Date.now()) {
  let r = Y(e, n),
    i = Lc(r) >= Ic(r);
  if(SWPremiumAction(r,t,n)){r.revision++;return r;}
  if(SWCivicProjectAction(r,t,n)){r.revision++;return r;}
  if(t.type==='claimReserve'){SWClaimReserve(r);r.revision++;return r;}
  if (SWCityAction(r, t, n)) { r.revision++; return Y(r, n); }
  if (SWApplyTrade(r, t)) { r.revision++; return Y(r, n); }
  if (ApplyGemAction(r, t, n)) { r.revision++; return Y(r, n); }
  if (ol(r, t, n)) return (r.revision++, r);
  if (t.type === `walls`) {
    if (i) throw Error(`All construction crews are working.`);
    let e = t.tiles;
    if (!Array.isArray(e) || !e.length || e.length > 24)
      throw Error(`Draw between 1 and 24 wall segments.`);
    let a = new Set();
    for (let t = 0; t < e.length; t++) {
      let n = e[t];
      if (
        !n ||
        !Vc(r, n.x, n.y) ||
        al(r, n.x, n.y) ||
        r.buildings.some((e) => e.x === n.x && e.y === n.y) ||
        (r.premium?.ornaments||[]).some(o=>o.x===n.x&&o.y===n.y) ||
        a.has(`${n.x},${n.y}`)
      )
        throw Error(`Walls need empty plots in your territory.`);
      if (t && Math.abs(n.x - e[t - 1].x) + Math.abs(n.y - e[t - 1].y) !== 1)
        throw Error(`Draw one connected wall.`);
      a.add(`${n.x},${n.y}`);
    }
    if (SWBuildingCount(r,'wall') + e.length > SWBuildingLimit(r,'wall'))
      throw Error(`Wall limit reached. Upgrade your Keep to unlock more segments.`);
    Q(r, { gold: 4 * e.length, wood: 0, stone: 8 * e.length, food: 0 });
    let o = `wall-project-${n}-${r.revision}`;
    for (let t = 0; t < e.length; t++) {
      let i = e[t],
        a = e[t + 1] || e[t - 1];
      r.buildings.push({
        id: `${o}-${t}`,
        kind: `wall`,
        ...i,
        level: 0,
        targetLevel: 1,
        startedAt: n,
        readyAt: n + Zc(r, `wall`) * 1e3,
        projectId: o,
        axis: a && a.x !== i.x ? `x` : `y`,
        facing: a && a.x !== i.x ? 0 : 1,
      });
    }
  } else if (t.type === `gate`) {
    let e = r.buildings.find((e) => e.id === t.id);
    if (!e || e.kind !== `wall` || e.readyAt)
      throw Error(`Select a completed wall to add a gate.`);
    if (i) throw Error(`All construction crews are working.`);
    if (SWBuildingCount(r,'gate') >= SWBuildingLimit(r,'gate'))
      throw Error(`Gate limit reached. Upgrade your Keep to unlock more.`);
    (Q(r, Sl.gate.cost),
      (e.kind = `gate`),
      (e.targetLevel = e.level),
      (e.startedAt = n),
      (e.readyAt = n + Zc(r, `gate`) * 1e3));
  } else if (t.type === `rotate`) {
    let e = r.buildings.find((e) => e.id === t.id);
    if (!e) throw Error(`Choose a building, wall or gate.`);
    e.facing=(SWFacing(e.facing,e.axis===`y`?1:0)+1)%4;
    if(zc(e))e.axis=e.facing%2?`y`:`x`;
  } else if (t.type === `specialize`) {
    let e = r.buildings.find((e) => e.id === t.id);
    if (!e || e.kind !== `tower` || e.level < 2 || e.readyAt)
      throw Error(`Complete a level 2 watchtower first.`);
    if (![`ballista`, `volley`].includes(t.specialty || ``))
      throw Error(`Choose a tower specialization.`);
    if (e.specialty === t.specialty)
      throw Error(`This tower already has that specialization.`);
    (Q(r, { gold: 120, wood: 0, stone: 100, food: 0 }),
      (e.specialty = t.specialty));
  } else if (t.type === `developProvince`) {
    let e = r.provinces?.find((e) => e.id === t.id);
    if (!e || e.level >= 10)
      throw Error(`Choose an owned province below level 10.`);
    if (e.level >= Ml(r))
      throw Error(`Upgrade your keep before developing this outpost.`);
    (Q(r, Uc(e.level)), e.level++);
  } else if (t.type === `commander`) {
    let e = t.id;
    if (!Object.hasOwn(Oc, e)) throw Error(`Choose a commander.`);
    if (r.activeBattle) throw Error(`Your commander is on the battlefield.`);
    if (Ml(r) < Oc[e].unlock)
      throw Error(`Requires keep level ${Oc[e].unlock}.`);
    (Wc(r, e) ||
      (Q(r, { gold: 200, wood: 0, stone: 0, food: 80 }),
      (r.commanders = {
        ...r.commanders,
        [e]: { xp: 0, gear: `armor`, owned: [`armor`] },
      })),
      (r.commander = e));
  } else if (t.type === `gear`) {
    let e = t.id || r.commander || `captain`,
      n = Wc(r, e);
    if (!Object.hasOwn(Oc, e) || !n || !t.gear || !Object.hasOwn(kc, t.gear))
      throw Error(`Choose valid commander equipment.`);
    if (r.activeBattle) throw Error(`Change equipment after the battle.`);
    let i = { ...n, owned: [...n.owned] };
    (i.owned.includes(t.gear) || (Q(r, kc[t.gear].cost), i.owned.push(t.gear)),
      (i.gear = t.gear),
      (r.commanders = { ...r.commanders, [e]: i }));
  } else if (t.type === `claimCosmetic`) {
    let e = jc.find((e) => e.id === t.id);
    if (!e || r.cosmetics?.includes(e.id) || (r.season?.points || 0) < e.points)
      throw Error(`Earn this league reward first.`);
    ((r.cosmetics = [...(r.cosmetics || []), e.id]),
      e.id !== `monument` && (r.livery = e.id));
  } else if (t.type === `livery`) {
    if (t.id !== `default` && !r.cosmetics?.includes(t.id || ``))
      throw Error(`Earn this livery first.`);
    r.livery = t.id;
  } else if (t.type === `build`) {
    let e = t.kind;
    if (!Object.hasOwn(Sl, e) || e === `keep`)
      throw Error(`Choose a valid building.`);
    let a = Sl[e];

    if (e === `monument` && !r.cosmetics?.includes(`monument`))
      throw Error(`Earn the Victor’s standard in the weekly league.`);
    if (t.axis !== void 0 && ![`x`, `y`].includes(t.axis))
      throw Error(`Choose a valid orientation.`);
    if (Ml(r) < a.unlock) throw Error(`Requires keep level ${a.unlock}.`);
    if (i) throw Error(`Your builders are finishing another project.`);
    if (
      !SWCanPlace(r, e, t.x, t.y)
    )
      throw Error(e === `harbor` ? `Choose an empty coastal berth beside your capital.` : `Choose an empty land plot.`);
    if(SWBuildingCount(r,e)>=SWBuildingLimit(r,e))throw Error(`${a.name} limit reached (${SWBuildingLimit(r,e)} at Keep ${Ml(r)}).`);
    const facing=SWFacing(t.facing,t.axis==='y'?1:0);
    (Q(r, X(e)),
      r.buildings.push({
        id: `b-${n}-${r.revision}`,
        kind: e,
        x: t.x,
        y: t.y,
        level: 0,
        targetLevel: 1,
        startedAt: n,
        readyAt: n + Zc(r, e) * (1-Math.min(.3,SWCivicLevel(r,'workshop')*.03)) * 1e3,
        facing,
        ...(e === `wall` || e === `gate` ? { axis: facing%2 ? `y` : `x` } : {}),
      }));
  } else if (t.type === `upgrade`) {
    let e = r.buildings.find((e) => e.id === t.id);
    if (!e) throw Error(`Building not found.`);
    if (e.readyAt) throw Error(`This building is under construction.`);
    if (i) throw Error(`Your builders are finishing another project.`);
    if (e.level >= Sl[e.kind].max)
      throw Error(`This building is fully upgraded.`);
    if (e.kind !== `keep` && e.level >= Ml(r))
      throw Error(`Upgrade your keep first.`);
    if (
      e.kind === `keep` &&
      e.level === 1 &&
      !r.buildings.some((e) => e.kind === `barracks` && e.level > 0)
    )
      throw Error(`Complete a barracks before advancing your age.`);
    if (e.kind === `keep` && e.level === 2 && r.campaign < 2)
      throw Error(`Capture Stonecross before advancing to Age III.`);
    let a = $c(r, e);
    if (a) throw Error(a);
    if(xl.some(k=>X(e.kind,e.level+1)[k]>Fl(r)))throw Error('Expand your storehouses before this upgrade.');
    (Q(r, X(e.kind, e.level + 1)),
      (e.targetLevel = e.level + 1),
      (e.startedAt = n),
      (e.readyAt = n + Zc(r, e.kind, e.level + 1) * (1-Math.min(.3,SWCivicLevel(r,'workshop')*.03)) * 1e3));
  } else if (t.type === `move`) {
    let e = r.buildings.find((e) => e.id === t.id);
    if (!e) throw Error(`Building not found.`);
    if (
      !SWCanPlace(r, e.kind, t.x, t.y, e.id)
    )
      throw Error(e.kind === `harbor` ? `Move your shipyard to another coastal berth.` : `Choose an empty land plot.`);
    e.facing=SWFacing(t.facing,e.facing||0);if(zc(e))e.axis=e.facing%2?`y`:`x`;
    ((e.x = t.x), (e.y = t.y));
  } else if (t.type === `recruit`) {
    if (r.activeBattle)
      throw Error(`Finish your battle before recruiting more soldiers.`);
    let e = t.kind,
      n = J[e],
      i = t.count === void 0 ? 1 : t.count;
    if (!Object.hasOwn(J, e) || !Number.isInteger(i) || i < 1 || i > 10)
      throw Error(`Choose a valid troop count.`);
    if (!r.buildings.some((e) => e.kind === `barracks` && e.level > 0))
      throw Error(`Build a barracks first.`);
    if (Ml(r) < n.unlock) throw Error(`Requires keep level ${n.unlock}.`);
    if (
      e === `cannon` &&
      !r.buildings.some((e) => e.kind === `forge` && e.level > 0)
    )
      throw Error(`Build a foundry to train cannons.`);
    if (Nl(r.army) + i > Pl(r))
      throw Error(`Upgrade or build another barracks for more army capacity.`);
    (Q(r, Object.fromEntries(xl.map((e) => [e, n.cost[e] * i]))),
      (r.army[e] += i));
  } else if (t.type === `claim`) {
    let e = El.find((e) => e.id === t.id);
    if (!e || r.quests.includes(e.id) || !e.check(r))
      throw Error(`Complete this objective before claiming it.`);
    SWRequireRoom(r,e.reward);
    (r.quests.push(e.id), Ll(r, e.reward), r.gems += 8);
  } else if (t.type === `claimAchievement`) {
    let e = Dl.find((e) => e.id === t.id);
    if (!e || r.honors?.includes(e.id) || Ol(r, e) < e.target)
      throw Error(`Earn this achievement before collecting its reward.`);
    SWRequireRoom(r,e.reward);
    ((r.honors = [...(r.honors || []), e.id]), Ll(r, e.reward), r.gems += 15);
  } else if (t.type === `rename`) {
    let e = (t.name || ``).trim();
    if (e.length < 2 || e.length > 24 || /[<>\x00-\x1f]/.test(e))
      throw Error(`Use a kingdom name between 2 and 24 characters.`);
    r.name = e;
  } else if (t.type === `publish`) {
    if (!r.buildings.some((e) => e.kind === `tower` && e.level > 0))
      throw Error(`Complete a watchtower before publishing your defenses.`);
    r.published = !0;
  } else if (t.type === `unpublish`) r.published = !1;
  else if (t.type !== `tick`) throw Error(`Unknown action.`);
  return (r.revision++, r);
}