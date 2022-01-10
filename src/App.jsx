import * as React from "react";
import "./App.css";

import Container from "./components/Container";
import Puzzle from "./components/Puzzle";

import breakSVG from "./visuals/break.svg";

import PuzzleClass from "./classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "./enums/Sym";

function App() {
  const p = new PuzzleClass(4, 4);
  p.addStart(8, 4);
  p.addStart(4, 4);
  p.addStart(8, 0);
  p.addStart(0, 0);
  p.addStart(8, 7);
  p.addEnd(0, 2);
  p.addEnd(0, 3);
  p.addEnd(0, 4);
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
        <Puzzle puzzle={p} />
      </Container>
    </div>
  );
}

export default App;
