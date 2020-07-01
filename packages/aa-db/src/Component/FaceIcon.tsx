import React from "react";
import EntityType from "../Api/Data/EntityType";

interface IProps {
    type: EntityType;
    rarity: number;
    location: string;
    height?: number;
}

class FaceIcon extends React.Component<IProps> {

    render() {
        return (
            <img alt={''} src={this.props.location}
                 style={this.props.height ? {height: this.props.height} : undefined}/>
        );
    }

}

export default FaceIcon;
