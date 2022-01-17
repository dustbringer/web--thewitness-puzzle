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
  isSameAxis,
  dirToSign,
  isHorizontal,
} from "../util/directionUtil";
import { getViewboxSize } from "../util/puzzleDisplayUtil";
import Orientation from "../enums/Orientation";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";
import {
  PIECESZ,
  STARTRAD as _STARTRAD,
  LINEWIDTH as _LINEWIDTH,
  ENDLENGTH as _ENDLENGTH,
  BREAKWIDTH as _BREAKWIDTH,
} from "./PuzzlePiece/info";

const pieceszScale = 2;
const EDGESEGMAX = PIECESZ * pieceszScale;
const LINERAD = (_LINEWIDTH / 2) * pieceszScale;
const STARTRAD = _STARTRAD * pieceszScale;
const ENDLENGTH = _ENDLENGTH * pieceszScale;
const BREAKWIDTH = _BREAKWIDTH * pieceszScale;
const moveCap = 60;
const perpCap = 30;

const capVal = (val, cap) => (Math.abs(val) > cap ? cap * Math.sign(val) : val);

function PuzzleLine({ puzzle, width }) {
  const [showLine, setShowLine] = React.useState(false);
  const [linePoints, setLinePoints, linePointsRef] = useStateRef([]);
  const [currDir, setCurrDir, currDirRef] = useStateRef(Direction.UP);
  const [currDist, setCurrDist, currDistRef] = useStateRef(0);

  const pointEquals = (p1, p2) => p1 && p2 && p1.x === p2.x && p1.y === p2.y;

  const endDir = (end) => {
    const o = puzzle.getEndOrientation(end.x, end.y);
    if (o === null) return null;

    // Orientation.VERTICAL check first as VERTICAL is default
    if (o === Orientation.VERTICAL) {
      if (end.y === 0) return Direction.UP;
      else return Direction.DOWN;
    } else if (o === Orientation.HORIZONTAL) {
      if (end.x === 0) return Direction.LEFT;
      else return Direction.RIGHT;
    } else {
      // TODO: account for Orientation.DIAGONAL
      console.log("Direction diagonal");
      return Direction.NONE;
    }
  };

  const isValidDir = (p, dir) => {
    const nextP = pointInDir(p, dir);
    return (
      (nextP !== null &&
        (puzzle.isVertexInGrid(nextP.x, nextP.y) ||
          puzzle.isEdgeInGrid(nextP.x, nextP.y)) &&
        !puzzle.isEmpty(nextP.x, nextP.y)) ||
      // TODO: account for diagonals
      (puzzle.isEnd(p.x, p.y) && dir === endDir(p))
    );
  };

  const distToPoint = EDGESEGMAX - LINERAD * 2;

  // Start could be on an edge
  const distToStart = (distToLine) => distToLine - STARTRAD - LINERAD;

  const distToBreak = (EDGESEGMAX - BREAKWIDTH) / 2 - LINERAD;

  const pointInDir = (p, dir) =>
    dir !== Direction.NONE && p !== null
      ? isHorizontal(dir)
        ? { x: p.x + dirToSign(dir), y: p.y }
        : { x: p.x, y: p.y + dirToSign(dir) }
      : null;

  const vertInDir = (p, dir) => {
    if (dir === Direction.NONE) return null;

    let newPoint = pointInDir(p, dir);
    while (newPoint && puzzle.isInGrid(newPoint.x, newPoint.y)) {
      if (
        puzzle.isVertexInGrid(newPoint.x, newPoint.y) ||
        puzzle.isEnd(newPoint.x, newPoint.y)
      ) {
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

  /*
   * Returns the distance (wrt EDGESEGMAX) between points on the larger axis.
   *
   * If the points share a coordinate, returns the point distance between
   * two points on a shared axis. (We are only using it for this case)
   */
  const greaterAxisDist = (p1, p2) => {
    const dist =
      Math.abs(p1.x - p2.x) > Math.abs(p1.y - p2.y)
        ? Math.abs(p1.x - p2.x)
        : Math.abs(p1.y - p2.y);
    return (EDGESEGMAX / 2) * dist;
  };

  const handleMouseMove = (e) => {
    // TODO: clicking escape should remove all line segments
    // TODO: end of puzzle
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
      currPoint !== null ? pointInDir(currPoint, updatedDir) : null;
    let nextVertex =
      currPoint !== null ? vertInDir(currPoint, updatedDir) : null;

    /* Replace NONE direction */
    if (updatedDir === Direction.NONE) {
      updatedDir = maxDir;
    }

    /* Turn assist (maxDir perpendicular to edge) */
    if (
      !isSameAxis(maxDir, updatedDir) &&
      nextVertex !== null &&
      !puzzle.isEnd(nextVertex.x, nextVertex.y) &&
      isValidDir(nextVertex, maxDir)
    ) {
      // TODO: Adjust the speed of this, feels too aggressive (maybe scale the value: Math.floor(maxDistAbs / 2))
      distDiff =
        (updatedDist > EDGESEGMAX / 2 ? 1 : -1) * capVal(maxDistAbs, perpCap);
      if (puzzle.isEdgeInGrid(currPoint.x, currPoint.y)) {
        distDiff = Math.abs(distDiff);
      }
    }

    updatedDist += distDiff;

    /* Changing direction at vertex; Prevent invalid movements */
    if (updatedDist <= 0) {
      // Line moved backwards past vertex

      if (isValidDir(currPoint, maxDir)) {
        // Any mouse direction, next point exists
        updatedDir = maxDir;
        updatedDist = Math.abs(updatedDist);
      } else if (
        !isSameAxis(maxDir, updatedDir) &&
        isValidDir(currPoint, reverseDir(updatedDir))
      ) {
        // No next point in mouse direction, but next point exists in edge direction
        updatedDir = reverseDir(updatedDir);
        updatedDist = Math.abs(updatedDist);
      } else {
        updatedDist = 0;
      }
    } else if (
      nextVertex &&
      updatedDist >= greaterAxisDist(currPoint, nextVertex) &&
      isValidDir(nextVertex, maxDir)
    ) {
      // Line moved forwards past vertex, and point in movement direction exists

      updatedDir = maxDir;
    }

    /* Self collision */

    /*
     * The next point, if it is part of the line
     * NOTE: POINT EXISTENCE MUST BE CHECKED BEFORE VERTEX
     */
    const nextPointInLine = containsPoint(linePointsRef.current, nextPoint)
      ? nextPoint
      : containsPoint(linePointsRef.current, nextVertex)
      ? nextVertex
      : null;

    if (nextPointInLine !== null) {
      if (
        linePointsRef.current.length > 0 &&
        pointEquals(nextPointInLine, linePointsRef.current[0]) &&
        updatedDist > distToStart(greaterAxisDist(currPoint, nextPointInLine))
      ) {
        // Line crossing start
        updatedDist = distToStart(greaterAxisDist(currPoint, nextPointInLine));
      } else if (updatedDist > distToPoint) {
        // Line crossing point in line
        updatedDist = distToPoint;
      }
    }

    /* Break collision */
    if (
      nextPoint &&
      puzzle.checkSymbol(nextPoint.x, nextPoint.y, EdgSym.BREAK) &&
      updatedDist > distToBreak
    ) {
      updatedDist = distToBreak;
    }

    /* Check if new point should be added */
    if (
      nextVertex !== null &&
      updatedDist >= greaterAxisDist(currPoint, nextVertex)
    ) {
      setLinePoints((points) => [...points, nextVertex]);
      // possibly assign this distance to a variable
      updatedDist %= greaterAxisDist(currPoint, nextVertex);
      prevPoint = currPoint;
      currPoint = nextVertex;
      console.log("added point");
    }

    if (
      puzzle.isEnd(currPoint.x, currPoint.y) &&
      updatedDir === endDir(currPoint)
    ) {
      if (updatedDist > ENDLENGTH) {
        updatedDist = ENDLENGTH;
      }
    }

    /* Prevent further invalid movements */
    if (!isValidDir(currPoint, updatedDir)) {
      if (minDir !== Direction.NONE && isValidDir(currPoint, minDir)) {
        // Move in minDir if maxDir is invalid
        updatedDir = minDir;
        updatedDist = minDistAbs;
      } else {
        updatedDist = 0;
      }
    }

    /*
     * Check if last point needs removing
     *
     * When we change direction at a vertex, isBacktrackingPoint checks if
     * the new direction is going back into the previously drawn edge segment.
     * If so, remove the point we backtracked from and update the values of
     * the current line segment to feel like it is controlling the removed edge.
     */
    if (isBacktrackingPoint(currPoint, prevPoint, updatedDir)) {
      setLinePoints((points) => {
        return points.slice(0, points.length - 1);
      });
      updatedDist = greaterAxisDist(currPoint, prevPoint) - updatedDist;
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
