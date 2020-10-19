import * as v2 from "../math/v2.ts";
import { Plane } from "../math/plane.ts";
import { advance, DynamicPoint, timeToPlane } from "./dynamic-point.ts";
import { BALL_RADIUS, FLOOR, GRAVITY } from "./constants.ts";

type V2 = v2.V2;

export type BallState = DynamicPoint;

export type State = {
  time: number;
  ball: BallState;
};

export type BallStep =
  | { type: "unhit"; state: BallState }
  | { type: "hit"; delta: number; state: BallState };

function ballPlane(
  ball: BallState,
  plane: Plane,
  radius: number,
): undefined | { time: number; ball: BallState } {
  const newPlane: Plane = {
    norm: plane.norm,
    origin: v2.add(plane.origin, v2.mul(plane.norm, radius)),
  };

  const time = timeToPlane(newPlane, ball, GRAVITY);
  if (time && time >= 0) {
    const hitBall = advance(ball, GRAVITY, time);
    const bounce = v2.project(hitBall.vel, plane.norm);
    const newVel = v2.add(hitBall.vel, v2.mul(plane.norm, -2 * bounce));
    return {
      time,
      ball: {
        pos: hitBall.pos,
        vel: newVel,
      },
    };
  }
}

function subStep(
  state: State,
  maxStep: number,
): State {
  const hitState = ballPlane(state.ball, FLOOR, BALL_RADIUS);
  if (hitState && hitState.time <= maxStep) {
    console.log("bounce", state.time, state.ball.vel);
    return {
      time: state.time + hitState.time,
      ball: hitState.ball,
    };
  } else {
    return {
      time: state.time + maxStep,
      ball: advance(state.ball, GRAVITY, maxStep),
    };
  }
}

export function step(
  state: State,
  stepTime: number,
): State {
  const nextTime = state.time + stepTime;
  while (state.time < nextTime) {
    state = subStep(state, nextTime - state.time);
  }
  return state;
}
