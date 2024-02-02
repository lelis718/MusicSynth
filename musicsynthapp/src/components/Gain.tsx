import { useContext, useEffect, useId, useReducer, useState } from "react";
import React from "react";
import { AppContext } from "../App";
import Slider from "../layout/Slider";


type GainProps = {
    id: string,
    name?: string,
    value?: number,
    destination?: string,
}

export const Gain = (props: GainProps) => {

    const { actx, audioNodes } = useContext(AppContext);
    const [value, setValue] = useState(props.value ?? 0.5);
    const [destination] = useState(props.destination);
    const [gainNode, setGainNode] = useState<GainNode>();
    const { id } = props;

    useEffect(() => {
        if (gainNode) {
            gainNode.gain.value = value;
            if (destination) {
                gainNode.connect(audioNodes.get(destination) ?? actx.destination);
            } else {
                gainNode.connect(actx.destination);
            }
        }
    }, [value, gainNode, destination])

    useEffect(() => {
        const gain = actx.createGain();
        gain.gain.value = value;
        if (destination) {
            gain.connect(audioNodes.get(destination) ?? actx.destination);
        } else {
            gain.connect(actx.destination);
        }
        setGainNode(gain);
        audioNodes.set(id, gain);
    }, [])

    return <div className="control">
        <h3>{"Gain" + props.name ?? id}</h3>
        <Slider
            name="value"
            value={value}
            maxValue={10}
            step={0.01}
            onChange={(value) => setValue(value)}
        ></Slider>
    </div>
}