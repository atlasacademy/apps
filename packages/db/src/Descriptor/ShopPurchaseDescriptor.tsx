import { Item, Region, Shop } from "@atlasacademy/api-connector";

import { CommandCodeDescriptorId } from "../Descriptor/CommandCodeDescriptor";
import CostumeDescriptor from "../Descriptor/CostumeDescriptor";
import EntityReferenceDescriptor from "../Descriptor/EntityReferenceDescriptor";
import { IconDescriptorMap } from "../Descriptor/ItemDescriptor";
import QuestDescriptor from "../Descriptor/QuestDescriptor";
import ItemSetDescriptor from "./ItemSetDescriptor";

export default function ShopPurchaseDescriptor(props: {
    region: Region;
    shop: Shop.Shop;
    itemMap: Map<number, Item.Item>;
}) {
    const shop = props.shop,
        region = props.region,
        target = shop.targetIds[0];
    switch (shop.purchaseType) {
        case Shop.PurchaseType.ITEM:
            return <IconDescriptorMap region={region} itemId={target} height={40} items={props.itemMap} />;
        case Shop.PurchaseType.FRIEND_GACHA:
            return <>Friend Point</>;
        case Shop.PurchaseType.SERVANT:
            return <EntityReferenceDescriptor region={region} svtId={target} />;
        case Shop.PurchaseType.SET_ITEM:
            if (shop.itemSet.length === 1) {
                return <ItemSetDescriptor region={region} itemSet={shop.itemSet[0]} itemMap={props.itemMap} />;
            } else {
                return (
                    <ul>
                        {shop.itemSet.map((itemSet) => (
                            <li key={`${itemSet.id}-${itemSet.purchaseType}-${itemSet.targetId}-${itemSet.setNum}`}>
                                <ItemSetDescriptor region={region} itemSet={itemSet} itemMap={props.itemMap} />
                            </li>
                        ))}
                    </ul>
                );
            }
        case Shop.PurchaseType.QUEST:
            return <QuestDescriptor region={region} questId={target} />;
        // case Shop.PurchaseType.EVENT_SHOP:
        case Shop.PurchaseType.EVENT_SVT_GET:
            return (
                <>
                    <EntityReferenceDescriptor region={region} svtId={target} /> joins
                </>
            );
        case Shop.PurchaseType.MANA_SHOP:
            return <>Unlock entry in Mana Prism shop</>;
        case Shop.PurchaseType.STORAGE_SVT:
            return <>Expand Servant Second Archive</>;
        case Shop.PurchaseType.STORAGE_SVTEQUIP:
            return <>Expand CE Second Archive</>;
        // case Shop.PurchaseType.BGM:
        case Shop.PurchaseType.COSTUME_RELEASE:
            const servantId = Math.floor(target / 100);
            const costumeLimit = target % 100;
            return (
                <>
                    <CostumeDescriptor region={region} servantId={servantId} costumeLimit={costumeLimit} /> Unlocked
                </>
            );
        // case Shop.PurchaseType.BGM_RELEASE:
        case Shop.PurchaseType.LOTTERY_SHOP:
            return <>A Random Item</>;
        // case Shop.PurchaseType.EVENT_FACTORY:
        case Shop.PurchaseType.COMMAND_CODE:
            return <CommandCodeDescriptorId region={region} ccId={target} />;
        // case Shop.PurchaseType.EVENT_SVT_JOIN:
        // case Shop.PurchaseType.ASSIST:
        case Shop.PurchaseType.KIARA_PUNISHER_RESET:
            return <>Kiara Punisher Reset</>;
        default:
            return (
                <>
                    {shop.purchaseType} {shop.targetIds}
                </>
            );
    }
}
