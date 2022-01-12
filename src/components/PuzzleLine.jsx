import * as React from "react";
import { styled } from "@mui/material/styles";

import useStateRef from "../hooks/useStateRef";
import PuzzleLineRaw from "./PuzzleLineRaw";
import PuzzleLineStart from "./PuzzleLineStart";

import PuzzleClass from "../classes/Puzzle";
import Direction from "../enums/Direction";
import {
  getDirX,
  getDirY,
  getDirInfo,
  reverseDir,
} from "../util/directionUtil";
import { getViewboxSize } from "../util/puzzleDisplayUtil";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";
import { PIECESZ, STARTRAD, LINEWIDTH } from "./PuzzlePiece/info";

// TODO: update this
const EDGESEGMAX = 200;
const moveCap = 60;
const assistSpeed = 5;

function PuzzleLine({ puzzle, width }) {
  const [linePoints, setLinePoints, linePointsRef] = useStateRef([]);
  const [currDir, setCurrDir, currDirRef] = useStateRef(Direction.UP);
  const [currDist, setCurrDist, currDistRef] = useStateRef(0);

  // TODO: VICTOR LOOK HERE PLEASE
  const outOfBounds = (curr, dir) => {
    return (
      (curr.x === 0 && dir === Direction.LEFT) ||
      (curr.x >= puzzle.gridw - 1 && dir === Direction.RIGHT) ||
      (curr.y === 0 && dir === Direction.UP) ||
      (curr.y >= puzzle.gridh - 1 && dir === Direction.DOWN)
    );
  };

  const handleMouseMove = (e) => {
    // TODO: check valid edge is desired direction
    // TODO: fix up directional switch statement (probably pass in functions)
    // TODO: account for starting position on edge
    // TODO: clicking escape keeps last line segment

    let updatedDist = currDistRef.current;
    let updatedDir = currDirRef.current;

    const x =
      Math.abs(e.movementX) > moveCap
        ? moveCap * (x / Math.abs(x))
        : e.movementX;
    const y =
      Math.abs(e.movementY) > moveCap
        ? moveCap * (y / Math.abs(y))
        : e.movementY;

    const { xDir, yDir, xAbs, yAbs, maxDist, minDist, maxDir, minDir } =
      getDirInfo(x, y);

    // The larger of the x and y inputs
    const largerDist = Math.abs(x) > Math.abs(y) ? Math.abs(x) : Math.abs(y);
    const largerDir =
      Math.abs(x) > Math.abs(y)
        ? x > 0
          ? Direction.RIGHT
          : Direction.LEFT
        : y > 0
        ? Direction.DOWN
        : Direction.UP;

    let currPoint = null;
    if (linePointsRef.current.length > 0)
      currPoint = linePointsRef.current[linePointsRef.current.length - 1];
    let lastPoint = null;
    if (linePointsRef.current.length > 1)
      lastPoint = linePointsRef.current[linePointsRef.current.length - 2];

    const containsPoint = (p, pointArr) => {
      for (let i of pointArr) {
        if (i.x === p.x && i.y === p.y) {
          return true;
        }
      }
      return false;
    };

    // check if near vertex
    if (updatedDist <= 4) {
      let valToAdd = 0;
      if (Math.abs(x) > Math.abs(y)) {
        if (x > 0) updatedDir = Direction.RIGHT;
        else updatedDir = Direction.LEFT;
        valToAdd = Math.abs(x);
      } else {
        if (y > 0) updatedDir = Direction.DOWN;
        else updatedDir = Direction.UP;
        valToAdd = Math.abs(y);
      }

      // TODO: replace out of bounds with checking if valid edge
      if (!outOfBounds(currPoint, updatedDir)) {
        updatedDist += valToAdd;
      } else {
        console.log("goodbye");
        updatedDist = 0;
      }
    } else {
      // add or subtract y based on current direction's positive movement
      const nextPoint = {
        ...currPoint,
      };
      let distDiff = 0;

      // assign variables based on current direction
      switch (updatedDir) {
        case Direction.UP:
          nextPoint.y -= 2;
          distDiff = -y;
          break;
        case Direction.RIGHT:
          nextPoint.x += 2;
          distDiff = +x;
          break;
        case Direction.DOWN:
          nextPoint.y += 2;
          distDiff = +y;
          break;
        case Direction.LEFT:
          nextPoint.x -= 2;
          distDiff = -x;
          break;
        default:
          console.log(`wtf dis direction: ${updatedDir}`);
          break;
      }

      // Corner turn assist (moving in a about perpendicular direction to edge)
      if (largerDir % 2 !== updatedDir % 2 && largerDist > 1) {
        distDiff += updatedDist > EDGESEGMAX / 2 ? assistSpeed : -assistSpeed;
      }

      // check if distance should be added
      if (
        updatedDist + LINEWIDTH * 2 < EDGESEGMAX ||
        !containsPoint(nextPoint, linePointsRef.current) ||
        updatedDist + distDiff < updatedDist
      ) {
        if (
          containsPoint(nextPoint, linePointsRef.current) &&
          updatedDist + distDiff > EDGESEGMAX - LINEWIDTH * 2
        ) {
          updatedDist = EDGESEGMAX - LINEWIDTH * 2;
        } else {
          updatedDist += distDiff;
        }
      }

      // check if new point should be added
      if (updatedDist >= EDGESEGMAX) {
        // TODO: check if direction is valid
        setLinePoints((points) => [...points, nextPoint]);
        if (!outOfBounds(nextPoint, updatedDir)) {
          updatedDist -= EDGESEGMAX;
        } else {
          updatedDist = 0;
        }
      }
    }

    // check if last point needs removing
    if (lastPoint !== null) {
      // TODO: change if statement into function
      if (
        (updatedDir === Direction.UP && currPoint.y - 2 === lastPoint.y) ||
        (updatedDir === Direction.RIGHT && currPoint.x + 2 === lastPoint.x) ||
        (updatedDir === Direction.DOWN && currPoint.y + 2 === lastPoint.y) ||
        (updatedDir === Direction.LEFT && currPoint.x - 2 === lastPoint.x)
      ) {
        setLinePoints((points) => {
          return points.slice(0, points.length - 1);
        });
        updatedDist = EDGESEGMAX - updatedDist;
        if (updatedDir === Direction.RIGHT) {
          updatedDir = Direction.LEFT;
        } else {
          updatedDir = Math.abs(updatedDir - 2);
        }
      }
    }

    setCurrDist(updatedDist);
    setCurrDir(updatedDir);
  };

  const handleStart = (i) => {
    setLinePoints([puzzle.start[i]]);
    setCurrDist(0);
    setCurrDir(Direction.UP);
  };

  return (
    <>
      <PuzzleLineRaw
        puzzle={puzzle}
        width={width}
        points={linePoints}
        currDir={currDir}
        currDist={currDist}
      />
      <PuzzleLineStart
        puzzle={puzzle}
        width={width}
        handleStart={handleStart}
        handleMouseMove={handleMouseMove}
      />
      <button
        style={{
          position: "relative",
          top: `${500 * getViewboxSize(puzzle).sizeRatio}px`,
        }}
        onClick={() => console.log(linePoints)}
      >
        Hi, I'm a button :)
      </button>
    </>
  );
}

export default PuzzleLine;
