import * as React from "react";
import { LINEWIDTH, ENDLENGTH } from "./info";

function End(props) {
  return (
    <g {...props}>
      <line
        x1="50"
        y1={`${50 - ENDLENGTH}`}
        x2="50"
        y2="50"
        stroke="black"
        strokeWidth={LINEWIDTH}
        strokeLinecap="round"
      ></line>
    </g>
  );
}

export default End;
