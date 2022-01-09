import * as React from "react";
import { styled } from "@mui/material/styles";
import MUIContainer from "@mui/material/Container";

import PuzzlePiece from "./PuzzlePiece";

import Puzzle from "../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";

const FixedSizeDiv = styled("div")`
  // height: 1000px;
  // width: 1000px;
`;

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
    <FixedSizeDiv>
      <PuzzlePiece puzzle={puzzle} x={1} y={1} />
    </FixedSizeDiv>
  );
}

export default PuzzleView;
