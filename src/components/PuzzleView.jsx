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

  return (
    <svg width="150px" height="150px" viewBox="0 0 500 500">
      {puzzle.grid.map((row, i1) => (
        <>
          {row.map((e, i2) => (
            <PuzzlePiece key={`${i1}${i2}`} puzzle={puzzle} x={i1} y={i2} />
          ))}
        </>
      ))}
      <PuzzlePiece puzzle={puzzle} x={1} y={0} />
      <PuzzlePiece puzzle={puzzle} x={0} y={1} />
    </svg>
  );
}

export default PuzzleView;
