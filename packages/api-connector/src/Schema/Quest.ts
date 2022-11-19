import ClassName from "../Enum/ClassName";
import CondType from "../Enum/Cond";
import { Bgm } from "./Bgm";
import { Gift } from "./Gift";
import { Item } from "./Item";
import { EnemyDrop, QuestEnemy } from "./QuestEnemy";
import { SupportServant } from "./SupportServant";
import { Trait } from "./Trait";

export enum QuestConsumeType {
    NONE = "none",
    AP = "ap",
    RP = "rp",
    ITEM = "item",
    AP_AND_ITEM = "apAndItem",
}

export enum QuestType {
    MAIN = "main",
    FREE = "free",
    FRIENDSHIP = "friendship",
    EVENT = "event",
    HERO_BALLAD = "heroballad",
    WAR_BOARD = "warBoard",
}

export enum QuestAfterClearType {
    CLOSE = "close",
    REPEAT_FIRST = "repeatFirst",
    REPEAT_LAST = "repeatLast",
    RESET_INTERVAL = "resetInterval",
    CLOSE_DISP = "closeDisp",
}

export enum QuestFlag {
    NONE = "none",
    NO_BATTLE = "noBattle",
    RAID = "raid",
    RAID_CONNECTION = "raidConnection",
    NO_CONTINUE = "noContinue",
    NO_DISPLAY_REMAIN = "noDisplayRemain",
    RAID_LAST_DAY = "raidLastDay",
    CLOSED_HIDE_COST_ITEM = "closedHideCostItem",
    CLOSED_HIDE_COST_NUM = "closedHideCostNum",
    CLOSED_HIDE_PROGRESS = "closedHideProgress",
    CLOSED_HIDE_RECOMMEND_LV = "closedHideRecommendLv",
    CLOSED_HIDE_TREND_CLASS = "closedHideTrendClass",
    CLOSED_HIDE_REWARD = "closedHideReward",
    NO_DISPLAY_CONSUME = "noDisplayConsume",
    SUPER_BOSS = "superBoss",
    NO_DISPLAY_MISSION_NOTIFY = "noDisplayMissionNotify",
    HIDE_PROGRESS = "hideProgress",
    DROP_FIRST_TIME_ONLY = "dropFirstTimeOnly",
    CHAPTER_SUB_ID_JAPANESE_NUMERALS = "chapterSubIdJapaneseNumerals",
    SUPPORT_ONLY_FORCE_BATTLE = "supportOnlyForceBattle",
    EVENT_DECK_NO_SUPPORT = "eventDeckNoSupport",
    FATIGUE_BATTLE = "fatigueBattle",
    SUPPORT_SELECT_AFTER_SCRIPT = "supportSelectAfterScript",
    BRANCH = "branch",
    USER_EVENT_DECK = "userEventDeck",
    NO_DISPLAY_RAID_REMAIN = "noDisplayRaidRemain",
    QUEST_MAX_DAMAGE_RECORD = "questMaxDamageRecord",
    ENABLE_FOLLOW_QUEST = "enableFollowQuest",
    SUPPORT_SVT_MULTIPLE_SET = "supportSvtMultipleSet",
    SUPPORT_ONLY_BATTLE = "supportOnlyBattle",
    ACT_CONSUME_BATTLE_WIN = "actConsumeBattleWin",
    VOTE = "vote",
    HIDE_MASTER = "hideMaster",
    DISABLE_MASTER_SKILL = "disableMasterSkill",
    DISABLE_COMMAND_SPEEL = "disableCommandSpeel",
    SUPPORT_SVT_EDITABLE_POSITION = "supportSvtEditablePosition",
    BRANCH_SCENARIO = "branchScenario",
    QUEST_KNOCKDOWN_RECORD = "questKnockdownRecord",
    NOT_RETRIEVABLE = "notRetrievable",
    DISPLAY_LOOPMARK = "displayLoopmark",
    BOOST_ITEM_CONSUME_BATTLE_WIN = "boostItemConsumeBattleWin",
    PLAY_SCENARIO_WITH_MAPSCREEN = "playScenarioWithMapscreen",
    BATTLE_RETREAT_QUEST_CLEAR = "battleRetreatQuestClear",
    BATTLE_RESULT_LOSE_QUEST_CLEAR = "battleResultLoseQuestClear",
    BRANCH_HAVING = "branchHaving",
    NO_DISPLAY_NEXT_ICON = "noDisplayNextIcon",
    WINDOW_ONLY = "windowOnly",
    CHANGE_MASTERS = "changeMasters",
    NOT_DISPLAY_RESULT_GET_POINT = "notDisplayResultGetPoint",
    FORCE_TO_NO_DROP = "forceToNoDrop",
    DISPLAY_CONSUME_ICON = "displayConsumeIcon",
    HARVEST = "harvest",
    RECONSTRUCTION = "reconstruction",
    ENEMY_IMMEDIATE_APPEAR = "enemyImmediateAppear",
    NO_SUPPORT_LIST = "noSupportList",
    LIVE = "live",
    FORCE_DISPLAY_ENEMY_INFO = "forceDisplayEnemyInfo",
    ALLOUT_BATTLE = "alloutBattle",
    RECOLLECTION = "recollection",
}

