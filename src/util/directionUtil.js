import Direction from "../enums/Direction";

export const getDirX = (x) => {
  if (x > 0) return Direction.RIGHT;
  else if (x < 0) return Direction.LEFT;
  else return Direction.NONE;
};

export const getDirY = (y) => {
  if (y > 0) return Direction.DOWN;
  else if (y < 0) return Direction.UP;
  else return Direction.NONE;
};

/*
 * Naming: max* = corresponding to x or y with larger magnitude
 *         min* = corresponding to x or y with smaller magnitude
 *
 * Note: when both x and y have the same magnitude, max* corresponds
 *       to x or y with the same axis as the current direction
 */
export const getDirInfo = (x, y, currDir) => {
  const xAbs = Math.abs(x);
  const yAbs = Math.abs(y);
  const xDir = getDirX(x);
  const yDir = getDirY(y);

  let maxDir, minDir, maxDist, minDist;
  // Doesnt handle currDir===Direciton.NONE separately
  if (xAbs > yAbs || (xAbs === yAbs && isHorizontal(currDir))) {
    maxDir = getDirX(x);
    minDir = getDirY(y);
    maxDist = x;
    minDist = y;
  } else {
    maxDir = getDirY(y);
    minDir = getDirX(x);
    maxDist = y;
    minDist = x;
  }
  const maxDistAbs = Math.abs(maxDist);
  const minDistAbs = Math.abs(minDist);

  return {
    xAbs,
    yAbs,
    xDir,
    yDir,
    maxDist,
    minDist,
    maxDistAbs,
    minDistAbs,
    maxDir,
    minDir,
  };
};

export const reverseDir = (dir) => (dir < 0 ? Direction.NONE : (dir + 2) % 4);
export const isSameAxis = (d1, d2) => d1 >= 0 && d2 >= 0 && d1 % 2 === d2 % 2;
export const isVertical = (dir) => dir >= 0 && !(dir % 2);
export const isHorizontal = (dir) => dir >= 0 && dir % 2;

// export const dirToSign = (dir) => {
//   if (dir === Direction.RIGHT || dir === Direction.DOWN) return 1;
//   else if (dir === Direction.LEFT || dir === Direction.UP) return -1;
//   else return 0;
// };
// This is illegible and potentially slow, but works nicely over all Z/4Z
export const dirToSign = (dir) =>
  dir < 0 ? 0 : Math.sign(((dir + 1) % 4) - (dir % 2 ? 1 : 2));
