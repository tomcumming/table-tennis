import { Ball, Seconds } from "../sim/sim";
import { SubsNode, Cleanup } from "./subsnode";
import { ballRadius } from "../constants";
import { Observable } from "rxjs";

export type BallState = {
  time: Seconds;
  ball: Ball;
};

export default function ball(state$: Observable<BallState>): SubsNode {
  const ball: SVGElement & Cleanup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  ball.classList.add("ball");

  const current = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  current.classList.add("current");

  current.setAttribute("r", `${ballRadius}`);

  ball.appendChild(current);

  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline"
  );
  pathElement.classList.add("path");

  ball.appendChild(pathElement);

  const trailTime = 0.25;

  let lasts: BallState[] = [];

  ball.subs = state$.subscribe((state) => {
    lasts.push(state);
    while (lasts[0].time < state.time - trailTime) lasts = lasts.slice(1);

    current.setAttribute("cx", `${state.ball.pos[0]}`);
    current.setAttribute("cy", `${state.ball.pos[1]}`);

    const points = lasts.map(({ ball }) => `${ball.pos[0]},${ball.pos[1]}`);
    pathElement.setAttribute("points", `${points.join(" ")}`);
  });

  return ball;
}
