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
}

export interface Gift {
    id: number;
    type: GiftType;
    objectId: number;
    priority: number;
    num: number;
}
