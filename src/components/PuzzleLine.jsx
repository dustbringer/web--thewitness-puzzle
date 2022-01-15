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
import {
  PIECESZ,
  STARTRAD as _STARTRAD,
  LINEWIDTH as _LINEWIDTH,
  BREAKWIDTH as _BREAKWIDTH,
} from "./PuzzlePiece/info";

const pieceszScale = 2;
const EDGESEGMAX = PIECESZ * pieceszScale;
const LINERAD = (_LINEWIDTH / 2) * pieceszScale;
const STARTRAD = _STARTRAD * pieceszScale;
const BREAKWIDTH = _BREAKWIDTH * pieceszScale;
const turnLeeway = 30;
const moveCap = 60;

const capVal = (val, cap) => (Math.abs(val) > cap ? cap * Math.sign(val) : val);

function PuzzleLine({ puzzle, width }) {
  const [showLine, setShowLine] = React.useState(false);
  const [linePoints, setLinePoints, linePointsRef] = useStateRef([]);
  const [currDir, setCurrDir, currDirRef] = useStateRef(Direction.UP);
  const [currDist, setCurrDist, currDistRef] = useStateRef(0);

  const pointEquals = (p1, p2) => p1 && p2 && p1.x === p2.x && p1.y === p2.y;

  const gridPoint = (p) =>
    puzzle.isInGrid(p.x, p.y) ? puzzle.grid[p.x][p.y] : null;

  const outOfBounds = (curr, dir) =>
    (curr.x === 0 && dir === Direction.LEFT) ||
    (curr.x >= puzzle.gridw - 1 && dir === Direction.RIGHT) ||
    (curr.y === 0 && dir === Direction.UP) ||
    (curr.y >= puzzle.gridh - 1 && dir === Direction.DOWN);

  const isLineCrossingPoint = (dist) => dist + LINERAD > EDGESEGMAX - LINERAD;

  const isLineCrossingStart = (dist) => dist + LINERAD > EDGESEGMAX - STARTRAD;

  const isLineCrossingBreak = (dist) =>
    dist + LINERAD > (EDGESEGMAX - BREAKWIDTH) / 2;

  const pointInDir = (p, dir) =>
    dir !== Direction.NONE
      ? isHorizontal(dir)
        ? { x: p.x + dirToSign(dir), y: p.y }
        : { x: p.x, y: p.y + dirToSign(dir) }
      : null;

  const vertInDir = (p, dir) => {
    if (dir === Direction.NONE) return null;

    let newPoint = pointInDir(p, dir);
    while (puzzle.isInGrid(newPoint.x, newPoint.y)) {
      if (puzzle.isVertexInGrid(newPoint.x, newPoint.y)) {
        return newPoint;
      }
      newPoint = pointInDir(newPoint, dir);
    }

    return null;
  };

  const isBacktrackingPoint = (currPoint, prevPoint, dir) =>
    dir !== Direction.NONE &&
    prevPoint !== null &&
    pointEquals(vertInDir(currPoint, dir), prevPoint);

  const containsPoint = (p, pArr) => pArr.some((e) => pointEquals(e, p));

  const handleMouseMove = (e) => {
    // TODO: check if a valid edge exists in desired direction
    // TODO: replace out of bounds with checking for valid edge
    // TODO: clicking escape should remove all line segments
    // TODO: update turning assist
    // TODO: end of puzzle
    // TODO: account for starting position on edge
    // TODO: changing direction at edge flicks out into edge
    // TODO: moving mouse towards out of bounds locks line when moving slowly on edge

    const x = capVal(e.movementX, moveCap);
    const y = capVal(e.movementY, moveCap);

    if (x === 0 && y === 0) return;

    let updatedDist = currDistRef.current;
    let updatedDir = currDirRef.current;
    let distDiff =
      updatedDir !== Direction.NONE
        ? (isHorizontal(updatedDir) ? x : y) * dirToSign(updatedDir)
        : 0;

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
    } = getDirInfo(x, y, updatedDir);

    // Current vertex that the line attaches to
    let currPoint =
      linePointsRef.current.length > 0
        ? linePointsRef.current[linePointsRef.current.length - 1]
        : null;
    let prevPoint =
      linePointsRef.current.length > 1
        ? linePointsRef.current[linePointsRef.current.length - 2]
        : null;
    let nextPoint =
      currPoint !== null && updatedDir !== Direction.NONE
        ? pointInDir(currPoint, updatedDir)
        : null;
    let nextVertex =
      currPoint !== null && updatedDir !== Direction.NONE
        ? vertInDir(currPoint, updatedDir)
        : null;

    // Replace NONE direction
    if (updatedDir === Direction.NONE) {
      updatedDir = maxDir;
    }

    // Turn assist (maxDir perpendicular to edge)
    if (!sameAxis(maxDir, updatedDir)) {
      distDiff += (updatedDist > EDGESEGMAX / 2 ? 1 : -1) * maxDistAbs;
    }

    updatedDist += distDiff;

    // Turning near vertex
    if (currDistRef.current <= turnLeeway) {
      // Overshot turn or backtracking
      if (updatedDist <= 0) {
        updatedDir = maxDir;
        updatedDist = Math.abs(updatedDist);
      }

      if (outOfBounds(currPoint, updatedDir)) {
        updatedDist = 0;
      }
    } else if (currDistRef.current >= EDGESEGMAX - turnLeeway) {
      // Overshot turn
      if (updatedDist >= EDGESEGMAX) {
        updatedDir = maxDir;
      }

      // Out of bounds is handled later
    }

    // Self collision
    if (containsPoint(nextVertex, linePointsRef.current)) {
      if (
        pointEquals(nextVertex, linePointsRef.current[0]) &&
        isLineCrossingStart(updatedDist + distDiff)
      ) {
        updatedDist = EDGESEGMAX - LINERAD - STARTRAD;
      } else if (isLineCrossingPoint(updatedDist + distDiff)) {
        // move will cross over into next point
        updatedDist = EDGESEGMAX - LINERAD * 2;
      }
    }

    // check if new point should be added
    if (updatedDist >= EDGESEGMAX && nextVertex != null) {
      setLinePoints((points) => [...points, nextVertex]);
      updatedDist %= EDGESEGMAX;
      if (outOfBounds(nextVertex, updatedDir)) {
        updatedDist = 0;
      }

      prevPoint = currPoint;
      currPoint = nextVertex;
      console.log(`added point`);
    }

    /*
     * When we change direction at a vertex, isBacktrackingPoint checks if
     * the new direction is going back into the previously drawn edge segment.
     * If so, remove the point we backtracked from and update the values of
     * the current line segment to feel like it is controlling the removed edge.
     */
    // check if last point needs removing
    if (isBacktrackingPoint(currPoint, prevPoint, updatedDir)) {
      setLinePoints((points) => {
        return points.slice(0, points.length - 1);
      });
      updatedDist = EDGESEGMAX - updatedDist;
      updatedDir = reverseDir(updatedDir);
      console.log(`removed point`);
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
