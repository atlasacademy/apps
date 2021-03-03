import { Event, Gift, Item, Region } from "@atlasacademy/api-connector";
import ItemIcon from "../Component/ItemIcon";
import { CommandCodeDescriptorId } from "../Descriptor/CommandCodeDescriptor";
import CostumeDescriptor from "../Descriptor/CostumeDescriptor";
import EntityReferenceDescriptor from "../Descriptor/EntityReferenceDescriptor";
import { FuncDescriptorId } from "../Descriptor/FuncDescriptor";
import { IconDescriptorMap } from "../Descriptor/ItemDescriptor";
import { MysticCodeDescriptorId } from "../Descriptor/MysticCodeDescriptor";

export default function GiftDescriptor(props: {
    region: Region;
    gift: Gift.Gift;
    items: Map<number, Item.Item>;
    pointBuffs?: Map<number, Event.EventPointBuff>;
}) {
    const gift = props.gift,
        region = props.region;
    switch (gift.type) {
        case Gift.GiftType.SERVANT:
            return (
                <>
                    <EntityReferenceDescriptor
                        region={region}
                        svtId={gift.objectId}
                    />{" "}
                    x{gift.num}
                </>
            );
        case Gift.GiftType.ITEM:
            return (
                <>
                    <IconDescriptorMap
                        region={region}
                        itemId={gift.objectId}
                        items={props.items}
                    />{" "}
                    x{gift.num}
                </>
            );
        case Gift.GiftType.EQUIP:
            return (
                <MysticCodeDescriptorId region={region} mcId={gift.objectId} />
            );
        case Gift.GiftType.EVENT_SVT_JOIN:
            return (
                <>
                    <EntityReferenceDescriptor
                        region={region}
                        svtId={gift.objectId}
                    />{" "}
                    joins the party
                </>
            );
        case Gift.GiftType.EVENT_SVT_GET:
            return (
                <>
                    Get{" "}
                    <EntityReferenceDescriptor
                        region={region}
                        svtId={gift.objectId}
                    />{" "}
                    x{gift.num}
                </>
            );
        case Gift.GiftType.QUEST_REWARD_ICON:
            return (
                <>
                    <img
                        alt={`Quest Reward ${gift.objectId} icon`}
                        className={"item-icon-image"}
                        src={`https://assets.atlasacademy.io/GameData/NA/Items/${gift.objectId}.png`}
                    />
                    Quest Reward
                </>
            );
        case Gift.GiftType.COSTUME_RELEASE:
        case Gift.GiftType.COSTUME_GET:
            const servantId = Math.floor(gift.objectId / 100);
            const costumeLimit = gift.objectId % 100;
            return (
                <>
                    <CostumeDescriptor
                        region={region}
                        servantId={servantId}
                        costumeLimit={costumeLimit}
                    />{" "}
                    {gift.type === Gift.GiftType.COSTUME_RELEASE
                        ? "Unlocked"
                        : "Get"}
                </>
            );
        case Gift.GiftType.COMMAND_CODE:
            return (
                <CommandCodeDescriptorId region={region} ccId={gift.objectId} />
            );
        case Gift.GiftType.EVENT_POINT_BUFF:
            const pointBuff =
                props.pointBuffs !== undefined
                    ? props.pointBuffs.get(gift.objectId)
                    : undefined;
            if (pointBuff !== undefined) {
                const pointBuffItem = {
                    id: pointBuff.id,
                    name: pointBuff.name,
                    type: Item.ItemType.EVENT_ITEM,
                    uses: [],
                    detail: pointBuff.detail,
                    individuality: [],
                    icon: pointBuff.icon,
                    background: pointBuff.background,
                    priority: 0,
                    dropPriority: 0,
                };
                return (
                    <>
                        <ItemIcon region={region} item={pointBuffItem} />
                        <b>{pointBuff.name}</b>
                        <br />
                        <b>Detail:</b> {pointBuff.detail}
                        <br />
                        <b>Functions:</b>{" "}
                        <ul style={{ margin: 0 }}>
                            {pointBuff.funcIds.map((funcId) => (
                                <li key={funcId}>
                                    <FuncDescriptorId
                                        region={region}
                                        funcId={funcId}
                                    />
                                </li>
                            ))}
                        </ul>
                        <b>Value:</b> {pointBuff.value / 10}%
                    </>
                );
            } else {
                return <>Event Buff {gift.objectId}</>;
            }
        // case Gift.GiftType.EVENT_BOARD_GAME_TOKEN:
        default:
            return (
                <>
                    {gift.type} {gift.objectId} {gift.priority} {gift.num}
                </>
            );
    }
}
