import * as React from "react";
import { LINEWIDTH } from "./info";

function EdgeRound(props) {
  return (
    <g {...props}>
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        stroke="black"
        strokeWidth={LINEWIDTH}
        strokeLinecap="round"
      ></line>
    </g>
  );
}

export default EdgeRound;
