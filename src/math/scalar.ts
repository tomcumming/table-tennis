export function roughlyEq(
  a: number,
  b: number,
  error = 1e-6,
): boolean {
  return Math.abs(a - b) <= error;
}
