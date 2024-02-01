import { createContext } from "react";
import "./App.scss";
import { Filter } from "./components/Filter";
import { Gain } from "./components/Gain";
import { Oscillator } from "./components/Oscillator";
import WaveDisplay from "./components/WaveDisplay";
import Knob from "./layout/Knob";



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


            <div>
                <Knob value={80} from={60} to={100} name="Volume"></Knob>
            </div>
            <div className="App">
                <Oscillator id="osc1" destination="gain1" />
                <Oscillator id="osc2" destination="gain2" />
                <Gain id="gain1" destination="filterOsc1" name="Oscillator 1 Gain" />
                <Gain id="gain2" destination="filterOsc2" name="Oscillator 2 Gain" />
                <Filter id="filterOsc1" destination="gain3" />
                <Filter id="filterOsc2" destination="gain3" />
                <Gain id="gain3" destination="analyzer1" name="Both Oscillators Gain" />
            </div>


        </AppContext.Provider>
    );
}

export default App;

