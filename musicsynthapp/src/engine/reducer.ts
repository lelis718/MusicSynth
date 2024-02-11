import { EnvelopeSettings, SynthEnvelope } from "./SynthEnvelope";
import { SynthNode, SynthNodeUnit } from "./SynthBase";
import { OscillatorSettings, SynthOscillator } from "./SynthOscillator";

export type SynthAction =

    RegisterOscillator |
    RegisterEnvelope |
    ChangeOscillatorSettings |
    ChangeEnvelopeSettings |
    ChangeNodeDestination |
    StartNode |
    StopNode
    ;

export type AppState = {
    audioContext: AudioContext;
    synthNodes: { [id: string]: SynthNode };
    audioNodes: { [id: string]: SynthNodeUnit };
};

export type RegisterOscillator = {
    actionName: "REGISTER_OSCILLATOR";
    synthId: string;
    settings?: OscillatorSettings;
};
export type RegisterEnvelope = {
    actionName: "REGISTER_ENVELOPE";
    synthId: string;
    settings?: EnvelopeSettings;
};

export type ChangeOscillatorSettings = {
    actionName: "CHANGE_OSCILLATOR_SETTINGS";
    synthId: string;
    settings: OscillatorSettings;
};
export type ChangeEnvelopeSettings = {
    actionName: "CHANGE_ENVELOPE_SETTINGS";
    synthId: string;
    settings: EnvelopeSettings;
};


export type ChangeNodeDestination = {
    actionName: "CHANGE_NODE_DESTINATION";
    synthId: string;
    destinationId?: string;
};

export type StartNode = {
    actionName: "START";
    synthId: string;
    nodeInstanceId: string;
    settingsOverride?: {[id:string]:number}
};
export type StopNode = {
    actionName: "STOP";
    nodeInstanceId: string;
};


export const reducer = (state: AppState, action: SynthAction): AppState => {
    switch (action.actionName) {
        case "REGISTER_OSCILLATOR":
            const new_osc = new SynthOscillator(state.audioContext, action.settings ?? { frequency: 225, gain: 10, detune:0, type: "sine" });
            return {
                ...state,
                synthNodes: { ...state.synthNodes, ...{ [action.synthId]: new_osc } }
            }
        case "REGISTER_ENVELOPE":
            const new_env = new SynthEnvelope(state.audioContext, action.settings ?? { attack: 0.2, sustain: 0.8, release: 0.5, decay: 0.3 });
            return {
                ...state,
                synthNodes: { ...state.synthNodes, ...{ [action.synthId]: new_env } }
            }
        case "CHANGE_OSCILLATOR_SETTINGS":
            const osc = state.synthNodes[action.synthId] as SynthOscillator;
            if (osc) osc.setSettings(action.settings);
            return {
                ...state,
                synthNodes: { ...state.synthNodes, ...{ [action.synthId]: osc } }
            }
        case "CHANGE_ENVELOPE_SETTINGS":
            const env = state.synthNodes[action.synthId] as SynthEnvelope;
            if (env) {
                env.setSettings(action.settings);
                return {
                    ...state,
                    synthNodes: { ...state.synthNodes, ...{ [action.synthId]: env } }
                }
            }
            return { ...state };

        case "CHANGE_NODE_DESTINATION":
            const origin = state.synthNodes[action.synthId] as SynthNode;
            if (action.destinationId) {
                const destination = state.synthNodes[action.destinationId] as SynthNode;
                origin.setDestination(destination);
            } else {
                origin.setDestination(undefined);
            }
            return {
                ...state,
                synthNodes: { ...state.synthNodes, ...{ [action.synthId]: origin } }
            }
        case "START":
            const nodeToStart = state.synthNodes[action.synthId] as SynthNode;
            
            if (nodeToStart) {
                if(action.settingsOverride && nodeToStart instanceof SynthOscillator) {
                    nodeToStart.setSettings({...nodeToStart.getSettings(), frequency:action.settingsOverride["frequency"]});
                }
                const nodeInstance = nodeToStart.create();
                nodeInstance.start();
                return { ...state, audioNodes: { ...state.audioNodes, ...{ [action.nodeInstanceId]: nodeInstance } } }
            }
            return { ...state }
        case "STOP":
            const nodeToStop = state.audioNodes[action.nodeInstanceId];
            if (nodeToStop) {
                nodeToStop.stop();
                const otherEntries = Object.entries(state.audioNodes).filter(item => item[0] !== action.nodeInstanceId);
                const updatedAudioNodes = otherEntries.reduce((acc: { [id: string]: SynthNodeUnit }, item) => {
                    const id: string = item[0];
                    acc[id] = item[1];
                    return acc;
                }, {});
                return {
                    ...state,
                    audioNodes: updatedAudioNodes
                }
            }
            return { ...state }
    };
}



