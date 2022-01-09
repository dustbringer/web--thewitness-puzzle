import * as React from "react";
import { isEdge, isVertex, isVertical } from "../../util/puzzle_grid_util";

import Break from "./Break";
import EdgeSquare from "./EdgeSquare";
import EdgeRound from "./EdgeRound";
import End from "./End";
import Start from "./Start";

import Puzzle from "../../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../../enums/Sym";

const PIECESZ = 100;

function PuzzlePiece({ puzzle, x, y }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  if (isSpace(x, y)) return <></>;

  let rotVal = "0";

  if (puzzle.isEnd(x, y)) {
    if (x === 0) {

    } else if (y === 0) {

    } else if (x === puzzle.gridw - 1) {

    } else {
      
    }
    return (
      <Start
        transform={`translate(${(PIECESZ / 2) * x}, ${(PIECESZ / 2) * y})`}
      />
    );
  }

  if (isVertex(x, y) && puzzle.isStart(x, y)) {
    return (
      <Start
        transform={`translate(${(PIECESZ / 2) * x}, ${(PIECESZ / 2) * y})`}
      />
    );
  }

  if (!isEdge(x, y)) return <></>;

  if (isVertical(x, y)) {
    rotVal = "90";
  }

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
      }) rotate(${rotVal}, 50, 50)`}
    />
  );
}

export default PuzzlePiece;
