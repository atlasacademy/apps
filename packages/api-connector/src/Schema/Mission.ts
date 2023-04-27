import Cond from "../Enum/Cond";
import { Gift } from "./Gift";
import { Trait } from "./Trait";

export enum MissionType {
    NONE = "none",
    EVENT = "event",
    WEEKLY = "weekly",
    DAILY = "daily",
    EXTRA = "extra",
    LIMITED = "limited",
    COMPLETE = "complete",
    RANDOM = "random",
}

export enum RewardType {
    GIFT = "gift",
    EXTRA = "extra",
    SET = "set",
}

export enum ProgressType {
    NONE = "none",
    REGIST = "regist",
    OPEN_CONDITION = "openCondition",
    START = "start",
    CLEAR = "clear",
    ACHIEVE = "achieve",
}

export enum DetailCondLinkType {
    EVENT_START = "eventStart",
    MISSION_START = "missionStart",
    MASTER_MISSION_START = "masterMissionStart",
    RANDOM_MISSION_START = "randomMissionStart",
}

export enum DetailCondType {
    ENEMY_KILL_NUM = 1,
    ENEMY_INDIVIDUALITY_KILL_NUM = 2,
    ITEM_GET_TOTAL = 3,
    BATTLE_SVT_IN_DECK = 4, // Unused
    BATTLE_SVT_EQUIP_IN_DECK = 5, // Unused
    TARGET_QUEST_ENEMY_KILL_NUM = 6,
    TARGET_QUEST_ENEMY_INDIVIDUALITY_KILL_NUM = 7,
    TARGET_QUEST_ITEM_GET_TOTAL = 8,
    QUEST_CLEAR_ONCE = 9,
    QUEST_CLEAR_NUM_1 = 10,
    ITEM_GET_BATTLE = 12,
    DEFEAT_ENEMY_INDIVIDUALITY = 13,
    DEFEAT_ENEMY_CLASS = 14,
    DEFEAT_SERVANT_CLASS = 15,
    DEFEAT_ENEMY_NOT_SERVANT_CLASS = 16,
    BATTLE_SVT_INDIVIDUALITY_IN_DECK = 17,
    BATTLE_SVT_CLASS_IN_DECK = 18, // Filter by svt class
    SVT_GET_BATTLE = 19, // Embers are svt instead of items
    FRIEND_POINT_SUMMON = 21,
    BATTLE_SVT_ID_IN_DECK_1 = 22,
    BATTLE_SVT_ID_IN_DECK_2 = 23, // Filter by svt ID
    QUEST_CLEAR_NUM_2 = 24, // Not sure what's the difference QUEST_CLEAR_NUM_1
    DICE_USE = 25, // Probably Fate/Requiem event
    SQUARE_ADVANCED = 26,
    MORE_FRIEND_FOLLOWER = 27, // 5th Anniversary missions
    QUEST_TYPE_CLEAR = 28, // 22M Download Campaign
    QUEST_CLEAR_NUM_INCLUDING_GRAILFRONT = 31,
    WAR_MAIN_QUEST_CLEAR = 32,
}

export interface MissionConditionDetail {
    id: number;
    missionTargetId: number;
    missionCondType: number;
    logicType: number;
    targetIds: number[];
    addTargetIds: number[];
    targetQuestIndividualities: Trait[];
    conditionLinkType: DetailCondLinkType;
    targetEventIds?: number[];
}

export interface MissionCondition {
    id: number;
    missionProgressType: ProgressType;
    priority: number;
    missionTargetId: number;
    condGroup: number;
    condType: Cond;
    targetIds: number[];
    targetNum: number;
    conditionMessage: string;
    closedMessage: string;
    flag: number;
    detail?: MissionConditionDetail;
    details?: MissionConditionDetail[];
}

export interface Mission {
    id: number;
    flag: number;
    type: MissionType;
    missionTargetId: number;
    dispNo: number;
    name: string;
    detail: string;
    startedAt: number;
    endedAt: number;
    closedAt: number;
    rewardType: RewardType;
    gifts: Gift[];
    bannerGroup: number;
    priority: number;
    rewardRarity: number;
    notfyPriority: number;
    presentMessageId: number;
    groups: number[];
    conds: MissionCondition[];
}
