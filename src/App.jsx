import "./App.css";

import Container from "./components/Container";

import Puzzle from "./classes/Puzzle";

function App() {
  const p = new Puzzle(1, 4);

  return (
    <div className="App">
      <Container maxWidth="md">
        Blah lasdmlasdmkal skmdals kdmlask mdlask dmalsk dmaslkd mals
        kmalskmdals kmals km ldkm
      </Container>
    </div>
  );
}

export default App;
