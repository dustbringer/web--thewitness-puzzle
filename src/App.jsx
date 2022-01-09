import * as React from "react";
import "./App.css";

import Container from "./components/Container";
import PuzzleView from "./components/PuzzleView";

import breakSVG from "./visuals/break.svg";

import Puzzle from "./classes/Puzzle";
import { VtxSym, SpcSym, EdgSym } from "./enums/Sym";

function App() {
  const p = new Puzzle(4, 4);
  p.addStart(0, 0);
  p.addEnd(2, 8);
  p.addEdgSym(0, 1, EdgSym.break);
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
