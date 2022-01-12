/*
 Display calculations and sizes
 */
import { PIECESZ, STARTRAD } from "../components/PuzzlePiece/info";

// Perfect Viewbox Size
export const getViewboxSize = (puzzle) => ({
  viewh: (PIECESZ / 2) * (puzzle.gridh + 1),
  vieww: (PIECESZ / 2) * (puzzle.gridw + 1),
  sizeRatio: (puzzle.gridh + 1) / (puzzle.gridw + 1),
});

export const getPixelSize = (puzzle, width) => {
  const { vieww } = getViewboxSize(puzzle);
  const pixelsPerUnit = width / vieww;
  return {
    pixelsPerUnit,
    relativePieceSize: PIECESZ * pixelsPerUnit, // In pixels
    relativeStartRad: STARTRAD * pixelsPerUnit, // In pixels
  };
};
