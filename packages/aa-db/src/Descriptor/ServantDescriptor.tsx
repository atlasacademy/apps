import React from "react";
import {Link} from "react-router-dom";
import Region from "../Api/Data/Region";
import Servant from "../Api/Data/Servant";
import ClassIcon from "../Component/ClassIcon";

interface IProps {
    region: Region;
    servant: Servant;
    iconHeight?: number;
}

class ServantDescriptor extends React.Component<IProps> {
    render() {
        return (
            <Link to={`/${this.props.region}/servant/${this.props.servant.id}`}>
                <ClassIcon className={this.props.servant.className}
                           rarity={this.props.servant.rarity}
                           height={this.props.iconHeight}/>
                {' '}
                {this.props.servant.name}
            </Link>
        );
    }
}

export default ServantDescriptor;
