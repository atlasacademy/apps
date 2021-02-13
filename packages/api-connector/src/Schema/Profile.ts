import CondType from "../Enum/Cond";

export enum ProfileVoiceType {
    HOME = "home",
    GROETH = "groeth",
    FIRST_GET = "firstGet",
    EVENT_JOIN = "eventJoin",
    EVENT_REWARD = "eventReward",
    BATTLE = "battle",
    TREASURE_DEVICE = "treasureDevice",
    MASTER_MISSION = "masterMission",
    EVENT_SHOP = "eventShop",
    HOME_COSTUME = "homeCostume",
    BOX_GACHA_TALK = "boxGachaTalk",
    BATTLE_ENTRY = "battleEntry",
    BATTLE_WIN = "battleWin",
    EVENT_TOWER_REWARD = "eventTowerReward",
    GUIDE = "guide",
    EVENT_DAILY_POINT = "eventDailyPoint",
    TDDAMAGE = "tddamage",
    SUM = "sum",
}

export enum VoiceCondType {
    BIRTH_DAY = "birthDay",
    EVENT = "event",
    FRIENDSHIP = "friendship",
    SVT_GET = "svtGet",
    SVT_GROUP = "svtGroup",
    QUEST_CLEAR = "questClear",
    NOT_QUEST_CLEAR = "notQuestClear",
    LEVEL_UP = "levelUp",
    LIMIT_COUNT = "limitCount",
    LIMIT_COUNT_COMMON = "limitCountCommon",
    COUNT_STOP = "countStop",
    IS_NEW_WAR = "isnewWar",
    EVENT_END = "eventEnd",
    EVENT_NOEND = "eventNoend",
    EVENT_MISSION_ACTION = "eventMissionAction",
    MASTER_MISSION = "masterMission",
    LIMIT_COUNT_ABOVE = "limitCountAbove",
    EVENT_SHOP_PURCHASE = "eventShopPurchase",
    EVENT_PERIOD = "eventPeriod",
    FRIENDSHIP_ABOVE = "friendshipAbove",
    SPACIFIC_SHOP_PURCHASE = "spacificShopPurchase",
    FRIENDSHIP_BELOW = "friendshipBelow",
    COSTUME = "costume",
    LEVEL_UP_LIMIT_COUNT = "levelUpLimitCount",
    LEVEL_UP_LIMIT_COUNT_ABOVE = "levelUpLimitCountAbove",
    LEVEL_UP_LIMIT_COUNT_BELOW = "levelUpLimitCountBelow",
}

export interface ProfileComment {
    id: number;
    priority: number;
    condMessage: string;
    comment: string;
    condType: CondType;
    condValues?: number[];
    condValue2: number;
}

export interface VoicePlayCond {
    condGroup: number;
    condType: CondType;
    targetId: number;
    condValue: number;
}

export interface Profile {
    cv: string;
    illustrator: string;
    stats?: {
        strength: string;
        endurance: string;
        agility: string;
        magic: string;
        luck: string;
        np: string;
    };
    comments: ProfileComment[];
    voices: {
        voicePrefix: number;
        type: ProfileVoiceType;
        voiceLines: {
            name?: string;
            condType?: CondType;
            condValue?: number;
            priority?: number;
            svtVoiceType?: ProfileVoiceType;
            overwriteName: string;
            id: string[];
            audioAssets: string[];
            delay: number[];
            face: number[];
            form: number[];
            text: string[];
            subtitle: string;
            conds: {
                condType: VoiceCondType;
                value: number;
                valueList: number[];
                eventId: number;
            }[];
            playConds: VoicePlayCond[];
        }[];
    }[];
    costume: {
        [key: string]: {
            id: number;
            costumeCollectionNo: number;
            name: string;
            shortName: string;
            detail: string;
            priority: number;
        };
    };
}
