import * as React from "react";
import { styled } from "@mui/material/styles";

import useStateRef from "../hooks/useStateRef";
import PuzzleLineRaw from "./PuzzleLineRaw";
import PuzzleLineStart from "./PuzzleLineStart";

import PuzzleClass, { Direction } from "../classes/Puzzle";
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

  const handleMouseMove = (e) => {
    // TODO: change ref values at end
    // TODO: check valid edge is desired direction
    // TODO: fix up directional switch statement (probably pass in functions)
    // TODO: account for starting position on edge

    let x = e.movementX;
    if (Math.abs(x) > moveCap) {
      if (x > 0) x = moveCap;
      else x = -moveCap;
    }
    let y = e.movementY;
    if (Math.abs(y) > moveCap) {
      if (y > 0) y = moveCap;
      else y = -moveCap;
    }
    console.log(`X: ${e.movementX} - ${x} --- Y: ${e.movementY} - ${y}`);

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

    const outOfBounds = (curr, dir) => {
      return (
        (curr.x === 0 && dir === Direction.LEFT) ||
        (curr.x >= puzzle.gridw - 1 && dir === Direction.RIGHT) ||
        (curr.y === 0 && dir === Direction.UP) ||
        (curr.y >= puzzle.gridh - 1 && dir === Direction.DOWN)
      );
    };

    const containsPoint = (p, pointArr) => {
      for (let i of pointArr) {
        if (i.x === p.x && i.y === p.y) {
          return true;
        }
      }
      return false;
    };

    // check if near vertex
    if (currDistRef.current <= 2) {
      let valToAdd = 0;
      if (Math.abs(x) >= 1) {
        if (x > 0) setCurrDir(Direction.RIGHT);
        else setCurrDir(Direction.LEFT);
        valToAdd = Math.abs(x);
      } else {
        if (y > 0) setCurrDir(Direction.DOWN);
        else setCurrDir(Direction.UP);
        valToAdd = Math.abs(y);
      }

      // TODO: replace out of bounds with checking if valid edge
      if (!outOfBounds(currPoint, currDirRef.current)) {
        // TODO: jumps between directions
        setCurrDist(currDistRef.current + valToAdd);
      }
    } else {
      // add or subtract y based on current direction's positive movement
      const nextPoint = {
        ...currPoint,
      };
      let distDiff = 0;

      // assign variables based on current direction
      switch (currDirRef.current) {
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
          console.log(`wtf dis direction: ${currDirRef.current}`);
          break;
      }

      // Corner turn assist (moving in a about perpendicular direction to edge)
      if (largerDir % 2 !== currDirRef.current % 2 && largerDist > 1) {
        distDiff +=
          currDistRef.current > EDGESEGMAX / 2 ? assistSpeed : -assistSpeed;
      }

      // check if distance should be added
      if (
        currDistRef.current + LINEWIDTH * 2 < EDGESEGMAX ||
        !containsPoint(nextPoint, linePointsRef.current) ||
        currDistRef.current + distDiff < currDistRef.current
      ) {
        setCurrDist(currDistRef.current + distDiff);
      }

      // check if new point should be added
      if (currDistRef.current >= EDGESEGMAX) {
        // TODO: check if direction is valid
        setLinePoints((points) => [...points, nextPoint]);
        setCurrDist(currDistRef.current - EDGESEGMAX);
      }
    }

    // check if last point needs removing
    if (lastPoint !== null) {
      if (
        (currDirRef.current === Direction.UP &&
          lastPoint.y === currPoint.y - 2) ||
        (currDirRef.current === Direction.RIGHT &&
          lastPoint.x === currPoint.x + 2) ||
        (currDirRef.current === Direction.DOWN &&
          lastPoint.y === currPoint.y + 2) ||
        (currDirRef.current === Direction.LEFT &&
          lastPoint.x === currPoint.x - 2)
      ) {
        setLinePoints((points) => {
          return points.slice(0, points.length - 1);
        });
        setCurrDist(EDGESEGMAX - currDistRef.current);
        if (currDirRef.current === Direction.RIGHT) {
          setCurrDir(Direction.LEFT);
        } else {
          setCurrDir(Math.abs(currDirRef.current - 2));
        }
      }
    }
  };

  const handleStart = (i) => {
    setLinePoints([puzzle.start[i]]);
    console.log(linePointsRef.current);
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
        asdasds
      </button>
    </>
  );
}

export default PuzzleLine;
