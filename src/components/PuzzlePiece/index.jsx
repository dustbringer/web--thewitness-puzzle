import * as React from "react";
import {
  isSpace,
  isEdge,
  isVertex,
  isVertical,
} from "../../util/puzzleGridUtil";

import Break from "./Break";
import EdgeSquare from "./EdgeSquare";
import EdgeRound from "./EdgeRound";
import End from "./End";
import EndDiagonal from "./EndDiagonal";
import Start from "./Start";

import Puzzle from "../../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../../enums/Sym";
import Orientation from "../../enums/Orientation";
import { PIECESZ } from "./info";

const getEndRot = (puzzle, x, y) => {
  const o = puzzle.getEndOrientation(x, y);
  switch (o) {
    case Orientation.HORIZONTAL:
      if (x === 0) return -90;
      else return 90;
    case Orientation.VERTICAL:
      if (y === 0) return 0;
      else return 180;
    case Orientation.DIAGONAL:
      if (x === 0 && y === 0) return 0;
      else if (x === puzzle.gridw - 1 && y === 0) return 90;
      else if (x === 0 && y === puzzle.gridw - 1) return -90;
      else return 180;
    default:
      // if not a corner, or orientation missing
      if (x === 0) return -90;
      else if (y === 0) return 0;
      else if (x === puzzle.gridw - 1) return 90;
      else return 180;
  }
};

/* ONLY RUN THIS ON VERTICES */
function Vertex({ puzzle, x, y }) {
  if (puzzle.isEmpty(x, y)) return <></>;

  // TODO: if there is exactly one edge, show vertex square
  return <></>;
}

/* ONLY RUN THIS ON EDGES */
function Edge({ puzzle, x, y }) {
  if (puzzle.isEmpty(x, y)) return <></>;

  let NewEdge;
  if (puzzle.checkSymbol(x, y, EdgSym.BREAK)) {
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
  if (puzzle.isEmpty(x, y)) return <></>;

  return <></>;
}

/* MAIN COMPONENT */
function PuzzlePiece({ puzzle, x, y }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  const EndComponent =
    puzzle.getEndOrientation(x, y) === Orientation.DIAGONAL ? EndDiagonal : End;

  return (
    <>
      {/* Render Vertex */}
      {isVertex(x, y) && <Vertex puzzle={puzzle} x={x} y={y} />}

      {/* Render Space */}
      {isSpace(x, y) && <Space puzzle={puzzle} x={x} y={y} />}

      {/* Render Edge */}
      {isEdge(x, y) && <Edge puzzle={puzzle} x={x} y={y} />}

      {puzzle.isStart(x, y) && (
        <Start
          transform={`translate(${(PIECESZ / 2) * x}, ${(PIECESZ / 2) * y})`}
        />
      )}

      {puzzle.isEnd(x, y) && (
        <EndComponent
          transform={`translate(${(PIECESZ / 2) * x}, ${
            (PIECESZ / 2) * y
          }) rotate(${getEndRot(puzzle, x, y)}, 50, 50)`}
        />
      )}
    </>
  );
}

export default PuzzlePiece;
