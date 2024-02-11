import "./App.scss";
import { Envelope } from "./components/Envelope";
import Keyboard from "./components/Keyboard";
import { Oscillator } from "./components/Oscillator";
import { AppProvider } from "./engine/AppProvider";


function App() {
  return (
    <AppProvider>
      <div>
          <Envelope name="Envelope 1" id="env1" />
          <Oscillator name="Oscillator 1" id="osc1" destination="env1" />
          <Keyboard destination="osc1"></Keyboard>
      </div>
      <div>
          <Oscillator name="Oscillator 2" id="osc2" />
      </div>

    </AppProvider>
  );
}

export default App;
