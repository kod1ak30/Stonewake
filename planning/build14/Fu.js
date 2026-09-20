function Fu(e, t, n, r, i, a = !0, o = Date.now()) {
  let s = { gold: 0, wood: 0, stone: 0, food: 0 };
  if (i.won) {
    if ((e.wins++, t === `campaign`))
      e.campaign === n
        ? ((s = Tl[n].reward), e.campaign++, (e.gems = (e.gems || 0) + 25), (e.rating += n === 4 ? 100 : 20))
        : (s = { gold: 35, wood: 20, stone: 15, food: 25 });
    else if (t === `province`) {
      let t = Ac.find((e) => e.id === r.provinceId);
      t &&
        !e.provinces?.some((e) => e.id === t.id) &&
        ((e.provinces = [...(e.provinces || []), { id: t.id, level: 1 }]),
        (s = t.reward),
        (e.rating += 25));
    } else
      t === `player` &&
        ((s = {
          gold: 90 + r.defense.level * 30,
          wood: 60,
          stone: 45,
          food: 60,
        }),
        (e.rating += Math.max(
          8,
          Math.min(25, Math.round(15 + (r.defense.rating - e.rating) / 20)),
        )));
    s = Ll(e, s);
  }
  if (
    (r.commander &&
      (r.rulesVersion !== 4 ||
        (r.orders?.some((e) => e.kind !== `hero`) && i.duration >= 10)) &&
      Kc(e, r.commander.id, i.won ? 40 : 15),
    t === `player`)
  ) {
    let t = Pc(o);
    e.season?.id !== t.id &&
      (e.season = { id: t.id, points: 0, wins: 0, losses: 0 });
    let n = e.season;
    i.won
      ? (n.wins++,
        a && (n.points += 20 + i.stars * 10 + (r.revengeReportId ? 10 : 0)))
      : n.losses++;
  }
  return s;
}