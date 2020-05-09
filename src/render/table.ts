import { SubsNode } from "./subsnode";

function surface(
  length: number,
  heightOffFloor: number,
  surfaceHeight: number
): SVGElement {
  const surface = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  surface.classList.add("surface");

  surface.setAttribute("width", `${length / 2}`);
  surface.setAttribute("height", `${surfaceHeight}`);

  surface.setAttribute("x", `${-length / 2}`);
  surface.setAttribute("y", `${heightOffFloor - surfaceHeight}`);

  return surface;
}

function stand(
  x: number,
  tableHeight: number,
  surfaceHeight: number
): SVGElement {
  const stand = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  stand.classList.add("stand");

  const standWidth = 0.1;

  stand.setAttribute("width", `${standWidth}`);
  stand.setAttribute("height", `${tableHeight - surfaceHeight}`);

  stand.setAttribute("x", `${x - standWidth / 2}`);
  stand.setAttribute("y", `${0}`);

  return stand;
}

export default function table(
  length: number,
  heightOffFloor: number
): SVGElement {
  const table = document.createElementNS("http://www.w3.org/2000/svg", "g");
  table.classList.add("table");

  const surfaceHeight = 0.025;

  table.appendChild(surface(length, heightOffFloor, surfaceHeight));
  table.appendChild(stand(-(length / 3), heightOffFloor, surfaceHeight));

  return table;
}
