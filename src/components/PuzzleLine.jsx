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
const perpCap = 30;

const capVal = (val, cap) => (Math.abs(val) > cap ? cap * Math.sign(val) : val);

function PuzzleLine({ puzzle, width }) {
  const [showLine, setShowLine] = React.useState(false);
  const [linePoints, setLinePoints, linePointsRef] = useStateRef([]);
  const [currDir, setCurrDir, currDirRef] = useStateRef(Direction.UP);
  const [currDist, setCurrDist, currDistRef] = useStateRef(0);

  const pointEquals = (p1, p2) => p1 && p2 && p1.x === p2.x && p1.y === p2.y;

  const isValidDir = (p, dir) => {
    const nextP = pointInDir(p, dir);
    return (
      nextP !== null &&
      (puzzle.isVertexInGrid(nextP.x, nextP.y) ||
        puzzle.isEdgeInGrid(nextP.x, nextP.y)) &&
      !puzzle.isEmpty(nextP.x, nextP.y)
    );
  };

  const isLineCrossingPoint = (dist) => dist + LINERAD > EDGESEGMAX - LINERAD;

  const isLineCrossingStart = (currP, existP, dist) =>
    pointEquals(existP, linePointsRef.current[0]) &&
    dist + LINERAD > sharedAxisDist(currP, existP) - STARTRAD;

  const isLineCrossingBreak = (dist) =>
    dist + LINERAD > (EDGESEGMAX - BREAKWIDTH) / 2;

  const pointInDir = (p, dir) =>
    dir !== Direction.NONE && p !== null
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

  const isBacktrackingPoint = (currP, prevP, dir) =>
    prevP !== null &&
    dir !== Direction.NONE &&
    (pointEquals(vertInDir(currP, dir), prevP) ||
      pointEquals(pointInDir(currP, dir), prevP));

  const containsPoint = (pArr, p) => pArr.some((e) => pointEquals(e, p));

  // potentially unnecessary functions
  const isSharedAxis = (p1, p2) => p1.x === p2.x || p1.y === p2.y;

  /*
  Returns the piece distance between two points on a shared axis
  */
  const sharedAxisDist = (p1, p2) => {
    if (p1 === null || p2 === null) return;

    const dist =
      Math.abs(p1.x - p2.x) > Math.abs(p1.y - p2.y)
        ? Math.abs(p1.x - p2.x)
        : Math.abs(p1.y - p2.y);

    return PIECESZ * dist;
  };

  const handleMouseMove = (e) => {
    // TODO: clicking escape should remove all line segments
    // TODO: end of puzzle
    // TODO: changing direction at edge flicks out into edge
    // TODO: scale movement speed (can be used as sensitivity setting)

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
      if (!isValidDir(currPoint, maxDir)) {
        return;
      }
      updatedDir = maxDir;
    }

    // Turn assist (maxDir perpendicular to edge)
    if (
      !sameAxis(maxDir, updatedDir) &&
      nextVertex !== null &&
      isValidDir(nextVertex, maxDir)
    ) {
      distDiff =
        (updatedDist > EDGESEGMAX / 2 ? 1 : -1) * capVal(maxDistAbs, perpCap);
      if (puzzle.isEdgeInGrid(currPoint.x, currPoint.y)) {
        distDiff = Math.abs(distDiff);
      }
    }

    updatedDist += distDiff;

    // FIXME: probably needs refactoring
    if (updatedDist < 0) {
      if (sameAxis(maxDir, updatedDir) && !isValidDir(currPoint, maxDir)) {
        updatedDist = 0;
      } else if (isValidDir(currPoint, maxDir)) {
        updatedDir = maxDir;
        updatedDist = Math.abs(updatedDist);
      } else if (
        !sameAxis(maxDir, updatedDir) &&
        !isValidDir(currPoint, maxDir)
      ) {
        if (isValidDir(currPoint, reverseDir(updatedDir))) {
          updatedDir = reverseDir(updatedDir);
          updatedDist = Math.abs(updatedDist);
        } else {
          updatedDist = 0;
        }
      }
    } else if (
      updatedDist >= sharedAxisDist(currPoint, nextVertex) &&
      isValidDir(nextVertex, maxDir)
    ) {
      // Overshot turn
      updatedDir = maxDir;

      // Out of bounds is handled later
    }

    // Self collision
    // FIXME: probably needs refactoring
    // NOTE: POINT MUST BE CHECKED BEFORE VERTEX
    const existingPoint = containsPoint(linePointsRef.current, nextPoint)
      ? nextPoint
      : containsPoint(linePointsRef.current, nextVertex)
      ? nextVertex
      : null;

    if (existingPoint !== null) {
      if (
        isLineCrossingStart(currPoint, existingPoint, updatedDist + distDiff)
      ) {
        updatedDist =
          sharedAxisDist(currPoint, existingPoint) - LINERAD - STARTRAD;
      } else if (isLineCrossingPoint(updatedDist + distDiff)) {
        // move will cross over into next point
        updatedDist = EDGESEGMAX - LINERAD * 2;
      }
    }

    // FIXME: this probably should be somewhere else
    if (!isValidDir(currPoint, updatedDir)) {
      updatedDist = 0;
    }

    // check if new point should be added
    // FIXME: probably needs refactoring
    if (
      nextVertex != null &&
      !pointEquals(currPoint, nextVertex) &&
      isSharedAxis(currPoint, nextVertex) &&
      updatedDist >= sharedAxisDist(currPoint, nextVertex)
    ) {
      setLinePoints((points) => [...points, nextVertex]);
      // possibly assign this distance to a variable
      updatedDist %= sharedAxisDist(currPoint, nextVertex);
      if (!isValidDir(nextVertex, updatedDir)) {
        updatedDist = 0;
      }
      prevPoint = currPoint;
      currPoint = nextVertex;
      console.log("added point");
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
      updatedDist = sharedAxisDist(currPoint, prevPoint) - updatedDist;
      updatedDir = reverseDir(updatedDir);
      console.log("removed point");
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
