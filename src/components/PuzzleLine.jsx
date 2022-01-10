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
    <g transform="translate(50, 50)">
      {points.map((e, i) => {
        return i === points.length - 1 ? (
          <React.Fragment key={`${i}`}></React.Fragment>
        ) : (
          <line
            key={`${i}`}
            x1={`${(e.x * PIECESZ) / 2}`}
            y1={`${(e.y * PIECESZ) / 2}`}
            x2={`${(points[i + 1].x * PIECESZ) / 2}`}
            y2={`${(points[i + 1].y * PIECESZ) / 2}`}
            stroke="red"
            strokeWidth="20"
            strokeLinecap="round"
          ></line>
        );
      })}
    </g>
  );
}

export default PuzzleLine;
