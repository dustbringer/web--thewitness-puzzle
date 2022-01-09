import * as React from "react";

function Edge(props) {
  return (
    <g {...props}>
      <rect
        y={50 - 16.56 / 2}
        width="100"
        height="16.56"
      />
    </g>
  );
}

export default Edge;
