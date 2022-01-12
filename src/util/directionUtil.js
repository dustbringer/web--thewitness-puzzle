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

export const reverseDir = (dir) => (dir < 0 ? Direction.NONE : (dir + 2) % 4);
