import { SynthNode, SynthNodeUnit } from "./SynthBase";
import { SynthEnvelopeUnit } from "./SynthEnvelope";


export type OscillatorSettings = {
    frequency: number;
    detune: number;
    type: OscillatorType;
    gain: number;
};

export class SynthOscillator implements SynthNode {

    private audioContext: AudioContext;
    private settings: OscillatorSettings;
    private destination?: SynthNode;
    private oscillators: SynthOscillatorUnit[];

    constructor(audioContext: AudioContext, settings: OscillatorSettings) {
        this.audioContext = audioContext;
        this.settings = settings;
        this.oscillators = [];
    }

    setSettings(settings: OscillatorSettings) {
        this.settings = { ...settings };
        this.oscillators.forEach(item => {
            item.setSettings(this.settings);
        });
    }
    getSettings() {
        return this.settings;
    }
    setDestination(node: SynthNode): void {
        this.destination = node;
    }

    create(): SynthNodeUnit {

        const binder = this;
        const synthUnit = new SynthOscillatorUnit(this.audioContext, this.settings, ()=>{
            binder.oscillators.splice(binder.oscillators.indexOf(synthUnit), 1);
        });
        if(this.destination){
            synthUnit.connectInput(this.destination.create());
        }
        this.oscillators.push(synthUnit);
        return synthUnit;
    }

}

class SynthOscillatorUnit implements SynthNodeUnit {

    private audioContext:AudioContext;

    private settings:OscillatorSettings;
    
    private onDispose:()=>void;

    private oscillator:OscillatorNode;
    private gain:GainNode;
    
    private destination?:SynthNodeUnit;
    
    constructor(audioContext:AudioContext, settings:OscillatorSettings, onDispose:()=>void){
        console.log("Creating internal oscillator ");
        this.audioContext = audioContext;
        this.settings = settings;
        this.onDispose = onDispose;
        this.oscillator = this.audioContext.createOscillator();
        
        this.gain = this.audioContext.createGain();
        this.gain.connect(this.audioContext.destination);
        this.oscillator.connect(this.gain);
        this.setSettings(settings);
    }

    setSettings(settings:OscillatorSettings){
        this.settings = settings;
        this.oscillator.frequency.value = this.settings.frequency;
        this.oscillator.detune.value = this.settings.detune;
        this.oscillator.type = this.settings.type;
        this.gain.gain.value = this.settings.gain;
    }


    get baseAudioNode(): AudioNode {
        return this.oscillator;
    }
    get endAudioNode(): AudioNode {
        return this.gain;
    }
    connectInput(input: SynthNodeUnit): void {
        console.log("Connectiing " + input.baseAudioNode, (input.baseAudioNode as GainNode).gain.value );
        this.destination = input;
        this.gain.disconnect();
        this.gain.connect(this.destination.baseAudioNode);
    }
    start(): void {
        this.oscillator.start();
        this.destination?.start();
    }
    stop(): void {
        if(this.destination && this.destination instanceof SynthEnvelopeUnit){
            this.destination.stop();
            const binder = this;
            setTimeout(() => {
                console.log("Stopping Oscillator");
                binder.oscillator.stop();
                binder.oscillator.disconnect();
                binder.gain.disconnect();
                binder.destination=undefined;
                binder.onDispose();
            }, 2000);
        } else {
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.gain.disconnect();
            this.destination=undefined;
            this.onDispose();
        }
    }

}