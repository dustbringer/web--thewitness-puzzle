import * as React from "react";

function EndIntersection(props) {
  return (
    <g {...props}>
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        stroke="black"
        stroke-width="20"
      ></line>

      <line
        x1="50"
        y1="0"
        x2="50"
        y2="80"
        stroke="black"
        stroke-width="20"
        stroke-linecap="round"
      ></line>
    </g>
  );
}

export default EndIntersection;
