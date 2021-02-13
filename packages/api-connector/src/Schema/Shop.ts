import { Item } from "./Item";

export enum ShopType {
    NONE = "none",
    EVENT_ITEM = "eventItem",
    MANA = "mana",
    RARE_PRI = "rarePri",
    SVT_STORAGE = "svtStorage",
    SVT_EQUIP_STORAGE = "svtEquipStorage",
    STONE_FRAGMENTS = "stoneFragments",
    SVT_ANONYMOUS = "svtAnonymous",
    BGM = "bgm",
    LIMIT_MATERIAL = "limitMaterial",
    GRAIL_FRAGMENTS = "grailFragments",
}
export enum PayType {
    STONE = "stone",
    QP = "qp",
    FRIEND_POINT = "friendPoint",
    MANA = "mana",
    TICKET = "ticket",
    EVENT_ITEM = "eventItem",
    CHARGE_STONE = "chargeStone",
    STONE_FRAGMENTS = "stoneFragments",
    ANONYMOUS = "anonymous",
    RARE_PRI = "rarePri",
    ITEM = "item",
    GRAIL_FRAGMENTS = "grailFragments",
}

export enum PurchaseType {
    NONE = "none",
    ITEM = "item",
    EQUIP = "equip",
    FRIEND_GACHA = "friendGacha",
    SERVANT = "servant",
    SET_ITEM = "setItem",
    QUEST = "quest",
    EVENT_SHOP = "eventShop",
    EVENT_SVT_GET = "eventSvtGet",
    MANA_SHOP = "manaShop",
    STORAGE_SVT = "storageSvt",
    STORAGE_SVTEQUIP = "storageSvtequip",
    BGM = "bgm",
    COSTUME_RELEASE = "costumeRelease",
    BGM_RELEASE = "bgmRelease",
    LOTTERY_SHOP = "lotteryShop",
    EVENT_FACTORY = "eventFactory",
    ITEM_AS_PRESENT = "itemAsPresent",
    COMMAND_CODE = "commandCode",
    GIFT = "gift",
    EVENT_SVT_JOIN = "eventSvtJoin",
    ASSIST = "assist",
    KIARA_PUNISHER_RESET = "kiaraPunisherReset",
}

export interface Shop {
    id: number;
    baseShopId: number;
    shopType: ShopType;
    eventId: number;
    slot: number;
    priority: number;
    name: string;
    detail: string;
    infoMessage: string;
    warningMessage: string;
    payType: PayType;
    cost: { item: Item; amount: number };
    purchaseType: PurchaseType;
    targetIds: number[];
    setNum: number;
    limitNum: number;
    defaultLv: number;
    defaultLimitCount: number;
    openedAt: number;
    closedAt: number;
}
