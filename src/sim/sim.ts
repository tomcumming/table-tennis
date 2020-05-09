import { V2, v2Add, v2Muls } from "./math";
import { gravity } from "../constants";

export type Seconds = number;

export type State = {
  time: Seconds;
  ball: Ball;
};

export type Ball = {
  pos: V2;
  vel: V2;
};

export function step(state: State, maxStep: Seconds): State {
  const nextBall: Ball = {
    vel: v2Add(state.ball.vel, v2Muls(gravity, maxStep)),
    pos: v2Add(
      state.ball.pos,
      v2Add(
        v2Muls(state.ball.vel, maxStep),
        v2Muls(gravity, maxStep * maxStep * 0.5)
      )
    ),
  };

  return {
    time: state.time + maxStep,
    ball: nextBall,
  };
}
