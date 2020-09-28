export enum ProfileCommentConditionType {
    NONE = "none",
    QUEST_CLEAR = "questClear",
    ITEM_GET = "itemGet",
    USE_ITEM_ETERNITY = "useItemEternity",
    USE_ITEM_TIME = "useItemTime",
    USE_ITEM_COUNT = "useItemCount",
    SVT_LEVEL = "svtLevel",
    SVT_LIMIT = "svtLimit",
    SVT_GET = "svtGet",
    SVT_FRIENDSHIP = "svtFriendship",
    SVT_GROUP = "svtGroup",
    EVENT = "event",
    DATE = "date",
    WEEKDAY = "weekday",
    PURCHASE_QP_SHOP = "purchaseQpShop",
    PURCHASE_STONE_SHOP = "purchaseStoneShop",
    WAR_CLEAR = "warClear",
    FLAG = "flag",
    SVT_COUNT_STOP = "svtCountStop",
    BIRTH_DAY = "birthDay",
    EVENT_END = "eventEnd",
    SVT_EVENT_JOIN = "svtEventJoin",
    MISSION_CONDITION_DETAIL = "missionConditionDetail",
    EVENT_MISSION_CLEAR = "eventMissionClear",
    EVENT_MISSION_ACHIEVE = "eventMissionAchieve",
    QUEST_CLEAR_NUM = "questClearNum",
    NOT_QUEST_GROUP_CLEAR = "notQuestGroupClear",
    RAID_ALIVE = "raidAlive",
    RAID_DEAD = "raidDead",
    RAID_DAMAGE = "raidDamage",
    QUEST_CHALLENGE_NUM = "questChallengeNum",
    MASTER_MISSION = "masterMission",
    QUEST_GROUP_CLEAR = "questGroupClear",
    SUPER_BOSS_DAMAGE = "superBossDamage",
    SUPER_BOSS_DAMAGE_ALL = "superBossDamageAll",
    PURCHASE_SHOP = "purchaseShop",
    QUEST_NOT_CLEAR = "questNotClear",
    NOT_SHOP_PURCHASE = "notShopPurchase",
    NOT_SVT_GET = "notSvtGet",
    NOT_EVENT_SHOP_PURCHASE = "notEventShopPurchase",
    SVT_HAVING = "svtHaving",
    NOT_SVT_HAVING = "notSvtHaving",
    QUEST_CHALLENGE_NUM_EQUAL = "questChallengeNumEqual",
    QUEST_CHALLENGE_NUM_BELOW = "questChallengeNumBelow",
    QUEST_CLEAR_NUM_EQUAL = "questClearNumEqual",
    QUEST_CLEAR_NUM_BELOW = "questClearNumBelow",
    QUEST_CLEAR_PHASE = "questClearPhase",
    NOT_QUEST_CLEAR_PHASE = "notQuestClearPhase",
    EVENT_POINT_GROUP_WIN = "eventPointGroupWin",
    EVENT_NORMA_POINT_CLEAR = "eventNormaPointClear",
    QUEST_AVAILABLE = "questAvailable",
    QUEST_GROUP_AVAILABLE_NUM = "questGroupAvailableNum",
    EVENT_NORMA_POINT_NOT_CLEAR = "eventNormaPointNotClear",
    NOT_ITEM_GET = "notItemGet",
    COSTUME_GET = "costumeGet",
    QUEST_RESET_AVAILABLE = "questResetAvailable",
    SVT_GET_BEFORE_EVENT_END = "svtGetBeforeEventEnd",
    QUEST_CLEAR_RAW = "questClearRaw",
    QUEST_GROUP_CLEAR_RAW = "questGroupClearRaw",
    EVENT_GROUP_POINT_RATIO_IN_TERM = "eventGroupPointRatioInTerm",
    EVENT_GROUP_RANK_IN_TERM = "eventGroupRankInTerm",
    NOT_EVENT_RACE_QUEST_OR_NOT_ALL_GROUP_GOAL = "notEventRaceQuestOrNotAllGroupGoal",
    EVENT_GROUP_TOTAL_WIN_EACH_PLAYER = "eventGroupTotalWinEachPlayer",
    EVENT_SCRIPT_PLAY = "eventScriptPlay",
    SVT_COSTUME_RELEASED = "svtCostumeReleased",
    QUEST_NOT_CLEAR_AND = "questNotClearAnd",
    SVT_RECOVERD = "svtRecoverd",
    SHOP_RELEASED = "shopReleased",
    EVENT_POINT = "eventPoint",
    EVENT_REWARD_DISP_COUNT = "eventRewardDispCount",
    EQUIP_WITH_TARGET_COSTUME = "equipWithTargetCostume",
    RAID_GROUP_DEAD = "raidGroupDead",
    NOT_SVT_GROUP = "notSvtGroup",
    NOT_QUEST_RESET_AVAILABLE = "notQuestResetAvailable",
    NOT_QUEST_CLEAR_RAW = "notQuestClearRaw",
    NOT_QUEST_GROUP_CLEAR_RAW = "notQuestGroupClearRaw",
    NOT_EVENT_MISSION_CLEAR = "notEventMissionClear",
    NOT_EVENT_MISSION_ACHIEVE = "notEventMissionAchieve",
    NOT_COSTUME_GET = "notCostumeGet",
    NOT_SVT_COSTUME_RELEASED = "notSvtCostumeReleased",
    NOT_EVENT_RACE_QUEST_OR_NOT_TARGET_RANK_GOAL = "notEventRaceQuestOrNotTargetRankGoal",
    PLAYER_GENDER_TYPE = "playerGenderType",
    SHOP_GROUP_LIMIT_NUM = "shopGroupLimitNum",
    EVENT_GROUP_POINT = "eventGroupPoint",
    EVENT_GROUP_POINT_BELOW = "eventGroupPointBelow",
    EVENT_TOTAL_POINT = "eventTotalPoint",
    EVENT_TOTAL_POINT_BELOW = "eventTotalPointBelow",
    EVENT_VALUE = "eventValue",
    EVENT_VALUE_BELOW = "eventValueBelow",
    EVENT_FLAG = "eventFlag",
    EVENT_STATUS = "eventStatus",
    NOT_EVENT_STATUS = "notEventStatus",
    FORCE_FALSE = "forceFalse",
    SVT_HAVING_LIMIT_MAX = "svtHavingLimitMax",
    EVENT_POINT_BELOW = "eventPointBelow",
    SVT_EQUIP_FRIENDSHIP_HAVING = "svtEquipFriendshipHaving",
    MOVIE_NOT_DOWNLOAD = "movieNotDownload",
    MULTIPLE_DATE = "multipleDate",
    SVT_FRIENDSHIP_ABOVE = "svtFriendshipAbove",
    SVT_FRIENDSHIP_BELOW = "svtFriendshipBelow",
    MOVIE_DOWNLOADED = "movieDownloaded",
    ROUTE_SELECT = "routeSelect",
    NOT_ROUTE_SELECT = "notRouteSelect",
    LIMIT_COUNT = "limitCount",
    LIMIT_COUNT_ABOVE = "limitCountAbove",
    LIMIT_COUNT_BELOW = "limitCountBelow",
    BAD_END_PLAY = "badEndPlay",
    COMMAND_CODE_GET = "commandCodeGet",
    NOT_COMMAND_CODE_GET = "notCommandCodeGet",
    ALL_USERS_BOX_GACHA_COUNT = "allUsersBoxGachaCount",
    TOTAL_TD_LEVEL = "totalTdLevel",
    TOTAL_TD_LEVEL_ABOVE = "totalTdLevelAbove",
    TOTAL_TD_LEVEL_BELOW = "totalTdLevelBelow",
    COMMON_RELEASE = "commonRelease",
    BATTLE_RESULT_WIN = "battleResultWin",
    BATTLE_RESULT_LOSE = "battleResultLose",
    EVENT_VALUE_EQUAL = "eventValueEqual",
    BOARD_GAME_TOKEN_HAVING = "boardGameTokenHaving",
    BOARD_GAME_TOKEN_GROUP_HAVING = "boardGameTokenGroupHaving",
    EVENT_FLAG_ON = "eventFlagOn",
    EVENT_FLAG_OFF = "eventFlagOff",
    QUEST_STATUS_FLAG_ON = "questStatusFlagOn",
    QUEST_STATUS_FLAG_OFF = "questStatusFlagOff",
    EVENT_VALUE_NOT_EQUAL = "eventValueNotEqual",
    LIMIT_COUNT_MAX_EQUAL = "limitCountMaxEqual",
    LIMIT_COUNT_MAX_ABOVE = "limitCountMaxAbove",
    LIMIT_COUNT_MAX_BELOW = "limitCountMaxBelow",
    BOARD_GAME_TOKEN_GET_NUM = "boardGameTokenGetNum",
    BATTLE_LINE_WIN_ABOVE = "battleLineWinAbove",
    BATTLE_LINE_LOSE_ABOVE = "battleLineLoseAbove",
    BATTLE_LINE_CONTINUE_WIN = "battleLineContinueWin",
    BATTLE_LINE_CONTINUE_LOSE = "battleLineContinueLose",
    BATTLE_LINE_CONTINUE_WIN_BELOW = "battleLineContinueWinBelow",
    BATTLE_LINE_CONTINUE_LOSE_BELOW = "battleLineContinueLoseBelow",
    BATTLE_GROUP_WIN_AVOVE = "battleGroupWinAvove",
    BATTLE_GROUP_LOSE_AVOVE = "battleGroupLoseAvove",
}

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
    condType: ProfileCommentConditionType;
    condValues?: number[];
    condValue2: number;
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
    }
    comments: ProfileComment[];
    voices: {
        type: ProfileVoiceType;
        voiceLines: {
            name?: string;
            condType?: ProfileCommentConditionType;
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
            }[]
        }[]
    }[]
}
