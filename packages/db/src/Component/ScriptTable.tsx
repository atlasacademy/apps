import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { Button, Table } from "react-bootstrap";

import { Region } from "@atlasacademy/api-connector";

import BgmDescriptor from "../Descriptor/BgmDescriptor";
import QuestDescriptor from "../Descriptor/QuestDescriptor";
import { flatten } from "../Helper/PolyFill";
import useWindowDimensions from "../Helper/WindowHelper";
import ShowScriptLineContext from "../Page/Script/ShowScriptLineContext";
import Manager from "../Setting/Manager";
import Scene from "./Scene";
import {
    ScriptBackground,
    ScriptBracketComponent,
    ScriptCharaFace,
    ScriptCharaFadeIn,
    ScriptChoiceRouteInfo,
    ScriptChoiceRouteType,
    ScriptComponentWrapper,
    ScriptComponentType,
    ScriptDialogue,
    ScriptInfo,
} from "./Script";
import ScriptDialogueLine from "./ScriptDialogueLine";

type RowBgmRefMap = Map<string | undefined, React.RefObject<HTMLTableRowElement>>;

const DialogueRow = (props: { region: Region; dialogue: ScriptDialogue; refs: RowBgmRefMap; lineNumber?: number }) => {
    const dialogueVoice = props.dialogue.voice ? (
        <BgmDescriptor region={props.region} bgm={props.dialogue.voice} style={{ display: "block" }} />
    ) : null;
    const showScriptLine = useContext(ShowScriptLineContext);
    return (
        <tr ref={props.refs.get(props.dialogue.voice?.audioAsset)}>
            <td>
                <ScriptDialogueLine components={props.dialogue.speaker?.components ?? []} />
            </td>
            <td>
                {dialogueVoice}
                <ScriptDialogueLine components={flatten(props.dialogue.components)} />
            </td>
            {showScriptLine && <td>{props.lineNumber}</td>}
        </tr>
    );
};

