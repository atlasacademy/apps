import {Region, Servant} from "@atlasacademy/api-connector";
import {ServantAssetMap} from "@atlasacademy/api-connector/dist/Schema/Servant";
import React from "react";
import {mergeElements} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    servant: Servant;
}

class ServantAssets extends React.Component<IProps> {
    private flattenAssets(assetMap: ServantAssetMap | undefined): string[] {
        if (!assetMap)
            return [];

        const assets = [];

        if (assetMap.ascension)
            assets.push(...Object.values(assetMap.ascension));

        if (assetMap.costume)
            assets.push(...Object.values(assetMap.costume));

        return assets;
    }

    private displayAssets(assetMap: ServantAssetMap | undefined) {
        const assets = this.flattenAssets(assetMap);

        return mergeElements(
            assets.map(asset => <a href={asset} target={'_blank'} rel={'noopener noreferrer'}>
                <img alt={''} src={asset} style={{maxWidth: "100%"}}/>
            </a>),
            ''
        );
    }

    render() {
        return (
            <div>
                <h3>Portraits</h3>
                <div>
                    {this.displayAssets(this.props.servant.extraAssets.charaGraph)}
                </div>

                <hr/>

                <h3>Status</h3>
                <div>
                    {this.displayAssets(this.props.servant.extraAssets.status)}
                </div>

                <hr/>

                <h3>Command</h3>
                <div>
                    {this.displayAssets(this.props.servant.extraAssets.commands)}
                </div>

                <hr/>

                <h3>Thumbnail</h3>
                <div>
                    {this.displayAssets(this.props.servant.extraAssets.faces)}
                </div>
            </div>
        );
    }
}

export default ServantAssets;
