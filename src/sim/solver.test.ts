import { assert } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import { solve } from "./solver.ts";

const EXPECTED_SOLUTION = `Expected a solution to be found`;

Deno.test("2x - 4 = 0", () => {
  const result = solve((x) => 2 * x - 4);
  if (result === undefined) throw new Error(EXPECTED_SOLUTION);
  assert(Math.abs(result - 2) <= 0.00001, "Result is roughly 2");
});

Deno.test(`3x + 2x - 1 = 0 where x is positive`, () => {
  const result = solve((x) =>
    x < 0 ? Number.NEGATIVE_INFINITY : 3 * x * x + 2 * x - 1
  );
  if (result === undefined) throw new Error(EXPECTED_SOLUTION);
  assert(Math.abs(result - 1 / 3) <= 0.00001, "Result is roughly 1/3");
});
