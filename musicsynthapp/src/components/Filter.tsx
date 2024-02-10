const Filter=()=>{}
export default Filter;
// import { useContext, useEffect, useState } from "react";
// import Slider from "../layout/Slider";
// import { AppContext } from "../App";
// import Knob from "../layout/Knob";

// export type FilterSettings = {
//     frequency: number
//     detune: number
//     Q: number
//     type: BiquadFilterType
//     gain: number
// }

// type FilterProps = {
//     id: string;
//     name?: string;
//     settings?: FilterSettings;
//     destination?: string
// };
// export function Filter(props: FilterProps) {

//     const filterTypes = ["allpass", "bandpass", "highpass", "highshelf", "lowpass", "lowshelf", "notch", "peaking"];

//     const [settings, setSettings] = useState<FilterSettings>(props.settings ?? { frequency: 220, detune: 0, Q: 5, type: "lowpass", gain: 0 });
//     const [filterNode, setFilterNode] = useState<BiquadFilterNode>();
//     const [destination, setDestination] = useState(props.destination);
//     const { actx, audioNodes } = useContext(AppContext);
//     const { id } = props;


//     useEffect(() => {
//         let filter = actx.createBiquadFilter();

//         filter.frequency.value = settings.frequency;
//         filter.detune.value = settings.detune;
//         filter.Q.value = settings.Q;
//         filter.gain.value = settings.gain;
//         filter.type = settings.type;

//         if (destination) {
//             filter.connect(audioNodes.get(destination) ?? actx.destination);
//         } else {
//             filter.connect(actx.destination);
//         }
//         audioNodes.set(id, filter);
//         setFilterNode(filter);

//     }, [])

//     useEffect(() => {
//         if (!filterNode) return;

//         if (destination) {
//             filterNode.connect(audioNodes.get(destination) ?? actx.destination);
//         } else {
//             filterNode.connect(actx.destination);
//         }

//     }, [filterNode, destination])


//     const change = (newvalue: any, id: string) => {
//         setSettings({ ...settings, [id]: newvalue });
//         if (!filterNode) return;

//         switch (id) {
//             case "frequency":
//                 filterNode.frequency.value = newvalue;
//                 break;
//             case "detune":
//                 filterNode.detune.value = newvalue;
//                 break;
//             case "Q":
//                 filterNode.Q.value = newvalue;
//                 break;
//             case "gain":
//                 filterNode.gain.value = newvalue;
//                 break;
//             case "type":
//                 filterNode.type = (newvalue as BiquadFilterType);
//                 break;
//         }
//     }

//     return (
//         <div className="control">
//             <div className="header">
//                 <h3>{props.name ?? "Filter"}</h3>
//             </div>
//             <div>
//                 <Knob name="frequency" value={settings.frequency} from={0} to={10000} onValueChange={(value) => change(value, "frequency")} ></Knob>
//                 <Knob name="detune" value={settings.detune} from={0} to={100} onValueChange={(value) => change(value, "detune")} ></Knob>
//                 <Knob name="Q" value={settings.Q} from={0} to={10} onValueChange={(value) => change(value, "Q")} ></Knob>
//                 <Knob name="gain" value={settings.gain} from={0} to={10} onValueChange={(value) => change(value, "gain")} ></Knob>
//             </div>

//             <div className="buttonGroup">
//                 {filterTypes.map(item => (
//                     <button key={item} id={item} onClick={(e: any) => change(item, "type")} className={`${settings.type === item && "active"}`}>{item}</button>
//                 ))}
//             </div>
//         </div>
//     );
// }
