import React from "react";

import { Entity } from "@atlasacademy/api-connector";

interface IProps {
    type?: Entity.EntityType;
    rarity?: number;
    location: string;
    height?: number | string;
    mightNotExist?: boolean;
}

class FaceIcon extends React.Component<IProps> {
    render() {
        return (
            <img
                alt={""}
                src={this.props.location}
                key={this.props.location}
                width={this.props.mightNotExist ? undefined : 128}
                height={this.props.mightNotExist ? undefined : 128}
                style={{ height: this.props.height ?? "2em", width: "auto" }}
            />
        );
    }
}

export default FaceIcon;
