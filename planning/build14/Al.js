function Al(e = Date.now()) {
  return {
    schema: 1,
    balanceVersion: 2,
    gemVersion: 1,
    gems: 100,
    name: `Havencrest`,
    resources: { gold: 430, wood: 360, stone: 240, food: 260 },
    buildings: [
      { id: `keep`, kind: `keep`, x: 3, y: 3, level: 1 },
      { id: `farm`, kind: `farm`, x: 2, y: 5, level: 1 },
      { id: `lumber`, kind: `lumber`, x: 1, y: 2, level: 1 },
      { id: `cottage`, kind: `cottage`, x: 5, y: 2, level: 1 },
      { id: `market`, kind: `market`, x: 5, y: 5, level: 1 },
    ],
    army: wl(),
    terrain: [
      { x: 0, y: 3, kind: `tree` },
      { x: 1, y: 4, kind: `tree` },
      { x: 6, y: 2, kind: `rock` },
      { x: 4, y: 6, kind: `rock` },
    ],
    fleet: [],
    lastTick: e,
    campaign: 0,
    wins: 0,
    rating: 100,
    quests: [],
    published: !1,
    activeBattle: null,
    revision: 0,
    research: 0,
  };
}