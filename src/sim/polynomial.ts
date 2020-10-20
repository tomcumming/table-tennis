import { roughlyEq as scalarRE } from "../math/scalar.ts";

/** [a, b, c...] = a + bx + cx^2 ... */
export type Polynomial = number[];

export function roughlyEq(
  a: Polynomial,
  b: Polynomial,
  error?: number,
): boolean {
  return a.length === b.length && a.every((v, i) => scalarRE(v, b[i], error));
}

export function derivative(poly: Polynomial): Polynomial {
  return poly.slice(1).map((a, i) => a * (i + 1));
}
