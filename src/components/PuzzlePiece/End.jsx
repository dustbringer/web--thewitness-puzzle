import * as React from "react";
import { LINEWIDTH } from "./info";

function End(props) {
  return (
    <g {...props}>
      <line
        x1="50"
        y1="20"
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
