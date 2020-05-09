import {
  V2,
  v2Add,
  v2Muls,
  v2Subs,
  v2Unit,
  Ray,
  Plane,
  v2Dot,
  v2Mag,
} from "./math";
import {
  gravity,
  tableHeight,
  ballRadius,
  ballCOR,
  tableLength,
} from "../constants";

export type Seconds = number;

export type State = {
  time: Seconds;
  ball: Ball;
};

export type Ball = {
  pos: V2;
  vel: V2;
};

export function step({ ball, time }: State, maxStep: Seconds): State {
  if (maxStep <= 0) return { ball, time };

  const nextBall: Ball = {
    vel: v2Add(ball.vel, v2Muls(gravity, maxStep)),
    pos: v2Add(
      ball.pos,
      v2Add(v2Muls(ball.vel, maxStep), v2Muls(gravity, maxStep * maxStep * 0.5))
    ),
  };

  const ballTable = ballTableBounce(ball, nextBall, maxStep);
  if (ballTable) {
    return {
      time: time + ballTable.delta,
      ball: ballTable.ball,
    };
  }

  return {
    time: time + maxStep,
    ball: nextBall,
  };
}

type BallBounce = {
  delta: Seconds;
  ball: Ball;
};

function ballTableBounce(
  ball: Ball,
  nextBall: Ball,
  step: Seconds
): undefined | BallBounce {
  const planeHeight = tableHeight + ballRadius;

  if (ball.pos[1] >= planeHeight && nextBall.pos[1] <= planeHeight) {
    const ballPath = v2Subs(nextBall.pos, ball.pos);

    const hitPathRatio = (planeHeight - ball.pos[1]) / ballPath[1];
    const hitTime = step * hitPathRatio;

    const ballHitPos = v2Add(ball.pos, v2Muls(ballPath, hitPathRatio));
    if (ballHitPos[0] >= -tableLength / 2 && ballHitPos[0] <= tableLength / 2) {
      const ballHitVel = v2Add(ball.vel, v2Muls(gravity, hitTime));
      const bouncedVel: V2 = [ballHitVel[0], -ballHitVel[1] * ballCOR];

      return {
        delta: hitTime,
        ball: {
          pos: ballHitPos,
          vel: bouncedVel,
        },
      };
    }
  }
}
