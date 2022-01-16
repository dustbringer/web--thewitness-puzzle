/*
 Height and width here are dimensions of the grid array
 */

export const isVertex = (x, y) => x % 2 === 0 && y % 2 === 0;
export const isSpace = (x, y) => x % 2 === 1 && y % 2 === 1;
export const isEdge = (x, y) => !isVertex(x, y) && !isSpace(x, y);
export const isEdgeVertical = (x, y) => x % 2 === 0;
export const verticesOfEdge = (x, y) => {
  if (!isEdge(x, y)) return [];
  if (isEdgeVertical(x, y))
    return [
      { x, y: y + 1 },
      { x, y: y - 1 },
    ];
  else
    return [
      { x: x + 1, y },
      { x: x - 1, y },
    ];
};
