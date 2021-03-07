import {
    Mission,
    Region,
    Item,
    Quest,
    Servant,
    EnumList,
} from "@atlasacademy/api-connector";
import {
    MultipleTraits,
    MultipleItems,
    MultipleServants,
    MultipleQuests,
    MultipleClasses,
} from "./MultipleDescriptors";

export default function CondMissionDetailDescriptor(props: {
    region: Region;
    detail: Mission.MissionConditionDetail;
    num: number;
    servants?: Map<number, Servant.ServantBasic>;
    quests?: Map<number, Quest.Quest>;
    items?: Map<number, Item.Item>;
    enums?: EnumList;
}) {
    const region = props.region,
        detail = props.detail,
        num = props.num,
        targetIds = props.detail.targetIds;
    switch (detail.missionCondType) {
        case Mission.DetailCondType.QUEST_CLEAR_NUM_1:
        case Mission.DetailCondType.QUEST_CLEAR_NUM_2:
            return (
                <>
                    {num} runs of{" "}
                    <MultipleQuests
                        region={region}
                        questIds={targetIds}
                        quests={props.quests}
                    />
                </>
            );
        case Mission.DetailCondType.ENEMY_KILL_NUM:
            return (
                <>
                    Defeat {num} from{" "}
                    <MultipleServants
                        region={region}
                        servantIds={targetIds}
                        servants={props.servants}
                    />
                </>
            );
        case Mission.DetailCondType.ENEMY_INDIVIDUALITY_KILL_NUM:
        case Mission.DetailCondType.DEFEAT_ENEMY_INDIVIDUALITY:
            return (
                <>
                    Defeat {num} enemies with{" "}
                    <MultipleTraits region={region} traitIds={targetIds} />
                </>
            );
        case Mission.DetailCondType.DEFEAT_SERVANT_CLASS:
            return (
                <>
                    Defeat {num} enemies with{" "}
                    <MultipleClasses
                        classIds={targetIds}
                        classes={props.enums?.SvtClass}
                    />
                </>
            );
        case Mission.DetailCondType.ITEM_GET_BATTLE:
        case Mission.DetailCondType.ITEM_GET_TOTAL:
            return (
                <>
                    Obtain {num}{" "}
                    <MultipleItems
                        region={region}
                        itemIds={targetIds}
                        items={props.items}
                    />{" "}
                    as battle drops
                </>
            );
        case Mission.DetailCondType.BATTLE_SVT_INDIVIDUALITY_IN_DECK:
            return (
                <>
                    Put servants with{" "}
                    <MultipleTraits region={region} traitIds={targetIds} /> in
                    your Party and complete Quests {num} times
                </>
            );
        case Mission.DetailCondType.BATTLE_SVT_ID_IN_DECK_1:
        case Mission.DetailCondType.BATTLE_SVT_ID_IN_DECK_2:
            return (
                <>
                    Put{" "}
                    <MultipleServants
                        region={region}
                        servantIds={targetIds}
                        servants={props.servants}
                    />{" "}
                    in your Party and complete Quests {num} times
                </>
            );
        default:
            return (
                <>
                    mission detail type {detail.missionCondType} num {num}{" "}
                    targets {targetIds.join(", ")}
                </>
            );
    }
}
