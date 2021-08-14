import {Region, Script} from "@atlasacademy/api-connector";
import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {Button, Table} from "react-bootstrap";
import Api from "../Api";
import BgmDescriptor from "../Descriptor/BgmDescriptor";
import QuestDescriptor from "../Descriptor/QuestDescriptor";
import {
    ScriptBracketComponent,
    ScriptCharaFace,
    ScriptComponent,
    ScriptComponentType,
    ScriptDialogue,
    ScriptInfo,
} from "./Script";
import ScriptDialogueLine from "./ScriptDialogueLine";

type RowBgmRefMap = Map<string | undefined,
    React.RefObject<HTMLTableRowElement>>;

const DialogueRow = (props: {
    region: Region;
    dialogue: ScriptDialogue;
    refs: RowBgmRefMap;
}) => {
    const dialogueVoice = props.dialogue.voice ? (
        <BgmDescriptor
            region={props.region}
            bgm={props.dialogue.voice}
            style={{display: "block"}}
        />
    ) : null;
    return (
        <tr ref={props.refs.get(props.dialogue.voice?.audioAsset)}>
            <td>
                <ScriptDialogueLine
                    components={props.dialogue.speaker?.components ?? []}
                />
            </td>
            <td>
                {dialogueVoice}
                <ScriptDialogueLine
                    components={props.dialogue.components.flat()}
                />
            </td>
        </tr>
    );
};

const CharaFaceRow = (props: {
    component: ScriptCharaFace,
}) => {
    let asset = null,
        name = '',
        [script, setScript] = useState<Script.SvtScript | undefined>(undefined);
    switch (props.component.assetSet?.type) {
        case ScriptComponentType.CHARA_SET:
            asset = props.component.assetSet?.charaGraphAsset;
            name = props.component.assetSet?.baseName;
            Api.svtScript(parseInt(props.component.assetSet?.charaGraphId)).then(script => {
                setScript(script[0]);
            });
            break;
    }

    let expression = null;
    if (asset && script) {
        let size = 256,
            face = props.component.face - 1,
            faceSize = script.extendData.faceSize ?? 256,
            figureWidth = 1024,
            offsetX = 0,
            offsetY = faceSize === 256 ? 768 : 1024,
            perRow = Math.floor(figureWidth / faceSize),
            col = face % perRow,
            row = Math.floor(face / perRow),
            scale = (size / faceSize),
            backgroundPositionX : number | string = ((col * faceSize * (-1)) - offsetX) * scale,
            backgroundPositionY : number | string = ((row * faceSize * (-1)) - offsetY) * scale,
            backgroundSize : number | string = scale * figureWidth;

        if (!script.faceX && !script.faceY) {
            backgroundPositionX = '50%';
            backgroundPositionY = '50%';
            backgroundSize = 'contain';
        } else if (props.component.face === 0) {
            backgroundPositionX = script.faceX * scale * (-1);
            backgroundPositionY = script.faceY * scale * (-1);
        }

        expression = <a href={asset}>
            <span style={{
                backgroundImage: `url("${asset}")`,
                backgroundPositionX,
                backgroundPositionY,
                backgroundRepeat: 'no-repeat',
                backgroundSize,
                display: 'inline-block',
                height: size,
                width: size,
            }}></span>
        </a>;
    }

    return (
        <tr>
            <td>{name}</td>
            <td>{expression}</td>
        </tr>
    );
}

const ChoiceComponentsTable = (props: {
    region: Region;
    choiceComponents: (ScriptBracketComponent | ScriptDialogue)[];
    refs: RowBgmRefMap;
}) => {
    if (props.choiceComponents.length === 0) return null;
    return (
        <Table hover responsive style={{marginTop: "1em"}}>
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
                            />
                        );
                    default:
                        return (
                            <ScriptBracketRow
                                key={i}
                                region={props.region}
                                component={c}
                                refs={props.refs}
                            />
                        );
                }
            })}
            </tbody>
        </Table>
    );
};

