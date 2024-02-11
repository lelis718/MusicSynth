

export interface SynthNode {
    setDestination(node?: SynthNode): void;
    getSettings():any
    create(): SynthNodeUnit;
}
export interface SynthNodeUnit {

    get baseAudioNode(): AudioNode;
    get endAudioNode(): AudioNode;
    connectInput(input: SynthNodeUnit): void;
    start(): void;
    stop(): void;
}
