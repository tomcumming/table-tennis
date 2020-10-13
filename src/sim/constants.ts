import * as v2 from "../math/v2.ts";
import { Plane } from "../math/plane.ts";

type V2 = v2.V2;

export const GRAVITY: V2 = [0, -9.81];
export const FLOOR: Plane = {
  origin: v2.ZERO,
  norm: [0, 1],
};

export const BALL_RADIUS = 0.2;
