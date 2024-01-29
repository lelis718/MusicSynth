
type SliderProps = {
  name: string;
  value?: number;
  maxValue?: number;
  onChange: (value: number) => void;
};
export function Slider(props: SliderProps) {

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
        type="range"
        max={props.maxValue}
        id="someRange"
      ></input>
    </div>
  );
}
