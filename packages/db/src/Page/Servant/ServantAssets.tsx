import {Entity, Region, Servant} from "@atlasacademy/api-connector";
import React, {useContext} from "react";
import {mergeElements, Renderable} from "../../Helper/OutputHelper";
import {Accordion, AccordionContext, Alert, Card} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

import "./ServantAssets.css";

interface IProps {
    region: Region;
    servant: Servant.Servant;
}

function ArrowToggle({ eventKey } : { eventKey: string }) {
    const currentKey = useContext(AccordionContext);
    return <FontAwesomeIcon className="assets-header-collapse-actions" icon={(currentKey === eventKey) ? faChevronUp : faChevronDown} />
}

class ServantAssets extends React.Component<IProps> {
    private flattenAssets(assetMap: Entity.EntityAssetMap | undefined): string[] {
        if (!assetMap)
            return [];

        const assets = [];

        if (assetMap.ascension)
            assets.push(...Object.values(assetMap.ascension));

        if (assetMap.costume)
            assets.push(...Object.values(assetMap.costume));

        return assets;
    }

    private displayAssets(assetMap: Entity.EntityAssetMap | undefined) {
        const assets = this.flattenAssets(assetMap);

        return mergeElements(
            assets.map(asset => <a href={asset} target={'_blank'} rel={'noopener noreferrer'}>
                <img alt={''} src={asset} style={{maxWidth: "100%"}}/>
            </a>),
            ''
        );
    }

    private renderCollapsibleContent({ title, content, subheader } : { title: Renderable, content: Renderable, subheader: boolean }) {
        return (
            <Accordion defaultActiveKey={`${title}`}>
                <Card border="light" className="assets-card">  
                    <hr className="assets-header-separator" />
                    <Accordion.Toggle className="assets-header" as="div" eventKey={`${title}`}>
                        {subheader ? <h5 style={{ display: "inline" }}>{title}</h5> : <h3 style={{ display: 'inline' }}>{title}</h3>}
                        <span style={{ flexGrow: 1, float: "right" }}><ArrowToggle eventKey={`${title}`}/></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={`${title}`}>
                        <div>{content}</div>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        )
    }

    render() {
        const charaFigure = (
            <>
                {this.displayAssets(this.props.servant.extraAssets.charaFigure)}
                <br />
                {Object.entries(this.props.servant.extraAssets.charaFigureForm)
                    .map(([form, assetMap]) => (
                        this.renderCollapsibleContent({ title: `Form ${form}`, content: this.displayAssets(assetMap), subheader: true })
                    ))
                }
            </>
        )
        const content = [
            { title: "Portraits", content: this.displayAssets(this.props.servant.extraAssets.charaGraph) },
            { title: "Status", content: this.displayAssets(this.props.servant.extraAssets.status) },
            { title: "Command", content: this.displayAssets(this.props.servant.extraAssets.commands) },
            { title: "Formation", content: this.displayAssets(this.props.servant.extraAssets.narrowFigure) },
            { title: "Thumbnail", content: this.displayAssets(this.props.servant.extraAssets.faces) },
            { title: "Figure", content: charaFigure }
        ].map(a => Object.assign({}, a, { subheader: false }));
        return (
            <div>
                <Alert variant="success">
                    Illustrator :&nbsp;
                    {this.props.servant.profile?.illustrator}
                </Alert>
                    {content.map(this.renderCollapsibleContent.bind(this))}
            </div>
        );
    }
}

export default ServantAssets;
