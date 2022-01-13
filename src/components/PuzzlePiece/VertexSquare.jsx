import * as React from "react";
import { LINEWIDTH } from "./info";

function VertexSquare(props) {
  const translateToCenter = 50 - LINEWIDTH / 2;
  return (
    <g {...props}>
      <line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        stroke="black"
        strokeWidth={LINEWIDTH}
      ></line>
      <rect
        width={LINEWIDTH}
        height={LINEWIDTH}
        transform={`translate(${translateToCenter}, ${translateToCenter})`}
      />
    </g>
  );
}

export default VertexSquare;
