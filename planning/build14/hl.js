function hl(e) {
  let t = { ...wl(), ...e.army, hero: +!!e.commander };
  for (let n of e.orders || []) t[n.kind] = Math.max(0, t[n.kind] - 1);
  return t;
}