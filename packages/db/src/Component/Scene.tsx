import { useState } from "react";

import { Script } from "@atlasacademy/api-connector";

import Api from "../Api";

import "./Scene.css";

const Scene = (props: {
    background?: {
        asset: string;
    };
    figure?: {
        asset: string;
        face: number;
        charaGraphId?: number;
    };
    equip?: {
        asset: string;
        equipAssetId: string;
    };
    offsetsFigure?: {
        charaGraphId?: number;
        y?: number;
    };
    resolution: {
        height: number;
        width: number;
    };
    height: number;
    width: number;
}) => {
    const [script, setScript] = useState<Script.SvtScript | undefined>(undefined);

    let fixOffsets = {
        y: props.offsetsFigure?.charaGraphId === props.figure?.charaGraphId ? props.offsetsFigure?.y : 0,
    };

    let scale = props.width / props.resolution.width,
        backgroundTop = 25 * scale * -1,
        figureWrapperWidth = 1024 * scale,
        figureWrapperLeft = ((props.resolution.width - 1024) / 2 + (script ? script.offsetX : 0)) * scale,
        figureWrapperTop = (script ? -script.offsetY + -(fixOffsets.y ?? 0) : 0) * scale,
        faceElement = null,
        equipElement = null;

    if (props.figure !== undefined && props.figure.charaGraphId !== undefined) {
        Api.svtScript(props.figure.charaGraphId).then((script) => {
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
            page = Math.floor(row / perRow),
            rowInPage = row % perRow,
            backgroundPositionX: number | string = (col * faceSize * -1 - offsetX) * scale,
            backgroundPositionY: number | string = ((page * figureWidth + rowInPage * faceSize) * -1 - offsetY) * scale,
            backgroundSize: number | string = scale * figureWidth,
            left = script.faceX * scale,
            top = script.faceY * scale,
            height = size,
            width = size;

        faceElement = (
            <div
                style={{
                    backgroundImage: `url("${props.figure.asset}")`,
                    backgroundPositionX,
                    backgroundPositionY,
                    backgroundSize,
                    height,
                    left,
                    top,
                    width,
                }}
                className="scene-figure-face"
            />
        );
    }

    if (props.equip) {
        const figureWidth = 250,
            left = 400 * scale,
            maxWidth = figureWidth * scale,
            maxHeight = (1024 * scale) / 2.4,
            top = (props.figure !== undefined ? 250 : 50) * scale,
            height = 1024 * scale,
            width = 1024 * scale,
            backgroundSize: number | string = scale * figureWidth;

        equipElement = (
            <div
                style={{
                    backgroundImage: `url("${props.equip.asset}")`,
                    backgroundSize,
                    maxWidth,
                    maxHeight,
                    height,
                    left,
                    top,
                    width,
                    borderRadius: "0.5rem",
                    zIndex: 20,
                }}
                className="scene-equip"
            />
        );
    }

    return (
        <div className="scene-wrapper" style={{ height: props.height, width: props.width }}>
            {props.background ? (
                <div
                    style={{
                        backgroundImage: `url("${props.background.asset}")`,
                        backgroundPositionY: backgroundTop,
                        backgroundSize: "100%",
                    }}
                    className="scene-background"
                />
            ) : null}
            <div
                className="scene-figure-wrapper"
                style={{ left: figureWrapperLeft, top: figureWrapperTop, width: figureWrapperWidth }}
            >
                {props.figure ? (
                    <div style={{ backgroundImage: `url("${props.figure.asset}")` }} className="scene-figure" />
                ) : null}
                {equipElement}
                {faceElement}
            </div>
        </div>
    );
};

export default Scene;
