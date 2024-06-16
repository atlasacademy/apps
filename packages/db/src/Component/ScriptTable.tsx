import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { Button, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Region } from "@atlasacademy/api-connector";

import BgmDescriptor from "../Descriptor/BgmDescriptor";
import QuestDescriptor from "../Descriptor/QuestDescriptor";
import { useImageSize } from "../Hooks/useImageSize";
import useWindowDimensions from "../Hooks/useWindowDimensions";
import ShowScriptLineContext from "../Page/Script/ShowScriptLineContext";
import Manager, { lang } from "../Setting/Manager";
import Scene from "./Scene";
import {
    CameraFilterType,
    ComponentWrapper,
    DialogueChildComponent,
    DialogueText,
    ScriptBackground,
    ScriptBracketComponent,
    ScriptCharaFace,
    ScriptCharaFaceFade,
    ScriptCharaFadeIn,
    ScriptCharaFilter,
    ScriptCharaMove,
    ScriptChoiceChildComponent,
    ScriptChoiceRouteInfo,
    ScriptChoiceRouteType,
    ScriptChoices,
    ScriptComponent,
    ScriptComponentType,
    ScriptComponentWrapper,
    ScriptDialogue,
    ScriptInfo,
    ScriptPictureFrame,
} from "./Script";
import ScriptDialogueLine from "./ScriptDialogueLine";

import "./ScriptTable.css";

type RowBgmRefMap = Map<string | undefined, React.RefObject<HTMLTableRowElement>>;
type ScriptOffsets = { charaGraphId: number; y?: number };

const combineDialogueString = (components: DialogueChildComponent[]): string => {
    return components
        .filter((c) => c.type === ScriptComponentType.DIALOGUE_TEXT)
        .map((c) => (c as DialogueText).text)
        .join(" ");
};

