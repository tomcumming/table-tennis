import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { SubsNode, Cleanup } from "./subsnode";
import table from "./table";
import ball, { BallState } from "./ball";

import { tableLength, tableHeight } from "../constants";
import { State } from "../sim/sim";

export default function sim(state$: Observable<State>): SubsNode {
  const svg: SVGElement & Cleanup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  const margin = 0.05;
  const viewHeight = tableHeight * 2.5;

  svg.setAttribute(
    "viewBox",
    `${-(tableLength + margin)} 0 ${tableLength + margin * 2} ${viewHeight}`
  );
  svg.classList.add("table-tennis");

  const transformGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );

  transformGroup.setAttribute(
    "transform",
    `scale(1 -1) translate(0 ${-viewHeight})`
  );

  svg.appendChild(transformGroup);

  transformGroup.appendChild(table(tableLength, tableHeight));
  transformGroup.appendChild(ball(state$.pipe(map(asBallState))));

  return svg;
}

function asBallState({ time, ball }: State): BallState {
  return { time, ball };
}
