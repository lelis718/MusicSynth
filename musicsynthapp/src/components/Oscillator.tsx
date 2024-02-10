import { useContext, useEffect, useState } from "react";
import Knob from "../layout/Knob";
import OnOff from "../layout/OnOff";
import { OscillatorSettings } from "../engine/reducer";
import { AppContext, useFetching } from "../engine/AppProvider";



type OscillatorProps = {
    id: string,
    name?: string,
    settings?: OscillatorSettings
    destination?: string
}
const initialSettings:OscillatorSettings =  { frequency: 220, gain: 0, type: "sine" };

export const Oscillator = (props: OscillatorProps) => {

    const { dispatch } = useContext(AppContext);
    const [settings, setSettings] = useState<OscillatorSettings>(props.settings ?? initialSettings);
    const [isStarted, setIsStarted] = useState(false);
    const [destination, setDestination] = useState(props.destination);

    
    useFetching({ actionName:"REGISTER_OSCILLATOR", synthId:props.id, settings:props.settings })

    useEffect(()=>{
        dispatch({actionName:"CHANGE_NODE_DESTINATION", destinationId:destination, synthId:props.id})
    },[destination, props.id])

    const start = () => {
        dispatch({ actionName:"START", synthId:props.id, nodeInstanceId: props.id })
        setIsStarted(true);
    }

    const stop = () => {
        dispatch({ actionName:"STOP", nodeInstanceId: props.id })
        setIsStarted(false);
    }
    
    const change = (value: number | string, key: string) => {
        const newSettings = { ...settings, [key]: value };
        dispatch({ actionName:"CHANGE_OSCILLATOR_SETTINGS", synthId: props.id, settings:newSettings })
        setSettings({...newSettings})
    }
    
    const changeGain = (value: number) => {
        const newSettings = { ...settings, "gain": value };
        dispatch({ actionName:"CHANGE_OSCILLATOR_SETTINGS", synthId: props.id, settings:newSettings })
        setSettings({...newSettings})
    }

    return <div className="control">
        <div className="header" onMouseDown={() => { !isStarted ? start() : stop() }}>
            <h3 className={isStarted ? "on" : "off"}>{props.name ?? "Oscillator"}</h3>
            <OnOff value={isStarted}></OnOff>
        </div>
        <div>
            <Knob name="frequency" value={settings.frequency} from={0} to={5000} onValueChange={(value) => { change(value, "frequency") }}></Knob>
            <Knob name="detune" value={0} from={0} to={100} onValueChange={(value) => { change(value, "detune") }}></Knob>
            <Knob name="gain" value={settings.gain} from={0} to={10} onValueChange={(value) => { changeGain(value) }}></Knob>
        </div>
        <div className="buttonGroup">
            <button id="sine" onClick={(e: any) => change(e.target.id ?? "", "type")} className={`${settings.type === "sine" && "active"}`}>sine</button>
            <button id="sawtooth" onClick={(e: any) => change(e.target.id ?? "", "type")} className={`${settings.type === "sawtooth" && "active"}`}>sawtooth</button>
            <button id="square" onClick={(e: any) => change(e.target.id ?? "", "type")} className={`${settings.type === "square" && "active"}`}>square</button>
            <button id="triangle" onClick={(e: any) => change(e.target.id ?? "", "type")} className={`${settings.type === "triangle" && "active"}`}>triangle</button>
        </div>
    </div>

}