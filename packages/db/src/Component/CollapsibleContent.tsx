import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Accordion, AccordionContext, Card } from "react-bootstrap";

import { Renderable } from "../Helper/OutputHelper";

import "./CollapsibleContent.css";

export function ArrowToggle({ eventKey }: { eventKey: string }) {
    const currentKey = useContext(AccordionContext);
    const rotateClass = currentKey === eventKey ? "collapsible-header-rotate-arrow" : "";
    return <FontAwesomeIcon className={`collapsible-header-collapse-actions ${rotateClass}`} icon={faChevronDown} />;
}

export default function CollapsibleContent({
    title,
    content,
    subheader,
    separator,
    initialOpen,
    accordionKey,
    enableBottomMargin,
}: {
    title: Renderable;
    content: Renderable;
    subheader: boolean;
    separator?: boolean;
    initialOpen?: boolean;
    accordionKey?: string;
    enableBottomMargin?: boolean;
}) {
    if (initialOpen === undefined) initialOpen = true;
    if (separator === undefined) separator = true;
    const eventKey = accordionKey ?? `${title}`;
    return (
        <Accordion defaultActiveKey={initialOpen ? eventKey : ""}>
            <Card className="collapsible-card">
                {separator && <hr className="collapsible-header-separator" />}
                <Accordion.Toggle className="collapsible-header" as="div" eventKey={eventKey}>
                    {subheader ? (
                        <h4 className="collapsible-header-title">{title}</h4>
                    ) : (
                        <h3 className="collapsible-header-title">{title}</h3>
                    )}
                    <span className="collapsible-header-arrow">
                        <ArrowToggle eventKey={eventKey} />
                    </span>
                </Accordion.Toggle>
                {/* 2 px to align the hr line with the start of content */}
                <Accordion.Collapse eventKey={eventKey}>
                    <div style={{ marginTop: "2px", marginBottom: enableBottomMargin === false ? "unset" : "1em" }}>
                        {content}
                    </div>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
}

export const CollapsibleLight = ({
    title,
    content,
    eventKey,
    defaultActiveKey,
    mountOnEnter,
    border,
}: {
    title: Renderable;
    content: Renderable;
    eventKey: string;
    defaultActiveKey: string;
    mountOnEnter?: boolean;
    border?: string;
}) => {
    return (
        <Accordion defaultActiveKey={defaultActiveKey}>
            <Card className="collapsible-card" border={border}>
                <Accordion.Toggle as="div" className="collapsible-header-tight" eventKey={eventKey}>
                    <span className="collapsible-header-title">{title}</span>
                    <span className="collapsible-header-arrow">
                        <ArrowToggle eventKey={eventKey} />
                    </span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={eventKey} mountOnEnter={mountOnEnter}>
                    <>{content}</>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
};
