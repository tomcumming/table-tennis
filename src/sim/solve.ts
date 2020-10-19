export function quadratic(
  a: number,
  b: number,
  c: number,
): undefined | [number, number] {
  const d = Math.sqrt(b ** 2 - 4 * a * c);
  const s1 = (-b - d) / (2 * a);
  const s2 = (-b + d) / (2 * a);
  return isFinite(s1) && isFinite(s2) ? [s1, s2] : undefined;
}
