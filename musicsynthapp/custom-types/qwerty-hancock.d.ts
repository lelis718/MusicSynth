declare module "qwerty-hancock" {

    type QwertyHancockSettings = {
        id?: string             
        octaves?: number        
        width?: number         
        height?:number         
        margin?: number         
        startNote?: string     
        whiteKeyColour?: string 
        blackKeyColour?: string 
        activeColour?: string  
        borderColour?: string  
        keyboardLayout?: string 
        musicalTyping?: boolean  
    }

    export class QwertyHancock {
        version:number;
        constructor(settings?:QwertyHancockSettings);

        keyDown: (keyPressed:string, keyFrequency:number) => void;
    
        keyUp:  (keyRelease:string) => void;
        setKeyOctave: (octave:string) => string;
    
        getKeyOctave: () => number;
        keyOctaveUp: () => number;
        keyOctaveDown: () => number;
    
        getKeyMap: () => string;
        setKeyMap: (newKeyMap:string) => string;
    }
    
}

