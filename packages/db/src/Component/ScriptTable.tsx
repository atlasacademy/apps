import { Region } from "@atlasacademy/api-connector";
import { Table } from "react-bootstrap";
import { mergeElements } from "../Helper/OutputHelper";
import {
    ScriptComponent,
    ScriptComponentType,
    ScriptDialogue,
    ScriptInfo,
    ScriptNotChoiceComponent,
} from "./Script";
import ScriptDialogueLine, { ScriptSpeakerName } from "./ScriptDialogueLine";

const DialogueRow = (props: { region: Region; dialogue: ScriptDialogue }) => {
    return (
        <tr>
            <td>
                <ScriptSpeakerName name={props.dialogue.speakerName} />
            </td>
            <td>
                {mergeElements(
                    props.dialogue.dialogueLines.map((line) => (
                        <ScriptDialogueLine region={props.region} line={line} />
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
}) => {
    if (props.choiceComponents.length === 0) return null;
    return (
        <Table style={{ marginTop: "1em" }}>
            <tbody>
                {props.choiceComponents
                    .filter((c) => c.type === ScriptComponentType.DIALOGUE)
                    .map((dialogue, i) => (
                        <DialogueRow
                            key={i}
                            region={props.region}
                            dialogue={dialogue}
                        />
                    ))}
            </tbody>
        </Table>
    );
};

const ScriptRow = (props: { region: Region; component: ScriptComponent }) => {
    const component = props.component;
    switch (component.type) {
        case ScriptComponentType.DIALOGUE:
            return <DialogueRow region={props.region} dialogue={component} />;
        case ScriptComponentType.CHOICES:
            return (
                <tr>
                    <td>Choices</td>
                    <td>
                        <ul>
                            {component.choices.map((choice) => (
                                <li key={choice.id}>
                                    <ScriptDialogueLine
                                        region={props.region}
                                        line={choice.text}
                                    />
                                    <ChoiceComponentsTable
                                        region={props.region}
                                        choiceComponents={choice.components}
                                    />
                                </li>
                            ))}
                        </ul>
                    </td>
                </tr>
            );
    }
};

const ScriptTable = (props: { region: Region; script: ScriptInfo }) => {
    return (
        <Table>
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
                    />
                ))}
            </tbody>
        </Table>
    );
};

export default ScriptTable;
