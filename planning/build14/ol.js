function ol(e, t, n) {
  if (t.type === `landscape`) {
    if (!Vc(e, t.x, t.y)) throw Error(`Choose a plot inside your territory.`);
    if (e.buildings.some((e) => e.x === t.x && e.y === t.y))
      throw Error(`Move the building before changing this plot.`);
    if((e.premium?.ornaments||[]).some(o=>o.x===t.x&&o.y===t.y))throw Error(`Return the decoration to your wardrobe before changing this plot.`);
    if (!Object.hasOwn(Tc, t.kind || ``))
      throw Error(`Choose a landscape tool.`);
    let n = t.kind,
      r = il(e, t.x, t.y),
      i = n === `clear` ? `grass` : n;
    if (r?.kind === i || n==='clear'&&!r) return true;
    return (
      Q(e, Tc[n].cost),
      n === `clear` &&
        r &&
        !r.harvested &&
        (r.kind === `tree` && Ll(e, { gold: 0, wood: 20, stone: 0, food: 0 }),
        r.kind === `rock` && Ll(e, { gold: 0, wood: 0, stone: 15, food: 0 })),
      (e.terrain = [
        ...(e.terrain || []).filter((e) => e.x !== t.x || e.y !== t.y),
        { x: t.x, y: t.y, kind: i, harvested: !0 },
      ]),
      !0
    );
  }
  if (t.type === `researchUnit`) {
    let r = t.kind;
    if (!Object.hasOwn(J, r)) throw Error(`Choose a troop.`);
    if (e.trainingResearch)
      throw Error(`A troop upgrade is already in progress.`);
    let i = el(e, r);
    if (i >= 10) throw Error(`Maximum troop level reached.`);
    if (i >= Ml(e))
      throw Error(`Upgrade your keep to unlock the next troop level.`);
    if (!e.buildings.some((e) => e.kind === `barracks` && e.level > 0))
      throw Error(`Complete a barracks first.`);
    if (Ml(e) < J[r].unlock) throw Error(`Unlock this troop first.`);
    return (
      Q(e, tl(e, r)),
      (e.trainingResearch = {
        kind: r,
        level: i + 1,
        readyAt: n + Math.ceil(120 * 1.7 ** (i - 1)) * 1e3,
      }),
      !0
    );
  }
  if (t.type === `buildShip`) {
    let r = t.kind;
    if (!Object.hasOwn(wc, r)) throw Error(`Choose a ship.`);
    let i = rl(e);
    if (i < wc[r].unlock) throw Error(`Requires a level ${wc[r].unlock} port.`);
    if ((e.fleet?.length || 0) >= Math.min(8, i + 1))
      throw Error(`Upgrade the port for another berth.`);
    if (e.fleet?.some((e) => e.readyAt || e.repairReadyAt))
      throw Error(`Your shipwright is working on another vessel.`);
    return (
      Q(e, nl(r)),
      (e.fleet = [
        ...(e.fleet || []),
        {
          id: `ship-${n}-${e.revision}`,
          kind: r,
          level: 0,
          targetLevel: 1,
          readyAt: n + wc[r].time * 1e3,
        },
      ]),
      !0
    );
  }
  if (t.type === `upgradeShip`) {
    let r = e.fleet?.find((e) => e.id === t.id);
    if (!r || r.readyAt || r.voyage || r.combatBattleId || r.wrecked || r.repairReadyAt)
      throw Error(`Choose an idle, completed ship.`);
    if (r.level >= 10) throw Error(`Maximum ship level reached.`);
    if (r.level >= rl(e)) throw Error(`Upgrade the port first.`);
    if (e.fleet?.some((e) => e.readyAt || e.repairReadyAt))
      throw Error(`Your shipwright is busy.`);
    return (
      Q(e, nl(r.kind, r.level + 1)),
      (r.targetLevel = r.level + 1),
      (r.readyAt = n + Math.ceil(wc[r.kind].time * 1.5 ** r.level) * 1e3),
      !0
    );
  }
  if (t.type === `voyage`) {
    let r = e.fleet?.find((e) => e.id === t.id),
      i = Ec.find((e) => e.id === t.kind);
    if (!r || !r.level || r.readyAt || r.voyage || r.combatBattleId || r.wrecked || r.repairReadyAt || !i)
      throw Error(`Choose a ready ship and sea route.`);
    if (
      rl(e) < i.unlock ||
      wc[r.kind].power * (1 + 0.22 * (r.level - 1)) < i.power
    )
      throw Error(`This ship needs more strength for that route.`);
    let a = 1 + 0.15 * (r.level - 1);
    return (
      (r.voyage = {
        route: i.id,
        startedAt: n,
        readyAt: n + Math.ceil(i.duration*(1-SWCivicBonuses(e).voyageSpeed)) * 1e3,
        reward: Object.fromEntries(
          xl.map((e) => [e, Math.round(i.reward[e] * a)]),
        ),
      }),
      !0
    );
  }
  if (t.type === `collectVoyage`) {
    let r = e.fleet?.find((e) => e.id === t.id);
    if (!r?.voyage || r.voyage.readyAt > n)
      throw Error(`This ship has not returned yet.`);
    SWRequireRoom(e,r.voyage.reward);
    return (Ll(e, r.voyage.reward), delete r.voyage, !0);
  }
  return !1;
}