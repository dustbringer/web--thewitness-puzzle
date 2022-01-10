import * as React from "react";
import {
  isSpace,
  isEdge,
  isVertex,
  isVertical,
} from "../../util/puzzle_grid_util";

import Break from "./Break";
import EdgeSquare from "./EdgeSquare";
import EdgeRound from "./EdgeRound";
import End from "./End";
import Start from "./Start";

import Puzzle from "../../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../../enums/Sym";
import { PIECESZ } from "./info";

const getEndRot = (puzzle, x, y) => {
  if (x === 0) {
    return 270;
  } else if (y === 0) {
    return 0;
  } else if (x === puzzle.gridw - 1) {
    return 90;
  } else {
    return 180;
  }
};

/* ONLY RUN THIS ON VERTICES */
function Vertex({ puzzle, x, y }) {
  return puzzle.isStart(x, y) ? (
    // Render start
    <Start
      transform={`translate(${(PIECESZ / 2) * x}, ${(PIECESZ / 2) * y})`}
    />
  ) : (
    <></>
  );
}

/* ONLY RUN THIS ON EDGES */
function Edge({ puzzle, x, y }) {
  let NewEdge;
  if (puzzle.checkSymbol(x, y, EdgSym.break)) {
    NewEdge = Break;
  } else {
    NewEdge = EdgeRound;
  }

  return (
    <NewEdge
      transform={`translate(${(PIECESZ / 2) * x}, ${
        (PIECESZ / 2) * y
      }) rotate(${isVertical(x, y) ? 90 : 0}, 50, 50)`}
    />
  );
}

/* ONLY RUN THIS ON SPACES */
function Space({ puzzle, x, y }) {
  return <></>;
}

/* MAIN COMPONENT */
function PuzzlePiece({ puzzle, x, y }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  return (
    <>
      {/* Render Vertex */}
      {isVertex(x, y) && <Vertex puzzle={puzzle} x={x} y={y} />}

      {/* Render Space */}
      {isSpace(x, y) && <Space puzzle={puzzle} x={x} y={y} />}

      {/* Render Edge */}
      {isEdge(x, y) && <Edge puzzle={puzzle} x={x} y={y} />}

      {puzzle.isEnd(x, y) && (
        <End
          transform={`translate(${(PIECESZ / 2) * x}, ${
            (PIECESZ / 2) * y
          }) rotate(${getEndRot(puzzle, x, y)}, 50, 50)`}
        />
      )}
    </>
  );
}

export default PuzzlePiece;
