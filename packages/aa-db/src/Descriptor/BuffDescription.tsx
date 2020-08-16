import {Buff, Region} from "@atlasacademy/api-connector";
import {BuffDescriptor} from "@atlasacademy/api-descriptor";
import React from "react";
import {Link} from "react-router-dom";
import BuffIcon from "../Component/BuffIcon";
import Description from "./Description";

interface IProps {
    region: Region;
    buff: Buff.Buff;
}

class BuffDescription extends React.Component<IProps> {
    render() {
        const buff = this.props.buff,
            descriptor = BuffDescriptor.describe(this.props.buff);

        return (
            <Link to={`/${this.props.region}/buff/${buff.id}`}>
                [
                {buff.icon ? <BuffIcon location={buff.icon}/> : undefined}
                {buff.icon ? ' ' : undefined}
                <Description region={this.props.region} descriptor={descriptor}/>
                ]
            </Link>
        );
    }
}

export default BuffDescription;
