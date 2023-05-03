import Puzzle from "../../../classes/Puzzle";
import Direction from "../../../enums/Direction";
import {
  getDirX,
  getDirY,
  getDirInfo,
  reverseDir,
  isSameAxis,
  dirToSign,
  isHorizontal,
} from "../../../util/directionUtil";
import { getViewboxSize } from "../../../util/puzzleDisplayUtil";
import Orientation from "../../../enums/Orientation";
import { VtxSym, SpcSym, EdgSym } from "../../../enums/Sym";
import {
  PIECESZ,
  STARTRAD as _STARTRAD,
  LINEWIDTH as _LINEWIDTH,
  ENDLENGTH as _ENDLENGTH,
  BREAKWIDTH as _BREAKWIDTH,
} from "../../PuzzlePiece/info";

const pieceszScale = 2;
const EDGESEGMAX = PIECESZ * pieceszScale;
const LINERAD = (_LINEWIDTH / 2) * pieceszScale;
const STARTRAD = _STARTRAD * pieceszScale;
const ENDLENGTH = _ENDLENGTH * pieceszScale;
const BREAKWIDTH = _BREAKWIDTH * pieceszScale;
const moveCap = 60;
const perpCap = 30;
const speed = 0.8; // 1 is the same as regular mouse speed

// Helper

const capVal = (val, cap) => (Math.abs(val) > cap ? cap * Math.sign(val) : val);
const pointEquals = (p1, p2) => p1 && p2 && p1.x === p2.x && p1.y === p2.y;
const endDir = (puzzle, end) => {
  const o = puzzle.getEndOrientation(end.x, end.y);
  if (o === undefined) return;

  // Orientation.VERTICAL check first as VERTICAL is default
  if (o === Orientation.VERTICAL) {
    if (end.y === 0) return Direction.UP;
    else return Direction.DOWN;
  } else if (o === Orientation.HORIZONTAL) {
    if (end.x === 0) return Direction.LEFT;
    else return Direction.RIGHT;
  } else {
    return;
  }
};

const isValidDir = (puzzle, pt, dir) => {
  const nextP = pointInDir(pt, dir);
  return (
    (nextP !== null &&
      (puzzle.isVertexInGrid(nextP.x, nextP.y) ||
        puzzle.isEdgeInGrid(nextP.x, nextP.y)) &&
      !puzzle.isEmpty(nextP.x, nextP.y)) ||
    (pt !== null && puzzle.isEnd(pt.x, pt.y) && dir === endDir(puzzle, pt))
  );
};

const pointInDir = (p, dir) =>
  dir !== Direction.NONE && p !== null
    ? isHorizontal(dir)
      ? { x: p.x + dirToSign(dir), y: p.y }
      : { x: p.x, y: p.y + dirToSign(dir) }
    : null;

const distToPoint = EDGESEGMAX - LINERAD * 2;
// Start could be on an edge
const distToStart = (distToLine) => distToLine - STARTRAD - LINERAD;
const distToBreak = (EDGESEGMAX - BREAKWIDTH) / 2 - LINERAD;

