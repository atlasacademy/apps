import { Region } from "@atlasacademy/api-connector";
import { mergeElements, Renderable } from "../Helper/OutputHelper";
import { colorString } from "../Helper/StringHelper";
import Manager from "../Setting/Manager";
import {
    DialogueBasicComponent,
    DialogueChildComponent,
    ScriptComponentType,
} from "./Script";

export const ScriptSpeakerName = (props: { name: string }) => {
    const name = props.name;
    const match = name.match(/\[(.*)\]/);
    if (match !== null) {
        const parameter = match[1];
        if (parameter.startsWith("servantName")) {
            const servantName = parameter
                .replace("servantName ", "")
                .split(":")[2];
            return <>{colorString(servantName)}</>;
        }
    }
    if (name[1] === "：") return <>{colorString(name.split("：")[1].trim())}</>;

    return <>{colorString(name)}</>;
};

const renderDialogueBasic = (component: DialogueBasicComponent): Renderable => {
    switch (component.type) {
        case ScriptComponentType.DIALOGUE_NEW_LINE:
            return <br />;
        case ScriptComponentType.DIALOGUE_PLAYER_NAME:
            return Manager.region() === Region.JP ? "ぐだ子" : "Gudako";
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
            return component.text;
        case ScriptComponentType.DIALOGUE_TEXT:
            return component.text;
        default:
            return "";
    }
};

const renderDialogueComponent = (
    component: DialogueChildComponent
): Renderable => {
    switch (component.type) {
        case ScriptComponentType.DIALOGUE_GENDER:
            return mergeElements(
                component.female.map((component) =>
                    renderDialogueBasic(component)
                ),
                ""
            );
        case ScriptComponentType.DIALOGUE_NEW_LINE:
        case ScriptComponentType.DIALOGUE_PLAYER_NAME:
        case ScriptComponentType.DIALOGUE_LINE:
        case ScriptComponentType.DIALOGUE_RUBY:
        case ScriptComponentType.DIALOGUE_TEXT:
            return renderDialogueBasic(component);
        default:
            return "";
    }
};

const ScriptDialogueLine = (props: {
    components: DialogueChildComponent[];
}) => {
    return (
        <>
            {mergeElements(
                props.components.map((component) =>
                    renderDialogueComponent(component)
                ),
                ""
            )}
        </>
    );
};

export default ScriptDialogueLine;
