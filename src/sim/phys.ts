import * as v2 from "../math/v2.ts";
import { intersectBodyTime, Plane } from "../math/plane.ts";
import { advance, Body } from "../math/body.ts";
import { solve } from "../sim/solver.ts";
import { GRAVITY } from "./constants.ts";

export function ballPlaneTime(
  plane: Plane,
  ball: Body,
  radius: number,
): undefined | number {
  const newPlane: Plane = {
    origin: v2.add(plane.origin, v2.mul(plane.norm, radius)),
    norm: plane.norm,
  };
  return solve((time) => {
    const advanced = advance(ball, GRAVITY, time);
    const hitTime = intersectBodyTime(newPlane, advanced);
    if (hitTime === undefined) {
      if (v2.dot(GRAVITY, plane.norm) > 0) return Number.POSITIVE_INFINITY;
      else return Number.NEGATIVE_INFINITY;
    } else {
      return -hitTime;
    }
  });
}
