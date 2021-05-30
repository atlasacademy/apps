import { Region } from "@atlasacademy/api-connector";
import { Table } from "react-bootstrap";
import BgmDescriptor from "../Descriptor/BgmDescriptor";
import { mergeElements } from "../Helper/OutputHelper";
import ScriptDialogueLine, { ScriptSpeakerName } from "./ScriptDialogueLine";
import {
    ScriptComponent,
    ScriptComponentType,
    ScriptDialogue,
    ScriptInfo,
    ScriptNotChoiceComponent,
} from "./Script";

type RowBgmRefMap = Map<
    string | undefined,
    React.RefObject<HTMLTableRowElement>
>;

const DialogueRow = (props: {
    region: Region;
    dialogue: ScriptDialogue;
    refs: RowBgmRefMap;
}) => {
    const dialogueVoice = props.dialogue.dialogueVoice ? (
        <>
            <BgmDescriptor
                region={props.region}
                bgm={props.dialogue.dialogueVoice}
            />
            <br />
        </>
    ) : null;
    return (
        <tr ref={props.refs.get(props.dialogue.dialogueVoice?.audioAsset)}>
            <td>
                <ScriptSpeakerName name={props.dialogue.speakerName} />
            </td>
            <td>
                {dialogueVoice}
                {mergeElements(
                    props.dialogue.dialogueLines.map((line) => (
                        <ScriptDialogueLine line={line} />
                    )),
                    <br />
                )}
            </td>
        </tr>
    );
};

const ChoiceComponentsTable = (props: {
    region: Region;
    choiceComponents: ScriptNotChoiceComponent[];
    refs: RowBgmRefMap;
}) => {
    if (props.choiceComponents.length === 0) return null;
    return (
        <Table hover responsive style={{ marginTop: "1em" }}>
            <tbody>
                {props.choiceComponents
                    .filter((c) => c.type === ScriptComponentType.DIALOGUE)
                    .map((dialogue, i) => (
                        <DialogueRow
                            key={i}
                            region={props.region}
                            dialogue={dialogue}
                            refs={props.refs}
                        />
                    ))}
            </tbody>
        </Table>
    );
};

const ScriptRow = (props: {
    region: Region;
    component: ScriptComponent;
    refs: RowBgmRefMap;
}) => {
    const component = props.component;
    switch (component.type) {
        case ScriptComponentType.DIALOGUE:
            return (
                <DialogueRow
                    region={props.region}
                    dialogue={component}
                    refs={props.refs}
                />
            );
        case ScriptComponentType.CHOICES:
            return (
                <tr>
                    <td>Choices</td>
                    <td>
                        <ul>
                            {component.choices.map((choice) => (
                                <li key={choice.id}>
                                    <ScriptDialogueLine line={choice.text} />
                                    <ChoiceComponentsTable
                                        region={props.region}
                                        choiceComponents={choice.components}
                                        refs={props.refs}
                                    />
                                </li>
                            ))}
                        </ul>
                    </td>
                </tr>
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
                    <th style={{ textAlign: "center", width: "10%" }}>
                        Speaker
                    </th>
                    <th style={{ textAlign: "center" }}>Text</th>
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
