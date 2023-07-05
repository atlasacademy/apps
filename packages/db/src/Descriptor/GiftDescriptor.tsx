import { useTranslation } from "react-i18next";

import { Event, Gift, Item, Region, Servant } from "@atlasacademy/api-connector";

import { AssetHost } from "../Api";
import { lang } from "../Setting/Manager";
import { CommandCodeDescriptorId } from "./CommandCodeDescriptor";
import CondTargetValueDescriptor from "./CondTargetValueDescriptor";
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
    heelPortraits?: Map<number, Event.EventHeelPortrait>;
}) {
    return (
        <>
            <BaseGiftDescriptor {...props} />
            {props.gift.giftAdds.length > 0 ? (
                <>
                    <br />
                    {props.gift.giftAdds.map((giftAdd) => (
                        <GiftAddDescriptor
                            key={giftAdd.priority}
                            region={props.region}
                            giftAdd={giftAdd}
                            items={props.items}
                            servants={props.servants}
                            pointBuffs={props.pointBuffs}
                        />
                    ))}
                </>
            ) : null}
        </>
    );
}

export function GiftAddDescriptor({
    region,
    giftAdd,
    items,
    servants,
    pointBuffs,
    heelPortraits,
}: {
    region: Region;
    giftAdd: Gift.GiftAdd;
    items?: Map<number, Item.Item>;
    servants?: Map<number, Servant.ServantBasic>;
    pointBuffs?: Map<number, Event.EventPointBuff>;
    heelPortraits?: Map<number, Event.EventHeelPortrait>;
}) {
    return (
        <>
            <img
                src={giftAdd.replacementGiftIcon}
                alt="Replacement reward if condition is satisfied"
                style={{ height: "2em" }}
            />{" "}
            {giftAdd.replacementGifts.map((gift) => (
                <BaseGiftDescriptor
                    region={region}
                    gift={gift}
                    items={items}
                    servants={servants}
                    pointBuffs={pointBuffs}
                    heelPortraits={heelPortraits}
                />
            ))}{" "}
            —{" "}
            <CondTargetValueDescriptor
                region={region}
                cond={giftAdd.condType}
                target={giftAdd.targetId}
                value={giftAdd.targetNum}
            />
        </>
    );
}

export function BaseGiftDescriptor(props: {
    region: Region;
    gift: Gift.BaseGift;
    items?: Map<number, Item.Item>;
    servants?: Map<number, Servant.ServantBasic>;
    pointBuffs?: Map<number, Event.EventPointBuff>;
    heelPortraits?: Map<number, Event.EventHeelPortrait>;
}) {
    const { t } = useTranslation();
    const { gift, region } = props;
    switch (gift.type) {
        case Gift.GiftType.SERVANT:
            return (
                <>
                    <EntityReferenceDescriptor region={region} svtId={gift.objectId} /> ×{gift.num}
                </>
            );
        case Gift.GiftType.ITEM:
            if (props.items !== undefined) {
                return (
                    <>
                        <IconDescriptorMap region={region} itemId={gift.objectId} items={props.items} /> ×
                        {gift.num.toLocaleString()}
                    </>
                );
            } else {
                return (
                    <>
                        <ItemDescriptorId region={region} itemId={gift.objectId} /> ×{gift.num.toLocaleString()}
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
                    Get <ServantDescriptorId region={region} id={gift.objectId} servants={props.servants} /> ×{gift.num}
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

        case Gift.GiftType.EVENT_COMMAND_ASSIST:
            return (
                <>
                    <img
                        src={`${AssetHost}/${region}/Items/${gift.objectId}.png`}
                        alt={`Command assist ${gift.objectId}`}
                        height={50}
                    />{" "}
                    {t("Increase the level of command assist by")} {gift.num}
                </>
            );
        case Gift.GiftType.EVENT_HEEL_PORTRAIT:
            const heelPortrait = props.heelPortraits?.get(gift.objectId);
            return (
                <>
                    <img
                        src={heelPortrait?.image}
                        alt={`${heelPortrait?.name} Heel Portrait`}
                        style={{ height: "2em", width: "auto" }}
                    />{" "}
                    <span lang={lang(region)}>{heelPortrait?.name}</span> {t("Heel Portrait")}
                </>
            );
        default:
            return (
                <>
                    {gift.type} {gift.objectId} {gift.priority} {gift.num}
                </>
            );
    }
}
