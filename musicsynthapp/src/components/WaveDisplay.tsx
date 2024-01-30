import { useEffect, useRef } from "react";

type WaveDisplayProps={
    width: number,
    height: number,
    bufferlength: number,
    getDataArray:()=>Uint8Array
}

export default function WaveDisplay (props:WaveDisplayProps) {

    const canvasRef = useRef<any>(null);
    const requestRef = useRef<any>(null);
    const drawFunction = (frametime:number) => {

        let dataArray = props.getDataArray();

        const canvasObj = canvasRef.current.getContext('2d');

        canvasObj.fillStyle = 'rgb(200, 200, 200)';
        canvasObj.fillRect(0, 0, props.width, props.height);
        canvasObj.lineWidth = 2;
        canvasObj.strokeStyle = 'rgb(0, 0, 0)';

        canvasObj.beginPath();
        var sliceWidth = props.width * 1.0 / props.bufferlength;
        var x = 0;

        for (var i = 0; i < props.bufferlength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * props.height / 2;

            if (i === 0) {
                canvasObj.moveTo(x, y);
            } else {
                canvasObj.lineTo(x, y);
            }

            x += sliceWidth;
        };

        canvasObj.lineTo(canvasObj.width, canvasObj.height / 2);
        canvasObj.stroke();

        requestRef.current = requestAnimationFrame(drawFunction);
    };

    useEffect(() => {
        const canvasObj = canvasRef.current.getContext('2d');
        canvasObj.clearRect(0, 0, props.width, props.height);
        requestRef.current = requestAnimationFrame(drawFunction);
        return () => cancelAnimationFrame(requestRef.current);
    }, [props])

    return <div className="WaveWindow"><canvas ref={canvasRef} width={props.width} height={props.height}></canvas></div>
}