import { Table } from "react-bootstrap";
import { mergeElements } from "../Helper/OutputHelper";
import { colorString } from "../Helper/StringHelper";
import {
    ScriptComponent,
    ScriptComponentType,
    ScriptDialogue,
    ScriptInfo,
    ScriptNotChoiceComponent,
} from "./Script";
import ScriptDialogueLine from "./ScriptDialogueLine";

const DialogueRow = (props: { dialogue: ScriptDialogue }) => {
    return (
        <tr>
            <td>{colorString(props.dialogue.speakerName)}</td>
            <td>
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
    choiceComponents: ScriptNotChoiceComponent[];
}) => {
    if (props.choiceComponents.length === 0) return null;
    return (
        <Table style={{ marginTop: "1em" }}>
            <tbody>
                {props.choiceComponents
                    .filter((c) => c.type === ScriptComponentType.DIALOGUE)
                    .map((dialogue, i) => (
                        <DialogueRow key={i} dialogue={dialogue} />
                    ))}
            </tbody>
        </Table>
    );
};

const ScriptRow = (props: { component: ScriptComponent }) => {
    const component = props.component;
    switch (component.type) {
        case ScriptComponentType.DIALOGUE:
            return <DialogueRow dialogue={component} />;
        case ScriptComponentType.CHOICES:
            return (
                <tr>
                    <td>Choices</td>
                    <td>
                        <ul>
                            {component.choices.map((choice) => (
                                <li key={choice.id}>
                                    {choice.text}
                                    <ChoiceComponentsTable
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

const ScriptTable = (props: { script: ScriptInfo }) => {
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
                    <ScriptRow key={i} component={component} />
                ))}
            </tbody>
        </Table>
    );
};

export default ScriptTable;
