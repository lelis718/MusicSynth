import { SynthNode, SynthNodeUnit } from "./SynthBase";


export type EnvelopeSettings = {
    attack: number;
    sustain: number;
    decay: number;
    release: number;
};
export class SynthEnvelope implements SynthNode {

    private settings: EnvelopeSettings;
    private audioContext: AudioContext;
    private destination?: SynthNode;
    private envelopeGains: SynthNodeUnit[];

    constructor(audioContext: AudioContext, settings: EnvelopeSettings) {
        this.settings = settings;
        this.audioContext = audioContext;
        this.envelopeGains = [];
    }
    setSettings(settings: EnvelopeSettings) {
        this.settings = { ...settings };
    }
    getSettings(){
        return this.settings;
    }    
    setDestination(node: SynthNode): void {
        this.destination = node;
    }
    create(): SynthNodeUnit {
        
        const binder = this;
        const envelopeUnit = new SynthEnvelopeUnit(this.audioContext, this.settings, ()=>{
            binder.envelopeGains.splice(binder.envelopeGains.indexOf(envelopeUnit), 1);            
        });
        if(this.destination){
            const destinationUnit = this.destination.create();
            envelopeUnit.connectInput(destinationUnit);
        }
        this.envelopeGains.push(envelopeUnit);
        return envelopeUnit;        
    }

}
export class SynthEnvelopeUnit implements SynthNodeUnit{

    private gain: GainNode;
    private destination?:SynthNodeUnit;
    private audioContext:AudioContext;
    private settings:EnvelopeSettings;
    private easing:number = 0.005;
    private onDispose:()=>void;

    constructor(audioContext:AudioContext, settings:EnvelopeSettings, onDispose:()=>void){
        this.settings = settings;
        this.audioContext = audioContext;
        this.gain = this.audioContext.createGain();
        this.gain.connect(this.audioContext.destination);
        this.gain.gain.value = 0;
        this.onDispose = onDispose;
    }
    get baseAudioNode(): AudioNode {
        return this.gain;
    }
    get endAudioNode(): AudioNode {
        return this.gain;
    }

    connectInput(input: SynthNodeUnit): void {
        console.log("Connectiing " + typeof input);

        this.destination = input;
        this.gain.connect(input.baseAudioNode);
    }
    start(): void {
        console.log("Starting Envelope ", this.settings);
        this.destination?.start();
        const currentTime = this.audioContext.currentTime;
        this.gain.gain.cancelScheduledValues(currentTime);
        this.gain.gain.setValueAtTime(0, currentTime);
        this.gain.gain.linearRampToValueAtTime(1, currentTime + this.settings.attack + this.easing);
        this.gain.gain.linearRampToValueAtTime(this.settings.sustain, currentTime + this.settings.attack + this.settings.decay + this.easing);        
    }
    stop(): void {
        console.log("Stopping envelope ", this.settings);
        const currentTime = this.audioContext.currentTime;
        this.gain.gain.cancelScheduledValues(currentTime);
        this.gain.gain.setTargetAtTime(0, currentTime, this.settings.release + this.easing);

        setTimeout(() => {
            this.destination?.stop();
            this.dispose();
        }, 2000);
    }
    private dispose(){
        this.gain.disconnect();
        this.destination = undefined;
        this.onDispose();
    }
}

