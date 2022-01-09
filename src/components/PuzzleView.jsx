import * as React from "react";
import PuzzlePiece from "./PuzzlePiece";

import Puzzle from "../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";

function PuzzleView({ puzzle }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }
  // const p = new Puzzle(1, 4);
  // p.addStart(0, 0);
  // p.addEnd(2, 8);
  // p.addEdgSym(0, 1, EdgSym.break);
  // p.addVtxSym(0, 2, VtxSym.dot);
  // p.addSpcSym(1, 1, SpcSym.sun);

  return (
    <div>
      <PuzzlePiece puzzle={puzzle} x={1} y={1} />
    </div>
  );
}

export default PuzzleView;