const ScriptBracketRow = (props: {
    region: Region;
    component: ScriptBracketComponent;
    refs: RowBgmRefMap;
}) => {
    const {region, component, refs} = props;
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
                <FontAwesomeIcon
                    icon={faShare}
                    title={`Go to label ${labelName}`}
                />
            </Button>
        );
    };

    switch (component.type) {
        case ScriptComponentType.BACKGROUND:
            return (
                <tr>
                    <td>Background</td>
                    <td>
                        <a href={component.backgroundAsset}>
                            <img
                                src={component.backgroundAsset}
                                style={{maxWidth: "30em", width: "100%"}}
                                alt="Script background"
                            />
                        </a>
                    </td>
                </tr>
            );
        case ScriptComponentType.BGM:
            return (
                <tr ref={refs.get(component.bgm.audioAsset)}>
                    <td>BGM</td>
                    <td>
                        <BgmDescriptor region={region} bgm={component.bgm}/>
                    </td>
                </tr>
            );
        case ScriptComponentType.SOUND_EFFECT:
            return (
                <tr ref={refs.get(component.soundEffect.audioAsset)}>
                    <td>Sound Effect</td>
                    <td>
                        <BgmDescriptor
                            region={region}
                            bgm={component.soundEffect}
                        />
                    </td>
                </tr>
            );
        case ScriptComponentType.FLAG:
            return (
                <tr>
                    <td>Flag</td>
                    <td>
                        Set flag <code>{component.name}</code> to{" "}
                        <code>{component.value}</code>
                    </td>
                </tr>
            );
        case ScriptComponentType.BRANCH:
            const condition =
                component.flag === undefined ? null : (
                    <>
                        {" "}
                        if <code>{component.flag.name}</code> is{" "}
                        <code>{component.flag.value}</code>
                    </>
                );
            return (
                <tr>
                    <td>Branch</td>
                    <td>
                        Go to label <code>{component.labelName}</code>
                        {condition} {getGoToLabel(component.labelName)}
                    </td>
                </tr>
            );
        case ScriptComponentType.BRANCH_QUEST_NOT_CLEAR:
            return (
                <tr>
                    <td>Branch</td>
                    <td>
                        Go to label <code>{component.labelName}</code> if quest{" "}
                        <QuestDescriptor
                            region={region}
                            questId={component.questId}
                        />{" "}
                        hasn't been cleared {getGoToLabel(component.labelName)}
                    </td>
                </tr>
            );
        case ScriptComponentType.BRANCH_MASTER_GENDER:
            return (
                <tr>
                    <td>Branch</td>
                    <td>
                        Go to label <code>{component.maleLabelName}</code>{" "}
                        {getGoToLabel(component.maleLabelName)} if chosen gender{" "}
                        is male or <code>{component.femaleLabelName}</code>{" "}
                        {getGoToLabel(component.femaleLabelName)} if female
                    </td>
                </tr>
            );
        case ScriptComponentType.LABEL:
            return (
                <tr ref={refs.get(component.name)}>
                    <td>Label</td>
                    <td>
                        <code>{component.name}</code>
                    </td>
                </tr>
            );
        default:
            return null;
    }
};

const ScriptRow = (props: {
    region: Region;
    component: ScriptComponent;
    refs: RowBgmRefMap;
}) => {
    const {region, component, refs} = props;
    switch (component.type) {
        case ScriptComponentType.DIALOGUE:
            return (
                <DialogueRow region={region} dialogue={component} refs={refs}/>
            );
        case ScriptComponentType.CHARA_FACE:
            return <CharaFaceRow component={component}/>;
        case ScriptComponentType.CHOICES:
            return (
                <tr>
                    <td>Choices</td>
                    <td>
                        <ul>
                            {component.choices.map((choice) => (
                                <li key={choice.id}>
                                    <ScriptDialogueLine
                                        components={choice.option}
                                    />
                                    <ChoiceComponentsTable
                                        region={region}
                                        choiceComponents={choice.results}
                                        refs={refs}
                                    />
                                </li>
                            ))}
                        </ul>
                    </td>
                </tr>
            );
        default:
            return (
                <ScriptBracketRow
                    region={region}
                    component={component}
                    refs={refs}
                />
            );
    }
};

const ScriptTable = (props: {
    region: Region;
    script: ScriptInfo;
    refs: RowBgmRefMap;
}) => {
    return (
        <Table hover responsive>
            <thead>
            <tr>
                <th style={{textAlign: "center", width: "10%"}}>
                    Speaker
                </th>
                <th style={{textAlign: "center"}}>Text</th>
            </tr>
            </thead>
            <tbody>
            {props.script.components.map((component, i) => (
                <ScriptRow
                    key={i}
                    region={props.region}
                    component={component}
                    refs={props.refs}
                />
            ))}
            </tbody>
        </Table>
    );
};

export default ScriptTable;
