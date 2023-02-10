import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { Region } from "@atlasacademy/api-connector";

import { replacePUACodePoints } from "../Helper/StringHelper";
import Manager, { lang } from "../Setting/Manager";
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
            switch (Manager.region()) {
                case Region.JP:
                    return <>藤丸</>;
                case Region.NA:
                    return <>Fujimaru</>;
                case Region.CN:
                case Region.TW:
                    return <>藤丸</>;
                case Region.KR:
                    return <>후지마루</>;
            }
            break;
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

const DialoguePopover = ({
    children,
    tooltipComponent,
}: {
    children: React.ReactNode;
    tooltipComponent: React.ReactNode;
}) => {
    const maleToolTip = (props: any) => (
        <Tooltip lang={lang()} {...props}>
            {tooltipComponent}
        </Tooltip>
    );

    return (
        <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={maleToolTip}>
            <span style={{ textDecoration: "underline" }}>{children}</span>
        </OverlayTrigger>
    );
};

const dialogueBasicHasContent = (components: DialogueBasicComponent[]) => {
    for (const component of components) {
        switch (component.type) {
            case ScriptComponentType.DIALOGUE_TEXT:
                if (component.text.length > 0) {
                    return true;
                }
        }
    }

    return false;
};

export const DialogueChild = ({ component, index }: { component: DialogueChildComponent; index?: number }) => {
    switch (component.type) {
        case ScriptComponentType.DIALOGUE_GENDER:
            const maleComponents = component.male.map((component, i) => (
                <DialogueBasic key={i} component={component} />
            ));
            if (dialogueBasicHasContent(component.female)) {
                const femaleComponents = component.female.map((component, i) => (
                    <DialogueBasic key={i} component={component} />
                ));

                return <DialoguePopover tooltipComponent={femaleComponents}>{maleComponents}</DialoguePopover>;
            } else {
                return <span style={{ textDecoration: "underline" }}>{maleComponents}</span>;
            }
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
    return (
        <>
            {props.components.map((component, i) => (
                <DialogueChild key={i} component={component} index={i} />
            ))}
        </>
    );
};

export default ScriptDialogueLine;
