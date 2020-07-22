import React from "react";
import EntityType from "../Api/Data/EntityType";

interface IProps {
    type?: EntityType;
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
