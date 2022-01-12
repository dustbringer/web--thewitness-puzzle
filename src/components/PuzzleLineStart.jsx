import * as React from "react";
import { styled } from "@mui/material/styles";

import { getPixelSize } from "../util/puzzleDisplayUtil";

const StartButton = styled("div")`
  width: ${(props) => props.relativestartrad * 2}px;
  height: ${(props) => props.relativestartrad * 2}px;
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  cursor: pointer;
`;

function PuzzleLineStart({ puzzle, width, handleStart, handleMouseMove }) {
  // Using refs, since state doesnt interact well with event listeners
  // https://stackoverflow.com/questions/53845595/wrong-react-hooks-behaviour-with-event-listener
  const pointerLocked = React.useRef(false);

  // Using a list of start Refs - https://caseyyee.com/blog/react-ref-collections/
  const startRefs = React.useRef(new Set());

  // Pointer lock setup
  // https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
  // https://github.com/mdn/dom-examples/blob/master/pointer-lock/app.js
  React.useEffect(() => {
    startRefs.current.forEach((element) => {
      element.requestPointerLock =
        element.requestPointerLock || element.mozRequestPointerLock;
    });
    document.exitPointerLock =
      document.exitPointerLock || document.mozExitPointerLock;

    const lockChangeAlert = () => {
      if (
        (document.pointerLockElement !== null &&
          startRefs.current.has(document.pointerLockElement)) ||
        (document.mozPointerLockElement !== null &&
          startRefs.current.has(document.mozPointerLockElement))
      ) {
        document.addEventListener("mousemove", handleMouseMove, false);
        pointerLocked.current = true;
      } else {
        document.removeEventListener("mousemove", handleMouseMove, false);
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

  // Perfect Viewbox Size
  const { relativePieceSize, relativeStartRad } = getPixelSize(puzzle, width);

  const handleStartClick = (e, i) => {
    const div = e.target;
    // Stop if already locked to avoid double unlock
    if (pointerLocked.current) document.exitPointerLock();
    else div.requestPointerLock();

    handleStart(i);
  };

  return (
    <>
      {puzzle.start.map((e, i) => (
        // TODO: Make this round to match the circle
        <StartButton
          key={`${i}`}
          ref={(ref) => startRefs.current.add(ref)}
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
          relativestartrad={relativeStartRad}
          onClick={(ev) => handleStartClick(ev, i)}
        ></StartButton>
      ))}
    </>
  );
}

export default PuzzleLineStart;
