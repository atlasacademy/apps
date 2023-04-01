import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { Button, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Region } from "@atlasacademy/api-connector";

import BgmDescriptor from "../Descriptor/BgmDescriptor";
import QuestDescriptor from "../Descriptor/QuestDescriptor";
import { flatten } from "../Helper/PolyFill";
import useWindowDimensions from "../Hooks/useWindowDimensions";
import ShowScriptLineContext from "../Page/Script/ShowScriptLineContext";
import Manager, { lang } from "../Setting/Manager";
import Scene from "./Scene";
import {
    CameraFilterType,
    ScriptBackground,
    ScriptBracketComponent,
    ScriptCharaFace,
    ScriptCharaFaceFade,
    ScriptCharaFadeIn,
    ScriptCharaFilter,
    ScriptCharaMove,
    ScriptChoiceRouteInfo,
    ScriptChoiceRouteType,
    ScriptComponentType,
    ScriptComponentWrapper,
    ScriptDialogue,
    ScriptInfo,
    ScriptPictureFrame,
} from "./Script";
import ScriptDialogueLine from "./ScriptDialogueLine";

type RowBgmRefMap = Map<string | undefined, React.RefObject<HTMLTableRowElement>>;
type ScriptOffsets = { charaGraphId: number; y?: number };

const DialogueRow = (props: {
    region: Region;
    dialogue: ScriptDialogue;
    refs: RowBgmRefMap;
    lineNumber?: number;
    wideScreen?: boolean;
}) => {
    const showScriptLine = useContext(ShowScriptLineContext);
    return (
        <tr ref={props.refs.get(props.dialogue.voice?.audioAsset ?? props.dialogue.maleVoice?.audioAsset)}>
            <td>
                <ScriptDialogueLine
                    components={props.dialogue.speaker?.components ?? []}
                    wideScreen={props.wideScreen}
                />
            </td>
            <td>
                {props.dialogue.voice && (
                    <BgmDescriptor region={props.region} bgm={props.dialogue.voice} className="d-block" />
                )}
                {props.dialogue.maleVoice && props.dialogue.femaleVoice && (
                    <div>
                        <BgmDescriptor
                            region={props.region}
                            bgm={props.dialogue.maleVoice}
                            className="mr-3"
                            showName="Male"
                        />
                        <BgmDescriptor region={props.region} bgm={props.dialogue.femaleVoice} showName="Female" />
                    </div>
                )}
                <ScriptDialogueLine components={flatten(props.dialogue.components)} wideScreen={props.wideScreen} />
            </td>
            {showScriptLine && <td>{props.lineNumber}</td>}
        </tr>
    );
};

const ChoiceComponentsTable = (props: {
    region: Region;
    choiceComponents: (ScriptBracketComponent | ScriptDialogue)[];
    refs: RowBgmRefMap;
    wideScreen?: boolean;
}) => {
    if (props.choiceComponents.length === 0) return null;
    return (
        <Table hover responsive className="mt-3">
            <tbody>
                {props.choiceComponents.map((c, i) => {
                    switch (c.type) {
                        case ScriptComponentType.DIALOGUE:
                            return (
                                <DialogueRow
                                    key={i}
                                    region={props.region}
                                    dialogue={c}
                                    refs={props.refs}
                                    wideScreen={props.wideScreen}
                                />
                            );
                        default:
                            return (
                                <ScriptBracketRow
                                    key={i}
                                    region={props.region}
                                    component={c}
                                    refs={props.refs}
                                    wideScreen={props.wideScreen}
                                />
                            );
                    }
                })}
            </tbody>
        </Table>
    );
};

const getSceneScale = (windowWidth: number, windowHeight: number, wideScreen: boolean) => {
    if (wideScreen) {
        if (windowWidth < 768) {
            return 4;
        } else if (windowWidth <= 1024) {
            return 2.5;
        }
    }
    if (windowWidth < 768) {
        return 3;
    }
    return 2;
};

