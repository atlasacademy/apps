import React from "react";
import Region from "../../Api/Data/Region";
import Servant from "../../Api/Data/Servant";
import {mergeElements} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    servant: Servant;
}

class ServantAssets extends React.Component<IProps>{
    private flattenAssetMap(type: string): string[] {
        const assetBundle = this.props.servant.extraAssets[type];
        if (!assetBundle)
            return [];

        const assets : string[] = [];

        Object.values(assetBundle).forEach(assetMap => {
            if (!assetMap)
                return;

            Object.values(assetMap).forEach(asset => {
                if (!asset)
                    return;

                assets.push(asset)
            });
        });

        return assets;
    }

    private displayAssets(key: string) {
        const assets = this.flattenAssetMap(key);

        return mergeElements(
            assets.map(asset => <a href={asset} target={'_blank'} rel={'noopener noreferrer'}>
                <img alt={''} src={asset}/>
            </a>),
            ''
        );
    }

    render() {
        return (
            <div>
                <h3>Portraits</h3>
                <div>
                    {this.displayAssets('charaGraph')}
                </div>

                <hr/>

                <h3>Status</h3>
                <div>
                    {this.displayAssets('status')}
                </div>

                <hr/>

                <h3>Command</h3>
                <div>
                    {this.displayAssets('commands')}
                </div>

                <hr/>

                <h3>Thumbnail</h3>
                <div>
                    {this.displayAssets('faces')}
                </div>
            </div>
        );
    }
}

export default ServantAssets;
