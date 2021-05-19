import {CraftEssence, Entity, Region} from "@atlasacademy/api-connector";
import React from "react";
import {Link} from "react-router-dom";
import {mergeElements} from "../../Helper/OutputHelper";
import {Alert} from "react-bootstrap";

interface IProps {
    region: Region;
    craftEssence: CraftEssence.CraftEssence;
}

class CraftEssenceAssets extends React.Component<IProps> {
    private flattenAssets(assetMap: Entity.EntityAssetMap | undefined): string[] {
        if (!assetMap)
            return [];

        const assets = [];

        if (assetMap.equip)
            assets.push(...Object.values(assetMap.equip));

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
        return (
            <div>
                <Alert variant="success">
                    Illustrator:&nbsp;
                    <Link to={`/${this.props.region}/entities?illustrator=${this.props.craftEssence.profile?.illustrator}`}>
                        {this.props.craftEssence.profile?.illustrator}
                    </Link>
                </Alert>
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
