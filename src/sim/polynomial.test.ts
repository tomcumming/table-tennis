import { assert } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import { derivative, Polynomial, roughlyEq } from "./polynomial.ts";

Deno.test("Derivative of 3x^2 + 2x^2 + 4x + -1", () => {
  const original: Polynomial = [-1, 4, 2, 3];
  const expected: Polynomial = [4, 4, 9];
  const result: Polynomial = derivative(original);
  assert(
    roughlyEq(expected, result),
    `${expected} ~= ${result}`,
  );
});
