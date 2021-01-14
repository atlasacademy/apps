export enum ItemBackgroundType {
    ZERO = "zero",
    BRONZE = "bronze",
    SILVER = "silver",
    GOLD = "gold",
    QUEST_CLEAR_QP_REWARD = "questClearQPReward",
}

export enum ItemType {
    QP = "qp",
    STONE = "stone",
    AP_RECOVER = "apRecover",
    AP_ADD = "apAdd",
    MANA = "mana",
    KEY = "key",
    GACHA_CLASS = "gachaClass",
    GACHA_RELIC = "gachaRelic",
    GACHA_TICKET = "gachaTicket",
    LIMIT = "limit",
    SKILL_LV_UP = "skillLvUp",
    TD_LV_UP = "tdLvUp",
    FRIEND_POINT = "friendPoint",
    EVENT_POINT = "eventPoint",
    EVENT_ITEM = "eventItem",
    QUEST_REWARD_QP = "questRewardQp",
    CHARGE_STONE = "chargeStone",
    RP_ADD = "rpAdd",
    BOOST_ITEM = "boostItem",
    STONE_FRAGMENTS = "stoneFragments",
    ANONYMOUS = "anonymous",
    RARE_PRI = "rarePri",
    COSTUME_RELEASE = "costumeRelease",
    ITEM_SELECT = "itemSelect",
    COMMAND_CARD_PRM_UP = "commandCardPrmUp",
    DICE = "dice",
}

export interface Item {
    id: number;
    name: string;
    type: ItemType;
    icon: string;
    background: ItemBackgroundType;
}
