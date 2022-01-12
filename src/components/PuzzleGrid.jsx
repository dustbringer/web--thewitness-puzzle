import * as React from "react";
import { styled } from "@mui/material/styles";

import FixedSVG from "./FixedSVG";
import PuzzlePiece from "./PuzzlePiece";

import Puzzle from "../classes/Puzzle";
import { getViewboxSize } from "../util/puzzleDisplayUtil";

function PuzzleGrid({ puzzle, width }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  // Perfect Viewbox Size
  const { viewh, vieww, sizeRatio } = getViewboxSize(puzzle);

  return (
    <FixedSVG
      width={`${width}px`}
      height={`${width * sizeRatio}px`}
      viewBox={`0 0 ${vieww} ${viewh}`}
    >
      {puzzle.grid.map((col, i1) => (
        <React.Fragment key={`Fragment${i1}`}>
          {col.map((e, i2) => (
            <PuzzlePiece key={`${i1}${i2}`} puzzle={puzzle} x={i1} y={i2} />
          ))}
        </React.Fragment>
      ))}
    </FixedSVG>
  );
}

export default PuzzleGrid;