const vertInDir = (puzzle, p, dir) => {
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

const containsPoint = (points, p) => points.some((e) => pointEquals(e, p));

const isBacktrackingPoint = (puzzle, currP, prevP, dir) =>
  prevP !== null &&
  dir !== Direction.NONE &&
  (pointEquals(vertInDir(puzzle, currP, dir), prevP) ||
    pointEquals(pointInDir(puzzle, currP, dir), prevP));

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

const roundTwoDP = (f) => Math.round(f * 100) / 100;

// Main function

const move = (puzzle, xMove, yMove, _dist, _dir, _points) => {
  const x = roundTwoDP(capVal(xMove * speed, moveCap));
  const y = roundTwoDP(capVal(yMove * speed, moveCap));
  let dist = _dist;
  let dir = _dir;
  const points = [..._points];

  if (_dist === undefined || _dir === undefined || _points === undefined)
    return;

  let distDiff =
    dir !== Direction.NONE ? (isHorizontal(dir) ? x : y) * dirToSign(dir) : 0;

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
  } = getDirInfo(x, y, dir);

  // Current vertex that the line attaches to
  let currPoint = points.length > 0 ? points[points.length - 1] : null;
  let prevPoint = points.length > 1 ? points[points.length - 2] : null;
  let nextPoint = currPoint !== null ? pointInDir(currPoint, dir) : null;
  // vertInDir returns any point you can turn at, including edges with end segments
  let nextVertex =
    currPoint !== null ? vertInDir(puzzle, currPoint, dir) : null;

  /* Replace NONE direction */
  if (dir === Direction.NONE) {
    dir = maxDir;
  }

  /* Turn assist (maxDir perpendicular to edge) */
  const assistSpeed = 1; // 1 is the same as regular mouse speed
  const assistDist = maxDistAbs * assistSpeed;
  if (currPoint && !isSameAxis(maxDir, dir)) {
    if (
      puzzle.isEnd(currPoint.x, currPoint.y) &&
      dir === endDir(puzzle, currPoint)
    ) {
      // turn assist out of end
      distDiff += (distDiff > 0 ? 1 : -1) * capVal(assistDist, perpCap);
    } else if (
      nextVertex !== null &&
      isValidDir(puzzle, nextVertex, maxDir) &&
      isValidDir(puzzle, currPoint, maxDir)
    ) {
      // TODO: Adjust the speed of this, feels too aggressive (maybe scale the value: Math.floor(assistDist / 2))
      distDiff =
        (dist > greaterAxisDist(currPoint, nextVertex) / 2 ? 1 : -1) *
        capVal(assistDist, perpCap);
    } else if (nextVertex !== null && isValidDir(puzzle, nextVertex, maxDir)) {
      distDiff = capVal(assistDist, perpCap);
    } else if (isValidDir(puzzle, currPoint, maxDir)) {
      distDiff = -capVal(assistDist, perpCap);
    }
  }

  dist += distDiff;

  /* Changing direction at vertex; Prevent invalid movements */
  if (dist <= 0) {
    // Line moved backwards past vertex

    if (isValidDir(puzzle, currPoint, maxDir)) {
      // Any mouse direction, next point exists
      dir = maxDir;
      dist = Math.abs(dist);
    } else if (
      !isSameAxis(maxDir, dir) &&
      isValidDir(puzzle, currPoint, reverseDir(dir))
    ) {
      // No next point in mouse direction, but next point exists in edge direction
      dir = reverseDir(dir);
      dist = Math.abs(dist);
    } else {
      dist = 0;
    }
  } else if (
    nextVertex &&
    dist >= greaterAxisDist(currPoint, nextVertex) &&
    isValidDir(puzzle, nextVertex, maxDir)
  ) {
    // Line moved forwards past vertex, and point in movement direction exists

    dir = maxDir;
  }

  /* Self collision */

  /*
   * The next point, if it is part of the line
   * NOTE: POINT EXISTENCE MUST BE CHECKED BEFORE VERTEX
   */
  const nextPointInLine = containsPoint(points, nextPoint)
    ? nextPoint
    : containsPoint(points, nextVertex)
    ? nextVertex
    : null;

  if (nextPointInLine !== null) {
    if (
      points.length > 0 &&
      pointEquals(nextPointInLine, points[0]) &&
      dist > distToStart(greaterAxisDist(currPoint, nextPointInLine))
    ) {
      // Line crossing start
      dist = distToStart(greaterAxisDist(currPoint, nextPointInLine));
    } else if (dist > distToPoint) {
      // Line crossing point in line
      dist = distToPoint;
    }
  }

  /* Break collision */
  if (
    nextPoint &&
    puzzle.checkSymbol(nextPoint.x, nextPoint.y, EdgSym.BREAK) &&
    dist > distToBreak
  ) {
    dist = distToBreak;
  }

  /* Check if new point should be added */
  if (nextVertex !== null && dist >= greaterAxisDist(currPoint, nextVertex)) {
    points.push(nextVertex);
    // possibly assign this distance to a variable
    dist %= greaterAxisDist(currPoint, nextVertex);
    prevPoint = currPoint;
    currPoint = nextVertex;
  }

  if (
    puzzle.isEnd(currPoint.x, currPoint.y) &&
    dir === endDir(puzzle, currPoint)
  ) {
    if (dist > ENDLENGTH) {
      dist = ENDLENGTH;
    }
  }

  /* Prevent further invalid movements */
  if (!isValidDir(puzzle, currPoint, dir)) {
    if (minDir !== Direction.NONE && isValidDir(puzzle, currPoint, minDir)) {
      // Move in minDir if maxDir is invalid
      dir = minDir;
      dist = minDistAbs;
    } else {
      dist = 0;
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
  if (isBacktrackingPoint(puzzle, currPoint, prevPoint, dir)) {
    points.pop();
    dist = greaterAxisDist(currPoint, prevPoint) - dist;
    dir = reverseDir(dir);
  }

  return { dist, dir, points };
};

export default move;
