import * as React from "react";
import { LINEWIDTH } from "./info";

function VertexSquare(props) {
  const translateToCenter = 50 - LINEWIDTH / 2;
  return (
    <g {...props}>
      <rect
        width={LINEWIDTH}
        height={LINEWIDTH}
        transform={`translate(${translateToCenter}, ${translateToCenter})`}
      />
    </g>
  );
}

export default VertexSquare;
