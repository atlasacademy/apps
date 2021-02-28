import { Gift } from "./Gift";
import { ItemBackgroundType } from "./Item";
import { Shop } from "./Shop";

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
}

export interface EventReward {
    groupId: number;
    point: number;
    gifts: Gift[];
    bgImagePoint: string;
    bgImageGet: string;
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
    pointBuffs: EventPointBuff[];
}
