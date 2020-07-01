import React from "react";
import {Link} from "react-router-dom";
import Buff, {BuffType} from "../Api/Data/Buff";
import {hasTraitId} from "../Helper/TraitHelper";
import BuffIcon from "./BuffIcon";

interface IProps {
    buff: Buff;
}

class BuffDescription extends React.Component<IProps>{
    render() {
        const buff = this.props.buff;

        let description = buff.name;
        if (buff.type === BuffType.DONOT_ACT) {
            if (hasTraitId(buff.vals, 3012)) {
                description = 'Charm';
            }
        }

        return (
            <Link to={`/buff/${buff.id}`}>
                [{description} <BuffIcon location={buff.icon}/>]
            </Link>
        );
    }
}

export default BuffDescription;
