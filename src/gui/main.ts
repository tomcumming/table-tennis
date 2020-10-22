import {
  BALL_RADIUS,
  BAT_RADIUS,
  GRAVITY,
  TABLE_HEIGHT,
  TABLE_LENGTH,
} from "../sim/constants.ts";
import { advance } from "../sim/dynamic-point.ts";
import { State, step } from "../sim/world.ts";

const TIME_SCALE = 0.5;

let sim: State = {
  time: 0,
  ball: {
    lastBounceTime: 0,
    lastBounceState: {
      pos: [-1, 2.5],
      vel: [-0.1, 0],
    },
  },
  bat: {
    pos: [-1.075, 1],
    vel: [0, 0],
  },
};

function draw(time: number) {
  if (sim.time === 0) {
    sim = { ...sim, time: TIME_SCALE * time / 1000 };
  } else {
    sim = step(sim, TIME_SCALE * (time / 1000) - sim.time);
  }

  const ball = advance(
    sim.ball.lastBounceState,
    GRAVITY,
    sim.time - sim.ball.lastBounceTime,
  );

  const canvas = document.querySelector("canvas");
  if (canvas instanceof HTMLCanvasElement) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (ctx instanceof CanvasRenderingContext2D) {
      ctx.resetTransform();
      ctx.clearRect(0, 0, width, height);

      const scale = width / 4;
      ctx.scale(scale, -scale);
      ctx.translate(2, -3);

      ctx.fillStyle = "grey";
      ctx.fillRect(-5, -2, 10, 2);

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(ball.pos[0], ball.pos[1], BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "green";
      ctx.fillRect(TABLE_LENGTH / -2, TABLE_HEIGHT, TABLE_LENGTH, -0.1);

      ctx.fillStyle = "#0000ff44";
      ctx.beginPath();
      ctx.arc(sim.bat.pos[0], sim.bat.pos[1], BAT_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      window.requestAnimationFrame(draw);

      return;
    }
  }
  throw new Error(`Could not set up context`);
}

window.requestAnimationFrame(draw);
