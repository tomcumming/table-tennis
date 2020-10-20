import * as v2 from "../math/v2.ts";
import { Plane } from "../math/plane.ts";
import { Polynomial, quadratic } from "../math/polynomial.ts";

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

export function timeToPlane(
  plane: Plane,
  dp: DynamicPoint,
  acc: V2,
): undefined | number {
  const relativeDist = v2.project(plane.norm, dp.pos);
  const relativeVel = v2.project(plane.norm, dp.vel);
  const relativeAcc = v2.project(plane.norm, acc);

  const solutions = quadratic([relativeAcc / 2, relativeVel, relativeDist]);
  if (solutions) {
    const [first, second] = solutions.sort();
    return relativeAcc > 0 ? first : second;
  }
}

export function timeToDistance(
  distance: number,
  dp: DynamicPoint,
  acc: V2
): undefined | number[] {
  /* Solving for t:
    p' = p + vt + at^2(1/2)
    dist^2 = (p + vt + at^2(1/2))^2
      = p^2 + t2(p . v) + t^2(v^2 + p . a) + t^3(v . a) + t^4(1/4)a^2
  */
  const eq: Polynomial = [
    v2.dot(dp.pos, dp.pos) - distance**2,
    2 * v2.dot(dp.pos, dp.vel),
    v2.dot(dp.vel, dp.vel) + v2.dot(dp.pos, acc),
    v2.dot(dp.vel, acc),
    (1/4) * v2.dot(acc, acc)
  ];

  // We need to be careful as we might start in an unsolvable spot!
  // ...Try a few starts? (based on the properties of the table tennis world)

  throw new Error('TODO');
}
