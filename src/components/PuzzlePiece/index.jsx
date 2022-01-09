import * as React from "react";
import Break from "./Break";
import Cap1 from "./Cap1";
import Cap2 from "./Cap2";
import Cap3 from "./Cap3";
import Edge from "./Edge";
import EndCorner from "./EndCorner";
import EndEdge from "./EndEdge";
import Intersection1 from "./Intersection1";
import Intersection2 from "./Intersection2";
import Intersection3 from "./Intersection3";
import Intersection4 from "./Intersection4";

import Puzzle from "../../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../../enums/Sym";

function PuzzlePiece({ puzzle, x, y }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  return (
    <svg width="300px" height="300px" viewBox="0 0 500 500">
      {/* <Break transform="rotate(600, 50, 50)" /> */}
      {/* <Cap1 /> */}
      {/* <Cap2 /> */}
      {/* <Cap3 /> */}
      {/* <Edge /> */}
      {/* <EndCorner /> */}
      {/* <EndEdge /> */}
      {/* <Intersection1 /> */}
      {/* <Intersection2 /> */}
      {/* <Intersection3 /> */}
      {/* <Intersection4 /> */}
    </svg>
  );
}

export default PuzzlePiece;
