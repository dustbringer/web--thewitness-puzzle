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

export const getDirInfo = (x, y) => {
  const xAbs = Math.abs(x);
  const yAbs = Math.abs(y);
  const maxDist = Math.max(xAbs, yAbs);
  const minDist = Math.min(xAbs, yAbs);

  const xDir = getDirX(x);
  const yDir = getDirY(y);
  let maxDir, minDir;
  if (xAbs >= yAbs) {
    maxDir = getDirX(x);
    minDir = getDirY(y);
  } else {
    maxDir = getDirY(y);
    minDir = getDirX(x);
  }
  return { xDir, yDir, xAbs, yAbs, maxDist, minDist, maxDir, minDir };
};

export const reverseDir = (dir) => (dir < 0 ? Direction.NONE : (dir + 2) % 4);
export const sameAxis = (d1, d2) => d1 % 2 === d2 % 2;
