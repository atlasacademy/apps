import React from "react";

const assetMap = new Map<number, string>([
    [1, './assets/star1.png'],
    [2, './assets/star2.png'],
    [3, './assets/star3.png'],
    [4, './assets/star4.png'],
    [5, './assets/star5.png'],
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
                    <img alt={`${this.props.rarity} star(s)`}
                         src={assetMap.get(this.props.rarity)}
                         style={{height: this.props.height ?? 18}}/>
                ) : null}
            </span>
        );
    }
}

export default RarityDescriptor;
