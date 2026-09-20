function Jc(e) {
  let t = Ac.find((t) => t.id === e);
  if (!t) throw Error(`Unknown province.`);
  return cl(Math.max(0, t.campaign), t.name, t.level);
}