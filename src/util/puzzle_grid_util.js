/*
 Height and width here are dimensions of the grid array
 */

export const isVertex = (x, y) => x % 2 === 0 && y % 2 === 0;
export const isSquare = (x, y) => x % 2 === 1 && y % 2 === 1;
export const isEdge = (x, y) => !isVertex(x, y) && !isSquare(x, y);
