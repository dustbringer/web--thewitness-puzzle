import * as React from "react";
import { styled } from "@mui/material/styles";
import MUIContainer from "@mui/material/Container";

import PuzzlePiece from "./PuzzlePiece";
import { PIECESZ } from "./PuzzlePiece/info";

import Puzzle from "../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";

function PuzzleGrid({ puzzle }) {
  if (!puzzle) {
    console.error(`Error: Puzzle is ${puzzle}`);
    return <p>Puzzle Failed to load</p>;
  }

  return (
    <>
      {puzzle.grid.map((col, i1) => (
        <React.Fragment key={`Fragment${i1}`}>
          {col.map((e, i2) => (
            <PuzzlePiece key={`${i1}${i2}`} puzzle={puzzle} x={i1} y={i2} />
          ))}
        </React.Fragment>
      ))}
    </>
  );
}

export default PuzzleGrid;
