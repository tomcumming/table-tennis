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
  rayCircle,
} from "./math";
import {
  gravity,
  tableHeight,
  ballRadius,
  ballCOR,
  tableLength,
  batRadius,
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

  // TODO fix this, use the last bat pos and current pos for intersection test,
  // then use smoothed vel for hit power
  const nextBat = v2Add(bat.pos, v2Muls(bat.vel, maxStep));

  const bounces = [
    ballTableBounce(ball, nextBall, maxStep),
    ballFloorBounce(ball, nextBall, maxStep),
    ballBatBounce(ball, nextBall, bat.pos, nextBat, maxStep),
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

function ballBatBounce(
  ball: Ball,
  nextBall: Ball,
  bat: V2,
  nextBat: V2,
  step: number
): undefined | BallBounce {
  const ballPath = v2Sub(nextBall.pos, ball.pos);
  const batPath = v2Sub(nextBat, bat);

  const bothPath = v2Sub(ballPath, batPath);
  const bothDist = v2Mag(bothPath);
  const bothPathU = v2Unit(bothPath);
  if (bothPathU) {
    const t = rayCircle(
      {
        origin: ball.pos,
        dir: bothPathU,
      },
      bat,
      batRadius + ballRadius
    );

    if (t && t[0] > 0 && t[0] <= bothDist) {
      const ratio = t[0] / bothDist;
      const time = step / ratio;

      const ballHitPos = v2Add(ball.pos, v2Muls(ballPath, ratio));
      const batHitPos = v2Add(bat, v2Muls(batPath, ratio));
      const ballBeforeVel = v2Add(ball.vel, v2Muls(gravity, time));
      const normal = v2Unit(v2Sub(ballHitPos, batHitPos));
      if (normal && v2Dot(normal, ballBeforeVel) < 0) {
        const cor = 1;

        const impact = v2Muls(normal, -v2Dot(normal, ballBeforeVel));
        const bouncedVel = v2Add(impact, v2Muls(impact, cor));

        return {
          ball: {
            pos: ballHitPos,
            vel: v2Add(ballBeforeVel, bouncedVel),
          },
          delta: time,
        };
      }
    }
  }
}
