import * as v2 from "../math/v2.ts";
import { Plane } from "../math/plane.ts";

type V2 = v2.V2;

export const GRAVITY: V2 = [0, -9.81];
export const FLOOR: Plane = {
  origin: v2.ZERO,
  norm: [0, 1],
};

export const BALL_RADIUS = 0.02;
export const TABLE_LENGTH = 2.74;
export const TABLE_HEIGHT = 0.76;

export const BAT_RADIUS = 0.25;
