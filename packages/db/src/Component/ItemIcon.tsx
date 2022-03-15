import React from "react";

import { Item, Region } from "@atlasacademy/api-connector";

import listframes0_bg from "../Assets/list/listframes0_bg.png";
import listframes1_bg from "../Assets/list/listframes1_bg.png";
import listframes2_bg from "../Assets/list/listframes2_bg.png";
import listframes3_bg from "../Assets/list/listframes3_bg.png";
import listframes4_bg from "../Assets/list/listframes4_bg.png";
import { formatNumber } from "../Helper/OutputHelper";

import "./ItemIcon.css";

const frameBgMap = new Map<Item.ItemBackgroundType, string>([
    [Item.ItemBackgroundType.ZERO, listframes0_bg],
    [Item.ItemBackgroundType.BRONZE, listframes1_bg],
    [Item.ItemBackgroundType.SILVER, listframes2_bg],
    [Item.ItemBackgroundType.GOLD, listframes3_bg],
    [Item.ItemBackgroundType.QUEST_CLEAR_QP_REWARD, listframes4_bg],
]);

interface IProps {
    region: Region;
    item: Item.Item;
    quantity?: number;
    height?: string | number;
    quantityHeight?: string | number;
}

class ItemIcon extends React.Component<IProps> {
    private getQuantity() {
        if (!this.props.quantity) return undefined;

        const int = Math.floor(this.props.quantity),
            quantity = formatNumber(int),
            height = this.props.quantityHeight ?? "1em";

        return (
            <span className={"item-icon-quantity"} style={{ fontSize: height }}>
                {quantity}
            </span>
        );
    }

    render() {
        const bg = frameBgMap.get(this.props.item.background) ?? "listframes0_bg.png",
            height = this.props.height ?? "2em";

        return (
            <span className={"item-icon"} style={{ height: height }}>
                <img
                    alt={""}
                    className={"item-icon-ratio"}
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                />
                <img alt={"Item icon background"} className={"item-icon-bg"} src={bg} />
                <img alt={this.props.item.name} className={"item-icon-image"} src={this.props.item.icon} />
                {this.getQuantity()}
            </span>
        );
    }
}

export default ItemIcon;
