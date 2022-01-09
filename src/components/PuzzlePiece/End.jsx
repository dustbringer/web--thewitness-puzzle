import * as React from "react";

function End(props) {
  return (
    <g {...props}>
      <line
        x1="50"
        y1="20"
        x2="50"
        y2="50"
        stroke="black"
        stroke-width="20"
        stroke-linecap="round"
      ></line>
    </g>
  );
}

export default End;
