import {CraftEssence, Entity, Region} from "@atlasacademy/api-connector";
import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Link} from "react-router-dom";
import FaceIcon from "../Component/FaceIcon";

interface IProps {
    region: Region;
    craftEssence: CraftEssence.CraftEssence;
}

class CraftEssenceDescriptor extends React.Component<IProps> {
    render() {
        const assetMap = this.props.craftEssence.extraAssets.faces.equip,
            asset = assetMap ? assetMap[this.props.craftEssence.id] : undefined;

        return (
            <Link to={`/${this.props.region}/craft-essence/${this.props.craftEssence.collectionNo}`}>
                {asset ? (
                    <FaceIcon type={Entity.EntityType.SERVANT_EQUIP}
                              rarity={this.props.craftEssence.rarity}
                              location={asset}
                              height={'2em'}/>
                ) : undefined}
                {asset ? ' ' : undefined}
                {this.props.craftEssence.name}
                {' '}
                <FontAwesomeIcon icon={faShare}/>
            </Link>
        );
    }
}

export default CraftEssenceDescriptor;
