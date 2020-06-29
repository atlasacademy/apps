import React from "react";

interface IProps {
    rarity: number;
}

const fillChars = function (count: number, character: string): string {
    return (new Array(count)).fill(null).map(v => character).join('');
}

class RarityStars extends React.Component<IProps> {
    render() {
        return (
            <div>
                {
                    fillChars(this.props.rarity, '★')
                    + fillChars(5 - this.props.rarity, '☆')
                }
            </div>
        );
    }
}

export default RarityStars;
