import { useEffect, useRef, useState } from "react";
import "./Knob.scss";

export type KnobProps = {
    name?: string,
    from?: number,
    to?: number,
    value?: number,
    onValueChange?: (newValue: number) => void
}

const mapValueIn = (from: number, to: number, value: number) => {
    return (value - from) / (to - from);
}
const mapValueOut = (from: number, to: number, value: number) => {
    const range = (to - from);
    return (value * range) + from;
}

const Knob = (props: KnobProps) => {

    const ticks = 27
    const volumeKnob = useRef<any>(null);

    const [from] = useState(props.from ?? 0)
    const [to] = useState(props.to ?? 0)
    const [value, setValue] = useState(mapValueIn(from, to, props.value ?? 0));
    const [startDrag, setStartDrag] = useState(false);
    const [dragAngle, setDragAngle] = useState(value * 100 * 2.7);

    useEffect(() => {
        if (props.onValueChange) {
            props.onValueChange(mapValueOut(from, to, value));
        }

    }, [from, to, value])

    const detectMobile = () => {
        const result = navigator.userAgent.match("/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i");
        if (result !== null) {
            return "mobile";
        } else {
            return "desktop";
        }
    }


    const onMouseMove = (event: any) => {
        if (!startDrag) return;
        const rect = volumeKnob.current?.getBoundingClientRect();

        const knobPositionX = rect.left + window.scrollX;
        const knobPositionY = rect.top + window.scrollY;

        let mouseX, mouseY = 0;
        if (detectMobile() === "desktop") {
            mouseX = event.pageX;
            mouseY = event.pageY;
        } else {
            mouseX = event.touches[0].pageX;
            mouseY = event.touches[0].pageY;
        }

        const knobCenterX = rect.width / 2 + knobPositionX;
        const knobCenterY = rect.height / 2 + knobPositionY;

        const adjacentSide = knobCenterX - mouseX;
        const oppositeSide = knobCenterY - mouseY;

        const currentRadiansAngle = Math.atan2(adjacentSide, oppositeSide);

        const getRadiansInDegrees = currentRadiansAngle * 180 / Math.PI;

        const finalAngleInDegrees = -(getRadiansInDegrees - 135);


        if (finalAngleInDegrees >= 0 && finalAngleInDegrees <= 270) {
            setDragAngle(finalAngleInDegrees);

            const volumeSetting = finalAngleInDegrees / (270 / 100);

            setValue(volumeSetting / 100);
        }
    }


    return <div className="knob-surround">
        <div>
            {[...Array(ticks)].map((_, index) => {
                const startingAngle = (index * 10) - 130;
                const tickHighlightPosition = Math.round((value * 100 * 2.7) / 10); //interpolate how many ticks need to be highlighted

                return <div key={index} style={{ transform: `rotate(${startingAngle}deg)` }} className={(index < tickHighlightPosition) ? "tick activetick" : "tick"} >
                </div>
            }
            )}
        </div>
        <div id="knob" ref={volumeKnob} style={{ transform: `rotate(${dragAngle}deg)` }} className="knob" onMouseDown={(e) => setStartDrag(true)} onMouseUp={(e) => setStartDrag(false)} onMouseMove={onMouseMove} ></div>
        <span className="min">{props.from ?? "Min"}</span>
        <span className="max">{props.to ?? "Max"}</span>
        <span className="label">{props.name ?? ""} {mapValueOut(from, to, value).toFixed(2)}</span>
    </div>
}

export default Knob;