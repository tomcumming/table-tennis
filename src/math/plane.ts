import * as v2 from "./v2.ts";
import { V2 } from "./v2.ts";

export type Plane = {
  origin: V2;
  norm: V2;
};

export function intersection(
  { origin, norm }: Plane,
  rayOrigin: V2,
  rayDir: V2,
): undefined | { time: number; pos: V2 } {
  const pathToOrigin = v2.sub(origin, rayOrigin);
  const distanceToward = v2.project(pathToOrigin, norm);
  const angle = 1 / v2.dot(norm, rayDir);
  const time = angle * distanceToward.pro;
  const pos = v2.isFinite(v2.add(rayOrigin, v2.mul(rayDir, time)));
  return pos === undefined ? undefined : { pos, time };
}
