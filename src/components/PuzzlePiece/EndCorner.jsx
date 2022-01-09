import * as React from "react";

function EndCorner(props) {
  return (
    <g {...props}>
      <line
        x1="20"
        y1="50"
        x2="100"
        y2="50"
        stroke="black"
        stroke-width="20"
        stroke-linecap="round"
      ></line>
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="100"
        stroke="black"
        stroke-width="20"
      ></line>
    </g>
  );
}

export default EndCorner;
