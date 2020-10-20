import { roughlyEq as scalarRE } from "../math/scalar.ts";

/** [a, b, c...] = a + bx + cx^2 ... */
export type Polynomial = number[];
export type Quadratic = [number, number, number];

const POLY_TOO_SMALL = `Polynomial order is too low`;

export function roughlyEq(
  a: Polynomial,
  b: Polynomial,
  error?: number,
): boolean {
  return a.length === b.length && a.every((v, i) => scalarRE(v, b[i], error));
}

export function quadratic([a, b, c]: Quadratic): undefined | [number, number] {
  const d = Math.sqrt(b ** 2 - 4 * a * c);
  const s1 = (-b - d) / (2 * a);
  const s2 = (-b + d) / (2 * a);
  return isFinite(s1) && isFinite(s2) ? [s1, s2] : undefined;
}

export function derivative(poly: Polynomial): Polynomial {
  return poly.slice(1).map((a, i) => a * (i + 1));
}

/** @returns The result and a remainder */
export function applyRoot(
  poly: Polynomial,
  x: number,
): [Polynomial, number] {
  if (poly.length < 2) throw new Error(POLY_TOO_SMALL);
  const divided = poly
    .slice()
    .reverse()
    .reduce(
      (rest, c) => rest.length === 0 ? [c] : [x * rest[0] + c, ...rest],
      [] as number[],
    );
  return [divided.slice(1), divided[0]];
}
