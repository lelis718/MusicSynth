import { useState } from "react";
import "./App.scss";
import { Slider } from "./components/Slider";

let actx = new AudioContext();
let out = actx.destination;

export let osc1 = actx.createOscillator();
let gain1 = actx.createGain();

osc1.connect(gain1);
gain1.connect(out);

function App() {
  const [osc1Settings, setOsc1Settings] = useState<Osc1Settings>({
    frequency: osc1.frequency.value,
    detune: osc1.detune.value,
    type:"sine"
  });

  const changeOsc1 = (newvalue: number, id: string) => {
    setOsc1Settings({ ...osc1Settings, [id]: newvalue });
    switch (id) {
      case "frequency":
        osc1.frequency.value = newvalue;
        break;
      case "detune":
        osc1.detune.value = newvalue;
        break;
    }

  };

  const changeOsc1Type = (newValue: OscillatorType ) => {
    setOsc1Settings({ ...osc1Settings, type: newValue });
    osc1.type = newValue;
  };

  return (
    <div className="App">
      <h1>Sliders</h1>
      <Osc1 settings={osc1Settings} onChange={changeOsc1} onChangeType={changeOsc1Type} />
      <button
        onClick={() => {
          osc1.start();
        }}
      >
        Start
      </button>
      <button
        onClick={() => {
          osc1.stop();
        }}
      >
        Stop
      </button>
    </div>
  );
}

type Osc1Settings = {
  frequency: number;
  detune: number;
  type: OscillatorType
};

type Osc1Props = {
  settings: Osc1Settings;
  onChange: (newValue: number, property: string) => void;
  onChangeType: (type: OscillatorType) => void;
};

function Osc1(props: Osc1Props) {
  

  return (
    <div className="control">
      <h3>Oscilator 1</h3>
      <Slider
        name="frequency"
        value={props.settings.frequency}
        maxValue={5000}
        onChange={(value) => props.onChange(value, "frequency")}
      ></Slider>
      <Slider
        name="detune"
        value={props.settings.detune}
        onChange={(value) => props.onChange(value, "detune")}
      ></Slider>
      <div>
      <button id="sine" onClick={(e:any)=>props.onChangeType(e.target.id??"")} className={`${props.settings.type === "sine" && "active" }`}>sine</button>
      <button id="sawtooth" onClick={(e:any)=>props.onChangeType(e.target.id??"") } className={`${props.settings.type === "sawtooth" && "active" }`}>sawtooth</button>
      <button id="square" onClick={(e:any)=>props.onChangeType(e.target.id??"") } className={`${props.settings.type === "square" && "active" }`}>square</button>
      <button id="triangle" onClick={(e:any)=>props.onChangeType(e.target.id??"") } className={`${props.settings.type === "triangle" && "active" }`}>triangle</button>
      </div>
    </div>
  );
}

export default App;
