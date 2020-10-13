import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";

import * as v2 from "./v2.ts";
import { intersectBodyTime, Plane } from "./plane.ts";
import { Body } from "./body.ts";
import { assertRoughlyEq } from "./v2.test.ts";

Deno.test("Body distance to perp", () => {
  const plane: Plane = {
    origin: [1, 9],
    norm: v2.norm([-1, -1]) as v2.V2,
  };
  const body: Body = {
    pos: [1, 1],
    vel: [2, 2],
  };

  const time = intersectBodyTime(plane, body);
  assertEquals(time, 2);
});

Deno.test("Body distance to backface", () => {
  const plane: Plane = {
    origin: [1, 9],
    norm: v2.norm([1, 1]) as v2.V2,
  };
  const body: Body = {
    pos: [1, 1],
    vel: [2, 2],
  };

  const time = intersectBodyTime(plane, body);
  assertEquals(time, undefined);
});

Deno.test("Body distance diag up", () => {
  const plane: Plane = {
    origin: [1, 9],
    norm: v2.norm([-1, -1]) as v2.V2,
  };
  const body: Body = {
    pos: [5, 1],
    vel: [0, 2],
  };

  const time = intersectBodyTime(plane, body);
  assertEquals(time, 2);
});

Deno.test("Body distance diag right", () => {
  const plane: Plane = {
    origin: [1, 9],
    norm: v2.norm([-1, -1]) as v2.V2,
  };
  const body: Body = {
    pos: [1, 5],
    vel: [2, 0],
  };

  const time = intersectBodyTime(plane, body);
  assertEquals(time, 2);
});
