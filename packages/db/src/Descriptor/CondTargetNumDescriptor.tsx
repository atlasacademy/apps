import { Button } from "react-bootstrap";

import { CondType, EnumList, Item, Mission, Quest, Region, Servant, Shop } from "@atlasacademy/api-connector";

import { mergeElements } from "../Helper/OutputHelper";
import { lang } from "../Setting/Manager";
import CondMissionDetailDescriptor from "./CondMissionDetailDescriptor";
import EventDescriptor from "./EventDescriptor";
import {
    MultipleClassLevels,
    MultipleClassLimits,
    MultipleEquipRarityLevel,
    MultipleQuests,
    MultipleServants,
    missionRange,
} from "./MultipleDescriptors";
import { QuestDescriptorId } from "./QuestDescriptor";
import ServantDescriptorId from "./ServantDescriptorId";
import ShopItemReferenceDescriptor from "./ShopItemReferenceDescriptor";
import ShopReferenceDescriptor from "./ShopReferenceDescriptor";

export default function CondTargetNumDescriptor(props: {
    region: Region;
    cond: CondType;
    targets: number[];
    num: number;
    details?: Mission.MissionConditionDetail[];
    servants?: Map<number, Servant.ServantBasic>;
    shop?: Shop.Shop;
    quests?: Map<number, Quest.QuestBasic>;
    missions?: Map<number, Mission.Mission>;
    items?: Map<number, Item.Item>;
    enums?: EnumList;
    handleNavigateMissionId?: (id: number) => void;
}) {
    const region = props.region;
    const targets = props.targets;
    const num = props.num;
    

    switch (props.cond) {
        case CondType.NONE:
            return null;
        case CondType.QUEST_CLEAR:
            return (
                <>
                    {num === targets.length
                        ? `Clear ${num === 1 ? "" : "all of "}`
                        : `Clear ${num} ${num !== 1 ? "different quests from " : "quest from "}`}
                    <MultipleQuests region={region} questIds={targets} quests={props.quests} />
                </>
            );
        case CondType.QUEST_CLEAR_PHASE:
            return (
                <>
                    Has cleared arrow {num} of{" "}
                    <QuestDescriptorId
                        region={region}
                        questId={targets[0]}
                        questPhase={num}
                        quests={props.quests}
                        showType={false}
                    />
                </>
            );
        case CondType.QUEST_CLEAR_NUM:
            return (
                <>
                    {num} runs of <MultipleQuests region={region} questIds={targets} quests={props.quests} />
                </>
            );
        case CondType.SVT_LIMIT:
            return (
                <>
                    <MultipleServants region={region} servantIds={targets} servants={props.servants} /> at ascension{" "}
                    {num}
                </>
            );
        case CondType.SVT_FRIENDSHIP:
            return (
                <>
                    <MultipleServants region={region} servantIds={targets} servants={props.servants} /> at bond level{" "}
                    {num}
                </>
            );
        case CondType.SVT_GET:
            return (
                <>
                    <ServantDescriptorId region={region} id={targets[0]} servants={props.servants} /> in Spirit Origin
                    Collection
                </>
            );
        case CondType.EVENT_END:
            return (
                <>
                    Event <EventDescriptor region={region} eventId={targets[0]} /> has ended
                </>
            );
        case CondType.SVT_HAVING:
            return (
                <>
                    Presence of <ServantDescriptorId region={region} id={targets[0]} servants={props.servants} />
                </>
            );
        case CondType.SVT_RECOVERD:
            return <>Servant recovered</>;
        case CondType.LIMIT_COUNT_ABOVE:
            return (
                <>
                    <ServantDescriptorId region={region} id={targets[0]} servants={props.servants} /> at ascension &ge;{" "}
                    {num}
                </>
            );
        case CondType.LIMIT_COUNT_BELOW:
            return (
                <>
                    <ServantDescriptorId region={region} id={targets[0]} servants={props.servants} /> at ascension &le;{" "}
                    {num}
                </>
            );
        case CondType.SVT_LEVEL_CLASS_NUM:
            return (
                <>
                    Raise {num}{" "}
                    <MultipleClassLevels targetIds={targets} classes={props.enums?.SvtClass} plural={num > 1} />
                </>
            );
        case CondType.SVT_LIMIT_CLASS_NUM:
            return (
                <>
                    Raise {num}{" "}
                    <MultipleClassLimits targetIds={targets} classes={props.enums?.SvtClass} plural={num > 1} />
                </>
            );
        case CondType.SVT_EQUIP_RARITY_LEVEL_NUM:
            return (
                <>
                    Raise {num} <MultipleEquipRarityLevel targetIds={targets} plural={num > 1} />
                </>
            );
        case CondType.EVENT_MISSION_ACHIEVE:
            if (targets.length === 1) {
                const mission = (props.missions ?? new Map([])).get(targets[0]);
                const missionDispNo = mission ? mission.dispNo : targets[0];
                const missionName = mission ? mission.name : "";
                return (
                    <>
                        Claim mission{" "}
                        <Button
                            variant="link"
                            className="reset-button-style"
                            onClick={() => props.handleNavigateMissionId?.(targets[0])}
                        >
                            {missionDispNo}: <span lang={lang(region)}>{missionName}</span>
                        </Button>
                    </>
                );
            } else {
                const missionDispNos = targets.map((target) => {
                    const mission = (props.missions ?? new Map([])).get(target);
                    return mission ? mission.dispNo : target;
                });
                return <>Claim missions {missionRange(missionDispNos)}</>;
            }
        case CondType.EVENT_TOTAL_POINT:
            return <>Reached {num.toLocaleString()} event points</>;
        case CondType.EVENT_MISSION_CLEAR:
            const missionDispNos = targets.map((target) => {
                const mission = (props.missions ?? new Map([])).get(target);
                return mission ? mission.dispNo : target;
            });
            return (
                <>
                    {num === targets.length
                        ? `Clear ${num === 1 ? "mission " : "missions "}`
                        : `Clear ${num} different missions from `}
                    {missionRange(missionDispNos)}
                </>
            );
        case CondType.MISSION_CONDITION_DETAIL:
            if (props.details) {
                return (
                    <>
                        {mergeElements(
                            props.details.map((detail) => (
                                <CondMissionDetailDescriptor
                                    region={region}
                                    detail={detail}
                                    num={num}
                                    servants={props.servants}
                                    quests={props.quests}
                                    items={props.items}
                                    enums={props.enums}
                                />
                            )),
                            " or "
                        )}
                    </>
                );
            } else {
                return (
                    <>
                        Unknown condition details {targets[0]} num {num}
                    </>
                );
            }
        case CondType.DATE:
            if (props.num !== undefined) {
                const date = new Date(props.num * 1000);
                return <>After {date.toLocaleString()}</>;
            } else {
                return <>After unknown date</>;
            }
        case CondType.START_RANDOM_MISSION:
            return <>Random Mission Started</>;
        
        case CondType.NOT_SHOP_PURCHASE:
            return <><ShopItemReferenceDescriptor shopId={targets[0]} region={region} /> not purchased</>;
        case CondType.PURCHASE_SHOP:
            return (
                <table>
                    <ShopReferenceDescriptor shopParent={props.shop} region={region} shopId={targets[0]} itemMap={props.items} />
                </table>
            );
        default:
            return (
                <>
                    {props.cond} target {targets.join(", ")} num {num}
                </>
            );
    }
}
