import * as React from "react";
import { styled } from "@mui/material/styles";
import PointerLocker from "react-pointerlock";

import PuzzleGrid from "./PuzzleGrid";
import PuzzleLine from "./PuzzleLine";

import PuzzleClass from "../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";
import { PIECESZ, STARTRAD } from "./PuzzlePiece/info";

function Puzzle({ puzzle }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  // Perfect Viewbox Size
  const viewh = (PIECESZ / 2) * (puzzle.gridh + 1);
  const vieww = (PIECESZ / 2) * (puzzle.gridw + 1);
  const sizeRatio = (puzzle.gridh + 1) / (puzzle.gridw + 1);

  const pixelsPerUnit = 500 / vieww;
  const relativePieceSize = PIECESZ * pixelsPerUnit; // In pixels
  const relativeStartRad = STARTRAD * pixelsPerUnit; // In pixels

  const Root = styled("div")`
    position: relative;
  `;

  const StartButton = styled("div")`
    width: ${relativeStartRad * 2}px;
    height: ${relativeStartRad * 2}px;
    position: absolute;
    top: ${(props) => props.top}px;
    left: ${(props) => props.left}px;
    cursor: pointer;
  `;

  // const onMouseMove = (e) => {
  //   console.log(e);
  //   // let x = movement.x;
  //   // let y = movement.y;

  //   // console.log(x, y);
  // };

  return (
    <>
      <Root>
        {/* <StartButton top={`${relativePieceSize * 4}`} left={`${relativePieceSize * 9}`}></StartButton> */}
        {puzzle.start.map((e, i) => (
          <StartButton
            key={`${i}`}
            top={`${
              (relativePieceSize / 2) * e.y +
              relativePieceSize / 2 -
              relativeStartRad
            }`}
            left={`${
              (relativePieceSize / 2) * e.x +
              relativePieceSize / 2 -
              relativeStartRad
            }`}
          ></StartButton>
        ))}
      </Root>
      <svg
        width="500px"
        height={`${500 * sizeRatio}px`}
        viewBox={`0 0 ${vieww} ${viewh}`}
      >
        <PuzzleGrid puzzle={puzzle} />
        <PuzzleLine puzzle={puzzle} />
      </svg>
    </>
  );
}

export default Puzzle;
