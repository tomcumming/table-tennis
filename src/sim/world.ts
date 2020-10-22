import * as v2 from "../math/v2.ts";
import { Plane } from "../math/plane.ts";
import { advance, DynamicPoint, timeToPlane } from "./dynamic-point.ts";
import { BALL_RADIUS, FLOOR, GRAVITY } from "./constants.ts";

type V2 = v2.V2;

// TODO just store last bounce position and time?
export type BallState = {
  lastBounceTime: number;
  lastBounceState: DynamicPoint;
};

export type State = {
  time: number;
  ball: BallState;
};

export type BallStep =
  | { type: "unhit"; state: BallState }
  | { type: "hit"; delta: number; state: BallState };

function subStep(
  state: State,
  maxStep: number,
): State {
  const floorAndRadius: Plane = {
    origin: v2.add(FLOOR.origin, v2.mul(FLOOR.norm, BALL_RADIUS)),
    norm: FLOOR.norm,
  };

  const deltaHitTime = timeToPlane(
    floorAndRadius,
    state.ball.lastBounceState,
    GRAVITY,
  );
  const hitTime = deltaHitTime !== undefined
    ? deltaHitTime + state.ball.lastBounceTime
    : undefined;
  if (
    hitTime !== undefined && hitTime >= state.time &&
    hitTime <= state.time + maxStep
  ) {
    const movedBall = advance(
      state.ball.lastBounceState,
      GRAVITY,
      hitTime - state.ball.lastBounceTime,
    );
    const bounce = v2.dot(movedBall.vel, floorAndRadius.norm);
    const ball: BallState = {
      lastBounceTime: hitTime,
      lastBounceState: {
        pos: movedBall.pos,
        vel: v2.add(movedBall.vel, v2.mul(floorAndRadius.norm, bounce * -2)),
      },
    };
    console.log("bounce", state.time, hitTime, ball.lastBounceState.vel);
    return {
      time: hitTime,
      ball,
    };
  } else {
    return {
      time: state.time + maxStep,
      ball: state.ball,
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
