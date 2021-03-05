import { Item, Region, Shop } from "@atlasacademy/api-connector";
import ItemDescriptor from "../Descriptor/ItemDescriptor";
import EntityReferenceDescriptor from "../Descriptor/EntityReferenceDescriptor";
import { CommandCodeDescriptorId } from "../Descriptor/CommandCodeDescriptor";
import CostumeDescriptor from "../Descriptor/CostumeDescriptor";
import QuestDescriptor from "../Descriptor/QuestDescriptor";

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
            const item = props.itemMap.get(target);
            if (item !== undefined) {
                return (
                    <ItemDescriptor region={region} item={item} height={40} />
                );
            } else {
                return <>Unknown Item {target}</>;
            }
        case Shop.PurchaseType.FRIEND_GACHA:
            return <>Friend Point</>;
        case Shop.PurchaseType.SERVANT:
            return <EntityReferenceDescriptor region={region} svtId={target} />;
        // case Shop.PurchaseType.SET_ITEM:
        case Shop.PurchaseType.QUEST:
            return (
                <QuestDescriptor
                    region={region}
                    text=""
                    questId={target}
                    questPhase={1}
                />
            );
        // case Shop.PurchaseType.EVENT_SHOP:
        case Shop.PurchaseType.EVENT_SVT_GET:
            return (
                <>
                    <EntityReferenceDescriptor region={region} svtId={target} />{" "}
                    joins
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
                    <CostumeDescriptor
                        region={region}
                        servantId={servantId}
                        costumeLimit={costumeLimit}
                    />{" "}
                    Unlocked
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
