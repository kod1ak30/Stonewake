function Gc(e) {
  let t = e.commander || `captain`,
    n = Wc(e, t) || Wc(e, `captain`);
  return {
    id: t,
    level: Math.min(10, 1 + Math.floor(n.xp / 160)),
    gear: n.gear,
  };
}