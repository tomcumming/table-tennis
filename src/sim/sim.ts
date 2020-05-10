import {
  V2,
  v2Add,
  v2Muls,
  v2Sub,
  v2Unit,
  Ray,
  Plane,
  v2Dot,
  v2Mag,
  signedDistanceFromPlane,
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
  bat: Bat;
};

export type Ball = {
  pos: V2;
  vel: V2;
};

export type Bat = {
  pos: V2;
  vel: V2;
};

const prettyMuchRollingImpactSpeed = 0.0001;

export function step(
  { bat, ball, time }: State,
  input: Bat,
  maxStep: Seconds
): State {
  if (maxStep <= 0) return { bat, ball, time };

  const nextBall: Ball = {
    vel: v2Add(ball.vel, v2Muls(gravity, maxStep)),
    pos: v2Add(
      ball.pos,
      v2Add(v2Muls(ball.vel, maxStep), v2Muls(gravity, maxStep * maxStep * 0.5))
    ),
  };

  const bounces = [
    ballTableBounce(ball, nextBall, maxStep),
    ballFloorBounce(ball, nextBall, maxStep),
  ]
    .flatMap((bounce) => (bounce === undefined ? [] : [bounce]))
    .sort((a, b) => a.delta - b.delta);

  if (bounces.length > 0) {
    const bounce = bounces[0];
    return {
      time: time + bounce.delta,
      ball: bounce.ball,
      bat: input,
    };
  }

  return {
    time: time + maxStep,
    ball: nextBall,
    bat: input,
  };
}

type BallBounce = {
  delta: Seconds;
  ball: Ball;
};

function ballPlaneBounce(
  plane: Plane,
  ball: Ball,
  nextBall: Ball,
  step: Seconds,
  cor: number
): undefined | BallBounce {
  const ballDist = signedDistanceFromPlane(plane, ball.pos);
  const nextBallDist = signedDistanceFromPlane(plane, nextBall.pos);

  if (ballDist >= 0 && nextBallDist <= 0) {
    const stepDist = ballDist + nextBallDist * -1;
    const hitPathRatio = ballDist / stepDist;
    const hitTime = step * hitPathRatio;

    const ballPath = v2Sub(nextBall.pos, ball.pos);
    const ballHitPos = v2Add(ball.pos, v2Muls(ballPath, hitPathRatio));

    const ballHitVel = v2Add(ball.vel, v2Muls(gravity, hitTime));
    const impact = v2Muls(plane.normal, -v2Dot(plane.normal, ballHitVel));
    const bouncedVel = v2Add(impact, v2Muls(impact, cor));

    if (v2Mag(impact) < prettyMuchRollingImpactSpeed) {
      const rollPath = v2Sub(
        ball.vel,
        v2Muls(plane.normal, v2Dot(plane.normal, ball.vel))
      );
      return {
        delta: step,
        ball: {
          pos: v2Add(ball.pos, v2Muls(rollPath, step)),
          vel: rollPath,
        },
      };
    } else {
      return {
        delta: hitTime,
        ball: {
          pos: ballHitPos,
          vel: v2Add(ballHitVel, bouncedVel),
        },
      };
    }
  }
}

function ballTableBounce(
  ball: Ball,
  nextBall: Ball,
  step: Seconds
): undefined | BallBounce {
  const bounce = ballPlaneBounce(
    {
      origin: [0, tableHeight + ballRadius],
      normal: [0, 1],
    },
    ball,
    nextBall,
    step,
    ballCOR
  );

  if (
    bounce &&
    bounce.ball.pos[0] > tableLength / -2 &&
    bounce.ball.pos[0] < tableLength / 2
  )
    return bounce;
}

function ballFloorBounce(
  ball: Ball,
  nextBall: Ball,
  step: Seconds
): undefined | BallBounce {
  return ballPlaneBounce(
    {
      origin: [0, ballRadius],
      normal: [0, 1],
    },
    ball,
    nextBall,
    step,
    ballCOR
  );
}
