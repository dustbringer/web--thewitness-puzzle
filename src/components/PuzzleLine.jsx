import * as React from "react";
import { styled } from "@mui/material/styles";

import Puzzle, { Direction } from "../classes/Puzzle";

import { PIECESZ } from "./PuzzlePiece/info";

function PuzzleLine({ puzzle, points, current }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  const getCurrent = (point, vec) => {
    let x = point.x;
    let y = point.y;

    switch (vec.dir) {
      case Direction.UP:
        y -= vec.dist / 100;
        break;
      case Direction.RIGHT:
        x += vec.dist / 100;
        break;
      case Direction.DOWN:
        y += vec.dist / 100;
        break;
      case Direction.LEFT:
        x -= vec.dist / 100;
        break;
    }

    return { x, y };
  };

  let lastPoint;
  if (points.length !== 0) lastPoint = getCurrent(points[points.length - 1], current);

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
            stroke="cyan"
            strokeWidth="20"
            strokeLinecap="round"
          ></line>
        );
      })}

      {points.length !== 0 && (
        <line
          x1={`${(points[points.length - 1].x * PIECESZ) / 2}`}
          y1={`${(points[points.length - 1].y * PIECESZ) / 2}`}
          x2={`${(lastPoint.x * PIECESZ) / 2}`}
          y2={`${(lastPoint.y * PIECESZ) / 2}`}
          stroke="cyan"
          strokeWidth="20"
          strokeLinecap="round"
        ></line>
      )}
    </g>
  );
}

export default PuzzleLine;
