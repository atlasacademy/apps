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
    let scale = props.width / props.resolution.width,
        figureScale = props.resolution.height / 768,
        figureWidth = 1024 * figureScale,
        figureMargin = (props.resolution.width - figureWidth) * scale / 2,
        [script, setScript] = useState<Script.SvtScript | undefined>(undefined),
        faceElement = null,
        figureWrapperLeft = figureMargin + (script ? (script.offsetX * figureScale * scale) : 0),
        figureWrapperRight = figureMargin + (script ? (script.offsetX * figureScale * scale) : 0),
        figureWrapperTop = script ? (script.offsetY * figureScale * scale) : 0;

    if (props.figure) {
        Api.svtScript(parseInt(props.figure.charaGraphId)).then(script => {
            setScript(script[0]);
        });
    }

    if (props.figure && props.figure.face > 0 && script) {
        let face = props.figure.face - 1,
            faceSize = script.extendData.faceSize ?? 256,
            figureWidth = 1024,
            size = faceSize * figureScale * scale,
            offsetX = 0,
            offsetY = faceSize === 256 ? 768 : 1024,
            perRow = Math.floor(figureWidth / faceSize),
            col = face % perRow,
            row = Math.floor(face / perRow),
            faceScale = (size / faceSize),
            backgroundPositionX: number | string = ((col * faceSize * (-1)) - offsetX) * faceScale,
            backgroundPositionY: number | string = ((row * faceSize * (-1)) - offsetY) * faceScale,
            backgroundSize: number | string = faceScale * figureWidth,
            left = script.faceX * faceScale,
            top = script.faceY * faceScale,
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
            <img src={props.background.asset} alt='' className='scene-background'/>
        ) : null}
        <div className='scene-figure-wrapper' style={{left: figureWrapperLeft, right: figureWrapperRight, top: figureWrapperTop}}>
            {props.figure ? (
                <div style={{backgroundImage: `url("${props.figure.asset}")`}}
                     className='scene-figure'/>
            ) : null}
            {faceElement}
        </div>
    </div>;
}

export default Scene;
