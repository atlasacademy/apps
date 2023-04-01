import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { Region } from "@atlasacademy/api-connector";

import { FGOText } from "../Helper/StringHelper";
import Manager, { lang } from "../Setting/Manager";
import { DialogueBasicComponent, DialogueChildComponent, ScriptComponentType } from "./Script";
import { useImageSize } from "./ScriptTable";

import "./ScriptDialogueLine.css";

const DialogueBasicContainer = ({
    component,
    wideScreen,
    children,
}: {
    component: DialogueBasicComponent;
    wideScreen?: boolean;
    children: React.ReactNode;
}) => {
    const { width } = useImageSize(wideScreen ?? false);
    const sizeClass = component.size !== undefined ? `scriptDialogueText-${component.size}` : "";
    const spanText = <span className={sizeClass}>{children}</span>;
    if (component.align) {
        return (
            <div style={{ width: `${width}px`, textAlign: component.align, display: "inline-block" }}>{spanText}</div>
        );
    }
    return spanText;
};

const DialogueBasicContent = (props: { component: DialogueBasicComponent; index?: number }) => {
    const { component } = props;
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
                        <FGOText text={component.text} />
                        <rp>(</rp>
                        <rt>
                            <FGOText text={component.ruby} />
                        </rt>
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
                    <FGOText text={component.text} />
                </em>
            );
        case ScriptComponentType.DIALOGUE_HIDDEN_NAME:
            return <FGOText text={component.trueName} />;
        case ScriptComponentType.DIALOGUE_TEXT:
            return (
                <span className="text-prewrap">
                    <FGOText text={component.text} />
                </span>
            );
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

const DialogueBasic = ({
    component,
    index,
    wideScreen,
}: {
    component: DialogueBasicComponent;
    index?: number;
    wideScreen?: boolean;
}) => {
    return (
        <DialogueBasicContainer component={component} wideScreen={wideScreen}>
            <DialogueBasicContent component={component} index={index}></DialogueBasicContent>
        </DialogueBasicContainer>
    );
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
            <span className="underline">{children}</span>
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

export const DialogueChild = ({
    component,
    index,
    wideScreen,
}: {
    component: DialogueChildComponent;
    index?: number;
    wideScreen?: boolean;
}) => {
    switch (component.type) {
        case ScriptComponentType.DIALOGUE_GENDER:
            const maleComponents = component.male.map((component, i) => (
                <DialogueBasic key={i} component={component} wideScreen={wideScreen} />
            ));
            if (dialogueBasicHasContent(component.female)) {
                const femaleComponents = component.female.map((component, i) => (
                    <DialogueBasic key={i} component={component} wideScreen={wideScreen} />
                ));

                return <DialoguePopover tooltipComponent={femaleComponents}>{maleComponents}</DialoguePopover>;
            } else {
                return <span className="underline">{maleComponents}</span>;
            }
        case ScriptComponentType.DIALOGUE_NEW_LINE:
        case ScriptComponentType.DIALOGUE_PLAYER_NAME:
        case ScriptComponentType.DIALOGUE_LINE:
        case ScriptComponentType.DIALOGUE_RUBY:
        case ScriptComponentType.DIALOGUE_TEXT:
        case ScriptComponentType.DIALOGUE_TEXT_IMAGE:
            return <DialogueBasic component={component} index={index} wideScreen={wideScreen} />;
        default:
            return null;
    }
};

const ScriptDialogueLine = (props: { components: DialogueChildComponent[]; wideScreen?: boolean }) => {
    return (
        <>
            {props.components.map((component, i) => (
                <DialogueChild key={i} component={component} index={i} wideScreen={props.wideScreen} />
            ))}
        </>
    );
};

export default ScriptDialogueLine;
