function pl(e, t, n) {
  if (!Number.isInteger(t) || !Number.isInteger(n)) return !1;
  let r = fl(e);
  return (
    t >= r.minX &&
    t <= r.maxX &&
    n >= r.minY &&
    n <= r.maxY &&
    (t <= r.minX + 1 ||
      t >= r.maxX - 1 ||
      n <= r.minY + 1 ||
      n >= r.maxY - 1) &&
    !e.buildings.some((e) => Math.abs(e.x - t) < 0.8 && Math.abs(e.y - n) < 0.8)
  );
}