const DialogueRow = (props: {
    region: Region;
    dialogue: ScriptDialogue;
    refs: RowBgmRefMap;
    lineNumber?: number;
    wideScreen?: boolean;
    compareRegion?: Region;
    compareMap?: Map<number, ScriptComponent>;
}) => {
    const { compareRegion } = props;
    const showScriptLine = useContext(ShowScriptLineContext);
    const compareComponent = props.compareMap?.get(props.lineNumber ?? -1);
    const hasCompareComponent =
        compareRegion !== undefined &&
        compareComponent !== undefined &&
        compareComponent.type === ScriptComponentType.DIALOGUE;
    const sameCompareSpeakerName =
        hasCompareComponent &&
        combineDialogueString(props.dialogue.speaker?.components ?? []) ===
            combineDialogueString(compareComponent.speaker?.components ?? []);

    return (
        <tr ref={props.refs.get(props.dialogue.voice?.audioAsset ?? props.dialogue.maleVoice?.audioAsset)}>
            <td>
                <ScriptDialogueLine
                    region={props.region}
                    components={props.dialogue.speaker?.components ?? []}
                    wideScreen={props.wideScreen}
                />
                {hasCompareComponent && !sameCompareSpeakerName && (
                    <div lang={lang(compareRegion)}>
                        <ScriptDialogueLine
                            region={compareRegion}
                            components={compareComponent.speaker?.components ?? []}
                            wideScreen={props.wideScreen}
                        />
                    </div>
                )}
            </td>
            <td className={`${hasCompareComponent ? "main-dialogue" : ""}`}>
                {props.dialogue.voice && (
                    <div>
                        <BgmDescriptor region={props.region} bgm={props.dialogue.voice} />
                    </div>
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
                <ScriptDialogueLine
                    region={props.region}
                    components={props.dialogue.components.flat()}
                    wideScreen={props.wideScreen}
                />
            </td>
            {hasCompareComponent && (
                <td lang={lang(props.compareRegion)} className="compare-dialogue">
                    <ScriptDialogueLine
                        region={compareRegion}
                        components={compareComponent.components.flat()}
                        wideScreen={props.wideScreen}
                    />
                </td>
            )}
            {showScriptLine && <td className="text-center">{props.lineNumber}</td>}
        </tr>
    );
};

const ChoiceComponentsTable = (props: {
    region: Region;
    choiceComponents: ComponentWrapper<ScriptChoiceChildComponent>[];
    refs: RowBgmRefMap;
    wideScreen?: boolean;
    compareRegion?: Region;
    compareMap?: Map<number, ScriptComponent>;
}) => {
    if (props.choiceComponents.length === 0) return null;
    return (
        <>
            {props.choiceComponents.map((c, i) => {
                switch (c.content.type) {
                    case ScriptComponentType.DIALOGUE:
                        return (
                            <DialogueRow
                                key={i}
                                region={props.region}
                                dialogue={c.content}
                                refs={props.refs}
                                lineNumber={c.lineNumber}
                                wideScreen={props.wideScreen}
                                compareRegion={props.compareRegion}
                                compareMap={props.compareMap}
                            />
                        );
                    default:
                        return (
                            <ScriptBracketRow
                                key={i}
                                region={props.region}
                                component={c.content}
                                refs={props.refs}
                                wideScreen={props.wideScreen}
                            />
                        );
                }
            })}
        </>
    );
};

const ChoiceRow = ({
    region,
    component,
    refs,
    lineNumber,
    wideScreen,
    compareRegion,
    compareMap,
}: {
    region: Region;
    component: ScriptChoices;
    refs: RowBgmRefMap;
    lineNumber?: number;
    wideScreen?: boolean;
    compareRegion?: Region;
    compareMap?: Map<number, ScriptComponent>;
}) => {
    const { t } = useTranslation();
    const showScriptLine = useContext(ShowScriptLineContext);
    const compareComponent = compareMap?.get(lineNumber ?? -1);
    const hasCompareComponent =
        compareRegion !== undefined &&
        compareComponent !== undefined &&
        compareComponent.type === ScriptComponentType.CHOICES;

    if (hasCompareComponent) {
        return (
            <tr>
                <td>{t("Choices")}</td>
                <td colSpan={2}>
                    {component.choices.map((choice, i) => {
                        const compareChoice = compareComponent.choices[i];
                        return (
                            <Table key={choice.id} hover responsive className="mb-0">
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td className="main-choice">
                                            <li>
                                                <ScriptDialogueLine region={region} components={choice.option} />
                                            </li>
                                        </td>
                                        <td className="compare-choice" lang={lang(compareRegion)}>
                                            <li>
                                                <ScriptDialogueLine region={region} components={compareChoice.option} />
                                            </li>
                                        </td>
                                        {showScriptLine && <td></td>}
                                    </tr>
                                    <ChoiceComponentsTable
                                        region={region}
                                        choiceComponents={choice.results}
                                        refs={refs}
                                        wideScreen={wideScreen}
                                        compareRegion={compareRegion}
                                        compareMap={compareMap}
                                    />
                                </tbody>
                            </Table>
                        );
                    })}
                </td>
                {showScriptLine && <td className="text-center">{lineNumber}</td>}
            </tr>
        );
    }

    return (
        <tr>
            <td>{t("Choices")}</td>
            <td>
                <ul className="mb-0">
                    {component.choices.map((choice) => (
                        <li key={choice.id}>
                            <ChoiceRouteInfo routeInfo={choice.routeInfo} />
                            <ScriptDialogueLine region={region} components={choice.option} />
                            {choice.results.length > 0 && (
                                <Table hover responsive className="mt-3 mb-0">
                                    <tbody>
                                        <ChoiceComponentsTable
                                            region={region}
                                            choiceComponents={choice.results}
                                            refs={refs}
                                            wideScreen={wideScreen}
                                        />
                                    </tbody>
                                </Table>
                            )}
                        </li>
                    ))}
                </ul>
            </td>
            {showScriptLine && <td className="text-center">{lineNumber}</td>}
        </tr>
    );
};

type ScriptCharaMovement = ScriptCharaFadeIn | ScriptCharaMove;

const SceneRow = (props: {
    region: Region;
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
    colSpan?: number;
    halfWidth?: boolean;
}) => {
    const { lineNumber, cameraFilter, effects, wideScreen, halfWidth } = props,
        { t } = useTranslation(),
        resolution = wideScreen ? { height: 576, width: 1344 } : { height: 576, width: 1024 },
        imageSize = useImageSize(wideScreen),
        height = halfWidth ? imageSize.height / 2 : imageSize.height,
        width = halfWidth ? imageSize.width / 2 : imageSize.width,
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
                <td colSpan={props.colSpan}>
                    <Scene
                        region={props.region}
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
                        {props.charaFadeIn?.assetSet?.type === ScriptComponentType.IMAGE_SET ? (
                            <a href={figure?.asset} target="_blank" rel="noreferrer">
                                [{t("Image")}]
                            </a>
                        ) : null}
                    </div>
                </td>
                {showScriptLine && <td className="text-center">{props.lineNumber}</td>}
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
            <td colSpan={props.colSpan}>
                <Scene
                    region={props.region}
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
                    {props.figure?.assetSet?.type === ScriptComponentType.IMAGE_SET ? (
                        <a href={figure?.asset} target="_blank" rel="noreferrer">
                            [{t("Image")}]
                        </a>
                    ) : null}
                </div>
            </td>
            {showScriptLine && <td className="text-center">{props.lineNumber}</td>}
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
    colSpan?: number;
}) => {
    const { region, component, refs, lineNumber, wideScreen, colSpan } = props,
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
                    <td colSpan={colSpan}>
                        <BgmDescriptor region={region} bgm={component.bgm} />
                    </td>
                    {showScriptLine && <td className="text-center">{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.CRI_MOVIE:
            return (
                <tr>
                    <td>{t("Movie")}</td>
                    <td colSpan={colSpan}>
                        <video controls preload="none" width={getVideoWidth(windowWidth, wideScreen)}>
                            <source src={component.movieUrl} type="video/mp4" />
                        </video>
                    </td>
                    {showScriptLine && <td className="text-center">{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.SOUND_EFFECT:
            return (
                <tr ref={refs.get(component.soundEffect.audioAsset)}>
                    <td>{t("Sound Effect")}</td>
                    <td colSpan={colSpan}>
                        <BgmDescriptor region={region} bgm={component.soundEffect} />
                    </td>
                    {showScriptLine && <td className="text-center">{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.CUE_SOUND_EFFECT:
            return (
                <tr ref={refs.get(component.soundEffect.audioAsset)}>
                    <td>{t("Sound Effect")}</td>
                    <td colSpan={colSpan}>
                        <BgmDescriptor region={region} bgm={component.soundEffect} />
                    </td>
                    {showScriptLine && <td className="text-center">{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.FLAG:
            return (
                <tr>
                    <td>{t("Flag")}</td>
                    <td colSpan={colSpan}>
                        Set flag <code>{component.name}</code> to <code>{component.value}</code>
                    </td>
                    {showScriptLine && <td className="text-center">{lineNumber}</td>}
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
                    <td colSpan={colSpan}>
                        Go to label <code>{component.labelName}</code>
                        {condition} {getGoToLabel(component.labelName)}
                    </td>
                    {showScriptLine && <td className="text-center">{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.BRANCH_QUEST_NOT_CLEAR:
            return (
                <tr>
                    <td>{t("Branch")}</td>
                    <td colSpan={colSpan}>
                        Go to label <code>{component.labelName}</code> if quest{" "}
                        <QuestDescriptor region={region} questId={component.questId} /> hasn't been cleared{" "}
                        {getGoToLabel(component.labelName)}
                    </td>
                    {showScriptLine && <td className="text-center">{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.BRANCH_MASTER_GENDER:
            return (
                <tr>
                    <td>{t("Branch")}</td>
                    <td colSpan={colSpan}>
                        Go to label <code>{component.maleLabelName}</code> {getGoToLabel(component.maleLabelName)} if
                        chosen gender is male or <code>{component.femaleLabelName}</code>{" "}
                        {getGoToLabel(component.femaleLabelName)} if female
                    </td>
                    {showScriptLine && <td className="text-center">{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.LABEL:
            return (
                <tr ref={refs.get(component.name)}>
                    <td>{t("Label")}</td>
                    <td colSpan={colSpan}>
                        <code>{component.name}</code>
                    </td>
                    {showScriptLine && <td className="text-center">{lineNumber}</td>}
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
    compareRegion?: Region;
    compareMap?: Map<number, ScriptComponent>;
}) => {
    const { region, wrapper, refs, wideScreen, compareRegion, compareMap } = props;
    const { content: component, lineNumber } = wrapper;

    switch (component.type) {
        case ScriptComponentType.DIALOGUE:
            return (
                <DialogueRow
                    region={region}
                    dialogue={component}
                    refs={refs}
                    lineNumber={lineNumber}
                    wideScreen={wideScreen}
                    compareRegion={compareRegion}
                    compareMap={compareMap}
                />
            );
        case ScriptComponentType.CHOICES:
            return (
                <ChoiceRow
                    region={region}
                    component={component}
                    refs={refs}
                    lineNumber={lineNumber}
                    wideScreen={wideScreen}
                    compareRegion={compareRegion}
                    compareMap={compareMap}
                />
            );
        default:
            return (
                <ScriptBracketRow
                    region={region}
                    component={component}
                    refs={refs}
                    lineNumber={lineNumber}
                    wideScreen={wideScreen}
                    colSpan={props.compareMap !== undefined ? 2 : undefined}
                />
            );
    }
};

const ScriptTable = (props: {
    region: Region;
    script: ScriptInfo;
    showScene?: boolean;
    refs: RowBgmRefMap;
    compareScript?: { region: Region; script: ScriptInfo };
    halfWidth?: boolean;
}) => {
    const scriptComponents = props.script.components,
        { t } = useTranslation(),
        compareMap =
            props.compareScript !== undefined
                ? (new Map(
                      props.compareScript.script.components
                          .filter((c) => c.lineNumber !== undefined)
                          .map((c) => [c.lineNumber, c.content])
                  ) as Map<number, ScriptComponent>)
                : undefined,
        colSpan = compareMap !== undefined ? 2 : undefined;

    for (const c of props.compareScript?.script.components ?? []) {
        if (c.content.type === ScriptComponentType.CHOICES) {
            for (const choice of c.content.choices) {
                for (const res of choice.results) {
                    compareMap?.set(res.lineNumber ?? -1, res.content);
                }
            }
        }
    }

    let backgroundComponent: ScriptBackground | undefined,
        figureComponent: ScriptCharaFace | ScriptCharaFaceFade | undefined,
        charaFadeIn: ScriptCharaMovement | undefined,
        wideScreen = false,
        sceneSpeakerCode: string | undefined = undefined,
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
        <Table hover responsive className="script-table" style={props.halfWidth ? { fontSize: "10pt" } : {}}>
            <thead>
                <tr>
                    <th className="text-center" style={{ width: "10%" }}>
                        {t("Speaker")}
                    </th>
                    <th className="text-center" colSpan={colSpan}>
                        {t("Text")}
                    </th>
                    {showScriptLine && <th className="text-center">{t("Line")}</th>}
                </tr>
            </thead>
            <tbody lang={lang(props.region)}>
                {scriptComponents.map((component, i) => {
                    const { content, lineNumber } = component;

                    let sceneRow,
                        renderScene = () => {
                            sceneSpeakerCode = undefined;
                            return (
                                <SceneRow
                                    region={props.region}
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
                                    colSpan={colSpan}
                                    halfWidth={props.halfWidth}
                                />
                            );
                        };

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
                            sceneSpeakerCode = content.speakerCode;
                            sceneDisplayed = false;
                            break;

                        case ScriptComponentType.CHARA_FACE_FADE:
                            appearedSpeakers.add(content.speakerCode);
                            if (figureComponent && !sceneDisplayed) sceneRow = renderScene();

                            figureComponent = content;
                            sceneSpeakerCode = content.speakerCode;
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

                            if (assetSet && content.speakerCode !== sceneSpeakerCode) {
                                figureComponent = {
                                    type: ScriptComponentType.CHARA_FACE,
                                    speakerCode: content.speakerCode,
                                    face: 1,
                                    assetSet,
                                };
                                sceneRow = renderScene();
                                figureComponent = undefined;
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
                            content.choices
                                .map((choice) => choice.results)
                                .flat()
                                .forEach((childChoice) => {
                                    if (childChoice.content.type === ScriptComponentType.BACKGROUND) {
                                        backgroundComponent = childChoice.content;
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
                                compareRegion={props.compareScript?.region}
                                compareMap={compareMap}
                            />
                        </React.Fragment>
                    );
                })}

                {props.showScene !== false &&
                (figureComponent !== undefined || backgroundComponent !== undefined || charaFadeIn !== undefined) &&
                !sceneDisplayed ? (
                    <SceneRow
                        region={props.region}
                        foreground={foreground}
                        filters={filters}
                        cameraFilter={cameraFilter}
                        offsets={offsets}
                        background={backgroundComponent}
                        figure={figureComponent}
                        wideScreen={wideScreen}
                        effects={[...effects]}
                        halfWidth={props.halfWidth}
                    />
                ) : null}
            </tbody>
        </Table>
    );
};

export default ScriptTable;
