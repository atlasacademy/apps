import {Entity, Region, Servant} from "@atlasacademy/api-connector";
import React from "react";
import {mergeElements} from "../../Helper/OutputHelper";
import {Alert} from "react-bootstrap";
import renderCollapsibleContent from "../../Component/CollapsibleContent";
import IllustratorDescriptor from "../../Descriptor/IllustratorDescriptor";

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

    private flattenStoryAssets(assetMap: Entity.EntityAssetMap | undefined): string[] {
        if (!assetMap)
            return [];

        const assets = [];

        if (assetMap.story)
            assets.push(...Object.values(assetMap.story));

        return assets;
    }

    private displayAssets(assetMap: Entity.EntityAssetMap | undefined, story = false) {
        let assets;
        if (story) {
            assets = this.flattenStoryAssets(assetMap);
        } else {
            assets = this.flattenAssets(assetMap);
        }

        return mergeElements(
            assets.map(asset => <a key={asset} href={asset} target={'_blank'} rel={'noopener noreferrer'}>
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
                        <div key={form}>{renderCollapsibleContent({ title: `Form ${form}`, content: this.displayAssets(assetMap), subheader: true })}</div>
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
                    <IllustratorDescriptor
                        region={this.props.region}
                        illustrator={this.props.servant.profile?.illustrator}/>
                </Alert>
                    {content.map(content => <div key={content.title}>{renderCollapsibleContent(content)}</div>)}
                    {this.props.servant.extraAssets.charaFigure.story ? renderCollapsibleContent({
                        title: "Story Figure (May contain spoilers)",
                        content: (
                            <>
                            {this.displayAssets(this.props.servant.extraAssets.charaFigure, true)}
                            {this.displayAssets(this.props.servant.extraAssets.image, true)}
                            </>
                        ),
                        subheader: false,
                        initialOpen: false
                    }) : ''}
                    <br />
                    {Object.entries(this.props.servant.extraAssets.charaFigureForm)
                        .map(([form, assetMap]) => (<div key={form}>
                            {assetMap.story
                            ? renderCollapsibleContent({
                                title: `Story Figure Form ${form}`,
                                content: this.displayAssets(assetMap, true),
                                subheader: true,
                                initialOpen: false})
                            : null}
                        </div>))
                    }
            </div>
        );
    }
}

export default ServantAssets;
