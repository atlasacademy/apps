import { useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

import { Region } from "@atlasacademy/api-connector";

import { FGOText } from "../Helper/StringHelper";
import { useImageSize } from "../Hooks/useImageSize";
import { lang } from "../Setting/Manager";
import { DialogueBasicComponent, DialogueChildComponent, ScriptComponentType } from "./Script";

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

const DialogueBasicContent = ({
    region,
    component,
    index,
}: {
    region: Region;
    component: DialogueBasicComponent;
    index?: number;
}) => {
    switch (component.type) {
        case ScriptComponentType.DIALOGUE_NEW_LINE:
            if (index !== 0) {
                return <br />;
            } else {
                return null;
            }
        case ScriptComponentType.DIALOGUE_PLAYER_NAME:
            switch (region) {
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
    region,
    component,
    index,
    wideScreen,
}: {
    region: Region;
    component: DialogueBasicComponent;
    index?: number;
    wideScreen?: boolean;
}) => {
    return (
        <DialogueBasicContainer component={component} wideScreen={wideScreen}>
            <DialogueBasicContent region={region} component={component} index={index}></DialogueBasicContent>
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
    const [showPopover, setShowPopover] = useState(false);
    const setShowPopOverHandler = (isOpen: boolean) => () => setShowPopover(isOpen);

    const malePopover = (props: any) => (
        <Popover
            onMouseEnter={setShowPopOverHandler(true)}
            onMouseLeave={setShowPopOverHandler(false)}
            lang={lang()}
            {...props}
        >
            <Popover.Title>Male Dialogue</Popover.Title>
            <Popover.Content>{tooltipComponent}</Popover.Content>
        </Popover>
    );

    return (
        <OverlayTrigger
            show={showPopover}
            placement="top"
            trigger={[]}
            delay={{ show: 250, hide: 400 }}
            overlay={malePopover}
        >
            <span
                className="underline"
                onMouseEnter={setShowPopOverHandler(true)}
                onMouseLeave={setShowPopOverHandler(false)}
            >
                {children}
            </span>
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
    region,
    component,
    index,
    wideScreen,
}: {
    region: Region;
    component: DialogueChildComponent;
    index?: number;
    wideScreen?: boolean;
}) => {
    switch (component.type) {
        case ScriptComponentType.DIALOGUE_GENDER:
            const maleComponents = component.male.map((component, i) => (
                <DialogueBasic key={i} region={region} component={component} wideScreen={wideScreen} />
            ));

            if (dialogueBasicHasContent(component.female)) {
                const femaleComponents = component.female.map((component, i) => (
                    <DialogueBasic key={i} region={region} component={component} wideScreen={wideScreen} />
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
            return <DialogueBasic region={region} component={component} index={index} wideScreen={wideScreen} />;
        default:
            return null;
    }
};

const ScriptDialogueLine = (props: { region: Region; components: DialogueChildComponent[]; wideScreen?: boolean }) => {
    return (
        <>
            {props.components.map((component, i) => (
                <DialogueChild
                    key={i}
                    region={props.region}
                    component={component}
                    index={i}
                    wideScreen={props.wideScreen}
                />
            ))}
        </>
    );
};

export default ScriptDialogueLine;
