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
    audioNodes: { [id: string]: SynthNodeInput };
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
};
export type StopNode = {
    actionName: "STOP";
    nodeInstanceId: string;
};


export const reducer = (state: AppState, action: SynthAction): AppState => {
    switch (action.actionName) {
        case "REGISTER_OSCILLATOR":
            const new_osc = new SynthOscillator(state.audioContext, action.settings ?? { frequency: 225, gain: 10, type: "sine" });
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
                const updatedAudioNodes = otherEntries.reduce((acc: { [id: string]: SynthNodeInput }, item) => {
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


export interface SynthNode {
    setDestination(node?: SynthNode): void;
    create(): SynthNodeInput;
}
export interface SynthNodeInput {

    get baseAudioNode(): AudioNode;
    get endAudioNode(): AudioNode;
    connectInput(input: SynthNodeInput): void;
    start(): void;
    stop(): void;
}

export type OscillatorSettings = {
    frequency: number;
    type: OscillatorType;
    gain: number;
};

export class SynthOscillator implements SynthNode {

    private audioContext: AudioContext;
    private settings: OscillatorSettings;
    private destination?: SynthNode;
    private oscillators: SynthNodeInput[];

    constructor(audioContext: AudioContext, settings: OscillatorSettings) {
        this.audioContext = audioContext;
        this.settings = settings;
        this.oscillators = [];
    }

    setSettings(settings: OscillatorSettings) {
        this.settings = { ...settings };
        this.oscillators.forEach(item => {
            const osc = item.baseAudioNode as OscillatorNode;
            const gain = item.endAudioNode as GainNode;
            osc.frequency.value = this.settings.frequency;
            osc.type = this.settings.type;
            gain.gain.value = this.settings.gain;
        });
    }
    setDestination(node: SynthNode): void {
        this.destination = node;
    }

    create(): SynthNodeInput {
        const osc = this.audioContext.createOscillator();
        osc.frequency.value = this.settings.frequency;
        osc.type = this.settings.type;

        const gain = this.audioContext.createGain();
        gain.gain.value = this.settings.gain;
        osc.connect(gain)

        const binder = this;

        if (this.destination) {
            const destinationInput = this.destination.create();
            gain.connect(destinationInput.endAudioNode);
            const output = {
                baseAudioNode: osc,
                endAudioNode: destinationInput.endAudioNode,
                connectInput: (input: SynthNodeInput) => {
                    gain.connect(input.baseAudioNode);
                },
                start: () => {
                    osc.start();
                    destinationInput.start();
                },
                stop: () => {
                    destinationInput.stop();
                    setTimeout(()=>{
                        osc.stop();
                        osc.disconnect();
                    },2000)
                    binder.oscillators.splice(binder.oscillators.indexOf(output), 1)
                }
            }
            this.oscillators.push(output);
            return output;

        } else {
            gain.connect(this.audioContext.destination);
            const output = {
                baseAudioNode: osc,
                endAudioNode: gain,
                connectInput: (input: SynthNodeInput) => {
                    gain.connect(input.baseAudioNode);
                },
                start: () => { osc.start() },
                stop: () => {
                    osc.stop();
                    osc.disconnect();
                    binder.oscillators.splice(binder.oscillators.indexOf(output), 1)
                }
            }
            this.oscillators.push(output);
            return output;
        }
    }

}


export type EnvelopeSettings = {
    attack: number;
    sustain: number;
    decay: number;
    release: number;
};
export class SynthEnvelope implements SynthNode {

    settings: EnvelopeSettings;
    private easing: number = 0.005;
    private audioContext: AudioContext;
    private destination?: SynthNode;
    private envelopeGains: SynthNodeInput[]

    constructor(audioContext: AudioContext, settings: EnvelopeSettings) {
        this.settings = settings;
        this.audioContext = audioContext;
        this.envelopeGains = []
    }
    setSettings(settings: EnvelopeSettings) {
        this.settings = { ...settings };
    }
    setDestination(node: SynthNode): void {
        this.destination = node;
    }
    create(): SynthNodeInput {

        const gain = this.audioContext.createGain();
        gain.gain.value = 0;


        const binder = this;

        const currentTime = this.audioContext.currentTime;
        if (this.destination) {

            const destinationInput = this.destination.create();
            gain.connect(destinationInput.endAudioNode);
            gain.gain.value = 0;
            const output = {
                baseAudioNode: gain,
                endAudioNode: destinationInput.endAudioNode,
                connectInput: (input: SynthNodeInput) => {
                    gain.connect(input.baseAudioNode);
                },
                start: () => {
                    destinationInput.start();
                    gain.gain.cancelScheduledValues(currentTime);
                    gain.gain.linearRampToValueAtTime(1, currentTime + this.settings.attack + this.easing);
                    gain.gain.linearRampToValueAtTime(this.settings.sustain, currentTime + this.settings.attack + this.settings.decay + this.easing);
                },
                stop: () => {
                    gain.gain.cancelScheduledValues(currentTime);
                    gain.gain.setTargetAtTime(0, currentTime, this.settings.release + this.easing);
                    setTimeout(() => {
                        destinationInput.stop();
                        gain.disconnect();
                    }, 2000);
                    binder.envelopeGains.splice(binder.envelopeGains.indexOf(output), 1)
                }
            }
            this.envelopeGains.push(output);
            return output;

        } else {
            gain.connect(this.audioContext.destination);
            gain.gain.value = 0;
            const output = {
                baseAudioNode: gain,
                endAudioNode: gain,
                connectInput: (input: SynthNodeInput) => {
                    gain.connect(input.baseAudioNode);
                },
                start: () => {
                    gain.gain.cancelScheduledValues(0);
                    gain.gain.linearRampToValueAtTime(1, currentTime + this.settings.attack + this.easing);
                    gain.gain.linearRampToValueAtTime(this.settings.sustain, currentTime + this.settings.attack + this.settings.decay + this.easing);
                },
                stop: () => {
                    gain.gain.cancelScheduledValues(currentTime);
                    gain.gain.setTargetAtTime(0, currentTime, this.settings.release + this.easing);
                    setTimeout(() => {
                        gain.disconnect();
                    }, 2000);
                    binder.envelopeGains.splice(binder.envelopeGains.indexOf(output), 1)
                }
            }
            this.envelopeGains.push(output);
            return output;
        }
    }

}