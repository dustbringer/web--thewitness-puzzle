import * as React from "react";
import { styled } from "@mui/material/styles";

import PuzzleGrid from "./PuzzleGrid";
import PuzzleLine from "./PuzzleLine";

import PuzzleClass from "../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";
import { PIECESZ, STARTRAD } from "./PuzzlePiece/info";

const Root = styled("div")`
  position: relative;
`;

function Puzzle({ puzzle }) {
  // Using refs, since state doesnt interact well with event listeners
  // https://stackoverflow.com/questions/53845595/wrong-react-hooks-behaviour-with-event-listener
  const pointerLocked = React.useRef(false);

  // Using a list of Refs - https://caseyyee.com/blog/react-ref-collections/
  const startRefs = React.useRef([]);

  // Pointer lock code from here
  // https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
  // https://github.com/mdn/dom-examples/blob/master/pointer-lock/app.js
  React.useEffect(() => {
    startRefs.current.forEach((element) => {
      element.requestPointerLock =
        element.requestPointerLock || element.mozRequestPointerLock;
    });

    document.exitPointerLock =
      document.exitPointerLock || document.mozExitPointerLock;

    const lockExit = () => document.exitPointerLock();

    const lockChangeAlert = () => {
      if (
        startRefs.current.includes(document.pointerLockElement) ||
        startRefs.current.includes(document.mozPointerLockElement)
      ) {
        console.log("The pointer lock status is now locked");
        document.addEventListener("mousemove", updatePosition, false);
        document.addEventListener("click", lockExit, false);
        pointerLocked.current = true;
      } else {
        console.log("The pointer lock status is now unlocked");
        document.removeEventListener("mousemove", updatePosition, false);
        document.removeEventListener("click", lockExit, false);
        pointerLocked.current = false;
      }
    };

    if ("onpointerlockchange" in document) {
      document.addEventListener("pointerlockchange", lockChangeAlert, false);
    } else if ("onmozpointerlockchange" in document) {
      document.addEventListener("mozpointerlockchange", lockChangeAlert, false);
    }

    const lockError = (e) => {
      console.error("Pointer lock failed, try again.");
    };
    document.addEventListener("pointerlockerror", lockError, false);
    document.addEventListener("mozpointerlockerror", lockError, false);
  }, []);

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

  const StartButton = styled("div")`
    width: ${relativeStartRad * 2}px;
    height: ${relativeStartRad * 2}px;
    position: absolute;
    top: ${(props) => props.top}px;
    left: ${(props) => props.left}px;
    cursor: pointer;
  `;

  const updatePosition = (e) => {
    console.log(e);
  };

  const handleStartClick = (e, x, y, i) => {
    if (pointerLocked.current) return;

    const div = e.target;
    div.requestPointerLock();
  };

  return (
    <>
      <Root>
        {puzzle.start.map((e, i) => (
          <StartButton
            key={`${i}`}
            ref={(ref) => startRefs.current.push(ref)}
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
            onClick={(ev) => handleStartClick(ev, e.x, e.y, i)}
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
