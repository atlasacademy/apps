import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Link} from "react-router-dom";
import CraftEssence from "../Api/Data/CraftEssence";
import Region from "../Api/Data/Region";

interface IProps {
    region: Region;
    craftEssence: CraftEssence;
}

class CraftEssenceDescriptor extends React.Component<IProps> {
    render() {
        return (
            <Link to={`/${this.props.region}/craft-essence/${this.props.craftEssence.id}`}>
                {this.props.craftEssence.name}
                {' '}
                <FontAwesomeIcon icon={faShare} />
            </Link>
        );
    }
}

export default CraftEssenceDescriptor;
