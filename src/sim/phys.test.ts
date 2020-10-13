import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";

import { EXPECTED_SOLUTION } from "./solver.test.ts";
import { Body } from "../math/body.ts";
import { BALL_RADIUS, FLOOR, GRAVITY } from "./constants.ts";
import { ballPlaneTime } from "./phys.ts";

Deno.test("throw ball straight up to floor", () => {
  const startSpeed = 20;

  // Time to slow to rest = 20 / g
  const expectedTime = (startSpeed / GRAVITY[1]) * -2;

  const ball: Body = {
    pos: [5, BALL_RADIUS],
    vel: [0, startSpeed],
  };

  const result = ballPlaneTime(FLOOR, ball, BALL_RADIUS);
  if (result === undefined) throw new Error(EXPECTED_SOLUTION);
  assert(
    Math.abs(result - expectedTime) < 0.00001,
    `${result} ~= ${expectedTime}`,
  );
});

Deno.test("throw ball diag to floor", () => {
  const startSpeed = 20;

  // Time to slow to rest = 20 / g
  const expectedTime = (startSpeed / GRAVITY[1]) * -2;

  const ball: Body = {
    pos: [5, BALL_RADIUS],
    vel: [startSpeed, startSpeed],
  };

  const result = ballPlaneTime(FLOOR, ball, BALL_RADIUS);
  if (result === undefined) throw new Error(EXPECTED_SOLUTION);
  assert(
    Math.abs(result - expectedTime) < 0.00001,
    `${result} ~= ${expectedTime}`,
  );
});

Deno.test("Ball over plane backwards in time", () => {
  const ball: Body = {
    pos: [2, -2],
    vel: [1, -10],
  };
  const result = ballPlaneTime(FLOOR, ball, BALL_RADIUS);
  assertEquals(result, undefined, `Backwards in time are not solved`);
});

Deno.test("Ball over plane forwards in time", () => {
  const ball: Body = {
    pos: [2, 2],
    vel: [1, 10],
  };
  const result = ballPlaneTime(FLOOR, ball, BALL_RADIUS);
  if (result === undefined) throw new Error(EXPECTED_SOLUTION);
  assert(result > 0, `Ball should hit plane in the future`);
});
