import React from "react";

import star1 from "../Assets/star1.png";
import star2 from "../Assets/star2.png";
import star3 from "../Assets/star3.png";
import star4 from "../Assets/star4.png";
import star5 from "../Assets/star5.png";

const assetMap = new Map<number, { location: string; width: number; height: number }>([
    [1, { location: star1, width: 21, height: 20 }],
    [2, { location: star2, width: 33, height: 20 }],
    [3, { location: star3, width: 45, height: 20 }],
    [4, { location: star4, width: 57, height: 20 }],
    [5, { location: star5, width: 69, height: 20 }],
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
                        src={assetMap.get(this.props.rarity)!.location}
                        width={assetMap.get(this.props.rarity)!.width}
                        height={assetMap.get(this.props.rarity)!.height}
                        style={{ height: this.props.height ?? 18 }}
                    />
                ) : null}
            </span>
        );
    }
}

export default RarityDescriptor;
