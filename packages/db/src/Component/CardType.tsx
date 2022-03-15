import React from "react";

import Card from "@atlasacademy/api-connector/dist/Enum/Card";

import card_icon_arts from "../Assets/card_icon_arts.png";
import card_icon_buster from "../Assets/card_icon_buster.png";
import card_icon_quick from "../Assets/card_icon_quick.png";
import card_txt_arts from "../Assets/card_txt_arts.png";
import card_txt_buster from "../Assets/card_txt_buster.png";
import card_txt_extra from "../Assets/card_txt_extra.png";
import card_txt_quick from "../Assets/card_txt_quick.png";

import "./CardType.css";

const supportedCardTypes = [Card.ARTS, Card.BUSTER, Card.QUICK, Card.EXTRA];

interface IProps {
    card: Card;
    height?: string | number;
}

class CardType extends React.Component<IProps> {
    render() {
        if (supportedCardTypes.indexOf(this.props.card) === -1) {
            return `[Card: ${this.props.card}]`;
        }

        const height = this.props.height ?? "2em",
            classNames = ["card-type"];

        let icon = undefined,
            txt = undefined;

        switch (this.props.card) {
            case Card.ARTS:
                icon = card_icon_arts;
                txt = card_txt_arts;
                break;
            case Card.BUSTER:
                icon = card_icon_buster;
                txt = card_txt_buster;
                break;
            case Card.QUICK:
                icon = card_icon_quick;
                txt = card_txt_quick;
                break;
            case Card.EXTRA:
                classNames.push("extra");
                txt = card_txt_extra;
                break;
        }

        return (
            <span className={classNames.join(" ")} style={{ height: height }}>
                <img
                    alt={""}
                    className={"card-type-ratio"}
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                />
                {icon ? <img alt={`${this.props.card} Card Icon`} className={"card-type-icon"} src={icon} /> : null}
                <img alt={`${this.props.card} Card Text`} className={"card-type-text"} src={txt} />
            </span>
        );
    }
}

export default CardType;
