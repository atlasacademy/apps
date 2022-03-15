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

function renderCollapsibleContent(
    {
        title,
        content,
        subheader,
        separator,
        initialOpen,
    }: { title: Renderable; content: Renderable; subheader: boolean; separator?: boolean; initialOpen?: boolean },
    enableBottomMargin = true
) {
    if (initialOpen === undefined) initialOpen = true;
    if (separator === undefined) separator = true;
    return (
        <Accordion defaultActiveKey={initialOpen ? `${title}` : ""}>
            <Card className="collapsible-card">
                {separator && <hr className="collapsible-header-separator" />}
                <Accordion.Toggle className="collapsible-header" as="div" eventKey={`${title}`}>
                    {subheader ? (
                        <h4 className="collapsible-header-title">{title}</h4>
                    ) : (
                        <h3 className="collapsible-header-title">{title}</h3>
                    )}
                    <span className="collapsible-header-arrow">
                        <ArrowToggle eventKey={`${title}`} />
                    </span>
                </Accordion.Toggle>
                {/* 2 px to align the hr line with the start of content */}
                <Accordion.Collapse eventKey={`${title}`}>
                    <div style={{ marginTop: "2px", marginBottom: enableBottomMargin ? "1em" : "unset" }}>
                        {content}
                    </div>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
}

export default renderCollapsibleContent;

export const CollapsibleLight = ({
    title,
    content,
    eventKey,
    defaultActiveKey,
}: {
    title: Renderable;
    content: Renderable;
    eventKey: string;
    defaultActiveKey: string;
}) => {
    return (
        <Accordion defaultActiveKey={defaultActiveKey}>
            <Card className="collapsible-card">
                <Accordion.Toggle as="div" className="collapsible-header-tight" eventKey={eventKey}>
                    <span className="collapsible-header-title">{title}</span>
                    <span className="collapsible-header-arrow">
                        <ArrowToggle eventKey={eventKey} />
                    </span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={eventKey}>
                    <>{content}</>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
};
