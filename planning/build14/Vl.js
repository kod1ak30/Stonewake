function Vl(e, t) {
  return t.level >= Sl[t.kind].max
    ? `Maximum level`
    : t.readyAt
      ? `Construction in progress`
      : Lc(e) >= Ic(e)
        ? `Builders are busy`
        : t.kind !== `keep` && t.level >= Ml(e)
          ? `Keep level ${t.level + 1} required`
          : t.kind === `keep` &&
              t.level === 1 &&
              !e.buildings.some((e) => e.kind === `barracks` && e.level > 0)
            ? `Build a barracks first`
            : t.kind === `keep` && t.level === 2 && e.campaign < 2
              ? `Capture Stonecross first`
              : xl.some(k=>X(t.kind,t.level+1)[k]>Fl(e))
                ? `Expand your storehouses first`
                : Z(e, X(t.kind, t.level + 1))
                ? $c(e, t)
                : `More resources needed`;
}