import * as v2 from "../math/v2.ts";
import { intersection, Plane } from "../math/plane.ts";

type V2 = v2.V2;

export const GRAVITY: V2 = [0, -9.81];
export const FLOOR: Plane = {
  origin: v2.ZERO,
  norm: [0, 1],
};

export const BALL_RADIUS = 0.2;

export type BallState = {
  pos: V2;
  vel: V2;
};

export type State = {
  time: number;
  ball: BallState;
};

export type BallStep =
  | { type: "unhit"; state: BallState }
  | { type: "hit"; delta: number; state: BallState };

function ballPlane(
  startPos: V2,
  ballDir: V2,
  plane: Plane,
  radius: number,
): undefined | { pos: V2; time: number } {
  if (ballDir && v2.dot(ballDir, plane.norm) < 0) {
    const newPlane: Plane = {
      norm: plane.norm,
      origin: v2.add(plane.origin, v2.mul(plane.norm, radius)),
    };

    const int = intersection(newPlane, startPos, ballDir);
    if (int && int.time >= 0) return int;
  }
}

function subStepBall(
  { pos, vel }: BallState,
  maxStep: number,
): BallStep {
  const nextPos = v2.add(
    pos,
    v2.mul(vel, maxStep),
    v2.mul(GRAVITY, 0.5, maxStep, maxStep),
  );
  const nextVel = v2.add(vel, v2.mul(GRAVITY, maxStep));

  const ballPath = v2.sub(nextPos, pos);
  const ballDir = v2.norm(ballPath);

  if (ballDir) {
    const rayHit = ballPlane(pos, ballDir, FLOOR, BALL_RADIUS);
    if (rayHit) {
      const midVel = v2.mul(0.5, v2.add(vel, nextVel));
      const midSpeed = v2.mag(midVel);
      const estTime = rayHit.time / midSpeed;
      const estVel = v2.add(vel, v2.mul(GRAVITY, estTime));
      const bounce = v2.mul(
        FLOOR.norm,
        v2.project(estVel, FLOOR.norm).pro * -2,
      );
      console.log('Bounce', { estTime, estVel, estSpeed: v2.mag(estVel) });
      return {
        type: "hit",
        delta: estTime,
        state: {
          pos: rayHit.pos,
          vel: v2.add(estVel, bounce),
        },
      };
    }
  }

  return {
    type: "unhit",
    state: {
      pos: nextPos,
      vel: nextVel,
    },
  };
}

function subStep(
  state: State,
  maxStep: number,
): State {
  const ballStep = subStepBall(state.ball, maxStep);
  if (ballStep.type === "unhit") {
    return {
      ball: ballStep.state,
      time: state.time + maxStep,
    };
  } else {
    return {
      ball: ballStep.state,
      time: state.time + ballStep.delta,
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
