function $c(e, t) {
  return t.kind === `keep`
    ? e.campaign < t.level
      ? `Capture ${t.level} campaign strongholds first`
      : e.buildings.some((e) => e.kind === `barracks` && e.level >= t.level)
        ? t.level >= 2 &&
          !e.buildings.some((e) => e.kind === `quarry` && e.level >= t.level)
          ? `Complete a level ${t.level} quarry`
          : null
        : `Complete a level ${t.level} barracks`
    : null;
}