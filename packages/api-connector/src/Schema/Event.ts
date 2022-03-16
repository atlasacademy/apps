import { CommonConsume } from "./CommonConsume";
import { Gift } from "./Gift";
import { Item, ItemBackgroundType } from "./Item";
import { Mission } from "./Mission";
import { PayType, Shop } from "./Shop";

export enum EventType {
    NONE = "none",
    RAID_BOSS = "raidBoss",
    PVP = "pvp",
    POINT = "point",
    LOGIN_BONUS = "loginBonus",
    COMBINE_CAMPAIGN = "combineCampaign",
    SHOP = "shop",
    QUEST_CAMPAIGN = "questCampaign",
    BANK = "bank",
    SERIAL_CAMPAIGN = "serialCampaign",
    LOGIN_CAMPAIGN = "loginCampaign",
    LOGIN_CAMPAIGN_REPEAT = "loginCampaignRepeat",
    EVENT_QUEST = "eventQuest",
    SVTEQUIP_COMBINE_CAMPAIGN = "svtequipCombineCampaign",
    TERMINAL_BANNER = "terminalBanner",
    BOX_GACHA = "boxGacha",
    BOX_GACHA_POINT = "boxGachaPoint",
    LOGIN_CAMPAIGN_STRICT = "loginCampaignStrict",
    TOTAL_LOGIN = "totalLogin",
    COMEBACK_CAMPAIGN = "comebackCampaign",
    LOCATION_CAMPAIGN = "locationCampaign",
    WAR_BOARD = "warBoard",
    COMBINE_COSUTUME_ITEM = "combineCosutumeItem",
    MYROOM_MULTIPLE_VIEW_CAMPAIGN = "myroomMultipleViewCampaign",
    RELAXED_QUEST_REQUIREMENT_CAMPAIGN = "relaxedQuestRequirementCampaign",
}

export interface EventReward {
    groupId: number;
    point: number;
    gifts: Gift[];
    bgImagePoint: string;
    bgImageGet: string;
}

export interface EventPointGroup {
    groupId: number;
    name: string;
    icon: string;
}

export interface EventPointBuff {
    id: number;
    funcIds: number[];
    groupId: number;
    eventPoint: number;
    name: string;
    detail: string;
    icon: string;
    background: ItemBackgroundType;
    value: number;
}

export interface TowerReward {
    floor: number;
    gifts: Gift[];
    boardMessage: string;
    rewardGet: string;
    banner: string;
}

export interface EventTower {
    towerId: number;
    name: string;
    rewards: TowerReward[];
}

export interface EventLotteryBox {
    id: number;
    boxIndex: number;
    no: number;
    type: number;
    gifts: Gift[];
    maxNum: number;
    isRare: boolean;
    priority: number;
    detail: string;
    icon: string;
    banner: string;
}

export interface EventLottery {
    id: number;
    slot: number;
    payType: PayType;
    cost: { item: Item; amount: number };
    priority: number;
    limited: boolean;
    boxes: EventLotteryBox[];
}

export interface EventTreasureBoxGift {
    id: number;
    idx: number;
    gifts: Gift[];
    collateralUpperLimit: number;
}

export interface EventTreasureBox {
    slot: number;
    id: number;
    idx: number;
    treasureBoxGifts: EventTreasureBoxGift[];
    maxDrawNumOnce: number;
    extraGifts: Gift[];
    commonConsume: CommonConsume;
}

export interface EventBasic {
    id: number;
    type: EventType;
    name: string;
    noticeAt: number;
    startedAt: number;
    endedAt: number;
    finishedAt: number;
    materialOpenedAt: number;
    warIds: number[];
}

export interface Event {
    id: number;
    type: EventType;
    name: string;
    shortName: string;
    detail: string;
    noticeBanner?: string;
    banner?: string;
    icon?: string;
    bannerPriority: number;
    noticeAt: number;
    startedAt: number;
    endedAt: number;
    finishedAt: number;
    materialOpenedAt: number;
    warIds: number[];
    shop: Shop[];
    rewards: EventReward[];
    pointGroups: EventPointGroup[];
    pointBuffs: EventPointBuff[];
    missions: Mission[];
    towers: EventTower[];
    lotteries: EventLottery[];
    treasureBoxes: EventTreasureBox[];
}
