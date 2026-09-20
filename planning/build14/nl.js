function nl(e, t = 1) {
  let n = wc[e].cost,
    r = 1.5 ** (t - 1);
  return Object.fromEntries(xl.map((e) => [e, Math.round(n[e] * r)]));
}