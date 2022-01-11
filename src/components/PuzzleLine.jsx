import * as React from "react";
import { styled } from "@mui/material/styles";

import Puzzle, { Direction } from "../classes/Puzzle";

import { PIECESZ } from "./PuzzlePiece/info";

function PuzzleLine({ puzzle, points, currDir, currDist }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  const getCurrent = (point, dir, dist) => {
    let x = point.x;
    let y = point.y;

    switch (dir) {
      case Direction.UP:
        y -= dist / 100;
        break;
      case Direction.RIGHT:
        x += dist / 100;
        break;
      case Direction.DOWN:
        y += dist / 100;
        break;
      case Direction.LEFT:
        x -= dist / 100;
        break;
      default:
        break;
    }

    return { x, y };
  };

  let lastPoint;
  if (points.length !== 0)
    lastPoint = getCurrent(points[points.length - 1], currDir, currDist);

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
