import { Mission, Region, Item, Quest, Servant, EnumList } from "@atlasacademy/api-connector";

import {
    MultipleTraits,
    MultipleItems,
    MultipleServants,
    MultipleQuests,
    MultipleClasses,
    MultipleEmbers,
} from "./MultipleDescriptors";

export default function CondMissionDetailDescriptor(props: {
    region: Region;
    detail: Mission.MissionConditionDetail;
    num: number;
    servants?: Map<number, Servant.ServantBasic>;
    quests?: Map<number, Quest.QuestBasic>;
    items?: Map<number, Item.Item>;
    enums?: EnumList;
}) {
    const region = props.region,
        detail = props.detail,
        num = props.num,
        targetIds = props.detail.targetIds,
        pluralS = num > 1 ? "s" : "";
    switch (detail.missionCondType) {
        case Mission.DetailCondType.QUEST_CLEAR_NUM_1:
        case Mission.DetailCondType.QUEST_CLEAR_NUM_2:
            if (targetIds.length === 1 && targetIds[0] === 0)
                return (
                    <>
                        Complete any quest {num} time{pluralS}
                    </>
                );
            return (
                <>
                    {num} run{pluralS} of <MultipleQuests region={region} questIds={targetIds} quests={props.quests} />
                </>
            );
        case Mission.DetailCondType.QUEST_CLEAR_NUM_INCLUDING_GRAILFRONT:
            return (
                <>
                    Clear any quest including grail front quest {num} time
                    {pluralS}
                </>
            );
        case Mission.DetailCondType.MAIN_QUEST_DONE:
            return (
                <>
                    Clear any main quest in Arc 1 and Arc 2 {num} time
                    {pluralS}
                </>
            );
        case Mission.DetailCondType.ENEMY_KILL_NUM:
            return (
                <>
                    Defeat {num} from{" "}
                    <MultipleServants region={region} servantIds={targetIds} servants={props.servants} />
                </>
            );
        case Mission.DetailCondType.DEFEAT_ENEMY_INDIVIDUALITY:
        case Mission.DetailCondType.ENEMY_INDIVIDUALITY_KILL_NUM:
            return (
                <>
                    Defeat {num} enemies with <MultipleTraits region={region} traitIds={targetIds} />
                </>
            );
        case Mission.DetailCondType.DEFEAT_SERVANT_CLASS:
        case Mission.DetailCondType.DEFEAT_ENEMY_CLASS:
            const opponent =
                detail.missionCondType === Mission.DetailCondType.DEFEAT_SERVANT_CLASS ? "servants" : "enemies";
            return (
                <>
                    Defeat {num} {opponent} with{" "}
                    <MultipleClasses classIds={targetIds} classes={props.enums?.SvtClass} />
                </>
            );
        case Mission.DetailCondType.DEFEAT_ENEMY_NOT_SERVANT_CLASS:
            return (
                <>
                    Defeat {num} <MultipleClasses classIds={targetIds} classes={props.enums?.SvtClass} /> enemies
                    (excluding Servants and certain bosses)
                </>
            );
        case Mission.DetailCondType.BATTLE_SVT_CLASS_IN_DECK:
            return (
                <>
                    Put one or more <MultipleClasses classIds={targetIds} classes={props.enums?.SvtClass} /> Servants in
                    your Party and complete any quest {num} times
                </>
            );
        case Mission.DetailCondType.ITEM_GET_BATTLE:
        case Mission.DetailCondType.ITEM_GET_TOTAL:
            return (
                <>
                    Obtain {num} <MultipleItems region={region} itemIds={targetIds} items={props.items} /> as battle
                    drops
                </>
            );
        case Mission.DetailCondType.BATTLE_SVT_INDIVIDUALITY_IN_DECK:
            return (
                <>
                    Put servants with <MultipleTraits region={region} traitIds={targetIds} /> in your Party and complete
                    Quests {num} times
                </>
            );
        case Mission.DetailCondType.BATTLE_SVT_ID_IN_DECK_1:
        case Mission.DetailCondType.BATTLE_SVT_ID_IN_DECK_2:
            return (
                <>
                    Put <MultipleServants region={region} servantIds={targetIds} servants={props.servants} /> in your
                    Party and complete Quests {num} times
                </>
            );
        case Mission.DetailCondType.SVT_GET_BATTLE:
            return (
                <>
                    Acquire {num} <MultipleEmbers region={region} svtIds={targetIds} /> through battles
                </>
            );
        case Mission.DetailCondType.FRIEND_POINT_SUMMON:
            return <>Perform {num} Friend Point Summons</>;
        default:
            return (
                <>
                    mission detail type {detail.missionCondType} num {num} targets {targetIds.join(", ")}
                </>
            );
    }
}
