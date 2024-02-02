import { createContext } from "react";
import "./App.scss";
import { Filter } from "./components/Filter";
import { Gain } from "./components/Gain";
import { Oscillator } from "./components/Oscillator";
import WaveDisplay from "./components/WaveDisplay";
import Knob from "./layout/Knob";
import OnOff from "./layout/OnOff";



let actx: AudioContext = new AudioContext();
let out = actx.destination;
let audioNodes: Map<string, AudioNode> = new Map();
let analyser = actx.createAnalyser();
analyser.connect(out);
analyser.fftSize = 2048;
audioNodes.set("analyzer1", analyser);

export const AppContext = createContext({
    actx,
    audioNodes
});


function App() {

    return (
        <AppContext.Provider value={{ actx, audioNodes }}>
            <div className="App">
                <div>
                    <Oscillator name="Oscillator 1" id="osc1" destination="filterOsc1" />
                    <Filter name="Filter 1" id="filterOsc1" destination="gain3" />
                </div>
                <div>
                    <Oscillator name="Oscillator 2" id="osc2" destination="filterOsc2" />
                    <Filter name="Filter 2" id="filterOsc2" destination="gain3" />
                </div>
                <Gain id="gain3" destination="analyzer1" name="Both Oscillators Gain" />
            </div>
        </AppContext.Provider>
    );
}

export default App;

