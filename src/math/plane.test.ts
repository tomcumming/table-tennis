import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";

import * as v2 from "./v2.ts";
import { intersection, Plane } from "./plane.ts";
import { assertRoughlyEq } from "./v2.test.ts";

const EXPECTED_INTERSECTION_MSG = `Should have intersected`;

Deno.test("Plane right angle intersection", () => {
  const planeNorm = v2.norm([-1, -1]) as v2.V2;

  const plane: Plane = { origin: [2, 8], norm: planeNorm };
  const ray = {
    origin: [3, 3] as v2.V2,
    dir: v2.mul(planeNorm, -1),
  };

  const int = intersection(plane, ray.origin, ray.dir);
  if (int === undefined) throw new Error(EXPECTED_INTERSECTION_MSG);

  assertRoughlyEq(int.pos, [5, 5]);
  assertEquals(int.time, 2 * Math.SQRT2);
});

Deno.test("Plane Diagonal intersection", () => {
  const plane: Plane = { origin: [5, 9], norm: [-1, 0] };
  const ray = {
    origin: [3, 1] as v2.V2,
    dir: v2.norm([1, 1]) as v2.V2,
  };

  const int = intersection(plane, ray.origin, ray.dir);
  if (int === undefined) throw new Error(EXPECTED_INTERSECTION_MSG);

  assertRoughlyEq(int.pos, [5, 3]);
  assertEquals(int.time, 2 * Math.SQRT2);
});
