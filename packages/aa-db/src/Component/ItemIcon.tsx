import React from "react";
import Item, {ItemBackgroundType} from "../Api/Data/Item";
import Region from "../Api/Data/Region";
import {formatNumber} from "../Helper/OutputHelper";

import "./ItemIcon.css";

const frameBgMap = new Map<ItemBackgroundType, string>([
    [ItemBackgroundType.ZERO, 'assets/list/listframes0_bg.png'],
    [ItemBackgroundType.BRONZE, 'assets/list/listframes1_bg.png'],
    [ItemBackgroundType.SILVER, 'assets/list/listframes2_bg.png'],
    [ItemBackgroundType.GOLD, 'assets/list/listframes3_bg.png'],
    [ItemBackgroundType.QUEST_CLEAR_QP_REWARD, 'assets/list/listframes4_bg.png'],
]);

interface IProps {
    region: Region;
    item: Item,
    quantity?: number;
    height?: string | number;
    quantityHeight?: string | number;
}

class ItemIcon extends React.Component<IProps> {
    private getQuantity() {
        if (!this.props.quantity)
            return undefined;

        const int = Math.floor(this.props.quantity),
            quantity = formatNumber(int),
            height = this.props.quantityHeight ?? '1em';

        return <span className={'item-icon-quantity'} style={{fontSize: height}}>{quantity}</span>;
    }

    render() {
        const bg = frameBgMap.get(this.props.item.background) ?? 'listframes0_bg.png',
            height = this.props.height ?? '2em';

        return (
            <span className={'item-icon'} style={{height: height}}>
                <img alt={''} className={'item-icon-ratio'}
                     src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"/>
                <img alt={''} className={'item-icon-bg'} src={bg}/>
                <img alt={''} className={'item-icon-image'} src={this.props.item.icon}/>
                {this.getQuantity()}
            </span>
        );
    }
}

export default ItemIcon;
