import { ZERO } from "../math/v2.ts";

function draw() {
  const canvas = document.querySelector("canvas");
  if (canvas instanceof HTMLCanvasElement) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (ctx instanceof CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, width, height);

      for (let x = 0; x < width; x += 100) {
        ctx.fillRect(x, 0, 10, height);
      }

      for (let y = 0; y < height; y += 100) {
        ctx.fillRect(0, y, width, 10);
      }

      return;
    }
  }
  throw new Error(`Could not set up context`);
}

draw();
