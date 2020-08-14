import {CraftEssence, Region} from "@atlasacademy/api-connector";
import {EntityAssetMap} from "@atlasacademy/api-connector/dist/Schema/BaseEntity";
import React from "react";
import {mergeElements} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    craftEssence: CraftEssence;
}

class CraftEssenceAssets extends React.Component<IProps> {
    private flattenAssets(assetMap: EntityAssetMap | undefined): string[] {
        if (!assetMap)
            return [];

        const assets = [];

        if (assetMap.equip)
            assets.push(...Object.values(assetMap.equip));

        return assets;
    }

    private displayAssets(assetMap: EntityAssetMap | undefined) {
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
                    {this.displayAssets(this.props.craftEssence.extraAssets.charaGraph)}
                </div>

                <hr/>

                <h3>Formation</h3>
                <div>
                    {this.displayAssets(this.props.craftEssence.extraAssets.equipFace)}
                </div>

                <hr/>

                <h3>Thumbnail</h3>
                <div>
                    {this.displayAssets(this.props.craftEssence.extraAssets.faces)}
                </div>
            </div>
        );
    }
}

export default CraftEssenceAssets;
