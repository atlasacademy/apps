import CondType from "../Enum/Cond";
import { CommonConsume } from "./CommonConsume";
import { Gift } from "./Gift";
import { Item, ItemAmount } from "./Item";

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
    SVT_COSTUME = "svtCostume",
    START_UP_SUMMON = "startUpSummon",
    SHOP13 = "shop13",
    TRADE_AP = "tradeAp",
    SHOP15 = "shop15",
    EVENT_SVT_EQUIP = "eventSvtEquip",
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
    FREE = "free",
    COMMON_CONSUME = "commonConsume",
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

export interface ItemSet {
    id: number;
    purchaseType: PurchaseType;
    targetId: number;
    setNum: number;
    gifts: Gift[];
}

export interface ShopRelease {
    condValues: number[];
    shopId: number;
    condType: CondType;
    condNum: number;
    priority: number;
    isClosedDisp: boolean;
    closedMessage: string;
    closedItemName: string;
}

export interface Shop {
    id: number;
    baseShopId: number;
    shopType: ShopType;
    releaseConditions: ShopRelease[];
    eventId: number;
    slot: number;
    priority: number;
    name: string;
    detail: string;
    infoMessage: string;
    warningMessage: string;
    payType: PayType;
    cost: ItemAmount;
    consumes: CommonConsume[];
    purchaseType: PurchaseType;
    targetIds: number[];
    itemSet: ItemSet[];
    setNum: number;
    limitNum: number;
    gifts: Gift[];
    defaultLv: number;
    defaultLimitCount: number;
    scriptName?: string;
    scriptId?: string;
    script?: string;
    image?: string;
    openedAt: number;
    closedAt: number;
}

export type ShopSearchOptions = {
    name?: string;
    eventId?: number[];
    type?: ShopType[];
    payType?: PayType[];
};
