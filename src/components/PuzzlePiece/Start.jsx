import * as React from "react";

import { STARTRAD } from "./info";

function Start(props) {
  return (
    <g {...props}>
      <circle cx="50" cy="50" r={`${STARTRAD}`} />
    </g>
  );
}

export default Start;
