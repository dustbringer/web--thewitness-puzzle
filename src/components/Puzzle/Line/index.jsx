import * as React from "react";
import { styled } from "@mui/material/styles";

import useStateRef from "../../../hooks/useStateRef";
import PuzzleLineRaw from "./LineRaw";
import PuzzleLineStart from "./LineStart";

import move from "./move";

import Direction from "../../../enums/Direction";
import { getViewboxSize } from "../../../util/puzzleDisplayUtil";

function PuzzleLine({ puzzle, width }) {
  const [showLine, setShowLine] = React.useState(false);
  const [linePoints, setLinePoints, linePointsRef] = useStateRef([]);
  const [currDir, setCurrDir, currDirRef] = useStateRef(Direction.UP);
  const [currDist, setCurrDist, currDistRef] = useStateRef(0);

  const handleMouseMove = (e) => {
    // TODO: clicking escape should remove all line segments
    // TODO: scale movement speed (can be used as sensitivity setting)

    if (e.movementX === 0 && e.movementY === 0) return;

    const updates = move(
      puzzle,
      e.movementX,
      e.movementY,
      currDistRef.current,
      currDirRef.current,
      linePointsRef.current
    );
    if (updates === undefined) return;

    setLinePoints(updates.points);
    setCurrDist(updates.dist);
    setCurrDir(updates.dir);
  };

  const handleStart = (i) => {
    setLinePoints([puzzle.start[i]]);
    setCurrDist(0);
    setCurrDir(Direction.NONE);
    setShowLine(true);
  };

  const handleEnd = () => {
    // for when mouse clicks to exit
    // TODO: right click to exit, left click to keep the line
    console.log("Ended");

    setShowLine(false);

    // TODO: replace this with what we actually want
    setLinePoints((curr) => [curr[0]]);
    setCurrDist(0);
    setCurrDir(Direction.NONE);
  };

  return (
    <>
      {showLine && (
        <PuzzleLineRaw
          puzzle={puzzle}
          width={width}
          points={linePoints}
          currDir={currDir}
          currDist={currDist}
        />
      )}
      <PuzzleLineStart
        puzzle={puzzle}
        width={width}
        handleStart={handleStart}
        handleEnd={handleEnd}
        handleMouseMove={handleMouseMove}
      />
      <button
        style={{
          position: "relative",
          top: `${500 * getViewboxSize(puzzle).sizeRatio}px`,
        }}
        onClick={() => console.log(linePoints)}
      >
        Hi, I'm a button :)
      </button>
    </>
  );
}

export default PuzzleLine;