export function useImageSize(wideScreen: boolean) {
    const { windowWidth, windowHeight } = useWindowDimensions(),
        sceneScale = getSceneScale(windowWidth, windowHeight, wideScreen),
        height = (wideScreen ? 576 : 576) / sceneScale,
        width = (wideScreen ? 1344 : 1024) / sceneScale;
    return { height, width };
}

type ScriptCharaMovement = ScriptCharaFadeIn | ScriptCharaMove;

const SceneRow = (props: {
    background?: ScriptBackground;
    figure?: ScriptCharaFace | ScriptCharaFaceFade;
    charaFadeIn?: ScriptCharaMovement;
    offsets?: ScriptOffsets;
    wideScreen: boolean;
    lineNumber?: number;
    foreground?: { frame?: ScriptPictureFrame };
    cameraFilter: CameraFilterType;
    effects?: string[];
    filters: { content: ScriptCharaFilter; lineNumber?: number }[];
}) => {
    const { lineNumber, cameraFilter, effects, wideScreen } = props,
        { t } = useTranslation(),
        resolution = wideScreen ? { height: 576, width: 1344 } : { height: 576, width: 1024 },
        { height, width } = useImageSize(wideScreen),
        background = props.background ? { asset: props.background.backgroundAsset } : undefined;

    const showScriptLine = useContext(ShowScriptLineContext);

    let figure = undefined;
    let equip = undefined;
    let offsets = undefined;
    let foreground = undefined;

    let isSilhouette = (figure: ScriptCharaFace | ScriptCharaFaceFade) => {
        const applicableFilters = props.filters.filter(
            (f) =>
                lineNumber !== undefined &&
                f.lineNumber !== undefined &&
                f.lineNumber < lineNumber &&
                f.content.speakerCode === figure.speakerCode
        );
        if (
            applicableFilters.length > 0 &&
            applicableFilters[applicableFilters.length - 1].content.filter === "silhouette"
        ) {
            return true;
        }

        return false;
    };

    if (props.figure !== undefined && props.figure.assetSet !== undefined) {
        switch (props.figure.assetSet.type) {
            case ScriptComponentType.CHARA_SET:
            case ScriptComponentType.CHARA_CHANGE:
                figure = {
                    asset: props.figure.assetSet.charaGraphAsset,
                    face: props.figure.face,
                    charaGraphId: props.figure.assetSet.charaGraphId,
                    silhouette: isSilhouette(props.figure),
                };

                offsets = {
                    y: props.offsets?.y ?? 0,
                    charaGraphId: props.offsets?.charaGraphId ?? 0,
                };
                break;
            case ScriptComponentType.IMAGE_SET:
                figure = {
                    asset: props.figure.assetSet.imageAsset,
                    face: props.figure.face,
                };
                break;
            case ScriptComponentType.EQUIP_SET:
                equip = {
                    asset: props.figure.assetSet.equipAsset,
                    equipAssetId: props.figure.assetSet.equipId,
                };
        }
    }

    if (props.charaFadeIn !== undefined) {
        switch (props.charaFadeIn.assetSet?.type) {
            case ScriptComponentType.SCENE_SET:
                break;
            case ScriptComponentType.IMAGE_SET:
            case ScriptComponentType.VERTICAL_IMAGE_SET:
                figure = {
                    asset: props.charaFadeIn.assetSet.imageAsset,
                    face: 0,
                };
                break;
            case ScriptComponentType.EQUIP_SET:
                equip = {
                    asset: props.charaFadeIn.assetSet.equipAsset,
                    equipAssetId: props.charaFadeIn.assetSet.equipId,
                };
                break;
        }

        return (
            <tr>
                <td />
                <td>
                    <Scene
                        background={
                            props.charaFadeIn.assetSet?.type === ScriptComponentType.SCENE_SET
                                ? { asset: props.charaFadeIn.assetSet.backgroundAsset }
                                : undefined
                        }
                        offsetsFigure={offsets}
                        equip={equip}
                        figure={figure}
                        resolution={resolution}
                        height={height}
                        width={width}
                        cameraFilter={cameraFilter}
                        effects={effects}
                    />
                    <div>
                        {props.charaFadeIn.assetSet?.type === ScriptComponentType.SCENE_SET ? (
                            <a href={props.charaFadeIn.assetSet.backgroundAsset} target="_blank" rel="noreferrer">
                                [{t("Background")}]
                            </a>
                        ) : null}
                        {figure !== undefined ? (
                            <a href={figure.asset} target="_blank" rel="noreferrer">
                                [{t("Figure")}]
                            </a>
                        ) : null}{" "}
                        {equip !== undefined ? (
                            <a
                                href={`/db/${Manager.region()}/craft-essence/${equip.equipAssetId}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                [{t("Craft Essence")}]
                            </a>
                        ) : null}
                    </div>
                </td>
                {showScriptLine && <td>{props.lineNumber}</td>}
            </tr>
        );
    }

    if (props.foreground !== undefined && props.foreground.frame !== undefined) {
        const frameProps = props.foreground.frame;

        if (frameProps.imageAsset !== undefined) {
            foreground = {
                frame: frameProps.imageAsset,
            };
        }
    }

    return (
        <tr>
            <td />
            <td>
                <Scene
                    background={background}
                    foreground={foreground}
                    offsetsFigure={offsets}
                    equip={equip}
                    figure={figure}
                    resolution={resolution}
                    height={height}
                    width={width}
                    cameraFilter={cameraFilter}
                    effects={effects}
                />
                <div>
                    {props.background ? (
                        <a href={props.background.backgroundAsset} target="_blank" rel="noreferrer">
                            [{t("Background")}]
                        </a>
                    ) : null}
                    &nbsp;
                    {props.figure &&
                    (props.figure.assetSet?.type === ScriptComponentType.CHARA_SET ||
                        props.figure.assetSet?.type === ScriptComponentType.CHARA_CHANGE) ? (
                        <a href={props.figure.assetSet?.charaGraphAsset} target="_blank" rel="noreferrer">
                            {isSilhouette(props.figure) ? `[${t("Figure")} (${t("Spoiler")})]` : `[${t("Figure")}]`}
                        </a>
                    ) : null}
                    &nbsp;
                    {props.figure && props.figure.assetSet?.type === ScriptComponentType.EQUIP_SET ? (
                        <a
                            href={`/db/${Manager.region()}/craft-essence/${props.figure.assetSet.equipId}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            [{t("Craft Essence")}]
                        </a>
                    ) : null}
                </div>
            </td>
            {showScriptLine && <td>{props.lineNumber}</td>}
        </tr>
    );
};

const getVideoWidth = (windowWidth: number, wideScreen?: boolean) => {
    if (wideScreen) {
        if (windowWidth >= 1024) {
            return 1344 / 2;
        } else if (windowWidth >= 768) {
            return 1344 / 2.5;
        } else {
            return 1344 / 4;
        }
    } else {
        if (windowWidth >= 768) {
            return 1024 / 2;
        } else {
            return 1024 / 3;
        }
    }
};

const ScriptBracketRow = (props: {
    region: Region;
    component: ScriptBracketComponent;
    refs: RowBgmRefMap;
    lineNumber?: number;
    wideScreen?: boolean;
}) => {
    const { region, component, refs, lineNumber, wideScreen } = props,
        { windowWidth } = useWindowDimensions(),
        showScriptLine = useContext(ShowScriptLineContext),
        { t } = useTranslation();

    const getGoToLabel = (labelName: string) => {
        return (
            <Button
                variant="link"
                onClick={() => {
                    const rowRef = refs.get(labelName);
                    if (rowRef !== undefined && rowRef.current !== null) {
                        rowRef.current.scrollIntoView({
                            behavior: "smooth",
                        });
                    }
                }}
            >
                <FontAwesomeIcon icon={faShare} title={`Go to label ${labelName}`} />
            </Button>
        );
    };

    switch (component.type) {
        case ScriptComponentType.BGM:
            return (
                <tr ref={refs.get(component.bgm.audioAsset)}>
                    <td>{t("BGM")}</td>
                    <td>
                        <BgmDescriptor region={region} bgm={component.bgm} />
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.CRI_MOVIE:
            return (
                <tr>
                    <td>{t("Movie")}</td>
                    <td>
                        <video controls preload="none" width={getVideoWidth(windowWidth, wideScreen)}>
                            <source src={component.movieUrl} type="video/mp4" />
                        </video>
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.SOUND_EFFECT:
            return (
                <tr ref={refs.get(component.soundEffect.audioAsset)}>
                    <td>{t("Sound Effect")}</td>
                    <td>
                        <BgmDescriptor region={region} bgm={component.soundEffect} />
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.CUE_SOUND_EFFECT:
            return (
                <tr ref={refs.get(component.soundEffect.audioAsset)}>
                    <td>{t("Sound Effect")}</td>
                    <td>
                        <BgmDescriptor region={region} bgm={component.soundEffect} />
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.FLAG:
            return (
                <tr>
                    <td>{t("Flag")}</td>
                    <td>
                        Set flag <code>{component.name}</code> to <code>{component.value}</code>
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.BRANCH:
            const condition =
                component.flag === undefined ? null : (
                    <>
                        {" "}
                        if <code>{component.flag.name}</code> is <code>{component.flag.value}</code>
                    </>
                );
            return (
                <tr>
                    <td>{t("Branch")}</td>
                    <td>
                        Go to label <code>{component.labelName}</code>
                        {condition} {getGoToLabel(component.labelName)}
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.BRANCH_QUEST_NOT_CLEAR:
            return (
                <tr>
                    <td>{t("Branch")}</td>
                    <td>
                        Go to label <code>{component.labelName}</code> if quest{" "}
                        <QuestDescriptor region={region} questId={component.questId} /> hasn't been cleared{" "}
                        {getGoToLabel(component.labelName)}
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.BRANCH_MASTER_GENDER:
            return (
                <tr>
                    <td>{t("Branch")}</td>
                    <td>
                        Go to label <code>{component.maleLabelName}</code> {getGoToLabel(component.maleLabelName)} if
                        chosen gender is male or <code>{component.femaleLabelName}</code>{" "}
                        {getGoToLabel(component.femaleLabelName)} if female
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.LABEL:
            return (
                <tr ref={refs.get(component.name)}>
                    <td>{t("Label")}</td>
                    <td>
                        <code>{component.name}</code>
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        default:
            return null;
    }
};

const ChoiceRouteInfo = ({ routeInfo }: { routeInfo?: ScriptChoiceRouteInfo }) => {
    switch (routeInfo?.routeType) {
        case ScriptChoiceRouteType.TRUE:
            return <>True Route: </>;
        case ScriptChoiceRouteType.BAD:
            return <>Bad Route: </>;
    }
    return null;
};

const ScriptRow = (props: {
    region: Region;
    wrapper: ScriptComponentWrapper;
    refs: RowBgmRefMap;
    wideScreen?: boolean;
}) => {
    const { region, wrapper, refs, wideScreen } = props;
    const { content: component, lineNumber } = wrapper;
    const showScriptLine = useContext(ShowScriptLineContext);
    const { t } = useTranslation();

    switch (component.type) {
        case ScriptComponentType.DIALOGUE:
            return (
                <DialogueRow
                    region={region}
                    dialogue={component}
                    refs={refs}
                    lineNumber={lineNumber}
                    wideScreen={wideScreen}
                />
            );
        case ScriptComponentType.CHOICES:
            return (
                <tr>
                    <td>{t("Choices")}</td>
                    <td>
                        <ul className="mb-0">
                            {component.choices.map((choice) => (
                                <li key={choice.id}>
                                    <ChoiceRouteInfo routeInfo={choice.routeInfo} />
                                    <ScriptDialogueLine components={choice.option} />
                                    <ChoiceComponentsTable
                                        region={region}
                                        choiceComponents={choice.results}
                                        refs={refs}
                                        wideScreen={wideScreen}
                                    />
                                </li>
                            ))}
                        </ul>
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        default:
            return (
                <ScriptBracketRow
                    region={region}
                    component={component}
                    refs={refs}
                    lineNumber={lineNumber}
                    wideScreen={wideScreen}
                />
            );
    }
};

const ScriptTable = (props: { region: Region; script: ScriptInfo; showScene?: boolean; refs: RowBgmRefMap }) => {
    const scriptComponents = props.script.components,
        { t } = useTranslation();

    let backgroundComponent: ScriptBackground | undefined,
        figureComponent: ScriptCharaFace | ScriptCharaFaceFade | undefined,
        charaFadeIn: ScriptCharaMovement | undefined,
        wideScreen = false,
        sceneDisplayed = false,
        offsets: ScriptOffsets | undefined,
        cameraFilter: CameraFilterType = "normal",
        foreground: { frame: ScriptPictureFrame | undefined } | undefined,
        effects: string[] = [],
        dummyEffects: Map<string, string> = new Map(),
        appearedSpeakers: Set<string> = new Set();

    const showScriptLine = useContext(ShowScriptLineContext),
        filters: { content: ScriptCharaFilter; lineNumber?: number }[] = [],
        figureAssetTypes = [ScriptComponentType.CHARA_SET, ScriptComponentType.CHARA_CHANGE];

    for (const component of scriptComponents) {
        const { content, lineNumber } = component;
        if (content.type === ScriptComponentType.CHARA_FILTER) {
            filters.push({ content, lineNumber });
        }
    }

    return (
        <Table hover responsive>
            <thead>
                <tr>
                    <th className="text-center" style={{ width: "10%" }}>
                        {t("Speaker")}
                    </th>
                    <th className="text-center">{t("Text")}</th>
                    {showScriptLine && <th className="text-center">{t("Line")}</th>}
                </tr>
            </thead>
            <tbody lang={lang(props.region)}>
                {scriptComponents.map((component, i) => {
                    const { content, lineNumber } = component;

                    let sceneRow,
                        renderScene = () => (
                            <SceneRow
                                filters={filters}
                                foreground={foreground}
                                cameraFilter={cameraFilter}
                                offsets={offsets}
                                background={backgroundComponent}
                                figure={figureComponent}
                                charaFadeIn={charaFadeIn}
                                wideScreen={wideScreen}
                                lineNumber={lineNumber}
                                effects={[...effects]}
                            />
                        );

                    switch (content.type) {
                        case ScriptComponentType.ENABLE_FULL_SCREEN:
                            wideScreen = true;
                            break;

                        case ScriptComponentType.BACKGROUND:
                            if (backgroundComponent && !sceneDisplayed) sceneRow = renderScene();

                            backgroundComponent = content;
                            figureComponent = undefined;
                            sceneDisplayed = false;
                            break;

                        case ScriptComponentType.CHARA_FACE:
                            appearedSpeakers.add(content.speakerCode);
                            if (figureComponent && !sceneDisplayed) sceneRow = renderScene();

                            figureComponent = content;
                            sceneDisplayed = false;
                            break;

                        case ScriptComponentType.CHARA_FACE_FADE:
                            appearedSpeakers.add(content.speakerCode);
                            if (figureComponent && !sceneDisplayed) sceneRow = renderScene();

                            figureComponent = content;
                            sceneDisplayed = false;
                            break;

                        case ScriptComponentType.CHARA_FADE_IN:
                        case ScriptComponentType.CHARA_MOVE:
                            const { assetSet } = content;
                            appearedSpeakers.add(content.speakerCode);

                            if (assetSet && !figureAssetTypes.includes(assetSet.type)) {
                                charaFadeIn = content;
                                sceneRow = renderScene();
                                charaFadeIn = undefined;
                            }

                            if (content.position && (content.position.y !== 0 || offsets?.y !== content.position.y)) {
                                switch (assetSet?.type) {
                                    case ScriptComponentType.CHARA_SET:
                                    case ScriptComponentType.CHARA_CHANGE:
                                        if (
                                            assetSet.charaGraphId.toString().startsWith("98") ||
                                            content.position.y <= 0
                                        ) {
                                            offsets = {
                                                charaGraphId: assetSet.charaGraphId,
                                                y: content.position.y,
                                            };
                                        }
                                }
                            }
                            break;
                        case ScriptComponentType.CHARA_FADE_OUT:
                            if (backgroundComponent && !sceneDisplayed) {
                                sceneRow = renderScene();
                                sceneDisplayed = true;
                            }
                            break;
                        case ScriptComponentType.CHARA_PUT:
                            const dummyCharaEffect = dummyEffects.get(content.speakerCode);
                            if (dummyCharaEffect !== undefined) {
                                effects.push(dummyCharaEffect);
                            }
                            break;
                        case ScriptComponentType.CHARA_PUT_FSR:
                            if (content.position.x > 1000 && content.position.y > 1000) {
                                // Script 9405420810
                                const dummyCharaEffectFSR = dummyEffects.get(content.speakerCode);
                                if (dummyCharaEffectFSR !== undefined) {
                                    effects = effects.filter((effect) => effect !== dummyCharaEffectFSR);
                                }
                            }
                            break;
                        case ScriptComponentType.CAMERA_FILTER:
                            cameraFilter = content.filter;
                            break;
                        case ScriptComponentType.EFFECT:
                            effects.push(content.effect);
                            break;
                        case ScriptComponentType.CHARA_EFFECT:
                            if (appearedSpeakers.has(content.speakerCode)) {
                                effects.push(content.effect);
                            } else {
                                dummyEffects.set(content.speakerCode, content.effect);
                            }
                            break;
                        case ScriptComponentType.EFFECT_STOP:
                        case ScriptComponentType.EFFECT_DESTROY:
                        case ScriptComponentType.CHARA_EFFECT_STOP:
                            if (content.effect === undefined) {
                                effects = [];
                            } else {
                                effects = effects.filter((effect) => effect !== content.effect);
                            }
                            break;
                        case ScriptComponentType.PICTURE_FRAME:
                            foreground = {
                                frame: content,
                            };
                            break;
                        case ScriptComponentType.BRANCH:
                        case ScriptComponentType.LABEL:
                        case ScriptComponentType.BRANCH_QUEST_NOT_CLEAR:
                            if (backgroundComponent && !sceneDisplayed) {
                                sceneRow = renderScene();
                                sceneDisplayed = true;
                            }
                            foreground = undefined;
                            break;
                        case ScriptComponentType.CHOICES:
                            flatten(content.choices.map((choice) => choice.results)).forEach((childChoice) => {
                                if (childChoice.type === ScriptComponentType.BACKGROUND) {
                                    backgroundComponent = childChoice;
                                }
                            });
                            break;
                    }

                    if (!sceneDisplayed) {
                        switch (content.type) {
                            case ScriptComponentType.DIALOGUE:
                            case ScriptComponentType.CHOICES:
                                sceneRow = renderScene();
                                sceneDisplayed = true;
                        }
                    }

                    return (
                        <React.Fragment key={i}>
                            {props.showScene === false ? null : sceneRow}
                            <ScriptRow
                                region={props.region}
                                wrapper={component}
                                refs={props.refs}
                                wideScreen={wideScreen}
                            />
                        </React.Fragment>
                    );
                })}

                {props.showScene !== false &&
                (figureComponent !== undefined || backgroundComponent !== undefined || charaFadeIn !== undefined) &&
                !sceneDisplayed ? (
                    <SceneRow
                        foreground={foreground}
                        filters={filters}
                        cameraFilter={cameraFilter}
                        offsets={offsets}
                        background={backgroundComponent}
                        figure={figureComponent}
                        wideScreen={wideScreen}
                        effects={[...effects]}
                    />
                ) : null}
            </tbody>
        </Table>
    );
};

export default ScriptTable;
