import { assert } from "https://deno.land/std@0.74.0/testing/asserts.ts";

import { DynamicPoint, timeToDistance, timeToPlane } from "./dynamic-point.ts";
import { BALL_RADIUS, FLOOR, GRAVITY } from "./constants.ts";
import { EXPECTED_SOLUTION } from "./phys.test.ts";
import { roughlyEq } from "../math/scalar.ts";
import * as v2 from '../math/v2.ts';

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


Deno.test("DynamicPoint up and down to circle below", () => {
  const startSpeed = 20;

  // Time to slow to rest = 20 / g
  const expectedTime = (startSpeed / GRAVITY[1]) * -2;

  const ball: DynamicPoint = {
    pos: [10, 5],
    vel: [0, startSpeed],
  };
  const bat: v2.V2 = [10, 4];
  const times = timeToDistance(1, { ...ball, pos: v2.sub(bat, ball.pos) }, GRAVITY);
  assert(
    times.some(t => roughlyEq(t, expectedTime)),
    `${expectedTime} in ${JSON.stringify(times)}`
  );
});
