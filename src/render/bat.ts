import { Observable } from "rxjs";

import { SubsElem, Cleanup } from "./subs-elem";
import { Seconds, Bat } from "../sim/sim";
import { V2, v2Add, v2Muls } from "../sim/math";
import { batRadius } from "../constants";

export default function bat(state$: Observable<Bat>): SubsElem {
  const bat: SVGElement & Cleanup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  bat.classList.add("bat");

  const surface = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  surface.classList.add("surface");

  surface.setAttribute("r", `${batRadius}`);

  const trail = document.createElementNS("http://www.w3.org/2000/svg", "line");
  trail.classList.add("trail");

  bat.appendChild(surface);
  bat.appendChild(trail);

  bat.subs = state$.subscribe((state) => {
    surface.setAttribute("cx", `${state.pos[0]}`);
    surface.setAttribute("cy", `${state.pos[1]}`);

    const trailEnd = v2Add(state.pos, v2Muls(state.vel, -0.1));

    trail.setAttribute("x1", `${state.pos[0]}`);
    trail.setAttribute("y1", `${state.pos[1]}`);
    trail.setAttribute("x2", `${trailEnd[0]}`);
    trail.setAttribute("y2", `${trailEnd[1]}`);
  });

  return bat;
}
