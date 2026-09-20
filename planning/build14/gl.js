function Gl(e) {
  let t = Tl[e];
  if (!t) throw Error(`Campaign not found.`);
  return cl(e, t.name, t.level);
}