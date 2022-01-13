import * as React from "react";
import { LINEWIDTH, ENDLENGTH } from "./info";

function EndDiagonal(props) {
  return (
    <g {...props}>
      <line
        x1="50"
        y1="50"
        x2={`${50 - ENDLENGTH}`}
        y2={`${50 - ENDLENGTH}`}
        stroke="black"
        strokeWidth={LINEWIDTH}
        strokeLinecap="round"
      ></line>
    </g>
  );
}

export default EndDiagonal;
