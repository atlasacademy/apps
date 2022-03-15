import { Event, Gift, Item, Region, Servant } from "@atlasacademy/api-connector";

import { AssetHost } from "../Api";
import { CommandCodeDescriptorId } from "./CommandCodeDescriptor";
import CostumeDescriptor from "./CostumeDescriptor";
import EntityReferenceDescriptor from "./EntityReferenceDescriptor";
import { IconDescriptorMap, ItemDescriptorId } from "./ItemDescriptor";
import { MysticCodeDescriptorId } from "./MysticCodeDescriptor";
import PointBuffDescriptor from "./PointBuffDescriptor";
import ServantDescriptorId from "./ServantDescriptorId";

export default function GiftDescriptor(props: {
    region: Region;
    gift: Gift.Gift;
    items?: Map<number, Item.Item>;
    servants?: Map<number, Servant.ServantBasic>;
    pointBuffs?: Map<number, Event.EventPointBuff>;
}) {
    const gift = props.gift,
        region = props.region;
    switch (gift.type) {
        case Gift.GiftType.SERVANT:
            return (
                <>
                    <EntityReferenceDescriptor region={region} svtId={gift.objectId} /> x{gift.num}
                </>
            );
        case Gift.GiftType.ITEM:
            if (props.items !== undefined) {
                return (
                    <>
                        <IconDescriptorMap region={region} itemId={gift.objectId} items={props.items} /> x
                        {gift.num.toLocaleString()}
                    </>
                );
            } else {
                return (
                    <>
                        <ItemDescriptorId region={region} itemId={gift.objectId} /> x{gift.num.toLocaleString()}
                    </>
                );
            }
        case Gift.GiftType.EQUIP:
            return <MysticCodeDescriptorId region={region} mcId={gift.objectId} />;
        case Gift.GiftType.EVENT_SVT_JOIN:
            return (
                <>
                    <ServantDescriptorId region={region} id={gift.objectId} servants={props.servants} /> joins the party
                </>
            );
        case Gift.GiftType.EVENT_SVT_GET:
            return (
                <>
                    Get <ServantDescriptorId region={region} id={gift.objectId} servants={props.servants} /> x{gift.num}
                </>
            );
        case Gift.GiftType.QUEST_REWARD_ICON:
            if (gift.objectId !== 99999999) {
                return (
                    <>
                        <img
                            alt={`Quest Reward ${gift.objectId} icon`}
                            style={{ maxWidth: "100%", maxHeight: "2em" }}
                            src={`${AssetHost}/${region}/Items/${gift.objectId}.png`}
                        />{" "}
                        Quest Reward
                    </>
                );
            } else {
                return null;
            }
        case Gift.GiftType.COSTUME_RELEASE:
        case Gift.GiftType.COSTUME_GET:
            const servantId = Math.floor(gift.objectId / 100);
            const costumeLimit = gift.objectId % 100;
            return (
                <>
                    <CostumeDescriptor region={region} servantId={servantId} costumeLimit={costumeLimit} />{" "}
                    {gift.type === Gift.GiftType.COSTUME_RELEASE ? "Unlocked" : "Get"}
                </>
            );
        case Gift.GiftType.COMMAND_CODE:
            return <CommandCodeDescriptorId region={region} ccId={gift.objectId} />;
        case Gift.GiftType.EVENT_POINT_BUFF:
            const pointBuff = props.pointBuffs !== undefined ? props.pointBuffs.get(gift.objectId) : undefined;
            if (pointBuff !== undefined) {
                return <PointBuffDescriptor region={region} pointBuff={pointBuff} />;
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
