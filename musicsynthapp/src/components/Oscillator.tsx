import { useContext, useEffect, useId, useReducer, useState } from "react";
import React from "react";
import { AppContext } from "../App";
import Slider from "../layout/Slider";
import Knob from "../layout/Knob";
import OnOff from "../layout/OnOff";


export type OscillatorSettings = {
    frequency: number,
    detune: number,
    gain: number,
    type: OscillatorType
}

type OscillatorProps = {
    id: string,
    name?: string,
    settings?: OscillatorSettings
    destination?: string
}

export const Oscillator = (props: OscillatorProps) => {

    const { actx, audioNodes } = useContext(AppContext);
    const [settings, setSettings] = useState<OscillatorSettings>(props.settings ?? { frequency: 220, detune: 0, gain: 0, type: "sine" });
    const [isStarted, setIsStarted] = useState(false);
    const [oscillatorNode, setOscillatorNode] = useState<OscillatorNode>();
    const [internalGainNode, setInternalGainNode] = useState<GainNode>();
    const { id } = props;

    useEffect(() => {
        const gainNode = actx.createGain();
        audioNodes.set(`${id}`, gainNode);

        setInternalGainNode(gainNode);

    }, [])

    useEffect(() => {
        connect(props.destination);
    }, [props.destination])

    const start = () => {
        if (oscillatorNode) stop();

        const osc = actx.createOscillator();
        if (internalGainNode) {
            osc.connect(internalGainNode);
        }

        if (settings) {
            osc.frequency.value = settings.frequency;
            osc.detune.value = settings.detune;
            osc.type = settings.type;
        }
        if (props.destination && internalGainNode) {
            internalGainNode.connect(audioNodes.get(props.destination) ?? actx.destination);
        } else {
            internalGainNode?.connect(actx.destination);
        }
        osc.start(0);

        audioNodes.set(`${id}-internalOsc`, osc);


        setOscillatorNode(osc);
        setIsStarted(true);

    }
    const connect = (destinationId?: string) => {
        if (destinationId) {
            internalGainNode?.connect(audioNodes.get(destinationId) ?? actx.destination);
        } else {
            internalGainNode?.connect(actx.destination);
        }
    }

    const stop = () => {
        oscillatorNode?.stop();
        oscillatorNode?.disconnect();
        audioNodes.delete(`${id}-internalOsc`);
        setOscillatorNode(undefined);
        setIsStarted(false);
    }

    const change = (value: number | string, key: string) => {
        setSettings({ ...settings, [key]: value });
        if (!oscillatorNode) return;

        switch (key) {
            case "frequency":
                oscillatorNode.frequency.value = value as number;
                break;
            case "detune":
                oscillatorNode.detune.value = value as number;
                break;
            case "type":
                oscillatorNode.type = value as OscillatorType;
                break;

        }
    }

    const changeGain = (value: number) => {
        setSettings({ ...settings, "gain": value });
        if (internalGainNode)
            internalGainNode.gain.value = value;
    }

    return <div className="control">
        <div className="header" onMouseDown={() => { !isStarted ? start() : stop() }}>
            <h3 className={isStarted ? "on" : "off"}>{props.name ?? "Oscillator"}</h3>
            <OnOff value={isStarted}></OnOff>
        </div>
        <div>
            <Knob name="frequency" value={settings.frequency} from={0} to={5000} onValueChange={(value) => { change(value, "frequency") }}></Knob>
            <Knob name="detune" value={settings.detune} from={0} to={100} onValueChange={(value) => { change(value, "detune") }}></Knob>
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