function Ml(e) {
  return e.buildings.find((e) => e.kind === `keep`)?.level || 1;
}