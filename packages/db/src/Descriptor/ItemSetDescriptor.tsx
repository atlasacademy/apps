import { Item, Region, Shop } from "@atlasacademy/api-connector";

import EntityReferenceDescriptor from "../Descriptor/EntityReferenceDescriptor";
import { IconDescriptorMap } from "../Descriptor/ItemDescriptor";

const ItemSetDescriptor = (props: { region: Region; itemSet: Shop.ItemSet; itemMap: Map<number, Item.Item> }) => {
    const region = props.region,
        itemSet = props.itemSet;
    switch (itemSet.purchaseType) {
        case Shop.PurchaseType.ITEM:
            return (
                <>
                    <IconDescriptorMap region={region} itemId={itemSet.targetId} height={40} items={props.itemMap} /> x
                    {itemSet.setNum}
                </>
            );
        case Shop.PurchaseType.SERVANT:
            return (
                <>
                    <EntityReferenceDescriptor region={region} svtId={itemSet.targetId} /> x{itemSet.setNum}
                </>
            );
        // case Shop.PurchaseType.EVENT_SHOP:
        // case Shop.PurchaseType.ITEM_AS_PRESENT:
        // case Shop.PurchaseType.GIFT:
        default:
            return (
                <>
                    {itemSet.purchaseType} {itemSet.targetId} {itemSet.setNum}
                </>
            );
    }
};

export default ItemSetDescriptor;
