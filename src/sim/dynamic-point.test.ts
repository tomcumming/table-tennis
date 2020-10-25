import { assert } from "https://deno.land/std@0.74.0/testing/asserts.ts";

import { DynamicPoint, timeToDistance, timeToPlane } from "./dynamic-point.ts";
import { BALL_RADIUS, FLOOR, GRAVITY } from "./constants.ts";
import { EXPECTED_SOLUTION } from "./phys.test.ts";
import { roughlyEq } from "../math/scalar.ts";
import * as v2 from "../math/v2.ts";
import { quadratic } from "../math/polynomial.ts";

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
  const times = timeToDistance(
    1,
    { ...ball, pos: v2.sub(bat, ball.pos) },
    GRAVITY,
  );
  assert(
    times.some((t) => roughlyEq(t, expectedTime)),
    `${expectedTime} in ${JSON.stringify(times)}`,
  );
});

Deno.test("DynamicPoint drop to static circle below", () => {
  const startHeight = 10;

  const ball: DynamicPoint = {
    pos: [1, startHeight],
    vel: v2.ZERO,
  };

  const r = 2;
  const hitHeight = Math.sqrt(r ** 2 - 1 ** 2);

  // (sh - hh) + g t^2 0.5 = 0
  const expectedTime = Math.sqrt(
    -(startHeight - hitHeight) / (GRAVITY[1] * 0.5),
  );
  console.log({ expectedTime });

  const times = timeToDistance(r, ball, GRAVITY);
  assert(
    times.some((t) => roughlyEq(t, expectedTime)),
    `${expectedTime} in ${JSON.stringify(times)}`,
  );
});

Deno.test("DynamicPoint drop to moving circle below", () => {
  const startHeight = 10;

  const ball: DynamicPoint = {
    pos: [1, startHeight],
    vel: v2.ZERO,
  };
  const batVel: v2.V2 = [0, 3];

  const r = 2;
  const hitHeight = Math.sqrt(r ** 2 - 1 ** 2);
  const relativeBall: DynamicPoint = {
    pos: ball.pos,
    vel: v2.sub(ball.vel, batVel),
  };

  // (sh - hh) + 3t + g t^2 0.5 = 0
  const [expectedTime] = quadratic(
    [startHeight - hitHeight, relativeBall.vel[1], GRAVITY[1] * 0.5],
  )
    .filter((t) => t > 0);

  const times = timeToDistance(r, relativeBall, GRAVITY);
  assert(
    times.some((t) => roughlyEq(t, expectedTime)),
    `${expectedTime} in ${JSON.stringify(times)}`,
  );
});
