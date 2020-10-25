import * as v2 from "../math/v2.ts";
import { Plane } from "../math/plane.ts";
import {
  applyRoot,
  isQuadratic,
  Polynomial,
  quadratic,
  solve,
} from "../math/polynomial.ts";

type V2 = v2.V2;

export type DynamicPoint = {
  pos: V2;
  vel: V2;
};

export function advance(
  dp: DynamicPoint,
  acc: V2,
  time: number,
): DynamicPoint {
  return {
    pos: v2.add(
      dp.pos,
      v2.mul(dp.vel, time),
      v2.mul(acc, time, time, 0.5),
    ),
    vel: v2.add(
      dp.vel,
      v2.mul(acc, time),
    ),
  };
}

export function advanceConstant(
  dp: DynamicPoint,
  time: number,
): DynamicPoint {
  return {
    pos: v2.add(dp.pos, v2.mul(time, dp.vel)),
    vel: dp.vel,
  };
}

export function timeToPlane(
  plane: Plane,
  dp: DynamicPoint,
  acc: V2,
): undefined | number {
  // (p + vt + att0.5 - o) . n = 0
  // (p - o) . n + (v . n)t +  (a . n)0.5tt = 0
  const solutions = quadratic([
    v2.dot(v2.sub(dp.pos, plane.origin), plane.norm),
    v2.dot(dp.vel, plane.norm),
    v2.dot(acc, plane.norm) * 0.5,
  ]);
  return solutions
    .filter((t) => v2.dot(plane.norm, advance(dp, acc, t).vel) < 0)[0];
}

export function timeToDistance(
  distance: number,
  dp: DynamicPoint,
  acc: V2,
): number[] {
  /* Solving for t:
    p' = p + vt + at^2(1/2)
    dist^2 = (p + vt + at^2(1/2))^2
      = p^2 + t2(p . v) + t^2(v^2 + p . a) + t^3(v . a) + t^4(1/4)a^2
  */
  const eq: Polynomial = [
    v2.dot(dp.pos, dp.pos) - distance ** 2,
    2 * v2.dot(dp.pos, dp.vel),
    v2.dot(dp.vel, dp.vel) + v2.dot(dp.pos, acc),
    v2.dot(dp.vel, acc),
    (1 / 4) * v2.dot(acc, acc),
  ];

  // try at t = 0 or t = 10, that should be enough...
  const root = solve(eq) || solve(eq, 10);
  if (root !== undefined) {
    const [eq2] = applyRoot(eq, root);
    const root2 = solve(eq2) || solve(eq2, 10);
    if (root2 === undefined) {
      console.warn(`I think there should never be one root?!`, eq, eq2);
      return [];
    }
    const [eq3] = applyRoot(eq2, root2);
    if (!isQuadratic(eq3)) throw new Error(`Duno wtf has gone wrong here`);
    return [root, root2, ...quadratic(eq3)];
  } else {
    return [];
  }
}
