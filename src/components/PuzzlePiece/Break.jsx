import * as React from "react";

function Break(props) {
  return (
    <g {...props}>
      <line
        x1="0"
        y1="50"
        x2="33.33"
        y2="50"
        stroke="black"
        stroke-width="20"
      ></line>
      <line
        x1="66.67"
        y1="50"
        x2="100"
        y2="50"
        stroke="black"
        stroke-width="20"
      ></line>
    </g>
  );
}

export default Break;
