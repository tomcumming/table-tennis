import { Observable } from "rxjs";

import { SubsNode, Cleanup } from "./subsnode";
import { Seconds } from "../sim/sim";
import { V2 } from "../sim/math";
import { batRadius } from "../constants";

export type BatState = {
  time: Seconds;
  bat: V2;
};

export default function bat(state$: Observable<BatState>): SubsNode {
  const bat: SVGElement & Cleanup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  bat.classList.add("bat");

  bat.setAttribute("r", `${batRadius}`);

  bat.subs = state$.subscribe((state) => {
    bat.setAttribute("cx", `${state.bat[0]}`);
    bat.setAttribute("cy", `${state.bat[1]}`);
  });

  return bat;
}
