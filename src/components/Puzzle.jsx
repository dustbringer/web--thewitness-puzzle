import * as React from "react";
import { styled } from "@mui/material/styles";

import PuzzleGrid from "./PuzzleGrid";
import PuzzleLine from "./PuzzleLine";

const Root = styled("div")`
  position: relative;
`;

function Puzzle({ puzzle }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  const width = 500; // in pixels

  return (
    <>
      <Root>
        <PuzzleGrid puzzle={puzzle} width={width} />
        <PuzzleLine puzzle={puzzle} width={width} />
      </Root>
    </>
  );
}

export default Puzzle;
