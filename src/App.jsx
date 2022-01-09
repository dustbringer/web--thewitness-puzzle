import * as React from "react";
import "./App.css";

import Container from "./components/Container";
import PuzzleView from "./components/PuzzleView";

import breakSVG from "./visuals/break.svg";

import Puzzle from "./classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "./enums/Sym";

function App() {
  const p = new Puzzle(7, 8);
  p.addStart(8, 4);
  p.addEnd(0, 0);
  p.addEnd(0, 2);
  p.addEnd(0, 3);
  p.addEnd(0, 4);
  p.addEnd(0, 5);
  p.addEnd(0, 6);
  p.addEnd(0, 7);
  p.addEnd(0, 8);
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
