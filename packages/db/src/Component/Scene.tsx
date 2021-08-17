import './Scene.css';
import {useState} from "react";
import {Script} from "../../../api-connector";
import Api from "../Api";

const Scene = (props: {
    background?: {
        asset: string,
    },
    figure?: {
        asset: string,
        face: number,
        charaGraphId: string,
    },
    resolution: {
        height: number,
        width: number,
    },
    height: number,
    width: number,
}) => {
    const [script, setScript] = useState<Script.SvtScript | undefined>(undefined);

    let scale = props.width / props.resolution.width,
        backgroundTop = 25 * scale * (-1),
        figureWrapperWidth = 1024 * scale,
        figureWrapperLeft = (
            ((props.resolution.width - 1024) / 2)
            + (script ? script.offsetX : 0)
        ) * scale,
        figureWrapperTop = backgroundTop + (script ? script.offsetX : 0) * scale,
        faceElement = null;

    if (props.figure) {
        Api.svtScript(parseInt(props.figure.charaGraphId)).then(script => {
            setScript(script[0]);
        });
    }

    if (props.figure && props.figure.face > 0 && script) {
        let face = props.figure.face - 1,
            faceSize = script.extendData.faceSize ?? 256,
            figureWidth = 1024,
            size = faceSize * scale,
            offsetX = 0,
            offsetY = faceSize === 256 ? 768 : 1024,
            perRow = Math.floor(figureWidth / faceSize),
            col = face % perRow,
            row = Math.floor(face / perRow),
            backgroundPositionX: number | string = ((col * faceSize * (-1)) - offsetX) * scale,
            backgroundPositionY: number | string = ((row * faceSize * (-1)) - offsetY) * scale,
            backgroundSize: number | string = scale * figureWidth,
            left = script.faceX * scale,
            top = script.faceY * scale,
            height = size,
            width = size;

        faceElement = <div style={{
            backgroundImage: `url("${props.figure.asset}")`,
            backgroundPositionX,
            backgroundPositionY,
            backgroundSize,
            height,
            left,
            top,
            width,
        }} className='scene-figure-face'/>
    }

    return <div className='scene-wrapper' style={{height: props.height, width: props.width}}>
        {props.background ? (
            <div style={{
                backgroundImage: `url("${props.background.asset}")`,
                backgroundPositionY: backgroundTop,
                backgroundSize: '100%',
            }} className='scene-background'/>
        ) : null}
        <div className='scene-figure-wrapper'
             style={{left: figureWrapperLeft, top: figureWrapperTop, width: figureWrapperWidth}}>
            {props.figure ? (
                <div style={{backgroundImage: `url("${props.figure.asset}")`}}
                     className='scene-figure'/>
            ) : null}
            {faceElement}
        </div>
    </div>;
}

export default Scene;
