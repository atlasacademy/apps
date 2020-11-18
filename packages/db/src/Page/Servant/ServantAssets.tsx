import {Entity, Region, Servant} from "@atlasacademy/api-connector";
import React from "react";
import {mergeElements} from "../../Helper/OutputHelper";
import {Alert} from "react-bootstrap";
import renderCollapsibleContent from "../../Component/CollapsibleContent";

interface IProps {
    region: Region;
    servant: Servant.Servant;
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

    render() {
        const charaFigure = (
            <>
                {this.displayAssets(this.props.servant.extraAssets.charaFigure)}
                <br />
                {Object.entries(this.props.servant.extraAssets.charaFigureForm)
                    .map(([form, assetMap]) => (
                        renderCollapsibleContent({ title: `Form ${form}`, content: this.displayAssets(assetMap), subheader: true })
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
                    {content.map(renderCollapsibleContent)}
            </div>
        );
    }
}

export default ServantAssets;
