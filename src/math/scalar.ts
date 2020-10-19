export function roughlyEq(
  a: number,
  b: number,
  error = 0.00001,
): boolean {
  return Math.abs(a - b) <= error;
}
