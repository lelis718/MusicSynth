import { Slider } from "./Slider";

export type FilterSettings = {
    frequency: number
    detune: number
    Q: number
    type: BiquadFilterType
    gain: number
}

type FilterProps = {
    settings: FilterSettings;
    onChange: (newValue: any, property: string) => void;
};
export function Filter(props: FilterProps) {

    const filterTypes = ["allpass", "bandpass", "highpass", "highshelf", "lowpass", "lowshelf", "notch", "peaking"];

    return (
        <div className="control">
            <h3>Filter 1</h3>
            <Slider
                name="frequency"
                value={props.settings.frequency}
                maxValue={10000}
                onChange={(value) => props.onChange(value, "frequency")}
            ></Slider>
            <Slider
                name="detune"
                value={props.settings.detune}
                onChange={(value) => props.onChange(value, "detune")}
            ></Slider>
            <Slider
                name="Q"
                value={props.settings.Q}
                maxValue={10}
                step={0.1}
                onChange={(value) => props.onChange(value, "Q")}
                ></Slider>
            <Slider
                name="gain"
                value={props.settings.gain}
                step={0.1}
                maxValue={10}
                onChange={(value) => props.onChange(value, "gain")}
            ></Slider>

            <div>
                ({filterTypes.map(item => (
                    <button key={item} id={item} onClick={(e: any) => props.onChange(item, "type")} className={`${props.settings.type === item && "active"}`}>{item}</button>
                ))})
            </div>
        </div>
    );
}
