import {useContext} from "react";
import {Accordion, AccordionContext, Card} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import {Renderable} from "../Helper/OutputHelper";
import "./CollapsibleContent.css";

function ArrowToggle({ eventKey } : { eventKey: string }) {
    const currentKey = useContext(AccordionContext);
    return <FontAwesomeIcon className="collapsible-header-collapse-actions" icon={(currentKey === eventKey) ? faChevronUp : faChevronDown} />
}

function renderCollapsibleContent(
    { title, content, subheader, separator, initialOpen } :
    { title: Renderable, content: Renderable, subheader: boolean, separator?: boolean, initialOpen?: boolean },
    enableBottomMargin = true
) {
    if (initialOpen === undefined) initialOpen = true;
    if (separator === undefined) separator = true;
    return (
        <Accordion defaultActiveKey={initialOpen ? `${title}` : ''}>
            <Card border="light" className="collapsible-card">
                {separator && <hr className="collapsible-header-separator" />}
                <Accordion.Toggle className="collapsible-header" as="div" eventKey={`${title}`}>
                    {subheader ? <h4 style={{ marginBottom: 0 }}>{title}</h4> : <h3 style={{ marginBottom: 0 }}>{title}</h3>}
                    <span style={{ textAlign: 'right', alignSelf: 'center', marginRight: '1em' }}><ArrowToggle eventKey={`${title}`}/></span>
                </Accordion.Toggle>
                {/* 2 px to align the hr line with the start of content */}
                <Accordion.Collapse eventKey={`${title}`}>
                    <div style={{ marginTop: '2px', marginBottom: enableBottomMargin ? '1em' : 'unset' }}>{content}</div>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default renderCollapsibleContent;