import * as v2 from "./v2.ts";
import { V2 } from "./v2.ts";
import { Body } from "./body.ts";

export type Plane = {
  origin: V2;
  norm: V2;
};

export function intersectBodyTime(
  { origin, norm }: Plane,
  body: Body,
): undefined | number {
  const dot = v2.dot(norm, body.vel);
  if (dot > 0) return undefined;

  const path = v2.sub(origin, body.pos);
  const distToPath = v2.project(path, norm).pro;
  const velDist = v2.project(body.vel, norm).pro;
  return distToPath / velDist;
}
