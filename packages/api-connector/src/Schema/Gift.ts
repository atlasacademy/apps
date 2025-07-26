import CondType from "../Enum/Cond";

export enum GiftType {
    SERVANT = "servant",
    ITEM = "item",
    FRIENDSHIP = "friendship",
    USER_EXP = "userExp",
    EQUIP = "equip",
    EVENT_SVT_JOIN = "eventSvtJoin",
    EVENT_SVT_GET = "eventSvtGet",
    QUEST_REWARD_ICON = "questRewardIcon",
    COSTUME_RELEASE = "costumeRelease",
    COSTUME_GET = "costumeGet",
    COMMAND_CODE = "commandCode",
    EVENT_POINT_BUFF = "eventPointBuff",
    EVENT_BOARD_GAME_TOKEN = "eventBoardGameToken",
    EVENT_COMMAND_ASSIST = "eventCommandAssist",
    EVENT_HEEL_PORTRAIT = "eventHeelPortrait",
    BATTLE_ITEM = "battleItem",
    PRIVILEGE = "privilege",
    CLASS_SKILL = "classSkill",
}

export interface BaseGift {
    id: number;
    type: GiftType;
    objectId: number;
    priority: number;
    num: number;
}

export interface GiftAdd {
    priority: number;
    replacementGiftIcon: string;
    condType: CondType;
    targetId: number;
    targetNum: number;
    replacementGifts: BaseGift[];
}

export interface Gift extends BaseGift {
    giftAdds: GiftAdd[];
}
