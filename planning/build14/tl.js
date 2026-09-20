function tl(e, t) {
  let n = 1.6 ** (el(e, t) - 1);
  return {
    gold: Math.round(120 * n),
    wood: Math.round(60 * n),
    stone: Math.round(45 * n),
    food: Math.round(90 * n),
  };
}