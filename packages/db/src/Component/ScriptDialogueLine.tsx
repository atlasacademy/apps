import { Region } from "@atlasacademy/api-connector";
import { mergeElements } from "../Helper/OutputHelper";
import Manager from "../Setting/Manager";
import {
    DialogueBasicComponent,
    DialogueChildComponent,
    ScriptComponentType,
} from "./Script";

const DialogueBasic = (props: { component: DialogueBasicComponent }) => {
    const component = props.component;
    switch (component.type) {
        case ScriptComponentType.DIALOGUE_NEW_LINE:
            return <br />;
        case ScriptComponentType.DIALOGUE_PLAYER_NAME:
            return <>{Manager.region() === Region.JP ? "ぐだ子" : "Gudako"}</>;
        case ScriptComponentType.DIALOGUE_LINE:
            return (
                <div
                    style={{
                        width: `${15 * component.length}px`,
                        height: "0.25em",
                        borderTop: "1px solid black",
                        margin: "0 0.125em 0 0.25em",
                        display: "inline-block",
                    }}
                ></div>
            );
        case ScriptComponentType.DIALOGUE_RUBY:
            if (component.text !== undefined && component.ruby !== undefined) {
                return (
                    <ruby>
                        {component.text}
                        <rp>(</rp>
                        <rt>{component.ruby}</rt>
                        <rp>)</rp>
                    </ruby>
                );
            }
            return <>{component.text}</>;
        case ScriptComponentType.DIALOGUE_HIDDEN_NAME:
            return <>{component.trueName}</>;
        case ScriptComponentType.DIALOGUE_TEXT:
            return <>{component.text}</>;
        default:
            return null;
    }
};

const DialogueChild = (props: { component: DialogueChildComponent }) => {
    const component = props.component;
    switch (component.type) {
        case ScriptComponentType.DIALOGUE_GENDER:
            const femaleComponents = component.female.map((component) => (
                <DialogueBasic component={component} />
            ));
            return <>{mergeElements(femaleComponents, "")}</>;
        case ScriptComponentType.DIALOGUE_NEW_LINE:
        case ScriptComponentType.DIALOGUE_PLAYER_NAME:
        case ScriptComponentType.DIALOGUE_LINE:
        case ScriptComponentType.DIALOGUE_RUBY:
        case ScriptComponentType.DIALOGUE_TEXT:
            return <DialogueBasic component={component} />;
        default:
            return null;
    }
};

const ScriptDialogueLine = (props: {
    components: DialogueChildComponent[];
}) => {
    const childDialogue = props.components.map((component) => (
        <DialogueChild component={component} />
    ));
    return <>{mergeElements(childDialogue, "")}</>;
};

export default ScriptDialogueLine;
