import * as React from "react";
import { styled } from "@mui/material/styles";

import PuzzleGrid from "./PuzzleGrid";
import PuzzleLine from "./PuzzleLine";

import PuzzleClass from "../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";
import { PIECESZ, STARTRAD } from "./PuzzlePiece/info";

import useStateRef from "../hooks/useStateRef";

const Root = styled("div")`
  position: relative;
`;

// TODO: update this
const EDGESEGMAX = 100;
const Direction = Object.freeze({
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
});

const StartButton = styled("div")`
  width: ${(props) => props.relativestartrad * 2}px;
  height: ${(props) => props.relativestartrad * 2}px;
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  cursor: pointer;
`;

function Puzzle({ puzzle }) {
  // Index of start that has been clicked
  const [activeStart, setActiveStart, activeStartRef] = useStateRef(null);
  const [linePoints, setLinePoints, linePointsRef] = useStateRef([]);
  const [currDir, setCurrDir, currDirRef] = useStateRef(Direction.UP);
  const [currDist, setCurrDist, currDistRef] = useStateRef(0);

  // Using refs, since state doesnt interact well with event listeners
  // https://stackoverflow.com/questions/53845595/wrong-react-hooks-behaviour-with-event-listener
  const pointerLocked = React.useRef(false);

  // Using a list of Refs - https://caseyyee.com/blog/react-ref-collections/
  const startRefs = React.useRef(new Set());

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

    const lockChangeAlert = () => {
      console.log("AAAAAAAAAAAAAAAA", document.pointerLockElement);
      if (
        (document.pointerLockElement !== null &&
          startRefs.current.has(document.pointerLockElement)) ||
        (document.mozPointerLockElement !== null &&
          startRefs.current.has(document.mozPointerLockElement))
      ) {
        console.log("The pointer lock status is now locked");
        document.addEventListener("mousemove", updatePosition, false);
        pointerLocked.current = true;
      } else {
        console.log("The pointer lock status is now unlocked");
        document.removeEventListener("mousemove", updatePosition, false);
        pointerLocked.current = false;
      }
    };

    if ("onpointerlockchange" in document) {
    } else if ("onmozpointerlockchange" in document) {
    }
    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    document.addEventListener("mozpointerlockchange", lockChangeAlert, false);

    const lockError = (e) => {
      console.error("Pointer lock failed, try again.");
    };
    document.addEventListener("pointerlockerror", lockError, false);
    document.addEventListener("mozpointerlockerror", lockError, false);
  }, []);

  React.useEffect(() => {
    console.log(linePoints);
  }, [linePoints]);

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

  const updatePosition = (e) => {
    const scaleFactor = 0.8;
    const x = e.movementX * scaleFactor;
    const y = e.movementY * scaleFactor;

    // TODO: scale & fine tune speed
    // TODO: edge case
    // TODO: moving backwards
    // TODO: current distance = 100

    // get current direction and magnitude
    let mouseMag,
      mouseDist = currDistRef.current;

    // if currently vertex, update current direction
    if (currDistRef.current === 0) {
      if (Math.abs(x) > Math.abs(y)) {
        setCurrDir(x > 0 ? Direction.RIGHT : Direction.LEFT);
      } else {
        setCurrDir(y > 0 ? Direction.DOWN : Direction.UP);
      }
    }

    if (currDirRef.current % 2 === 0) {
      mouseMag = Math.abs(y);
    } else {
      mouseMag = Math.abs(x);
    }

    // console.log(mouseMag, mouseDist);

    while (mouseMag > 0) {
      if (mouseMag + mouseDist > EDGESEGMAX) {
        mouseMag -= EDGESEGMAX - mouseDist;
        mouseDist = 0;

        const lastPoint =
          linePointsRef.current[linePointsRef.current.length - 1];
        if (lastPoint) {
          switch (currDirRef.current) {
            case Direction.UP:
              setLinePoints((curr) => [
                ...curr,
                { x: lastPoint.x, y: lastPoint.y - 2 },
              ]);
              break;
            case Direction.RIGHT:
              setLinePoints((curr) => [
                ...curr,
                { x: lastPoint.x + 2, y: lastPoint.y },
              ]);
              break;
            case Direction.DOWN:
              setLinePoints((curr) => [
                ...curr,
                { x: lastPoint.x, y: lastPoint.y - 2 },
              ]);
              break;
            case Direction.LEFT:
              setLinePoints((curr) => [
                ...curr,
                { x: lastPoint.x - 2, y: lastPoint.y },
              ]);
              break;
            default:
              break;
          }
        }
      } else {
        mouseDist += mouseMag;
        mouseMag = 0;
      }
    }

    // console.log(mouseMag, mouseDist);
    setCurrDist(mouseDist);
    // console.log(e.movementX, e.movementY);
  };

  const handleStartClick = (e, i) => {
    const div = e.target;

    // Stop if already locked to avoid double unlock
    if (pointerLocked.current) document.exitPointerLock();
    else div.requestPointerLock();
    console.log(startRefs.current);
    // setActiveStart(() => puzzle.start[i]);
    setLinePoints([puzzle.start[i]]);
  };

  const myPoints = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 2 },
    { x: 0, y: 2 },
  ];
  return (
    <>
      <Root>
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
      </Root>
      <svg
        width="500px"
        height={`${500 * sizeRatio}px`}
        viewBox={`0 0 ${vieww} ${viewh}`}
      >
        <PuzzleGrid puzzle={puzzle} />
        <PuzzleLine
          puzzle={puzzle}
          points={linePoints}
          // current={{ dir: currDir, dist: currDist }}
        />
      </svg>
      <button onClick={() => console.log(linePoints)}>asdasds</button>
    </>
  );
}

export default Puzzle;
