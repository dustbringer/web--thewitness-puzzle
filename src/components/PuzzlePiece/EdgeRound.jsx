import * as React from "react";

function EdgeRound(props) {
  return (
    <g {...props}>
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        stroke="black"
        stroke-width="20"
        stroke-linecap="round"
      ></line>
    </g>
  );
}

export default EdgeRound;
