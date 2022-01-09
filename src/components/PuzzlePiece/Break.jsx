import * as React from "react";

function Break(props) {
  return (
    <g {...props}>
      <rect y={50 - 16.56 / 2} width="33.33" height="16.56" />
      <rect x="66.67" y={50 - 16.56 / 2} width="33.33" height="16.56" />
    </g>
  );
}

export default Break;
