import { useTranslation } from "react-i18next";

import { BattlePoint, CondType, Event, Mission, Quest, Region, Servant } from "@atlasacademy/api-connector";

import CostumeDescriptor from "./CostumeDescriptor";
import EntityReferenceDescriptor from "./EntityReferenceDescriptor";
import EventDescriptor from "./EventDescriptor";
import { ItemDescriptorId } from "./ItemDescriptor";
import { missionRange } from "./MultipleDescriptors";
import { QuestDescriptorId } from "./QuestDescriptor";
import ServantDescriptorId from "./ServantDescriptorId";
import TraitDescription from "./TraitDescription";

export default function CondTargetValueDescriptor(props: {
    region: Region;
    cond: CondType;
    target: number;
    value: number;
    forceFalseDescription?: string;
    servants?: Map<number, Servant.ServantBasic>;
    quests?: Map<number, Quest.QuestBasic>;
    missions?: Map<number, Mission.Mission>;
    missionGroups?: Event.EventMissionGroup[];
    battlePoints?: BattlePoint.BattlePoint[];
}) {
    const forceFalseDescription = props.forceFalseDescription ? props.forceFalseDescription : "Not possible";
    const { region, target, value, missions, missionGroups } = props;
    const { t } = useTranslation();

    const bpNames = new Map<number, Map<number, string>>();

    for (const bp of props.battlePoints ?? []) {
        const bpPhaseNames = new Map<number, string>();
        for (const bpPhase of bp.phases) {
            if (!Array.from(bpPhaseNames.values()).includes(bpPhase.name)) {
                bpPhaseNames.set(bpPhase.value, bpPhase.name);
            }
        }
        bpNames.set(bp.id, bpPhaseNames);
    }

    switch (props.cond) {
        case CondType.NONE:
            return null;
        case CondType.QUEST_CLEAR:
            return (
                <>
                    Has cleared <QuestDescriptorId region={region} questId={target} quests={props.quests} />
                </>
            );
        case CondType.QUEST_AVAILABLE:
            return (
                <>
                    <QuestDescriptorId region={region} questId={target} quests={props.quests} /> is available
                </>
            );

        case CondType.SVT_LIMIT:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> at ascension {value}
                </>
            );
        case CondType.SVT_GET:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> in Spirit Origin
                    Collection
                </>
            );
        case CondType.SVT_FRIENDSHIP:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> at bond level {value}
                </>
            );
        case CondType.SVT_FRIENDSHIP_BELOW:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> at bond level {value}{" "}
                    or lower
                </>
            );
        case CondType.SVT_FRIENDSHIP_ABOVE:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> at bond level {value}{" "}
                    or higher
                </>
            );
        case CondType.COSTUME_GET:
            return (
                <>
                    <CostumeDescriptor region={region} servantId={target} costumeLimit={value} /> get
                </>
            );
        case CondType.EVENT_END:
            return (
                <>
                    Event <EventDescriptor region={region} eventId={target} /> has ended
                </>
            );
        case CondType.QUEST_NOT_CLEAR:
            return (
                <>
                    Has not cleared <QuestDescriptorId region={region} questId={target} quests={props.quests} />
                </>
            );
        case CondType.SVT_HAVING:
            return (
                <>
                    {t("Presence of")} <ServantDescriptorId region={region} id={target} servants={props.servants} />
                </>
            );
        case CondType.NOT_SVT_HAVING:
            return (
                <>
                    {t("Doesn't have")} <ServantDescriptorId region={region} id={target} servants={props.servants} />
                </>
            );
        case CondType.QUEST_CLEAR_PHASE:
            return (
                <>
                    Has cleared arrow {value} of{" "}
                    <QuestDescriptorId region={region} questId={target} quests={props.quests} />
                </>
            );
        case CondType.NOT_QUEST_CLEAR_PHASE:
            return (
                <>
                    Has not cleared arrow {value} of{" "}
                    <QuestDescriptorId region={region} questId={target} questPhase={value} quests={props.quests} />
                </>
            );
        case CondType.SVT_RECOVERD:
            return <>Servant recovered</>;
        case CondType.EVENT_REWARD_DISP_COUNT:
            return (
                <>
                    Event{" "}
                    <b>
                        <EventDescriptor region={region} eventId={target} />
                    </b>{" "}
                    reward voice line and at least {value - 1} other reward line
                    {value > 2 ? "s are " : " is "}
                    played before this one
                </>
            );
        case CondType.PLAYER_GENDER_TYPE:
            if (target === 1) {
                return <>Using male protagonist</>;
            } else {
                return <>Using female protagonist</>;
            }
        case CondType.FORCE_FALSE:
            return <>{forceFalseDescription}</>;
        case CondType.LIMIT_COUNT_ABOVE:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> at ascension &ge;{" "}
                    {value}
                </>
            );
        case CondType.LIMIT_COUNT_BELOW:
            return (
                <>
                    <ServantDescriptorId region={region} id={target} servants={props.servants} /> at ascension &le;{" "}
                    {value}
                </>
            );
        case CondType.DATE:
            if (props.value !== undefined && props.value !== 0) {
                const date = new Date(props.value * 1000);
                return <>After {date.toLocaleString()}</>;
            } else if (props.value === 0) {
                return null;
            } else {
                return <>After unknown date</>;
            }
        case CondType.ITEM_GET:
            return (
                <>
                    Has <ItemDescriptorId region={region} itemId={target} /> ×{value}
                </>
            );
        case CondType.NOT_ITEM_GET:
            return (
                <>
                    Doesn't have <ItemDescriptorId region={region} itemId={target} /> ×{value}
                </>
            );
        case CondType.EVENT_MISSION_GROUP_ACHIEVE:
            const missionGroup = (missionGroups ?? []).find((group) => group.id === target);
            if (missionGroup === undefined)
                return (
                    <>
                        {t("Event mission group achieve")} target {target}
                    </>
                );
            const missionDispNos = missionGroup.missionIds.map((id) => missions?.get(id)?.dispNo ?? id);
            return (
                <>
                    Finished {value} missions out of {missionRange(missionDispNos)}
                </>
            );
        case CondType.WITH_STARTING_MEMBER:
            return (
                <>
                    <EntityReferenceDescriptor region={region} svtId={target} /> {t("in starting party")}
                </>
            );
        case CondType.BATTLE_POINT_ABOVE:
            const bpAboveName = bpNames.get(target)?.get(value);
            if (bpAboveName !== undefined) {
                return (
                    <>
                        {t("Master Affection lvl")} ≥ {bpAboveName}
                    </>
                );
            }
            return (
                <>
                    {t("Battle point")} {target} ≥ {value}
                </>
            );
        case CondType.BATTLE_POINT_BELOW:
            const bpBelowName = bpNames.get(target)?.get(value + 1);
            if (bpBelowName !== undefined) {
                return (
                    <>
                        {t("Master Affection lvl")} &lt; {bpBelowName}
                    </>
                );
            }
            return (
                <>
                    {t("Battle point")} {target} ≤ {value}
                </>
            );
        case CondType.BATTLE_FUNCTION_TARGET_ALL_INDIVIDUALITY:
            return (
                <>
                    {t("All targeted enemies have trait")} <TraitDescription region={region} trait={target} />
                </>
            );
        case CondType.BATTLE_FUNCTION_TARGET_ONE_INDIVIDUALITY:
            return (
                <>
                    {t("Targeted enemy has trait")} <TraitDescription region={region} trait={target} />
                </>
            );
        case CondType.NOT_BATTLE_FUNCTION_TARGET_ALL_INDIVIDUALITY:
            return (
                <>
                    {t("No targeted enemy has trait")} <TraitDescription region={region} trait={target} />
                </>
            );
        case CondType.NOT_BATTLE_FUNCTION_TARGET_ONE_INDIVIDUALITY:
            return (
                <>
                    {t("Targeted enemy doesn't have trait")} <TraitDescription region={region} trait={target} />
                </>
            );
        default:
            return (
                <>
                    {props.cond} value {value} target {target}
                </>
            );
    }
}