const ChoiceComponentsTable = (props: {
    region: Region;
    choiceComponents: (ScriptBracketComponent | ScriptDialogue)[];
    refs: RowBgmRefMap;
}) => {
    if (props.choiceComponents.length === 0) return null;
    return (
        <Table hover responsive style={{ marginTop: "1em" }}>
            <tbody>
                {props.choiceComponents.map((c, i) => {
                    switch (c.type) {
                        case ScriptComponentType.DIALOGUE:
                            return <DialogueRow key={i} region={props.region} dialogue={c} refs={props.refs} />;
                        default:
                            return <ScriptBracketRow key={i} region={props.region} component={c} refs={props.refs} />;
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
        }
    }
    if (windowWidth < 768) {
        return 3;
    }
    return 2;
};

const SceneRow = (props: {
    background?: ScriptBackground;
    figure?: ScriptCharaFace;
    charaFadeIn?: ScriptCharaFadeIn;
    offsets?: {
        y?: number;
        asset?: {
            charaGraphId?: number;
        };
    };
    wideScreen: boolean;
    lineNumber?: number;
}) => {
    const resolution = props.wideScreen ? { height: 576, width: 1344 } : { height: 576, width: 1024 },
        { windowWidth, windowHeight } = useWindowDimensions(),
        sceneScale = getSceneScale(windowWidth, windowHeight, props.wideScreen),
        height = (props.wideScreen ? 576 : 576) / sceneScale,
        width = (props.wideScreen ? 1344 : 1024) / sceneScale,
        background = props.background ? { asset: props.background.backgroundAsset } : undefined;

    const showScriptLine = useContext(ShowScriptLineContext);

    let figure = undefined;
    let equip = undefined;
    let offsets = undefined;

    if (props.figure !== undefined && props.figure.assetSet !== undefined) {
        switch (props.figure.assetSet.type) {
            case ScriptComponentType.CHARA_SET:
            case ScriptComponentType.CHARA_CHANGE:
                figure = {
                    asset: props.figure.assetSet.charaGraphAsset,
                    face: props.figure.face,
                    charaGraphId: props.figure.assetSet.charaGraphId,
                };

                offsets = {
                    y: props.offsets?.y ?? 0,
                    charaGraphId: props.offsets?.asset?.charaGraphId,
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
                figure = {
                    asset: props.charaFadeIn.assetSet.backgroundAsset,
                    face: 0,
                };
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
                        background={undefined}
                        offsetsFigure={offsets}
                        equip={equip}
                        figure={figure}
                        resolution={resolution}
                        height={height}
                        width={width}
                    />
                    <div>
                        {figure !== undefined ? (
                            <a href={figure.asset} target="_blank" rel="noreferrer">
                                [Figure]
                            </a>
                        ) : null}{" "}
                        {equip !== undefined ? (
                            <a
                                href={`/db/${Manager.region()}/craft-essence/${equip.equipAssetId}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                [Craft Essence]
                            </a>
                        ) : null}
                    </div>
                </td>
                {showScriptLine && <td>{props.lineNumber}</td>}
            </tr>
        );
    }

    return (
        <tr>
            <td />
            <td>
                <Scene
                    background={background}
                    offsetsFigure={offsets}
                    equip={equip}
                    figure={figure}
                    resolution={resolution}
                    height={height}
                    width={width}
                />
                <div>
                    {props.background ? (
                        <a href={props.background.backgroundAsset} target="_blank" rel="noreferrer">
                            [Background]
                        </a>
                    ) : null}
                    &nbsp;
                    {props.figure &&
                    (props.figure.assetSet?.type === ScriptComponentType.CHARA_SET ||
                        props.figure.assetSet?.type === ScriptComponentType.CHARA_CHANGE) ? (
                        <a href={props.figure.assetSet?.charaGraphAsset} target="_blank" rel="noreferrer">
                            [Figure]
                        </a>
                    ) : null}
                    &nbsp;
                    {props.figure && props.figure.assetSet?.type === ScriptComponentType.EQUIP_SET ? (
                        <a
                            href={`/db/${Manager.region()}/craft-essence/${props.figure.assetSet.equipId}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            [Craft Essence]
                        </a>
                    ) : null}
                </div>
            </td>
            {showScriptLine && <td>{props.lineNumber}</td>}
        </tr>
    );
};

const ScriptBracketRow = (props: {
    region: Region;
    component: ScriptBracketComponent;
    refs: RowBgmRefMap;
    lineNumber?: number;
}) => {
    const { region, component, refs, lineNumber } = props;
    const showScriptLine = useContext(ShowScriptLineContext);
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
                    <td>BGM</td>
                    <td>
                        <BgmDescriptor region={region} bgm={component.bgm} />
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.SOUND_EFFECT:
            return (
                <tr ref={refs.get(component.soundEffect.audioAsset)}>
                    <td>Sound Effect</td>
                    <td>
                        <BgmDescriptor region={region} bgm={component.soundEffect} />
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        case ScriptComponentType.FLAG:
            return (
                <tr>
                    <td>Flag</td>
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
                    <td>Branch</td>
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
                    <td>Branch</td>
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
                    <td>Branch</td>
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
                    <td>Label</td>
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

const ScriptRow = (props: { region: Region; wrapper: ScriptComponentWrapper; refs: RowBgmRefMap }) => {
    const { region, wrapper, refs } = props;
    const { content: component, lineNumber } = wrapper;
    const showScriptLine = useContext(ShowScriptLineContext);
    switch (component.type) {
        case ScriptComponentType.DIALOGUE:
            return <DialogueRow region={region} dialogue={component} refs={refs} lineNumber={lineNumber} />;
        case ScriptComponentType.CHOICES:
            return (
                <tr>
                    <td>Choices</td>
                    <td>
                        <ul>
                            {component.choices.map((choice) => (
                                <li key={choice.id}>
                                    <ChoiceRouteInfo routeInfo={choice.routeInfo} />
                                    <ScriptDialogueLine components={choice.option} />
                                    <ChoiceComponentsTable
                                        region={region}
                                        choiceComponents={choice.results}
                                        refs={refs}
                                    />
                                </li>
                            ))}
                        </ul>
                    </td>
                    {showScriptLine && <td>{lineNumber}</td>}
                </tr>
            );
        default:
            return <ScriptBracketRow region={region} component={component} refs={refs} lineNumber={lineNumber} />;
    }
};

const ScriptTable = (props: { region: Region; script: ScriptInfo; showScene?: boolean; refs: RowBgmRefMap }) => {
    let backgroundComponent: ScriptBackground | undefined,
        figureComponent: ScriptCharaFace | undefined,
        charaFadeIn: ScriptCharaFadeIn | undefined,
        wideScreen = false,
        sceneDisplayed = false,
        offsets: Object | undefined = undefined;

    const showScriptLine = useContext(ShowScriptLineContext);
    return (
        <Table hover responsive>
            <thead>
                <tr>
                    <th style={{ textAlign: "center", width: "10%" }}>Speaker</th>
                    <th style={{ textAlign: "center" }}>Text</th>
                    {showScriptLine && <th style={{ textAlign: "center" }}>Line</th>}
                </tr>
            </thead>
            <tbody>
                {props.script.components.map((component, i) => {
                    let sceneRow,
                        renderScene = () => (
                            <SceneRow
                                offsets={offsets}
                                background={backgroundComponent}
                                figure={figureComponent}
                                charaFadeIn={charaFadeIn}
                                wideScreen={wideScreen}
                                lineNumber={component.lineNumber}
                            />
                        );

                    if (component.content.type === ScriptComponentType.ENABLE_FULL_SCREEN) {
                        wideScreen = true;
                    } else if (component.content.type === ScriptComponentType.BACKGROUND) {
                        if (backgroundComponent && !sceneDisplayed) sceneRow = renderScene();

                        backgroundComponent = component.content;
                        figureComponent = undefined;
                        sceneDisplayed = false;
                    } else if (component.content.type === ScriptComponentType.CHARA_FACE) {
                        if (figureComponent && !sceneDisplayed) sceneRow = renderScene();

                        figureComponent = component.content;
                        sceneDisplayed = false;
                    } else if (component.content.type === ScriptComponentType.CHARA_FADE_IN) {
                        if (
                            component.content?.assetSet?.type !== ScriptComponentType.CHARA_SET &&
                            component.content?.assetSet?.type !== ScriptComponentType.CHARA_CHANGE
                        ) {
                            charaFadeIn = component.content;
                            sceneRow = renderScene();
                            charaFadeIn = undefined;
                        }

                        if (component.content.position && component.content.position.y !== 0) {
                            offsets = {
                                asset: component.content.assetSet,
                                y: component.content.position.y,
                            };
                        }
                    } else if (
                        component.content.type === ScriptComponentType.BRANCH ||
                        component.content.type === ScriptComponentType.LABEL
                    ) {
                        if (backgroundComponent && !sceneDisplayed) {
                            sceneRow = renderScene();
                            sceneDisplayed = true;
                        }
                    } else if (!sceneDisplayed) {
                        switch (component.content.type) {
                            case ScriptComponentType.DIALOGUE:
                            case ScriptComponentType.CHOICES:
                                sceneRow = renderScene();
                                sceneDisplayed = true;
                        }
                    } else if (component.content.type === ScriptComponentType.CHOICES) {
                        flatten(component.content.choices.map((choice) => choice.results)).forEach((childChoice) => {
                            if (childChoice.type === ScriptComponentType.BACKGROUND) {
                                backgroundComponent = childChoice;
                            }
                        });
                    }

                    return (
                        <React.Fragment key={i}>
                            {props.showScene === false ? null : sceneRow}
                            <ScriptRow region={props.region} wrapper={component} refs={props.refs} />
                        </React.Fragment>
                    );
                })}

                {props.showScene !== false &&
                (figureComponent !== undefined || backgroundComponent !== undefined) &&
                !sceneDisplayed ? (
                    <SceneRow
                        offsets={offsets}
                        background={backgroundComponent}
                        figure={figureComponent}
                        wideScreen={wideScreen}
                    />
                ) : null}
            </tbody>
        </Table>
    );
};

export default ScriptTable;
