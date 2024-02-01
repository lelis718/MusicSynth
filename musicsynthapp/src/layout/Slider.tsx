
type SliderProps = {
    name: string;
    value?: number;
    maxValue?: number;
    step?: number;
    onChange: (value: number) => void;
};
export default function Slider(props: SliderProps) {

    const handleValueChange = (e: any) => {
        const value = parseFloat(e.target.value);
        if (props.onChange) {
            props.onChange(value);
        }
    };

    return (
        <div>
            <h3>{props.name}</h3>
            <input
                onChange={handleValueChange}
                value={props.value}
                step={props.step}
                type="range"
                max={props.maxValue}
                id="someRange"
            ></input>
        </div>
    );
}
