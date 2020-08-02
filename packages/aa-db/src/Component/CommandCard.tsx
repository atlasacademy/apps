import React from "react";
import Card from "../Api/Data/Card";
import Servant from "../Api/Data/Servant";

import "./CommandCard.css";

const supportedCardTypes = [
    Card.ARTS,
    Card.BUSTER,
    Card.QUICK,
];

interface IProps {
    card: Card;
    servant: Servant;
    npText?: string;
    npTextBottom?: boolean;
    height?: string | number;
    assetType?: string;
    assetId?: string;
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

        const commandBundle = this.props.servant.extraAssets.commands,
            ascensionMap = commandBundle.ascension;

        if (ascensionMap) {
            const assets = Object.values(ascensionMap);

            if (assets.length > 0) {
                return assets[0];
            }
        }

        const firstMap = Object.values(commandBundle).shift();
        if (!firstMap) {
            return undefined;
        }

        return Object.values(firstMap).shift();
    }

    render() {
        if (supportedCardTypes.indexOf(this.props.card) === -1) {
            return <span>[Card: {this.props.card}]</span>;
        }

        const height = this.props.height ?? '1em',
            portrait = this.getPortrait();

        let bg, icon, txt, np = false;

        switch (this.props.card) {
            case Card.ARTS:
                bg = 'assets/card_bg_arts.png';
                icon = 'assets/card_icon_arts.png';
                txt = 'assets/card_txt_arts.png';
                break;
            case Card.BUSTER:
                bg = 'assets/card_bg_buster.png';
                icon = 'assets/card_icon_buster.png';
                txt = 'assets/card_txt_buster.png';
                break;
            case Card.QUICK:
                bg = 'assets/card_bg_quick.png';
                icon = 'assets/card_icon_quick.png';
                txt = 'assets/card_txt_quick.png';
                break;
        }

        if (this.props.npText) {
            txt = this.props.npText;
            np = true;
        }

        return <span className={'command-card'} style={{height: height}}>
            <img alt={''} className={'command-card-ratio'}
                 src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>
            <img alt={''} className={'command-card-bg'} src={bg}/>
            <img alt={''} className={'command-card-portrait'} src={portrait}/>
            <img alt={''} className={'command-card-icon'} src={icon}/>
            {
                np
                    ? <div className={'command-card-text-np' + (this.props.npTextBottom ? ' bottom' : '')}>
                        <img alt={''} src={txt}/>
                    </div>
                    : <img className={'command-card-text-card'} alt={''} src={txt}/>
            }
        </span>;
    }
}

export default CommandCard;
