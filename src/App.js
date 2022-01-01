import logo from "./logo.svg";
import "./App.css";
import Container from "./components/Container";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Poop.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Container maxWidth="md">
        Blah lasdmlasdmkal skmdals kdmlask mdlask dmalsk dmaslkd mals
        kmalskmdals kmals km ldkm
      </Container>
    </div>
  );
}

export default App;
