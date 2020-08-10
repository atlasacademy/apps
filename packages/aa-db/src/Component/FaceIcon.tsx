import EntityType from "@atlasacademy/api-connector/dist/Enum/EntityType";
import React from "react";

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
