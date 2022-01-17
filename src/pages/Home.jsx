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
  p.addStart(8, 4);
  p.addStart(4, 4);
  p.addStart(0, 0);
  p.addStart(6, 7);
  p.addStart(1, 6);
  p.addStart(7, 8);
  p.addEnd(3, 0);
  p.addEnd(0, 2);
  p.addEnd(0, 3);
  p.addEnd(0, 4);
  p.addEnd(5, 8);
  p.addEnd(8, 1);
  p.addEnd(0, 8);
  p.addEnd(8, 0);
  p.addEnd(8, 8);
  p.setEndOrientation(0, 8, Orientation.DIAGONAL);
  p.setEndOrientation(8, 8, Orientation.HORIZONTAL);

  p.addEdgSym(5, 2, EdgSym.BREAK);
  p.addEdgSym(6, 1, EdgSym.BREAK);
  p.addEdgSym(7, 2, EdgSym.BREAK);

  p.addVtxSym(0, 2, VtxSym.DOT);
  p.addSpcSym(1, 1, SpcSym.SUN);

  console.log(p.grid);

  return (
    <Container maxWidth="md">
      asdasjkdnakjsndsad
      <Puzzle puzzle={p} />
    </Container>
  );
}

export default Home;
