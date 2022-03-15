import React from "react";

import { Card, Region } from "@atlasacademy/api-connector";
import { CardDescriptor } from "@atlasacademy/api-descriptor";

import Description from "./Description";

interface IProps {
    region: Region;
    card: Card | number;
}

class CardDescription extends React.Component<IProps> {
    static renderAsString(card: Card | number): string {
        const descriptor = CardDescriptor.describe(card);

        return "[" + Description.renderAsString(descriptor) + "]";
    }

    render() {
        const descriptor = CardDescriptor.describe(this.props.card);

        return (
            <span>
                [
                <Description region={this.props.region} descriptor={descriptor} />]
            </span>
        );
    }
}

export default CardDescription;
