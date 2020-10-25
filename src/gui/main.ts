import * as v2 from "../math/v2.ts";
import {
  BALL_RADIUS,
  BAT_RADIUS,
  GRAVITY,
  TABLE_HEIGHT,
  TABLE_LENGTH,
} from "../sim/constants.ts";
import { advance, DynamicPoint } from "../sim/dynamic-point.ts";
import { State, step } from "../sim/world.ts";

const TIME_SCALE = 0.5;

const MOUSE_SMOOTHING_FRAMES = 8;

const INITIAL_BALL_STATE: DynamicPoint = {
  pos: [-1, 2.5],
  vel: [-0.1, 0],
};

let batPosScr: v2.V2;
let batPoss: v2.V2[] = [];

let sim: State = {
  time: 0,
  ball: {
    lastBounceTime: 0,
    lastBounceState: INITIAL_BALL_STATE,
  },
  bat: {
    pos: [0, 0],
    vel: [0, 0],
  },
};

function onMouseMove(e: MouseEvent) {
  batPosScr = [e.clientX, e.clientY];
}

function onKeyDown(e: KeyboardEvent) {
  console.log(e);
  if (e.code === "Space") {
    sim = {
      ...sim,
      ball: { lastBounceTime: sim.time, lastBounceState: INITIAL_BALL_STATE },
    };
  }
}

function draw(time: number) {
  const canvas = document.querySelector("canvas");
  if (canvas instanceof HTMLCanvasElement) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    const scale = width / 4;

    const curBatPos: undefined | v2.V2 = batPosScr
      ? v2.sub(
        v2.mul(batPosScr, [1 / scale, -1 / scale]),
        [2, -3],
      )
      : undefined;

    if (curBatPos) {
      batPoss = [
        curBatPos,
        ...batPoss.reverse(),
      ].slice(0, MOUSE_SMOOTHING_FRAMES).reverse();
    }
    const avgBatPos = batPoss.length === 0 ? sim.bat.pos : v2.mul(
      batPoss.reduce((p, c) => v2.add(p, c), v2.ZERO),
      1 / batPoss.length,
    );

    if (sim.time === 0) {
      sim = { ...sim, time: TIME_SCALE * time / 1000 };
    } else {
      sim = step(
        sim,
        TIME_SCALE * (time / 1000) - sim.time,
        avgBatPos || sim.bat.pos,
      );
    }

    const ball = advance(
      sim.ball.lastBounceState,
      GRAVITY,
      sim.time - sim.ball.lastBounceTime,
    );

    const ctx = canvas.getContext("2d");
    if (ctx instanceof CanvasRenderingContext2D) {
      ctx.resetTransform();
      ctx.clearRect(0, 0, width, height);

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

document
  .querySelector("canvas")
  ?.addEventListener("mousemove", onMouseMove);

window.addEventListener("keydown", onKeyDown);

window.requestAnimationFrame(draw);
