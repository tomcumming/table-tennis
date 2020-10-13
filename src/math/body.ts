import * as v2 from "./v2.ts";
import { V2 } from "./v2.ts";

export type Body = {
  pos: V2;
  vel: V2;
};

export function advance(
  { pos, vel }: Body,
  accel: V2,
  time: number,
): Body {
  return {
    pos: v2.add(pos, v2.mul(vel, time), v2.mul(0.5, accel, time ** 2)),
    vel: v2.add(vel, v2.mul(accel, time)),
  };
}
