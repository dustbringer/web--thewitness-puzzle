import * as React from "react";
import { styled } from "@mui/material/styles";

import FixedSVG from "../../FixedSVG";

import Puzzle from "../../../classes/Puzzle";
import Direction from "../../../enums/Direction";
import { getViewboxSize } from "../../../util/puzzleDisplayUtil";
import { PIECESZ, LINEWIDTH, STARTRAD } from "../../PuzzlePiece/info";

function PuzzleLineRaw({ puzzle, width, points, currDir, currDist }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  // Perfect Viewbox Size
  const { viewh, vieww, sizeRatio } = getViewboxSize(puzzle);

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

  let firstPoint;
  if (points.length !== 0) firstPoint = points[0];

  let lastPoint;
  if (points.length !== 0)
    lastPoint = getCurrent(points[points.length - 1], currDir, currDist);

  return (
    <FixedSVG
      width={`${width}px`}
      height={`${width * sizeRatio}px`}
      viewBox={`0 0 ${vieww} ${viewh}`}
    >
      <g transform="translate(50, 50)">
        <circle
          cx={`${(firstPoint.x * PIECESZ) / 2}`}
          cy={`${(firstPoint.y * PIECESZ) / 2}`}
          r={STARTRAD}
          fill="red"
        />
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
              strokeWidth={LINEWIDTH}
              strokeLinecap="round"
            ></line>
          );
        })}

        {lastPoint && (
          <line
            x1={`${(points[points.length - 1].x * PIECESZ) / 2}`}
            y1={`${(points[points.length - 1].y * PIECESZ) / 2}`}
            x2={`${(lastPoint.x * PIECESZ) / 2}`}
            y2={`${(lastPoint.y * PIECESZ) / 2}`}
            stroke="red"
            strokeWidth={LINEWIDTH}
            strokeLinecap="round"
          ></line>
        )}
      </g>
    </FixedSVG>
  );
}

export default PuzzleLineRaw;
