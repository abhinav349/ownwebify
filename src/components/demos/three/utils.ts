/** Deterministic pseudo-random in [0, 1) — avoids calling Math.random during render. */
export function hashRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}
