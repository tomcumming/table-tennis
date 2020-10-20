import { assert } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import {
  applyRoot,
  derivative,
  Polynomial,
  roughlyEq,
  solve,
} from "./polynomial.ts";
import { roughlyEq as scalarRE } from "../math/scalar.ts";

const EXPECTED_SOLUTION = `A solution was expected but not found`;

Deno.test("Derivative of 3x^2 + 2x^2 + 4x + -1", () => {
  const original: Polynomial = [-1, 4, 2, 3];
  const expected: Polynomial = [4, 4, 9];
  const result: Polynomial = derivative(original);
  assert(
    roughlyEq(expected, result),
    `${expected} ~= ${result}`,
  );
});

Deno.test("Solve (x^3 - 2x^2 - 5x + 6) when a root is x = 3", () => {
  const original: Polynomial = [6, -5, -2, 1];
  const expected: Polynomial = [-2, 1, 1];
  const [result, remainder] = applyRoot(original, 3);
  assert(
    roughlyEq(expected, result),
    `${expected} ~= ${result}`,
  );
  assert(scalarRE(remainder, 0), `${remainder} ~= 0`);
});

Deno.test("Solve (x^3 + 5x^2 + 7x + 2) when a root is x = -2", () => {
  const original: Polynomial = [2, 7, 5, 1];
  const expected: Polynomial = [1, 3, 1];
  const [result, remainder] = applyRoot(original, -2);
  assert(
    roughlyEq(expected, result),
    `${expected} ~= ${result}`,
  );
  assert(scalarRE(remainder, 0), `${remainder} ~= 0`);
});

Deno.test("Find the root for 2x - 6", () => {
  const poly: Polynomial = [-6, 2];
  const result = solve(poly);
  if (!result) throw new Error(EXPECTED_SOLUTION);
  assert(scalarRE(result.error, 0), `${result.error} ~= 0`);
  assert(scalarRE(result.root, 3), `${result.root} ~= 3`);
});

Deno.test("Find a root for 3x^2 + 9x + 6", () => {
  const poly: Polynomial = [6, 9, 3];
  const result = solve(poly);
  if (!result) throw new Error(EXPECTED_SOLUTION);
  assert(scalarRE(result.error, 0), `${result.error} ~= 0`);
  assert(
    [-2, -1].some((n) => scalarRE(result.root, n)),
    `${result.root} in [-2, -1]`,
  );
});
