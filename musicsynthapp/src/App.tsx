import "./App.scss";
import { Envelope } from "./components/Envelope";
import { Oscillator } from "./components/Oscillator";
import { AppProvider } from "./engine/AppProvider";


function App() {
  return (
    <AppProvider>
      <div>
          <Envelope name="Envelope 1" id="env1" />
          <Oscillator name="Oscillator 1" id="osc1" destination="env1" />
      </div>
      <div>
          <Envelope name="Envelope 2" id="env2" />
          <Oscillator name="Oscillator 2" id="osc2" destination="env2" />
      </div>
    </AppProvider>
  );
}

export default App;
