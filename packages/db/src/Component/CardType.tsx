import Card from "@atlasacademy/api-connector/dist/Enum/Card";
import React from "react";

import "./CardType.css";

const supportedCardTypes = [
    Card.ARTS,
    Card.BUSTER,
    Card.QUICK,
    Card.EXTRA,
];

interface IProps {
    card: Card;
    height?: string | number;
}

class CardType extends React.Component<IProps> {
    render() {
        if (supportedCardTypes.indexOf(this.props.card) === -1) {
            return `[Card: ${this.props.card}]`;
        }

        const height = this.props.height ?? '2em',
            classNames = ['card-type'];

        let icon = undefined,
            txt = undefined;

        switch (this.props.card) {
            case Card.ARTS:
                icon = 'assets/card_icon_arts.png';
                txt = 'assets/card_txt_arts.png';
                break;
            case Card.BUSTER:
                icon = 'assets/card_icon_buster.png';
                txt = 'assets/card_txt_buster.png';
                break;
            case Card.QUICK:
                icon = 'assets/card_icon_quick.png';
                txt = 'assets/card_txt_quick.png';
                break;
            case Card.EXTRA:
                classNames.push('extra');
                txt = 'assets/card_txt_extra.png';
                break;
        }

        return <span className={classNames.join(' ')} style={{height: height}}>
            <img alt={''} className={'card-type-ratio'}
                 src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>
            {icon ? <img alt={''} className={'card-type-icon'} src={icon}/> : null}
            <img alt={''} className={'card-type-text'} src={txt}/>
        </span>;
    }
}

export default CardType;
