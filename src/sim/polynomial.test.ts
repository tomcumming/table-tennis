import { assert } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import { derivative, Polynomial, roughlyEq, solveRoot } from "./polynomial.ts";
import { roughlyEq as scalarRE } from "../math/scalar.ts";

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
  const [result, remainder] = solveRoot(original, 3);
  assert(
    roughlyEq(expected, result),
    `${expected} ~= ${result}`,
  );
  assert(scalarRE(remainder, 0), `${remainder} ~= 0`);
});

Deno.test("Solve (x^3 + 5x^2 + 7x + 2) when a root is x = -2", () => {
  const original: Polynomial = [2, 7, 5, 1];
  const expected: Polynomial = [1, 3, 1];
  const [result, remainder] = solveRoot(original, -2);
  assert(
    roughlyEq(expected, result),
    `${expected} ~= ${result}`,
  );
  assert(scalarRE(remainder, 0), `${remainder} ~= 0`);
});
