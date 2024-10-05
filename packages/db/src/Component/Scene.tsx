import { useEffect, useState } from "react";

import { Region, Script } from "@atlasacademy/api-connector";

import Api, { AssetHost } from "../Api";
import { getImageSize } from "../Helper/getImageSize";
import { CameraFilterType } from "./Script";

import "./Scene.css";

const getFilter = ({
    silhoeutte,
    cameraFilter,
    effects,
}: {
    silhoeutte?: boolean;
    cameraFilter?: CameraFilterType;
    effects?: string[];
}): string => {
    const filters: string[] = [];

    if (silhoeutte) {
        filters.push("brightness(0)");
    }
    if (cameraFilter === "gray") {
        filters.push("grayscale(1)");
    }

    if (filters.length === 0) {
        return "none";
    } else {
        return filters.join(" ");
    }
};

const Scene = (props: {
    region: Region;
    background?: {
        asset: string;
    };
    foreground?: {
        frame: string;
    };
    figure?: {
        asset: string;
        face: number;
        charaGraphId?: number;
        silhouette?: boolean;
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
    cameraFilter?: CameraFilterType;
    effects?: string[];
}) => {
    const [script, setScript] = useState<Script.SvtScript | undefined>(undefined),
        [figureWidth, setFigureWidth] = useState(1024),
        [figureHeight, setFigureHeight] = useState(1024),
        { cameraFilter, effects, region } = props,
        charaGraphId = props.figure?.charaGraphId;

    useEffect(() => {
        const controller = new AbortController();
        if (charaGraphId !== undefined) {
            Promise.all([
                Api.svtScript(charaGraphId),
                getImageSize(`${AssetHost}/${region}/CharaFigure/${charaGraphId}/${charaGraphId}.png`),
            ]).then(([scriptInfo, size]) => {
                if (controller.signal.aborted) return;
                setScript(scriptInfo[0]);
                if (size.width !== -1) {
                    setFigureWidth(size.width);
                    setFigureHeight(size.height);
                }
            });
            Api.svtScript(charaGraphId).then((script) => {
                if (controller.signal.aborted) return;
                setScript(script[0]);
            });
        }
        return () => {
            controller.abort();
        };
    }, [region, charaGraphId]);

    let fixOffsets = {
        y: props.offsetsFigure?.charaGraphId === charaGraphId ? props.offsetsFigure?.y : 0,
    };

    let scale = props.width / props.resolution.width,
        backgroundHeight = 626,
        backgroundTop = ((backgroundHeight - props.resolution.height) / 2) * scale * -1,
        figureWrapperWidth = props.resolution.width * scale,
        figureWrapperLeft = (script ? script.offsetX : 0) * scale,
        figureWrapperTop = (script ? -script.offsetY + -(fixOffsets.y ?? 0) : 0) * scale,
        figureLeft = ((props.resolution.width - figureWidth) / 2 + (script ? script.offsetX : 0)) * scale,
        faceElement = null,
        equipElement = null;

    if (props.figure && props.figure.face > 0 && script) {
        let face = props.figure.face - 1,
            defaultFaceSize = 256,
            defaultFigureHeight = 1024,
            facePortionPageWidth = 1024,
            facePortionPageHeight = 1024,
            faceSizeWidth = script.extendData.faceSizeRect
                ? script.extendData.faceSizeRect[0]
                : (script.extendData.faceSize ?? defaultFaceSize),
            faceSizeHeight = script.extendData.faceSizeRect
                ? script.extendData.faceSizeRect[1]
                : (script.extendData.faceSize ?? defaultFaceSize),
            perRow = Math.floor(facePortionPageWidth / faceSizeWidth),
            col = face % perRow,
            row = Math.floor(face / perRow),
            page = Math.floor(row / perRow),
            rowInPage = row % perRow,
            offsetX = col * faceSizeWidth,
            offsetY =
                faceSizeHeight === defaultFaceSize && figureHeight === defaultFigureHeight
                    ? defaultFigureHeight - defaultFaceSize + defaultFaceSize * row
                    : figureHeight + facePortionPageHeight * page + rowInPage * faceSizeHeight,
            backgroundPositionX: number | string = offsetX * -1 * scale,
            backgroundPositionY: number | string = offsetY * -1 * scale,
            backgroundSize: number | string = scale * figureWidth,
            left = script.faceX * scale + figureLeft,
            top = script.faceY * scale,
            height = faceSizeHeight * scale,
            width = faceSizeWidth * scale;

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
                    filter: getFilter({ silhoeutte: props.figure.silhouette, cameraFilter, effects }),
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
                        filter: getFilter({ cameraFilter, effects }),
                    }}
                    className="scene-background"
                />
            ) : null}
            <div
                className="scene-figure-wrapper"
                style={{ left: figureWrapperLeft, top: figureWrapperTop, width: figureWrapperWidth }}
            >
                {props.figure ? (
                    <div
                        style={{
                            backgroundImage: `url("${props.figure.asset}")`,
                            filter: getFilter({ silhoeutte: props.figure.silhouette, cameraFilter, effects }),
                            backgroundSize: scale * figureWidth,
                            left: figureLeft,
                        }}
                        className="scene-figure"
                    />
                ) : null}
                {equipElement}
                {faceElement}
            </div>
            {props.foreground && props.foreground.frame && (
                <div
                    style={{
                        backgroundImage: `url("${props.foreground.frame}")`,
                    }}
                    className="scene-foreground frame"
                />
            )}
            {effects !== undefined &&
            ["bit_sepia01", "bit_sepia01_depth"].some((sepia_effect) => effects.includes(sepia_effect)) ? (
                <div className="sepia-bg"></div>
            ) : null}
        </div>
    );
};

export default Scene;
