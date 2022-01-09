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
        strokeWidth="20"
        strokeLinecap="round"
      ></line>
    </g>
  );
}

export default EdgeRound;
