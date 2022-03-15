import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { Region } from "@atlasacademy/api-connector";

import { mergeElements, Renderable } from "../Helper/OutputHelper";
import { replacePUACodePoints } from "../Helper/StringHelper";
import Manager from "../Setting/Manager";
import { DialogueBasicComponent, DialogueChildComponent, ScriptComponentType } from "./Script";

import "../Helper/StringHelper.css";
import "./ScriptDialogueLine.css";

const DialogueBasic = (props: { component: DialogueBasicComponent; index?: number }) => {
    const component = props.component;
    switch (component.type) {
        case ScriptComponentType.DIALOGUE_NEW_LINE:
            if (props.index !== 0) {
                return <br />;
            } else {
                return null;
            }
        case ScriptComponentType.DIALOGUE_PLAYER_NAME:
            return <>{Manager.region() === Region.JP ? "藤丸" : "Fujimaru"}</>;
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
                    <ruby className="dialogueRuby">
                        {replacePUACodePoints(component.text)}
                        <rp>(</rp>
                        <rt>{replacePUACodePoints(component.ruby)}</rt>
                        <rp>)</rp>
                    </ruby>
                );
            }
            return (
                <em
                    style={{
                        textEmphasis: "filled dot",
                        WebkitTextEmphasis: "filled dot",
                        fontStyle: "normal",
                    }}
                >
                    {replacePUACodePoints(component.text)}
                </em>
            );
        case ScriptComponentType.DIALOGUE_HIDDEN_NAME:
            return <>{replacePUACodePoints(component.trueName)}</>;
        case ScriptComponentType.DIALOGUE_TEXT:
            const replacedPUA = replacePUACodePoints(component.text);
            const sizeClass = component.size !== undefined ? `scriptDialogueText-${component.size}` : "";

            return <span className={`newline ${sizeClass}`}>{replacedPUA}</span>;
        case ScriptComponentType.DIALOGUE_TEXT_IMAGE:
            if (component.ruby === undefined)
                return <img src={component.imageAsset} alt="Berserker Text" className="dialogueTextImage" />;

            return (
                <ruby>
                    <img src={component.imageAsset} alt="Berserker Text" className="dialogueTextImage" />
                    <rt className="dialogueTextImageRuby">{component.ruby}</rt>
                </ruby>
            );
        default:
            return null;
    }
};

const DialoguePopover = (props: { children: Renderable[]; tooltipComponent: Renderable[] }) => {
    const { children, tooltipComponent } = props;

    const maleToolTip = (props: any) => (
        <Tooltip lang={Manager.lang()} {...props}>
            {tooltipComponent}
        </Tooltip>
    );

    return (
        <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={maleToolTip}>
            <span style={{ textDecoration: "underline" }}>{mergeElements(children, "")}</span>
        </OverlayTrigger>
    );
};

export const DialogueChild = ({ component, index }: { component: DialogueChildComponent; index?: number }) => {
    switch (component.type) {
        case ScriptComponentType.DIALOGUE_GENDER:
            const femaleComponents = component.female.map((component, i) => (
                <DialogueBasic key={i} component={component} />
            ));

            const maleComponents = component.male.map((component, i) => (
                <DialogueBasic key={i} component={component} />
            ));

            return <DialoguePopover tooltipComponent={femaleComponents}>{maleComponents}</DialoguePopover>;
        case ScriptComponentType.DIALOGUE_NEW_LINE:
        case ScriptComponentType.DIALOGUE_PLAYER_NAME:
        case ScriptComponentType.DIALOGUE_LINE:
        case ScriptComponentType.DIALOGUE_RUBY:
        case ScriptComponentType.DIALOGUE_TEXT:
        case ScriptComponentType.DIALOGUE_TEXT_IMAGE:
            return <DialogueBasic component={component} index={index} />;
        default:
            return null;
    }
};

const ScriptDialogueLine = (props: { components: DialogueChildComponent[] }) => {
    const childDialogue = props.components.map((component, i) => <DialogueChild component={component} index={i} />);
    return <>{mergeElements(childDialogue, "")}</>;
};

export default ScriptDialogueLine;
