import * as React from "react";
import { styled } from "@mui/material/styles";

import useStateRef from "../hooks/useStateRef";
import PuzzleLineRaw from "./PuzzleLineRaw";
import PuzzleLineStart from "./PuzzleLineStart";

import Puzzle from "../classes/Puzzle";
import Direction from "../enums/Direction";
import {
  getDirX,
  getDirY,
  getDirInfo,
  reverseDir,
  sameAxis,
  dirToSign,
  isHorizontal,
} from "../util/directionUtil";
import { getViewboxSize } from "../util/puzzleDisplayUtil";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";
import { PIECESZ, STARTRAD, LINEWIDTH, BREAKWIDTH } from "./PuzzlePiece/info";

// TODO: update this
const EDGESEGMAX = 200;
const moveCap = 60;
const assistSpeed = 5;

const capVal = (val, cap) => (Math.abs(val) > cap ? cap * Math.sign(val) : val);

function PuzzleLine({ puzzle, width }) {
  const [showLine, setShowLine] = React.useState(false);
  const [linePoints, setLinePoints, linePointsRef] = useStateRef([]);
  const [currDir, setCurrDir, currDirRef] = useStateRef(Direction.UP);
  const [currDist, setCurrDist, currDistRef] = useStateRef(0);

  const outOfBounds = (curr, dir) =>
    (curr.x === 0 && dir === Direction.LEFT) ||
    (curr.x >= puzzle.gridw - 1 && dir === Direction.RIGHT) ||
    (curr.y === 0 && dir === Direction.UP) ||
    (curr.y >= puzzle.gridh - 1 && dir === Direction.DOWN);

  const isLineCrossingPoint = (dist) => {
    return dist + LINEWIDTH > EDGESEGMAX - LINEWIDTH;
  };

  const isLineCrossingBreak = (updatedDist) => {
    return updatedDist + LINEWIDTH > (EDGESEGMAX - BREAKWIDTH) / 2;
  };

  // updatedDist + distDiff > EDGESEGMAX - LINEWIDTH * 2

  const pointInDir = (dir, p) =>
    isHorizontal(dir)
      ? { x: p.x + dirToSign(dir) * 2, y: p.y }
      : { x: p.x, y: p.y + dirToSign(dir) * 2 };

  const isBacktrackingPoint = (dir, currPoint, prevPoint) => {
    const comparisonPoint = pointInDir(dir, currPoint);
    return (
      prevPoint !== null &&
      comparisonPoint.x === prevPoint.x &&
      comparisonPoint.y === prevPoint.y
    );
  };

  // TODO: FIXME: there is a better way of doing this using Array.prototype.some()
  const containsPoint = (p, pArr) => {
    for (let i of pArr) {
      if (i.x === p.x && i.y === p.y) {
        return true;
      }
    }
    return false;
  };

  const handleMouseMove = (e) => {
    // TODO: check if a valid edge exists in desired direction
    // TODO: replace out of bounds with checking for valid edge
    // TODO: clicking escape should remove all line segments
    // TODO: circle at start
    // TODO: can't go into start circle
    // TODO: update turning assist
    // TODO: end of puzzle
    // TODO: account for starting position on edge

    let updatedDist = currDistRef.current;
    let updatedDir = currDirRef.current;

    const x = capVal(e.movementX, moveCap);
    const y = capVal(e.movementY, moveCap);

    const {
      xDir,
      yDir,
      xAbs,
      yAbs,
      maxDistAbs,
      minDistAbs,
      maxDist,
      minDist,
      maxDir,
      minDir,
    } = getDirInfo(x, y);

    // Current vertex that the line attaches to
    const currPoint =
      linePointsRef.current.length > 0
        ? linePointsRef.current[linePointsRef.current.length - 1]
        : null;
    const prevPoint =
      linePointsRef.current.length > 1
        ? linePointsRef.current[linePointsRef.current.length - 2]
        : null;
    const nextPoint =
      currPoint !== null ? pointInDir(updatedDir, currPoint) : null;

    // check if near vertex
    // TODO: does not account for moving into the vertex
    // TODO: changing direction at edge flicks out into edge
    // caused by add maxDistAbs to updatedDist
    if (updatedDist <= 4) {
      updatedDir = maxDir;
      updatedDist += maxDistAbs;
      if (outOfBounds(currPoint, updatedDir)) {
        updatedDist = 0;
      }
    } else {
      let distDiff = (isHorizontal(updatedDir) ? x : y) * dirToSign(updatedDir);

      // Corner turn assist (moving in a about perpendicular direction to edge)
      if (!sameAxis(maxDir, updatedDir) && maxDistAbs > 1) {
        distDiff += updatedDist > EDGESEGMAX / 2 ? assistSpeed : -assistSpeed;
      }

      // New turn assist (doesnt work well, try again after 'updatedDist >= EDGESEGMAX - 4')
      // If some movement in perp direction, add it to value in current direction
      // if (
      //   !sameAxis(maxDir, updatedDir) &&
      //   maxDistAbs > 1 &&
      //   updatedDist >= 4 &&
      //   updatedDist <= EDGESEGMAX - 4
      // ) {
      //   distDiff += maxDistAbs * Math.sign(minDist);
      // }

      // TODO: this probably can be simplified
      // check if distance should be added
      if (
        // TODO: This first check can be factored out
        !isLineCrossingPoint(updatedDist) || // not intersecting the next point
        !containsPoint(nextPoint, linePointsRef.current) || // havent been to next point
        distDiff < 0 // moving backwards
      ) {
        if (
          containsPoint(nextPoint, linePointsRef.current) && // been to next point
          isLineCrossingPoint(updatedDist + distDiff) // move will cross over into next point
        ) {
          updatedDist = EDGESEGMAX - LINEWIDTH * 2;
        } else {
          updatedDist += distDiff;
        }
      }
    }

    // check if new point should be added
    if (updatedDist >= EDGESEGMAX && nextPoint != null) {
      setLinePoints((points) => [...points, nextPoint]);
      updatedDist %= EDGESEGMAX;
      if (outOfBounds(nextPoint, updatedDir)) {
        updatedDist = 0;
      }
    }

    /*
     * When we change direction at a vertex, isBacktrackingPoint checks if
     * the new direction is going back into the previously drawn edge segment.
     * If so, remove the point we backtracked from and update the values of
     * the current line segment to feel like it is controlling the removed edge.
     */
    // check if last point needs removing
    if (isBacktrackingPoint(updatedDir, currPoint, prevPoint)) {
      setLinePoints((points) => {
        return points.slice(0, points.length - 1);
      });
      updatedDist = EDGESEGMAX - updatedDist;
      updatedDir = reverseDir(updatedDir);
    }

    setCurrDist(updatedDist);
    setCurrDir(updatedDir);
  };

  const handleStart = (i) => {
    setLinePoints([puzzle.start[i]]);
    setCurrDist(0);
    setCurrDir(Direction.NONE);
    setShowLine(true);
  };

  const handleEnd = () => {
    // for when mouse clicks to exit
    // TODO: right click to exit, left click to keep the line
    console.log("Ended");

    setShowLine(false);

    // TODO: replace this with what we actually want
    setLinePoints((curr) => [curr[0]]);
    setCurrDist(0);
    setCurrDir(Direction.NONE);
  };

  return (
    <>
      {showLine && (
        <PuzzleLineRaw
          puzzle={puzzle}
          width={width}
          points={linePoints}
          currDir={currDir}
          currDist={currDist}
        />
      )}
      <PuzzleLineStart
        puzzle={puzzle}
        width={width}
        handleStart={handleStart}
        handleEnd={handleEnd}
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
