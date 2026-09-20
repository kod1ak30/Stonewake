function Jl(e, t, n = 0.65) {
  return Object.fromEntries(
    Object.keys(J).map((r) => [
      r,
      (t[r] || 0) +
        (n === 0.65 ? Math.ceil : Math.floor)(
          Math.max(0, (e[r] || 0) - (t[r] || 0)) * n,
        ),
    ]),
  );
}