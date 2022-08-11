import CondType from "../Enum/Cond";
import { BgmEntity } from "./Bgm";
import { CommonConsume } from "./CommonConsume";
import { CommonRelease } from "./CommonRelease";
import { Gift } from "./Gift";
import { Item, ItemBackgroundType } from "./Item";
import { Mission } from "./Mission";
import { VoiceGroup, VoiceLine } from "./Profile";
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
    INTERLUDE_CAMPAIGN = "interludeCampaign",
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
    talkId: number;
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

export interface EventLotteryTalk {
    talkId: number;
    no: number;
    guideImageId: number;
    beforeVoiceLines: VoiceLine[];
    afterVoiceLines: VoiceLine[];
    isRare: boolean;
}

export interface EventLottery {
    id: number;
    slot: number;
    payType: PayType;
    cost: { item: Item; amount: number };
    priority: number;
    limited: boolean;
    boxes: EventLotteryBox[];
    talks: EventLotteryTalk[];
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

export interface EventRewardSceneGuide {
    imageId: number;
    limitCount: number;
    image: string;
    faceId?: number;
    displayName?: string;
    weight?: number;
    unselectedMax?: number;
}

export enum EventRewardSceneFlag {
    NPC_GUIDE = "npcGuide",
    IS_CHANGE_SVT_BY_CHANGED_TAB = "isChangeSvtByChangedTab",
    IS_HIDE_TAB = "isHideTab",
}

export interface EventRewardScene {
    slot: number;
    groupId: number;
    type: number;
    guides: EventRewardSceneGuide[];
    tabOnImage: string;
    tabOffImage: string;
    image?: string;
    bg: string;
    bgm: BgmEntity;
    afterBgm: BgmEntity;
    flags: EventRewardSceneFlag[];
}

export interface EventVoicePlay {
    slot: number;
    idx: number;
    guideImageId: number;
    voiceLines: VoiceLine[];
    confirmVoiceLines: VoiceLine[];
    condType: CondType;
    condValue: number;
    startedAt: number;
    endedAt: number;
}

export interface EventDiggingBlock {
    id: number;
    eventId: number;
    image: string;
    commonConsume: CommonConsume;
    objectId: number;
    diggingEventPoint: number;
    blockNum: number;
}

export interface EventDiggingReward {
    id: number;
    gifts: Gift[];
    rewardSize: number;
}

export interface EventDigging {
    sizeX: number;
    sizeY: number;
    bgImage: string;
    eventPointItem: Item;
    resettableDiggedNum: number;
    blocks: EventDiggingBlock[];
    rewards: EventDiggingReward[];
}

export interface EventCooltimeReward {
    spotId: number;
    lv: number;
    name: number;
    commonRelease: CommonRelease;
    cooltime: number;
    addEventPointRate: number;
    gifts: Gift[];
    upperLimitGiftNum: number;
}

export interface EventCooltime {
    rewards: EventCooltimeReward;
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
    originalName: string;
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
    rewardScenes: EventRewardScene[];
    pointGroups: EventPointGroup[];
    pointBuffs: EventPointBuff[];
    missions: Mission[];
    towers: EventTower[];
    lotteries: EventLottery[];
    treasureBoxes: EventTreasureBox[];
    digging?: EventDigging;
    cooltime?: EventCooltime;
    voicePlays: EventVoicePlay[];
    voices: VoiceGroup[];
}
