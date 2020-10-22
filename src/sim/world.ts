import * as v2 from "../math/v2.ts";
import { Plane } from "../math/plane.ts";
import { advance, DynamicPoint, timeToPlane } from "./dynamic-point.ts";
import {
  BALL_RADIUS,
  FLOOR,
  GRAVITY,
  TABLE_HEIGHT,
  TABLE_LENGTH,
} from "./constants.ts";

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

function hitPlane(
  plane: Plane,
  state: State,
  maxStep: number,
): undefined | State {
  const planeAndRadius: Plane = {
    origin: v2.add(plane.origin, v2.mul(plane.norm, BALL_RADIUS)),
    norm: plane.norm,
  };

  const deltaHitTime = timeToPlane(
    planeAndRadius,
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
    const bounce = v2.dot(movedBall.vel, planeAndRadius.norm);
    const ball: BallState = {
      lastBounceTime: hitTime,
      lastBounceState: {
        pos: movedBall.pos,
        vel: v2.add(movedBall.vel, v2.mul(planeAndRadius.norm, bounce * -2)),
      },
    };
    return {
      time: hitTime,
      ball,
    };
  }
}

function subStep(
  state: State,
  maxStep: number,
): State {
  {
    const hitFloor = hitPlane(FLOOR, state, maxStep);
    if (hitFloor) return hitFloor;
  }

  {
    const table: Plane = { origin: [0, TABLE_HEIGHT], norm: [0, 1] };
    const hitTable = hitPlane(table, state, maxStep);
    if (
      hitTable &&
      hitTable.ball.lastBounceState.pos[0] >= (TABLE_LENGTH / -2) &&
      hitTable.ball.lastBounceState.pos[0] <= (TABLE_LENGTH / 2)
    ) {
      return hitTable;
    }
  }

  return {
    time: state.time + maxStep,
    ball: state.ball,
  };
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
