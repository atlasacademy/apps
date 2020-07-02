import React from "react";
import {Link} from "react-router-dom";
import Buff, {BuffType} from "../Api/Data/Buff";
import Region from "../Api/Data/Region";
import BuffIcon from "../Component/BuffIcon";

interface IProps {
    region: Region;
    buff: Buff;
}

class BuffDescriptor extends React.Component<IProps>{
    render() {
        const buff = this.props.buff;

        let description = buff.name;
        if (buff.type === BuffType.DONOT_ACT) {
            if (buff.vals.filter(trait => trait.id === 3012).length > 0) {
                description = 'Charm';
            }
        }

        return (
            <Link to={`/${this.props.region}/buff/${buff.id}`}>
                [{description} <BuffIcon location={buff.icon}/>]
            </Link>
        );
    }
}

export default BuffDescriptor;
