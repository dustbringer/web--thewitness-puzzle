import * as React from "react";
import { styled } from "@mui/material/styles";
import MUIContainer from "@mui/material/Container";

import PuzzlePiece from "./PuzzlePiece";
import { PIECESZ } from "./PuzzlePiece/info";

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

  // Perfect Viewbox Size
  const viewh = (PIECESZ / 2) * (puzzle.gridh + 1);
  const vieww = (PIECESZ / 2) * (puzzle.gridw + 1);

  return (
    <svg width="500px" height="500px" viewBox={`0 0 ${viewh} ${vieww}`}>
      {puzzle.grid.map((col, i1) => (
        <React.Fragment key={`Fragment${i1}`}>
          {col.map((e, i2) => (
            <PuzzlePiece key={`${i1}${i2}`} puzzle={puzzle} x={i1} y={i2} />
          ))}
        </React.Fragment>
      ))}
    </svg>
  );
}

export default PuzzleView;
