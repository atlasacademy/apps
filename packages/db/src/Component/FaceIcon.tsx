import {Entity} from "@atlasacademy/api-connector";
import React from "react";

interface IProps {
    type?: Entity.EntityType;
    rarity?: number;
    location: string;
    height?: number | string;
}

class FaceIcon extends React.Component<IProps> {

    render() {
        return (
            <img alt={''} src={this.props.location}
                 style={{height: this.props.height ?? '2em'}}/>
        );
    }

}

export default FaceIcon;
