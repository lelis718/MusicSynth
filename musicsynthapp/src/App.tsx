import { useState } from "react";
import "./App.scss";
import { Osc1Settings, Osc1 } from "./components/Osc1";
import { FilterSettings, Filter } from "./components/Filter";
import WaveDisplay from "./components/WaveDisplay";

let actx = new AudioContext();
let out = actx.destination;

export let osc1 = actx.createOscillator();
let gain1 = actx.createGain();
let filter = actx.createBiquadFilter();
let analyser = actx.createAnalyser();
osc1.connect(gain1);
gain1.connect(filter);
filter.connect(analyser);
analyser.connect(out);
analyser.fftSize = 2048;

function App() {
  const [osc1Settings, setOsc1Settings] = useState<Osc1Settings>({
    frequency: osc1.frequency.value,
    detune: osc1.detune.value,
    type:"sine"
  });

  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    frequency: filter.frequency.value,
    detune: filter.detune.value,
    Q: filter.Q.value,
    type: filter.type,
    gain: filter.gain.value
  });  

  const changeFilter = (newvalue: any, id:string) => {
    setFilterSettings({...filterSettings, [id]: newvalue});
    switch(id){
      case "frequency":
        filter.frequency.value = newvalue;
        break;
        case "detune":
          filter.detune.value = newvalue;
          break;
        case "Q":
          filter.Q.value = newvalue;
          break;
        case "gain":
          filter.gain.value = newvalue;
          break;
        case "type":
          filter.type = (newvalue as BiquadFilterType);
          break;
        }
  }

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
      <Filter settings={filterSettings} onChange={changeFilter} />
      <WaveDisplay width={200} height={200} bufferlength={analyser.frequencyBinCount} getDataArray={()=> {
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);
        return dataArray;        
      }} ></WaveDisplay>
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

export default App;
