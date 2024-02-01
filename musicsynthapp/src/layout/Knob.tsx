import { useEffect, useRef, useState } from "react";


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


    const [value, setValue] = useState(mapValueIn(props.from ?? 0, props.to ?? 1, props.value ?? 0));
    const [startDrag, setStartDrag] = useState(false);
    const [dragAngle, setDragAngle] = useState(value * 100 * 2.7);

    useEffect(() => {
        if (props.onValueChange) {
            props.onValueChange(mapValueOut(props.from ?? 0, props.to ?? 1, value ?? 0));
        }

    }, [value])

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
        const knobPositionX = rect.left;
        const knobPositionY = rect.top;

        let mouseX, mouseY = 0;
        if (detectMobile() == "desktop") {
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

            const volumeSetting = Math.floor(finalAngleInDegrees / (270 / 100));

            setValue(volumeSetting / 100);
        }
    }


    return <div className="knob-control">
        <div className="knob-surround">
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
            <span className="label">{props.name ?? ""} {Math.floor(value * 100)}%</span>
        </div>
    </div>
}

export default Knob;