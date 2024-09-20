import Card from "../Enum/Card";
import CondType from "../Enum/Cond";
import { BgmEntity } from "./Bgm";
import { CombineAdjustTarget, CombineCalc } from "./Combine";
import { CommonConsume } from "./CommonConsume";
import { CommonRelease } from "./CommonRelease";
import { Gift } from "./Gift";
import { Item, ItemAmount, ItemBackgroundType } from "./Item";
import { Mission } from "./Mission";
import { VoiceGroup, VoiceLine } from "./Profile";
import { PayType, Shop } from "./Shop";
import { Skill } from "./Skill";
import { SvtClassSupportGroupType } from "./Support";
import { WarBoard } from "./WarBoard";

export interface EventAlloutBattle {
    eventId: number;
    alloutBattleId: number;
    warId: number;
}

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
    MYROOM_PHOTO_CAMPAIGN = "myroomPhotoCampaign",
    FORTUNE_CAMPAIGN = "fortuneCampaign",
    GENDER_SELECTION = "genderSelection",
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
    skillIcon?: string;
    lv?: number;
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
    cost: ItemAmount;
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
    consumes: CommonConsume[];
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
    consumes: CommonConsume[];
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
    releaseConditions: CommonRelease[];
    cooltime: number;
    addEventPointRate: number;
    gifts: Gift[];
    upperLimitGiftNum: number;
}

export interface EventCooltime {
    rewards: EventCooltimeReward;
}

export interface EventBulletinBoardRelease {
    condGroup: number;
    condType: CondType;
    condTargetId: number;
    condNum: number;
}

export interface EventBulletinBoard {
    bulletinBoardId: number;
    message: string;
    probability: number;
    releaseConditions: EventBulletinBoardRelease[];
}

export interface EventRecipeGift {
    idx: number;
    displayOrder: number;
    gifts: Gift[];
}

export interface EventRecipe {
    id: number;
    icon: string;
    name: string;
    maxNum: number;
    eventPointItem: Item;
    eventPointNum: number;
    consumes: CommonConsume[];
    releaseConditions: CommonRelease[];
    closedMessage: string;
    recipeGifts: EventRecipeGift[];
}

export enum EventFortificationSvtType {
    USER_SVT = "userSvt",
    NPC = "npc",
    NONE = "none",
}

export interface EventFortificationSvt {
    position: number;
    type: EventFortificationSvtType;
    svtId: number;
    limitCount: number;
    lv: number;
    releaseConditions: CommonRelease[];
}

export interface EventFortificationDetail {
    position: number;
    name: string;
    className: SvtClassSupportGroupType;
    releaseConditions: CommonRelease[];
}

export enum EventWorkType {
    MILITSRY_AFFAIRS = "militsryAffairs",
    INTERNAL_AFFAIRS = "internalAffairs",
    FARMMING = "farmming",
}

export interface EventFortification {
    idx: number;
    name: string;
    x: number;
    y: number;
    rewardSceneX: number;
    rewardSceneY: number;
    maxFortificationPoint: number;
    workType: EventWorkType;
    gifts: Gift[];
    releaseConditions: CommonRelease[];
    details: EventFortificationDetail[];
    servants: EventFortificationSvt[];
}

export interface EventRandomMission {
    missionId: number;
    missionRank: number;
    condType: CondType;
    condId: number;
    condNum: number;
}

export interface EventMissionGroup {
    id: number;
    missionIds: number[];
}

export interface EventQuest {
    questId: number;
}

export interface EventCampaign {
    targetIds: number[];
    warIds: number[];
    target: CombineAdjustTarget;
    idx: number;
    value: number;
    calcType: CombineCalc;
    entryCondMessage: string;
}

export interface EventCommandAssist {
    id: number;
    priority: number;
    lv: number;
    name: string;
    assistCard: Card;
    image: string;
    skill: Skill;
    skillLv: number;
    releaseConditions: CommonRelease[];
}

export interface EventHeelPortrait {
    id: number;
    name: string;
    image: string;
    dispCondType: CondType;
    dispCondId: number;
    dispCondNum: number;
    script: Record<string, unknown>;
}

export interface EventMural {
    id: number;
    message: string;
    images: string[];
    num: number;
    condQuestId: number;
    condQuestPhase: number;
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

export enum EventOverwriteType {
    BG_IMAGE = "bgImage",
    BGM = "bgm",
    NAME = "name",
    BANNER = "banner",
    NOTICE_BANNER = "noticeBanner",
}

export interface EventAdd {
    overwriteType: EventOverwriteType;
    priority: number;
    overwriteId: number;
    overwriteText: string;
    overwriteBanner?: string;
    condType: CondType;
    targetId: number;
    startedAt: number;
    endedAt: number;
}

export enum EventPointActivityObjectType {
    QUEST_ID = "questId",
    SKILL_ID = "skillId",
    SHOP_ID = "shopId",
}

export interface EventPointActivity {
    groupId: number;
    point: number;
    objectType: EventPointActivityObjectType;
    objectId: number;
    objectValue: number;
}

export enum EventSvtType {
    NONE = "none",
    JOIN = "join",
    COND_JOIN = "condJoin",
    DIRECT_JOIN = "directJoin",
}

export interface EventSvtScript {
    addGetMessage: string;
    addMessageReleaseConditions: CommonRelease[];
    isProtectedDuringEvent: boolean;
    joinQuestId: number;
    joinShopId: number;
    notPresentAnonymous: boolean;
    notPresentRarePri: number;
    ruby: string;
}

export interface EventSvt {
    svtId: number;
    script: EventSvtScript;
    originalScript: Record<string, any>;
    type: EventSvtType;
    joinMessage: string;
    getMessage: string;
    leaveMessage: string;
    name: string;
    battleName: string;
    releaseConditions: CommonRelease[];
    startedAt: number;
    endedAt: number;
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
    eventAdds: EventAdd[];
    shop: Shop[];
    rewards: EventReward[];
    svts: EventSvt[];
    rewardScenes: EventRewardScene[];
    pointGroups: EventPointGroup[];
    pointBuffs: EventPointBuff[];
    pointActivities: EventPointActivity[];
    missions: Mission[];
    randomMissions: EventRandomMission[];
    missionGroups: EventMissionGroup[];
    towers: EventTower[];
    lotteries: EventLottery[];
    warBoards: WarBoard[];
    treasureBoxes: EventTreasureBox[];
    bulletinBoards: EventBulletinBoard[];
    recipes: EventRecipe[];
    fortifications: EventFortification[];
    campaigns: EventCampaign[];
    campaignQuests: EventQuest[];
    commandAssists: EventCommandAssist[];
    heelPortraits: EventHeelPortrait[];
    murals: EventMural[];
    digging?: EventDigging;
    cooltime?: EventCooltime;
    voicePlays: EventVoicePlay[];
    voices: VoiceGroup[];
}
