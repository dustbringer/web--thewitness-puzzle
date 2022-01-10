import * as React from "react";
import { styled } from "@mui/material/styles";

import Puzzle from "../classes/Puzzle";

import { PIECESZ } from "./PuzzlePiece/info";

function PuzzleLine({ puzzle, points, current }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  return (
    <g>
        <line
        x1="0"
        y1="0"
        x2="0"
        y2="0"
        stroke="white"
        strokeWidth="20"
        strokeLinecap="round"
      ></line>
    </g>
  );
}

export default PuzzleLine;
