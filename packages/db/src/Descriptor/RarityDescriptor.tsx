import React from "react";

import star1 from "../Assets/star1.png";
import star2 from "../Assets/star2.png";
import star3 from "../Assets/star3.png";
import star4 from "../Assets/star4.png";
import star5 from "../Assets/star5.png";

const assetMap = new Map<number, string>([
    [1, star1],
    [2, star2],
    [3, star3],
    [4, star4],
    [5, star5],
]);

interface IProps {
    rarity: number;
    height?: number;
}

class RarityDescriptor extends React.Component<IProps> {
    render() {
        return (
            <span>
                {assetMap.has(this.props.rarity) ? (
                    <img
                        alt={`${this.props.rarity} star(s)`}
                        src={assetMap.get(this.props.rarity)}
                        style={{ height: this.props.height ?? 18 }}
                    />
                ) : null}
            </span>
        );
    }
}

export default RarityDescriptor;
