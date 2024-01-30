import { Slider } from "./Slider";

export type Osc1Settings = {
  frequency: number;
  detune: number;
  type: OscillatorType;
};
type Osc1Props = {
  settings: Osc1Settings;
  onChange: (newValue: number, property: string) => void;
  onChangeType: (type: OscillatorType) => void;
};
export function Osc1(props: Osc1Props) {


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
        <button id="sine" onClick={(e: any) => props.onChangeType(e.target.id ?? "")} className={`${props.settings.type === "sine" && "active"}`}>sine</button>
        <button id="sawtooth" onClick={(e: any) => props.onChangeType(e.target.id ?? "")} className={`${props.settings.type === "sawtooth" && "active"}`}>sawtooth</button>
        <button id="square" onClick={(e: any) => props.onChangeType(e.target.id ?? "")} className={`${props.settings.type === "square" && "active"}`}>square</button>
        <button id="triangle" onClick={(e: any) => props.onChangeType(e.target.id ?? "")} className={`${props.settings.type === "triangle" && "active"}`}>triangle</button>
      </div>
    </div>
  );
}
