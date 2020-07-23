import React from "react";
import {Link} from "react-router-dom";
import MysticCode from "../Api/Data/MysticCode";
import Region from "../Api/Data/Region";
import FaceIcon from "../Component/FaceIcon";

interface IProps {
    region: Region;
    mysticCode: MysticCode;
}

class MysticCodeDescriptor extends React.Component<IProps> {
    render() {
        return (
            <Link to={`/${this.props.region}/mystic-code/${this.props.mysticCode.id}`}>
                <FaceIcon location={this.props.mysticCode.extraAssets.item.male}/>
                <FaceIcon location={this.props.mysticCode.extraAssets.item.female}/>
                {' '}
                [{this.props.mysticCode.name}]
            </Link>
        );
    }
}

export default MysticCodeDescriptor;
