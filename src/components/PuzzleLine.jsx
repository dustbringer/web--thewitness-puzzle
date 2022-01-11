import * as React from "react";
import { styled } from "@mui/material/styles";

import PuzzleLineRaw from "./PuzzleLineRaw";

import PuzzleClass, { Direction } from "../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";
import { PIECESZ, STARTRAD } from "./PuzzlePiece/info";

import useStateRef from "../hooks/useStateRef";

const Root = styled("div")`
  position: relative;
`;

const FixedSVG = styled("svg")`
  position: absolute;
`;

// TODO: update this
const EDGESEGMAX = 200;

const StartButton = styled("div")`
  width: ${(props) => props.relativestartrad * 2}px;
  height: ${(props) => props.relativestartrad * 2}px;
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  cursor: pointer;
`;

function PuzzleLine({ puzzle }) {
  // Index of start that has been clicked
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
      if (
        (document.pointerLockElement !== null &&
          startRefs.current.has(document.pointerLockElement)) ||
        (document.mozPointerLockElement !== null &&
          startRefs.current.has(document.mozPointerLockElement))
      ) {
        document.addEventListener("mousemove", updatePosition, false);
        pointerLocked.current = true;
      } else {
        document.removeEventListener("mousemove", updatePosition, false);
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

  const viewh = (PIECESZ / 2) * (puzzle.gridh + 1);
  const vieww = (PIECESZ / 2) * (puzzle.gridw + 1);
  const sizeRatio = (puzzle.gridh + 1) / (puzzle.gridw + 1);

  const pixelsPerUnit = 500 / vieww;
  const relativePieceSize = PIECESZ * pixelsPerUnit; // In pixels
  const relativeStartRad = STARTRAD * pixelsPerUnit; // In pixels

  const updatePosition = (e) => {
    // TODO: change ref values at end
    // TODO: prevent line overlap
    // TODO: check valid edge is desired direction
    // TODO: fix up directional switch statement (probably pass in functions)

    const x = e.movementX;
    const y = e.movementY;
    let currPoint = null;
    if (linePointsRef.current.length > 0)
      currPoint = linePointsRef.current[linePointsRef.current.length - 1];
    let lastPoint = null;
    if (linePointsRef.current.length > 1)
      lastPoint = linePointsRef.current[linePointsRef.current.length - 2];

    const outOfBounds = (curr, dir) => {
      return (
        (curr.x === 0 && dir === Direction.LEFT) ||
        (curr.x >= puzzle.gridw - 1 && dir === Direction.RIGHT) ||
        (curr.y === 0 && dir === Direction.UP) ||
        (curr.y >= puzzle.gridh - 1 && dir === Direction.DOWN)
      );
    };

    // TODO: cap x && y

    // vertex
    if (currDistRef.current <= 8) {
      let valToAdd = 0;
      if (Math.abs(x) >= 1) {
        if (x > 0) setCurrDir(Direction.RIGHT);
        else setCurrDir(Direction.LEFT);
        valToAdd = Math.abs(x);
      } else {
        if (y > 0) setCurrDir(Direction.DOWN);
        else setCurrDir(Direction.UP);
        valToAdd = Math.abs(y);
      }

      if (!outOfBounds(currPoint, currDirRef.current)) {
        // TODO: jumps between directions
        setCurrDist(currDistRef.current + valToAdd);
      } else {
        setCurrDist(0);
      }
      // edge
    } else {
      // add or subtract y based on current direction's positive movement
      switch (currDirRef.current) {
        case Direction.UP:
          setCurrDist(currDistRef.current - y);
          break;
        case Direction.RIGHT:
          setCurrDist(currDistRef.current + x);
          break;
        case Direction.DOWN:
          setCurrDist(currDistRef.current + y);
          break;
        case Direction.LEFT:
          setCurrDist(currDistRef.current - x);
          break;
        default:
          console.log(`wtf dis direction: ${currDirRef.current}`);
          break;
      }
    }

    if (currDistRef.current >= EDGESEGMAX) {
      let newPoint = {
        ...currPoint,
      };
      switch (currDirRef.current) {
        case Direction.UP:
          newPoint.y -= 2;
          break;
        case Direction.RIGHT:
          newPoint.x += 2;
          break;
        case Direction.DOWN:
          newPoint.y += 2;
          break;
        case Direction.LEFT:
          newPoint.x -= 2;
          break;
        default:
          console.log("you've come to the wrong place punk!!!");
          break;
      }

      // TODO: jumps to centre
      setCurrDist(0);
      setLinePoints((points) => [...points, newPoint]);
      console.log(newPoint);
    }

    if (lastPoint !== null) {
      if (
        (currDirRef.current === Direction.UP &&
          lastPoint.y === currPoint.y - 2) ||
        (currDirRef.current === Direction.RIGHT &&
          lastPoint.x === currPoint.x + 2) ||
        (currDirRef.current === Direction.DOWN &&
          lastPoint.y === currPoint.y + 2) ||
        (currDirRef.current === Direction.LEFT &&
          lastPoint.x === currPoint.x - 2)
      ) {
        setLinePoints((points) => {
          return points.slice(0, points.length - 1);
        });
        setCurrDist(EDGESEGMAX - currDistRef.current);
        if (currDirRef.current === Direction.RIGHT) {
          setCurrDir(Direction.LEFT);
        } else {
          setCurrDir(Math.abs(currDirRef.current - 2));
        }
      }
    }
  };

  const handleStartClick = (e, i) => {
    const div = e.target;
    // Stop if already locked to avoid double unlock
    if (pointerLocked.current) document.exitPointerLock();
    else div.requestPointerLock();

    setLinePoints([puzzle.start[i]]);
    setCurrDist(0);
    setCurrDir(Direction.UP);
  };

  const myPoints = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 2 },
    { x: 0, y: 2 },
  ];
  return (
    <>
      <FixedSVG
        width="500px"
        height={`${500 * sizeRatio}px`}
        viewBox={`0 0 ${vieww} ${viewh}`}
      >
        <PuzzleLineRaw
          puzzle={puzzle}
          points={linePoints}
          currDir={currDir}
          currDist={currDist}
        />
      </FixedSVG>
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
      <button
        style={{ position: "relative", top: `${500 * sizeRatio}px` }}
        onClick={() => console.log(linePoints)}
      >
        asdasds
      </button>
    </>
  );
}

export default PuzzleLine;
