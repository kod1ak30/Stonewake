function Y(e, t = Date.now()) {
  let n = jl(e);
  SWMigrateCoast(n);
  SWMigrateStorage(n);
  SWMigratePremium(n);
  SWCityTick(n, t);
  SWMigrateRaids(n,t);
  if (!n.gemVersion) { n.gemVersion = 1; n.gems = 100; }
  n.gems = Number.isSafeInteger(n.gems) && n.gems >= 0 ? n.gems : 0;
  if (!n.balanceVersion) {
    for (let e of Object.values(n.commanders || {}))
      e && (e.xp = Math.min(1440, Math.round(e.xp * 1.6)));
    n.balanceVersion = 2;
  }
  ((n.army = { ...wl(), ...n.army }),
    (n.unitLevels ||= {}),
    (n.fleet ||= []),
    (n.terrain ||= []),
    n.trainingResearch &&
      n.trainingResearch.readyAt <= t &&
      ((n.unitLevels[n.trainingResearch.kind] = n.trainingResearch.level),
      delete n.trainingResearch));
  for (const ship of n.fleet) if(ship.combatBattleId && ship.combatBattleId!==n.activeBattle) delete ship.combatBattleId;
  for (let e of n.fleet)
    e.readyAt &&
      e.readyAt <= t &&
      ((e.level = e.targetLevel || 1), delete e.readyAt, delete e.targetLevel);
  let r = Math.max(n.lastTick, t),
    i = Math.max(n.lastTick, r - 8 * 36e5),
    a = n.buildings
      .filter((e) => e.readyAt && e.readyAt <= r)
      .map((e) => e.readyAt)
      .sort((e, t) => e - t);
  for(const project of Object.values(n.city?.projects||{}))if(project.readyAt&&project.readyAt<=r)a.push(project.readyAt);
  if(n.city?.festivalUntil>i && n.city.festivalUntil<r)a.push(n.city.festivalUntil);a.sort((a,b)=>a-b);
  for (let e of [...a, r]) {
    let t = Math.max(i, e),
      r = Il(n, i),
      a = Fl(n);
    for (let e of xl)
      n.resources[e] = Math.min(a, n.resources[e] + (r[e] * (t - i)) / 6e4);
    for (let e of n.buildings)
      e.readyAt &&
        e.readyAt <= t &&
        ((e.level = e.targetLevel || 1),
        delete e.readyAt,
        delete e.targetLevel,
        delete e.projectId);
    SWCivicTick(n,t);
    SWMigrateRaids(n,t);
    i = t;
  }
  n.lastTick = r;
  let o = Pc(t);
  return (
    n.season?.id !== o.id &&
      (n.season = { id: o.id, points: 0, wins: 0, losses: 0 }),
    n
  );
}