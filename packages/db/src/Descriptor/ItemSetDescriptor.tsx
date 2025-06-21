import { Item, Region, Shop } from "@atlasacademy/api-connector";

import EntityReferenceDescriptor from "../Descriptor/EntityReferenceDescriptor";
import { IconDescriptorMap, ItemDescriptorId } from "../Descriptor/ItemDescriptor";

const ItemSetDescriptor = (props: { region: Region; itemSet: Shop.ItemSet; itemMap: Map<number, Item.Item> }) => {
    const region = props.region;
    const itemSet = props.itemSet;

    switch (itemSet.purchaseType) {
        case Shop.PurchaseType.ITEM:
            return (
                <>
                    <IconDescriptorMap region={region} itemId={itemSet.targetId} height={40} items={props.itemMap} /> ×
                    {itemSet.setNum}
                </>
            );
        case Shop.PurchaseType.SERVANT:
            return (
                <>
                    <EntityReferenceDescriptor region={region} svtId={itemSet.targetId} /> ×{itemSet.setNum}
                </>
            );
        case Shop.PurchaseType.EVENT_SHOP:
            return (
                <>
                    {/* Some items is not present in api because is other version of item with diff id
                     example https://static.atlasacademy.io/JP/Items/80528.png */}
                    {/* Work around is <img src="https://static.atlasacademy.io/{region}/Items/{itemSet.targetId}.png" */}
                    <ItemDescriptorId itemId={itemSet.targetId} region={region} height={40} /> ×{itemSet.setNum}
                </>
            )
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
