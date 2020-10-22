import { GRAVITY } from "../sim/constants.ts";
import { advance } from "../sim/dynamic-point.ts";
import { State, step } from "../sim/world.ts";

let sim: State = {
  time: 0,
  ball: {
    lastBounceTime: 0,
    lastBounceState: {
      pos: [1, 5],
      vel: [-0.1, 0],
    },
  },
};

function draw(time: number) {
  if (sim.time === 0) {
    sim = { ...sim, time: time / 1000 };
  } else {
    sim = step(sim, (time / 1000) - sim.time);
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

      const scale = width / 10;
      ctx.scale(scale, -scale);
      ctx.translate(5, -8);

      ctx.fillRect(-5, -2, 10, 2);

      ctx.beginPath();
      ctx.arc(ball.pos[0], ball.pos[1], 0.04, 0, Math.PI * 2);
      ctx.fill();

      window.requestAnimationFrame(draw);

      return;
    }
  }
  throw new Error(`Could not set up context`);
}

window.requestAnimationFrame(draw);
