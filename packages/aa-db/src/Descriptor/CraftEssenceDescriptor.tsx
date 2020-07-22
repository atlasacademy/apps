import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Link} from "react-router-dom";
import CraftEssence from "../Api/Data/CraftEssence";
import Region from "../Api/Data/Region";
import FaceIcon from "../Component/FaceIcon";

interface IProps {
    region: Region;
    craftEssence: CraftEssence;
}

class CraftEssenceDescriptor extends React.Component<IProps> {
    render() {
        return (
            <Link to={`/${this.props.region}/craft-essence/${this.props.craftEssence.collectionNo}`}>
                <FaceIcon type={this.props.craftEssence.type}
                          rarity={this.props.craftEssence.rarity}
                          location={this.props.craftEssence.extraAssets.faces.equip[this.props.craftEssence.id] ?? ''}
                          height={'2em'}/>
                {' '}
                {this.props.craftEssence.name}
                {' '}
                <FontAwesomeIcon icon={faShare}/>
            </Link>
        );
    }
}

export default CraftEssenceDescriptor;
