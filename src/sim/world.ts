import * as v2 from "../math/v2.ts";
import { Plane } from "../math/plane.ts";
import {
  advance,
  advanceConstant,
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
): undefined | BallState {
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
    return {
      lastBounceTime: hitTime,
      lastBounceState: {
        pos: movedBall.pos,
        vel: v2.add(movedBall.vel, v2.mul(planeAndRadius.norm, bounce * -2)),
      },
    };
  }
}

function hitBat(
  state: State,
  maxStep: number,
): undefined | BallState {
  const batAtLastBounce = advanceConstant(state.bat, state.ball.lastBounceTime - state.time);
  const relativeInitialPos = v2.sub(
    state.ball.lastBounceState.pos,
    batAtLastBounce.pos,
  );
  const relativeInitialVel = v2.sub(
    state.ball.lastBounceState.vel,
    batAtLastBounce.vel,
  );

  const times = timeToDistance(
    BAT_RADIUS + BALL_RADIUS,
    { pos: relativeInitialPos, vel: relativeInitialVel },
    GRAVITY,
  )
    .map((t) => state.ball.lastBounceTime + t)
    .filter((t) => t >= state.time && t <= state.time + maxStep);
  const ballStates = times
    .flatMap<BallState>((t) => {
      const deltaTime = t - state.ball.lastBounceTime;
      const movedBall = advance(state.ball.lastBounceState, GRAVITY, deltaTime);
      const movedBat = advanceConstant(batAtLastBounce, deltaTime);
      const norm = v2.norm(v2.sub(movedBall.pos, movedBat.pos)) as V2;
      const relativeVel = v2.sub(movedBall.vel, movedBat.vel);
      const bounce = v2.dot(relativeVel, norm);
      console.log("Bounce", bounce);
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

  return ballStates[0];
}

function ballHit(
  state: State,
  maxStep: number,
): undefined | BallState {
  {
    const hitFloor = hitPlane(FLOOR, state, maxStep);
    if (hitFloor) {
      return hitFloor;
    }
  }

  {
    const table: Plane = { origin: [0, TABLE_HEIGHT], norm: [0, 1] };
    const hitTable = hitPlane(table, state, maxStep);
    if (
      hitTable &&
      hitTable.lastBounceState.pos[0] >= (TABLE_LENGTH / -2) &&
      hitTable.lastBounceState.pos[0] <= (TABLE_LENGTH / 2)
    ) {
      return hitTable;
    }
  }

  {
    const hitB = hitBat(state, maxStep);
    if (hitB) {
      return hitB;
    }
  }
}

function subStep(
  state: State,
  maxStep: number,
): State {
  const hit = ballHit(state, maxStep);
  if (hit) {
    return {
      time: hit.lastBounceTime,
      ball: hit,
      bat: advanceConstant(state.bat, hit.lastBounceTime - state.time),
    };
  } else {
    return {
      time: state.time + maxStep,
      ball: state.ball,
      bat: advanceConstant(state.bat, maxStep),
    };
  }
}

export function step(
  state: State,
  stepTime: number,
  batPos: V2,
): State {
  const nextTime = state.time + stepTime;

  const bat: BatState = {
    pos: state.bat.pos,
    vel: v2.mul(v2.sub(batPos, state.bat.pos), 1 / stepTime),
  };
  state = { ball: state.ball, time: state.time, bat };

  while (state.time < nextTime) {
    state = subStep(state, nextTime - state.time);
  }
  return state;
}
