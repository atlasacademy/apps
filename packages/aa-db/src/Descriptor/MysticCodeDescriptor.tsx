import React from "react";
import {Link} from "react-router-dom";
import MysticCode from "../Api/Data/MysticCode";
import Region from "../Api/Data/Region";

interface IProps {
    region: Region;
    mysticCode: MysticCode;
}

class MysticCodeDescriptor extends React.Component<IProps> {
    render() {
        return (
            <Link to={`/${this.props.region}/mystic-code/${this.props.mysticCode.id}`}>
                [{this.props.mysticCode.name}]
            </Link>
        );
    }
}

export default MysticCodeDescriptor;
