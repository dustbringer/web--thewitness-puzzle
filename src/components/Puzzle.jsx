import * as React from "react";
import { styled } from "@mui/material/styles";

import PuzzleGrid from "./PuzzleGrid";
import PuzzleLine from "./PuzzleLine";

import PuzzleClass from "../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";
import { PIECESZ, STARTRAD } from "./PuzzlePiece/info";

function Puzzle({ puzzle }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  // Perfect Viewbox Size
  const viewh = (PIECESZ / 2) * (puzzle.gridh + 1);
  const vieww = (PIECESZ / 2) * (puzzle.gridw + 1);
  const sizeRatio = (puzzle.gridh + 1) / (puzzle.gridw + 1);

  const pixelsPerUnit = 500 / vieww;
  const relativePieceSize = PIECESZ * pixelsPerUnit; // In pixels

  const Root = styled("div")`
    position: relative;
  `;

  const StartButton = styled("div")`
    width: ${STARTRAD * 2 * pixelsPerUnit}px;
    height: ${STARTRAD * 2 * pixelsPerUnit}px;
    position: absolute;
    background-color: red;
    top: ${(props) => props.top}px;
    left: ${(props) => props.left}px;
  `;

  return (
    <>
      <Root>
        <StartButton top="10" left="240"></StartButton>
      </Root>
      <svg
        width="500px"
        height={`${500 * sizeRatio}px`}
        viewBox={`0 0 ${vieww} ${viewh}`}
      >
        <PuzzleGrid puzzle={puzzle} />
        <PuzzleLine puzzle={puzzle} />
      </svg>
    </>
  );
}

export default Puzzle;
