import * as React from "react";

function Edge(props) {
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
    </g>
  );
}

export default Edge;
