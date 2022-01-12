import * as React from "react";
import { BREAKWIDTH, LINEWIDTH } from "./info";

/*
 * Another way to have the edges rounded:
 * Have dashed line (with rounded caps) and
 * rectangles to cover the inner roundedness
 */
function Break(props) {
  return (
    <g {...props}>
      <circle cx="0" cy="50" r="10" />
      <line
        x1="0"
        y1="50"
        x2={`${50 - BREAKWIDTH / 2}`}
        y2="50"
        stroke="black"
        strokeWidth={LINEWIDTH}
      ></line>
      <circle cx="100" cy="50" r="10" />
      <line
        x1={`${50 + BREAKWIDTH / 2}`}
        y1="50"
        x2="100"
        y2="50"
        stroke="black"
        strokeWidth={LINEWIDTH}
      ></line>
    </g>
  );
}

export default Break;
