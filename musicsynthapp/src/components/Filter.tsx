import { useContext, useEffect, useState } from "react";
import { Slider } from "./Slider";
import { AppContext } from "../App";

export type FilterSettings = {
    frequency: number
    detune: number
    Q: number
    type: BiquadFilterType
    gain: number
}

type FilterProps = {
    id:string;
    settings?: FilterSettings;
    destination?:string
};
export function Filter(props: FilterProps) {

    const filterTypes = ["allpass", "bandpass", "highpass", "highshelf", "lowpass", "lowshelf", "notch", "peaking"];

    const [settings, setSettings] = useState<FilterSettings>(props.settings?? {frequency:220, detune:0, Q:5, type:"lowpass", gain:0});
    const [filterNode, setFilterNode] = useState<BiquadFilterNode>();
    const [destination, setDestination] = useState(props.destination);
    const { actx, audioNodes } = useContext(AppContext);
    const { id } = props;


    useEffect(() => {
        let filter = actx.createBiquadFilter();

        filter.frequency.value = settings.frequency;
        filter.detune.value = settings.detune;
        filter.Q.value = settings.Q;
        filter.gain.value = settings.gain;
        filter.type = settings.type;
        
        if(destination){
            filter.connect(audioNodes.get(destination) ?? actx.destination);
        } else {
            filter.connect(actx.destination);
        }
        audioNodes.set(id, filter);
        setFilterNode(filter);

    }, [])

    useEffect(()=>{
        if(!filterNode) return;
        
        if(destination){
            filterNode.connect(audioNodes.get(destination) ?? actx.destination);
        } else {
            filterNode.connect(actx.destination);
        }

    }, [filterNode, destination])


      const change = (newvalue: any, id: string) => {
        setSettings({ ...settings, [id]: newvalue });
        if(!filterNode) return;
        
        switch (id) {
          case "frequency":
            filterNode.frequency.value = newvalue;
            break;
          case "detune":
            filterNode.detune.value = newvalue;
            break;
          case "Q":
            filterNode.Q.value = newvalue;
            break;
          case "gain":
            filterNode.gain.value = newvalue;
            break;
          case "type":
            filterNode.type = (newvalue as BiquadFilterType);
            break;
        }
      }

    return (
        <div className="control">
            <h3>Filter 1</h3>
            <Slider
                name="frequency"
                value={settings.frequency}
                maxValue={10000}
                onChange={(value) => change(value, "frequency")}
            ></Slider>
            <Slider
                name="detune"
                value={settings.detune}
                onChange={(value) => change(value, "detune")}
            ></Slider>
            <Slider
                name="Q"
                value={settings.Q}
                maxValue={10}
                step={0.1}
                onChange={(value) => change(value, "Q")}
                ></Slider>
            <Slider
                name="gain"
                value={settings.gain}
                step={0.1}
                maxValue={10}
                onChange={(value) => change(value, "gain")}
            ></Slider>

            <div>
                ({filterTypes.map(item => (
                    <button key={item} id={item} onClick={(e: any) => change(item, "type")} className={`${settings.type === item && "active"}`}>{item}</button>
                ))})
            </div>
        </div>
    );
}
