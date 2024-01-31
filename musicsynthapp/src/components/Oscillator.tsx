import { useContext, useEffect, useReducer, useState } from "react";
import React from "react";
import { AppContext } from "../App";
import { Slider } from "./Slider";

type OscillatorSettings = {
    frequency: number,
    detune: number,
    type: OscillatorType
}

type OscillatorState = {
    isStarted: boolean,
    settings: OscillatorSettings,
    oscillatorNode?: OscillatorNode
    oscillatorGain?: OscillatorNode
}

type OscillatorAction = StartOscillatorAction | StopOscillatorAction | ChangeOscillatorSettingsAction | ChangeOscillatorConnectionAction;
type StartOscillatorAction = { type: "START", audioContext: AudioContext, settings?: OscillatorSettings }
type StopOscillatorAction = { type: "STOP" }
type ChangeOscillatorSettingsAction = { type: "CHANGE_SETTINGS", settings: OscillatorSettings }
type ChangeOscillatorConnectionAction = { type: "CHANGE_CONNECTION", audioSource?: AudioNode, audioContext: AudioContext }

const reducer = (state: OscillatorState, action: OscillatorAction): OscillatorState => {
    switch (action.type) {
        case "START":
            console.log("Creating the oscillator (REDUCER)");

            const osc = action.audioContext.createOscillator();
            osc.connect(action.audioContext.destination);
            osc.start();

            if (action.settings) {
                osc.frequency.value = action.settings.frequency;
                osc.detune.value = action.settings.detune;
                osc.type = action.settings.type;
            }

            return {
                ...state,
                oscillatorNode: osc,
                isStarted: true,
                settings: action.settings ?? { frequency: osc.frequency.value, detune: osc.detune.value, type: "sine" }
            };

        case "STOP":
            console.log("STOPPING the oscillator (REDUCER)", state.oscillatorNode);
            state.oscillatorNode?.stop();
            state.oscillatorNode?.disconnect();
            return { ...state, isStarted: false, oscillatorNode: undefined }

        case "CHANGE_SETTINGS":
            if (!state.oscillatorNode) return { ...state };
            let osc1 = state.oscillatorNode;
            osc1.frequency.value = action.settings.frequency;
            osc1.detune.value = action.settings.detune;
            osc1.type = action.settings.type;
            return { ...state, oscillatorNode: osc1, settings: action.settings }

        case "CHANGE_CONNECTION": //WIP
            if (!state.oscillatorNode) return { ...state };

            if (action.audioSource) {
                state.oscillatorNode.connect(action.audioSource);
            } else {
                state.oscillatorNode.connect(action.audioContext.destination);
            }
            return { ...state }
        default:
            return state;
    }


}


export const Oscillator = () => {

    const { actx } = useContext(AppContext);

    const [state, dispatcher] = useReducer(reducer, {
        isStarted: false,
        settings: { frequency: 0, detune: 0, type: "sine" }
    })

    const start = () => {
        dispatcher({ type: "START", audioContext: actx });
    }

    const stop = () => {
        dispatcher({ type: "STOP" });
    }

    const change = (value: number | string, key: string) => {
        dispatcher({ type: "CHANGE_SETTINGS", settings: { ...state.settings, [key]: value } });
    }

    return <div className="control">
        <h3>Oscilator 1</h3>
        {!state.isStarted && <button onClick={(e) => { e.stopPropagation(); start(); }}>On</button>}
        {state.isStarted && <button onClick={(e) => { e.stopPropagation(); stop(); }}>Off</button>}

        <Slider
            name="frequency"
            value={state.settings.frequency}
            maxValue={5000}
            onChange={(value) => change(value, "frequency")}
        ></Slider>
        <Slider
            name="detune"
            value={state.settings.detune}
            onChange={(value) => change(value, "detune")}
        ></Slider>
        <div>
            <button id="sine" onClick={(e: any) => change(e.target.id ?? "", "type")} className={`${state.settings.type === "sine" && "active"}`}>sine</button>
            <button id="sawtooth" onClick={(e: any) => change(e.target.id ?? "", "type")} className={`${state.settings.type === "sawtooth" && "active"}`}>sawtooth</button>
            <button id="square" onClick={(e: any) => change(e.target.id ?? "", "type")} className={`${state.settings.type === "square" && "active"}`}>square</button>
            <button id="triangle" onClick={(e: any) => change(e.target.id ?? "", "type")} className={`${state.settings.type === "triangle" && "active"}`}>triangle</button>
        </div>
    </div>
}