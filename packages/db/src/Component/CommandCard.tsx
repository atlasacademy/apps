import React from "react";

import { Card, Servant } from "@atlasacademy/api-connector";

import card_bg_arts from "../Assets/card_bg_arts.png";
import card_bg_buster from "../Assets/card_bg_buster.png";
import card_bg_quick from "../Assets/card_bg_quick.png";
import card_icon_arts from "../Assets/card_icon_arts.png";
import card_icon_buster from "../Assets/card_icon_buster.png";
import card_icon_quick from "../Assets/card_icon_quick.png";
import card_txt_arts from "../Assets/card_txt_arts.png";
import card_txt_buster from "../Assets/card_txt_buster.png";
import card_txt_quick from "../Assets/card_txt_quick.png";

import "./CommandCard.css";

const supportedCardTypes = [Card.ARTS, Card.BUSTER, Card.QUICK];

interface IProps {
    card: Card;
    servant: Servant.Servant;
    npText?: string;
    npTextBottom?: boolean;
    height?: string | number;
    assetType?: "ascension" | "costume";
    assetId?: number;
}

class CommandCard extends React.Component<IProps> {
    private getPortrait(): string | undefined {
        if (this.props.assetType && this.props.assetId) {
            const assetMap = this.props.servant.extraAssets.commands[this.props.assetType];
            if (assetMap !== undefined) {
                const asset = assetMap[this.props.assetId];

                return asset ? asset : Object.values(assetMap).pop();
            }
        }

        const commandBundle = this.props.servant.extraAssets.commands;

        if (commandBundle.ascension) {
            const assets = Object.values(commandBundle.ascension);

            if (assets.length > 0) {
                return assets[0];
            }
        }

        if (commandBundle.costume) {
            const assets = Object.values(commandBundle.costume);

            if (assets.length > 0) {
                return assets[0];
            }
        }

        return undefined;
    }

    render() {
        if (supportedCardTypes.indexOf(this.props.card) === -1) {
            return <span>[Card: {this.props.card}]</span>;
        }

        const height = this.props.height ?? "1em",
            portrait = this.getPortrait();

        if (portrait === undefined) return null;

        let bg,
            icon,
            txt,
            np = false;

        switch (this.props.card) {
            case Card.ARTS:
                bg = card_bg_arts;
                icon = card_icon_arts;
                txt = card_txt_arts;
                break;
            case Card.BUSTER:
                bg = card_bg_buster;
                icon = card_icon_buster;
                txt = card_txt_buster;
                break;
            case Card.QUICK:
                bg = card_bg_quick;
                icon = card_icon_quick;
                txt = card_txt_quick;
                break;
        }

        if (this.props.npText) {
            txt = this.props.npText;
            np = true;
        }

        return (
            <span className={"command-card"} style={{ height: height }}>
                <img
                    alt={""}
                    className={"command-card-ratio"}
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                />
                <img alt={`${this.props.card} Card Background`} className={"command-card-bg"} src={bg} />
                <img alt="Servant Portrait" className={"command-card-portrait"} src={portrait} />
                <img alt={`${this.props.card} Card Icon`} className={"command-card-icon"} src={icon} />
                {np ? (
                    <div className={"command-card-text-np" + (this.props.npTextBottom ? " bottom" : "")}>
                        <img alt={`NP Name Text`} src={txt} />
                    </div>
                ) : (
                    <img className={"command-card-text-card"} alt={`${this.props.card} Card Text`} src={txt} />
                )}
            </span>
        );
    }
}

export default CommandCard;
