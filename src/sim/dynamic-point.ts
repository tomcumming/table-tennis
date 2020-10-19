import * as v2 from "../math/v2.ts";
import * as solve from "./solve.ts";
import { Plane } from "../math/plane.ts";

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

  const solutions = solve.quadratic(relativeAcc / 2, relativeVel, relativeDist);
  if (solutions) {
    const [first, second] = solutions.sort();
    return relativeAcc > 0 ? first : second;
  }
}
