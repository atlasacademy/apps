import React from "react";

import { Item, Region } from "@atlasacademy/api-connector";
import { ItemDescriptor } from "@atlasacademy/api-descriptor";

import { mergeElements } from "../Helper/OutputHelper";

interface IProps {
    region: Region;
    item: Item.Item;
}

class ItemUseDescription extends React.Component<IProps> {
    render() {
        let itemUseDescriptions = [];
        const { uses } = this.props.item;
        for (let use of uses) {
            if (use === Item.ItemUse.SKILL && uses.includes(Item.ItemUse.ASCENSION)) {
                itemUseDescriptions.push(ItemDescriptor.describeUse("skill & ascension"));
                continue;
            }
            if (use === Item.ItemUse.ASCENSION && uses.includes(Item.ItemUse.SKILL)) continue;

            itemUseDescriptions.push(ItemDescriptor.describeUse(use));
        }
        return (
            <div>
                {mergeElements(
                    itemUseDescriptions.map((use) => <span>{use}</span>),
                    ", "
                )}
            </div>
        );
    }
}

export default ItemUseDescription;
