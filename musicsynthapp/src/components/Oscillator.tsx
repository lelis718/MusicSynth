import { useContext, useEffect, useId, useReducer, useState } from "react";
import React from "react";
import { AppContext } from "../App";
import Slider from "../layout/Slider";


export type OscillatorSettings = {
    frequency: number,
    detune: number,
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
    const [settings, setSettings] = useState<OscillatorSettings>(props.settings ?? { frequency: 220, detune: 0, type: "sine" });
    const [isStarted, setStarted] = useState(false);
    const [destination] = useState(props.destination);
    const [oscillatorNode, setOscillatorNode] = useState<OscillatorNode>();
    const { id } = props;

    useEffect(() => {
        connect(destination);
    }, [destination])

    const start = () => {
        if (oscillatorNode) stop();

        const osc = actx.createOscillator();
        if (settings) {
            osc.frequency.value = settings.frequency;
            osc.detune.value = settings.detune;
            osc.type = settings.type;
        }
        if (destination) {
            console.log("conectando destino a ", audioNodes.get(destination));
            osc.connect(audioNodes.get(destination) ?? actx.destination);
        } else {
            osc.connect(actx.destination);
        }

        osc.start();

        audioNodes.set(id, osc);

        setOscillatorNode(osc);
        setStarted(true);

    }
    const connect = (destinationId?: string) => {
        if (destinationId) {
            oscillatorNode?.connect(audioNodes.get(destinationId) ?? actx.destination);
        } else {
            oscillatorNode?.connect(actx.destination);
        }
    }

    const stop = () => {
        oscillatorNode?.stop();
        oscillatorNode?.disconnect();
        audioNodes.delete(id);
        setOscillatorNode(undefined);
        setStarted(false);
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

    return <div className="control">
        <h3>{props.name ?? "Oscillator 1"}</h3>
        {!isStarted && <button onClick={(e) => { e.stopPropagation(); start(); }}>On</button>}
        {isStarted && <button onClick={(e) => { e.stopPropagation(); stop(); }}>Off</button>}
        <Slider
            name="frequency"
            value={settings.frequency}
            maxValue={5000}
            onChange={(value) => change(value, "frequency")}
        ></Slider>
        <Slider
            name="detune"
            value={settings.detune}
            onChange={(value) => change(value, "detune")}
        ></Slider>
        <div>
            <button id="sine" onClick={(e: any) => change(e.target.id ?? "", "type")} className={`${settings.type === "sine" && "active"}`}>sine</button>
            <button id="sawtooth" onClick={(e: any) => change(e.target.id ?? "", "type")} className={`${settings.type === "sawtooth" && "active"}`}>sawtooth</button>
            <button id="square" onClick={(e: any) => change(e.target.id ?? "", "type")} className={`${settings.type === "square" && "active"}`}>square</button>
            <button id="triangle" onClick={(e: any) => change(e.target.id ?? "", "type")} className={`${settings.type === "triangle" && "active"}`}>triangle</button>
        </div>
    </div>
}