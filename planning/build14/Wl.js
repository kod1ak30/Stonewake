function Wl(e) {
  return {
    name: e.name,
    level: Ml(e),
    rating: e.rating,
    provinces: e.provinces,
    livery: e.livery,
    appearance: SWAppearance(e),
    buildings: e.buildings
      .filter((e) => e.level > 0)
      .map((e) => ({
        id: e.id,
        kind: e.kind,
        x: e.x,
        y: e.y,
        level: e.level,
        axis: e.axis,
        facing: e.facing,
        specialty: e.specialty,
      })),
  };
}