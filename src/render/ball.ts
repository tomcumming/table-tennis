import { Ball } from "../sim/sim";
import { SubsNode, Cleanup } from "./subsnode";
import { ballRadius } from "../constants";
import { Observable } from "rxjs";

export default function ball(state$: Observable<Ball>): SubsNode {
  const ball: SVGElement & Cleanup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  ball.classList.add("ball");

  ball.setAttribute("r", `${ballRadius}`);

  ball.subs = state$.subscribe((state) => {
    ball.setAttribute("cx", `${state.pos[0]}`);
    ball.setAttribute("cy", `${state.pos[1]}`);
  });

  return ball;
}
