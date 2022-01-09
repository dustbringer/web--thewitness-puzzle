import * as React from "react";
import "./App.css";

import Container from "./components/Container";
import PuzzleView from "./components/PuzzleView";

import breakSVG from "./visuals/break.svg";

import Puzzle from "./classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "./enums/Sym";

function App() {
  const p = new Puzzle(4, 4);
  p.addStart(8, 4);
  p.addEnd(0, 0);
  p.addEnd(0, 2);
  p.addEnd(0, 3);
  p.addEnd(0, 4);
  p.addEnd(0, 5);
  p.addEnd(0, 6);
  p.addEnd(0, 7);
  p.addEnd(0, 8);
  p.addEnd(1, 8);
  p.addEnd(2, 8);
  p.addEnd(3, 8);
  p.addEnd(4, 8);
  p.addEnd(5, 8);
  p.addEnd(6, 8);
  p.addEnd(7, 8);
  p.addEnd(8, 8);
  p.addEnd(8, 7);
  p.addEnd(8, 6);
  p.addEnd(8, 5);
  // p.addEnd(8, 4); // start
  p.addEnd(8, 3);
  p.addEnd(8, 2);
  p.addEnd(8, 1);
  p.addEnd(8, 0);
  p.addEnd(7, 0);
  p.addEnd(6, 0);
  p.addEnd(5, 0);
  p.addEnd(4, 0);
  p.addEnd(3, 0);
  p.addEnd(2, 0);
  p.addEdgSym(0, 1, EdgSym.break);
  p.addEdgSym(1, 0, EdgSym.break);
  p.addEdgSym(2, 1, EdgSym.break);
  p.addEdgSym(1, 2, EdgSym.break);
  p.addEdgSym(2, 3, EdgSym.break);
  p.addEdgSym(3, 2, EdgSym.break);
  p.addVtxSym(0, 2, VtxSym.dot);
  p.addSpcSym(1, 1, SpcSym.sun);

  console.log(p.grid);

  return (
    <div>
      <Container maxWidth="md">
        asdasjkdnakjsndsad
        <PuzzleView puzzle={p} />
      </Container>
    </div>
  );
}

export default App;
