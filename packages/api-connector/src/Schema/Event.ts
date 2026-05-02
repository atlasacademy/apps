import CondType from "../Enum/Cond.js";
import { BgmEntity } from "./Bgm.js";
import { CombineAdjustTarget, CombineCalc } from "./Combine.js";
import { CommonConsume } from "./CommonConsume.js";
import { CommonRelease } from "./CommonRelease.js";
import { Gift } from "./Gift.js";
import { Item, ItemAmount, ItemBackgroundType } from "./Item.js";
import { Mission } from "./Mission.js";
import { VoiceGroup, VoiceLine } from "./Profile.js";
import { QuestReleaseOverwrite } from "./Quest.js";
import { PayType, Shop } from "./Shop.js";
import { Skill } from "./Skill.js";
import { SvtClassSupportGroupType } from "./Support.js";
import { WarBoard } from "./WarBoard.js";

export interface EventAlloutBattle {
    eventId: number;
    alloutBattleId: number;
    warId: number;
}

export enum EventFlag {
    TYPE_POINT = "typePoint",
    TYPE_EXCHANGE_SHOP = "typeExchangeShop",
    TYPE_BOX_GACHA = "typeBoxGacha",
    TYPE_RANKING = "typeRanking",
    TYPE_BONUS_SKILL = "typeBonusSkill",
    TYPE_MISSION = "typeMission",
    TYPE_RAID = "typeRaid",
    TYPE_EVENT_SHOP = "typeEventShop",
    MATERIAL_ADD_QUEST_GROUP = "materialAddQuestGroup",
    MATERIAL_ADD_EVENT_END = "materialAddEventEnd",
    SUPER_BOSS = "superBoss",
    RAID_DEFEAT_COUNT = "raidDefeatCount",
    BP = "bp",
    NO_MATERIAL_BANNER = "noMaterialBanner",
    EVENT_POINT = "eventPoint",
    EVENT_GROUP_POINT = "eventGroupPoint",
    EVENT_VOICE_PLAY = "eventVoicePlay",
    DAILY_MISSION = "dailyMission",
    EVENT_GROUP_RANKING = "eventGroupRanking",
    EVENT_TOWER = "eventTower",
    EVENT_FATIGUE = "eventFatigue",
    NO_DISP_ARROW = "noDispArrow",
    FORCED_ADJUSTMENT_DIALOG = "forcedAdjustmentDialog",
    SHIFT_HELP_INFO = "shiftHelpInfo",
    CLOSE_PURCHASE_SHOP = "closePurchaseShop",
    TIME_STATUS_RECORD = "timeStatusRecord",
    USE_EVENT_SUPPORT_DECK = "useEventSupportDeck",
    EVENT_DAIRY_POINT = "eventDairyPoint",
    EVENT_ACTIVITY_POINT = "eventActivityPoint",
    EVENT_ONLY_EQUIP = "eventOnlyEquip",
    MAP_SWITCH_BUTTON_TOP = "mapSwitchButtonTop",
    EVENT_REVIVAL = "eventRevival",
    EVENT_CONQUEST = "eventConquest",
    EVENT_POINT_BY_QP = "eventPointByQp",
    ALL_USERS_BOX_GACHA_COUNT = "allUsersBoxGachaCount",
    NOT_DISPLAY_BONUS_ON_SUPPORT_SET = "notDisplayBonusOnSupportSet",
    FRIEND_POINT_BOOST_ITEM = "friendPointBoostItem",
    EVENT_BOARD_GAME = "eventBoardGame",
    NOT_DISPLAY_DA_VINCI = "notDisplayDaVinci",
    IS_MAIN_INTERLUDE = "isMainInterlude",
    QUEST_COOLTIME = "questCooltime",
    EVENT_PANEL = "eventPanel",
    EVENT_ASSIST = "eventAssist",
    TREASURE_BOX = "treasureBox",
    HIDE_AFTER_PURCHASE = "hideAfterPurchase",
    ALLOUT_BATTLE = "alloutBattle",
    SPOT_COOLTIME = "spotCooltime",
}

export enum EventTradeGoodsBoardType {
    TRADE = "trade",
    CRAFT = "craft",
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
    phase: number;
    isExcepted: boolean;
}

export interface EventCampaignScript {
    OnlyMaxFuncGroupId?: number;
    addPassiveIconOrganization?: string;
    addPassiveContentOrganization?: string;
    addPassiveContentDetail?: string;
    addPassiveDescriptionDetail?: string;
    addPassiveSkillId?: number;
}

export interface EventCampaign {
    targetIds: number[];
    warIds: number[];
    warGroupIds: number[];
    script: EventCampaignScript;
    target: CombineAdjustTarget;
    idx: number;
    value: number;
    calcType: CombineCalc;
    entryCondMessage: string;
}

export interface EventDetail {
    flags: EventFlag[];
    pointImageId: number;
    condQuestId: number;
    condQuestPhase: number;
    condMessage: string;
    shopCondQuestId: number;
    shopCondQuestPhase: number;
    shopCondMessage: string;
    entryCondMessage: string;
}

export interface EventTradePickup {
    startedAt: number;
    endedAt: number;
    tradeTimeRate: number;
}

export interface EventTradeGoods {
    id: number;
    boardType: EventTradeGoodsBoardType;
    name: string;
    goodsIcon: string;
    gifts: Gift[];
    consumes: CommonConsume[];
    eventPointNum: number;
    eventPointItem: Item;
    tradeTime: number;
    maxNum: number;
    maxTradeTime: number;
    releaseConditions: CommonRelease[];
    closedMessage: string;
    pickups: EventTradePickup[];
}

export interface EventCommandAssist {
    id: number;
    priority: number;
    lv: number;
    name: string;
    assistCard: string;
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
    eventDetail?: EventDetail;
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
    questReleaseOverwrites: QuestReleaseOverwrite[];
    tradeGoods: EventTradeGoods[];
    commandAssists: EventCommandAssist[];
    heelPortraits: EventHeelPortrait[];
    murals: EventMural[];
    digging?: EventDigging;
    cooltime?: EventCooltime;
    voicePlays: EventVoicePlay[];
    voices: VoiceGroup[];
}
