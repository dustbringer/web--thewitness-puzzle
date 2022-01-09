import * as React from "react";
import { isEdge, isVertical } from "../../util/puzzle_grid_util";

import Break from "./Break";
import EdgeSquare from "./EdgeSquare";
import EdgeRound from "./EdgeRound";
import End from "./End";
import Start from "./Start";

import Puzzle from "../../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../../enums/Sym"

const PIECESZ = 100;

function PuzzlePiece({ puzzle, x, y }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  if(!isEdge(x, y)) return <></>;

  const NewEdge = EdgeRound;
  let rotVal = '0';
  if(isVertical(x, y)) {
    rotVal = '90';
  }

  return <NewEdge transform={`translate(${PIECESZ * x}, ${PIECESZ * y}) rotate(${rotVal}, 50, 50)`} />
}

export default PuzzlePiece;