export interface QuestRelease {
    type: CondType;
    targetId: number;
    value: number;
    closedMessage: string;
}

export interface QuestMessage {
    idx: number;
    message: string;
    condType: CondType;
    targetId: number;
    targetNum: number;
}

export interface StageStartMovie {
    waveStartMovie: string;
}

export interface Stage {
    wave: number;
    bgm: Bgm;
    fieldAis: { day?: number; raid?: number; id: number }[];
    call: number[];
    waveStartMovies: StageStartMovie[];
    enemies: QuestEnemy[];
}

export interface QuestBasic {
    id: number;
    name: string;
    type: QuestType;
    afterClear: QuestAfterClearType;
    consumeType: QuestConsumeType;
    consume: number;
    spotId: number;
    spotName: string;
    warId: number;
    warLongName: string;
    noticeAt: number;
    openedAt: number;
    closedAt: number;
}

export interface QuestPhaseBasic extends QuestBasic {
    phase: number;
    individuality: Trait[];
    qp: number;
    exp: number;
    bond: number;
    battleBgId: number;
}

export interface PhaseScript {
    scriptId: string;
    script: string;
}

export interface QuestPhaseScript {
    phase: number;
    scripts: PhaseScript[];
}

export interface QuestPhaseExtraDetail {
    questSelect?: number[];
    singleForceSvtId?: number;
    hintTitle?: string;
    hintMessage?: string;
}

export interface Quest {
    id: number;
    name: string;
    type: QuestType;
    flags: QuestFlag[];
    consumeType: QuestConsumeType;
    consume: number;
    consumeItem: { item: Item; amount: number }[];
    afterClear: QuestAfterClearType;
    recommendLv: string;
    spotId: number;
    spotName: string;
    warId: number;
    warLongName: string;
    chapterId: number;
    chapterSubId: number;
    chapterSubStr: string;
    giftIcon?: string;
    gifts: Gift[];
    releaseConditions: QuestRelease[];
    phases: number[];
    phasesWithEnemies: number[];
    phasesNoBattle: number[];
    phaseScripts: QuestPhaseScript[];
    noticeAt: number;
    openedAt: number;
    closedAt: number;
}

export interface QuestPhase extends Quest {
    phase: number;
    className: ClassName[];
    individuality: Trait[];
    qp: number;
    exp: number;
    bond: number;
    isNpcOnly: boolean;
    battleBgId: number;
    extraDetail: QuestPhaseExtraDetail;
    scripts: PhaseScript[];
    messages: QuestMessage[];
    supportServants: SupportServant[];
    drops: EnemyDrop[];
    stages: Stage[];
}

export type QuestPhaseSearchOptions = {
    name?: string;
    spotName?: string;
    warId?: number[];
    type?: QuestType[];
    flag?: QuestFlag[];
    fieldIndividuality?: number[];
    battleBgId?: number;
    bgmId?: number;
    fieldAiId?: number;
    enemySvtId?: number;
    enemySvtAiId?: number;
    enemyTrait?: number[];
    enemyClassName?: ClassName[];
    enemySkillId?: number[];
    enemyNoblePhantasmId?: number[];
};
