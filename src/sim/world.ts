import * as v2 from "../math/v2.ts";
import { Plane } from "../math/plane.ts";
import {
  advance,
  DynamicPoint,
  timeToDistance,
  timeToPlane,
} from "./dynamic-point.ts";
import {
  BALL_RADIUS,
  BAT_RADIUS,
  FLOOR,
  GRAVITY,
  TABLE_HEIGHT,
  TABLE_LENGTH,
} from "./constants.ts";

type V2 = v2.V2;

export type BallState = {
  lastBounceTime: number;
  lastBounceState: DynamicPoint;
};

export type BatState = DynamicPoint;

export type State = {
  time: number;
  ball: BallState;
  bat: BatState;
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
      bat: state.bat,
    };
  }
}

function hitBat(
  state: State,
  maxStep: number,
): undefined | State {
  const relativePos = v2.sub(state.ball.lastBounceState.pos, state.bat.pos);
  const times = timeToDistance(
    BAT_RADIUS + BALL_RADIUS,
    { pos: relativePos, vel: state.ball.lastBounceState.vel },
    GRAVITY,
  )
    .map((t) => state.ball.lastBounceTime + t)
    .filter((t) => t >= state.time && t <= state.time + maxStep);
  const ballStates = times
    .flatMap<BallState>((t) => {
      const movedBall = advance(
        state.ball.lastBounceState,
        GRAVITY,
        t - state.ball.lastBounceTime,
      );
      const norm = v2.norm(v2.sub(movedBall.pos, state.bat.pos)) as V2;
      const relativeVel = v2.sub(movedBall.vel, state.bat.vel);
      const bounce = v2.dot(relativeVel, norm);
      if (bounce < 0) {
        return [{
          lastBounceTime: t,
          lastBounceState: {
            pos: movedBall.pos,
            vel: v2.add(movedBall.vel, v2.mul(norm, bounce * -2)),
          },
        }];
      } else return [];
    })
    .sort((a, b) => a.lastBounceTime - b.lastBounceTime);

  return ballStates[0]
    ? {
      time: ballStates[0].lastBounceTime,
      ball: ballStates[0],
      bat: state.bat,
    }
    : undefined;
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

  {
    const hitB = hitBat(state, maxStep);
    if (hitB) return hitB;
  }

  return {
    time: state.time + maxStep,
    ball: state.ball,
    bat: state.bat,
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
