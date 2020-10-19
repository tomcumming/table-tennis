import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";

import { DynamicPoint, timeToPlane } from "./dynamic-point.ts";
import { BALL_RADIUS, FLOOR, GRAVITY } from "./constants.ts";
import { EXPECTED_SOLUTION } from "./phys.test.ts";
import { roughlyEq } from "../math/scalar.ts";

Deno.test("DynamicPoint straight up to floor", () => {
  const startSpeed = 20;

  // Time to slow to rest = 20 / g
  const expectedTime = (startSpeed / GRAVITY[1]) * -2;

  const ball: DynamicPoint = {
    pos: [5, 0],
    vel: [0, startSpeed],
  };

  const result = timeToPlane(FLOOR, ball, GRAVITY);
  if (result === undefined) throw new Error(EXPECTED_SOLUTION);
  assert(
    roughlyEq(result, expectedTime),
    `${result} ~= ${expectedTime}`,
  );
});

Deno.test("DynamicPoint diag up to floor", () => {
  const startSpeed = 20;

  // Time to slow to rest = 20 / g
  const expectedTime = (startSpeed / GRAVITY[1]) * -2;

  const ball: DynamicPoint = {
    pos: [5, 0],
    vel: [startSpeed, startSpeed],
  };

  const result = timeToPlane(FLOOR, ball, GRAVITY);
  if (result === undefined) throw new Error(EXPECTED_SOLUTION);
  assert(
    roughlyEq(result, expectedTime),
    `${result} ~= ${expectedTime}`,
  );
});
