import { Gift } from "./Gift";
import { Trait } from "./Trait";

export enum ItemBackgroundType {
    ZERO = "zero",
    BRONZE = "bronze",
    SILVER = "silver",
    GOLD = "gold",
    QUEST_CLEAR_QP_REWARD = "questClearQPReward",
    AQUA_BLUE = "aquaBlue",
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
    SVT_COIN = "svtCoin",
    FRIENDSHIP_UP_ITEM = "friendshipUpItem",
    PP = "pp",
    TRADE_AP = "tradeAp",
    RI = "ri",
    STORMPOD = "stormpod",
    BATTLE_ITEM = "battleItem",
}

export enum ItemUse {
    SKILL = "skill",
    APPEND_SKILL = "appendSkill",
    ASCENSION = "ascension",
    COSTUME = "costume",
}

export interface ItemSelect {
    idx: number;
    gifts: Gift[];
    requireNum: number;
    detail: string;
}

export interface Item {
    id: number;
    name: string;
    originalName: string;
    type: ItemType;
    uses: ItemUse[];
    detail: string;
    individuality: Trait[];
    icon: string;
    background: ItemBackgroundType;
    value: number;
    eventId: number;
    eventGroupId: number;
    priority: number;
    dropPriority: number;
    startedAt: number;
    endedAt: number;
    itemSelects: ItemSelect[];
}

export interface ItemAmount {
    item: Item;
    amount: number;
}

export type ItemSearchOptions = {
    name?: string;
    individuality?: number[];
    type?: ItemType[];
    background?: ItemBackgroundType[];
    use?: ItemUse[];
};
