import { SubsNode } from "./subsnode";
import table from "./table";

import { tableLength, tableHeight } from "../constants";

export default function sim(): SubsNode {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

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

  return svg;
}
