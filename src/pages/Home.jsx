import * as React from "react";

import Container from "../components/Container";
import Puzzle from "../components/Puzzle";

import PuzzleClass from "../classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "../enums/Sym";
import Orientation from "../enums/Orientation";

import removedEdgeMaze1 from "../puzzles/removedEdgeMaze1";
import removedEdgeMaze2 from "../puzzles/removedEdgeMaze2";

function Home() {
  let p = new PuzzleClass(4, 4);
  p.addStart(8, 4)
    .addStart(4, 4)
    .addStart(0, 0)
    .addStart(6, 7)
    .addStart(1, 6)
    .addStart(7, 8)
    .addEnd(3, 0)
    .addEnd(0, 2)
    .addEnd(0, 3)
    .addEnd(0, 4)
    .addEnd(5, 8)
    .addEnd(8, 1)
    .addEnd(0, 8)
    .addEnd(8, 0)
    .addEnd(8, 8)
    .setEndOrientation(8, 8, Orientation.HORIZONTAL)
    .addEdgSym(5, 2, EdgSym.BREAK)
    .addEdgSym(6, 1, EdgSym.BREAK)
    .addEdgSym(7, 2, EdgSym.BREAK)
    .addVtxSym(0, 2, VtxSym.DOT)
    .addSpcSym(1, 1, SpcSym.SUN);

  console.log(p.grid);

  return (
    <Container maxWidth="md">
      asdasjkdnakjsndsad
      <Puzzle puzzle={p} />
    </Container>
  );
}

export default Home;
