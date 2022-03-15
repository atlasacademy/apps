import { Skill } from "./Skill";
import { Trait } from "./Trait";

export enum AiType {
    SVT = "svt",
    FIELD = "field",
}

export enum AiActNum {
    NOMAL = "nomal",
    ANYTIME = "anytime",
    REACTION_ENEMYTURN_START = "reactionEnemyturnStart",
    REACTION_ENEMYTURN_END = "reactionEnemyturnEnd",
    REACTION_DEAD = "reactionDead",
    REACTION_PLAYERACTIONEND = "reactionPlayeractionend",
    REACTION_WAVESTART = "reactionWavestart",
    MAXNP = "maxnp",
    SHIFT_SARVANT_AFTER = "shiftSarvantAfter",
    USENP_TARGET = "usenpTarget",
    REACTION_TURNSTART = "reactionTurnstart",
    REACTION_PLAYERACTIONSTART = "reactionPlayeractionstart",
    REACTION_ENTRY_UNIT = "reactionEntryUnit",
    UNKNOWN = "unknown",
}

export enum AiCond {
    NONE = "none",
    HP_HIGHER = "hpHigher",
    HP_LOWER = "hpLower",
    ACTCOUNT = "actcount",
    ACTCOUNT_MULTIPLE = "actcountMultiple",
    TURN = "turn",
    TURN_MULTIPLE = "turnMultiple",
    BEFORE_ACT_ID = "beforeActId",
    BEFORE_ACT_TYPE = "beforeActType",
    BEFORE_NOT_ACT_ID = "beforeNotActId",
    BEFORE_NOT_ACT_TYPE = "beforeNotActType",
    CHECK_SELF_BUFF = "checkSelfBuff",
    CHECK_SELF_INDIVIDUALITY = "checkSelfIndividuality",
    CHECK_PT_BUFF = "checkPtBuff",
    CHECK_PT_INDIVIDUALITY = "checkPtIndividuality",
    CHECK_OPPONENT_BUFF = "checkOpponentBuff",
    CHECK_OPPONENT_INDIVIDUALITY = "checkOpponentIndividuality",
    CHECK_SELF_BUFF_INDIVIDUALITY = "checkSelfBuffIndividuality",
    CHECK_PT_BUFF_INDIVIDUALITY = "checkPtBuffIndividuality",
    CHECK_OPPONENT_BUFF_INDIVIDUALITY = "checkOpponentBuffIndividuality",
    CHECK_SELF_NPTURN = "checkSelfNpturn",
    CHECK_PT_LOWER_NPTURN = "checkPtLowerNpturn",
    CHECK_OPPONENT_HEIGHT_NPGAUGE = "checkOpponentHeightNpgauge",
    ACTCOUNT_THISTURN = "actcountThisturn",
    CHECK_PT_HP_HIGHER = "checkPtHpHigher",
    CHECK_PT_HP_LOWER = "checkPtHpLower",
    CHECK_SELF_NOT_BUFF_INDIVIDUALITY = "checkSelfNotBuffIndividuality",
    TURN_AND_ACTCOUNT_THISTURN = "turnAndActcountThisturn",
    FIELDTURN = "fieldturn",
    FIELDTURN_MULTIPLE = "fieldturnMultiple",
    CHECK_PT_LOWER_TDTURN = "checkPtLowerTdturn",
    RAID_HP_HIGHER = "raidHpHigher",
    RAID_HP_LOWER = "raidHpLower",
    RAID_COUNT_HIGHER = "raidCountHigher",
    RAID_COUNT_LOWER = "raidCountLower",
    RAID_COUNT_VALUE_HIGHER = "raidCountValueHigher",
    RAID_COUNT_VALUE_LOWER = "raidCountValueLower",
    CHECK_SPACE = "checkSpace",
    TURN_HIGHER = "turnHigher",
    TURN_LOWER = "turnLower",
    CHARACTOR_TURN_HIGHER = "charactorTurnHigher",
    CHARACTOR_TURN_LOWER = "charactorTurnLower",
    COUNT_ALIVE_PT = "countAlivePt",
    COUNT_ALIVE_OPPONENT = "countAliveOpponent",
    COUNT_PT_REST_HIGHER = "countPtRestHigher",
    COUNT_PT_REST_LOWER = "countPtRestLower",
    COUNT_OPPONENT_REST_HIGHER = "countOpponentRestHigher",
    COUNT_OPPONENT_REST_LOWER = "countOpponentRestLower",
    COUNT_ITEM_HIGHER = "countItemHigher",
    COUNT_ITEM_LOWER = "countItemLower",
    CHECK_SELF_BUFFCOUNT_INDIVIDUALITY = "checkSelfBuffcountIndividuality",
    CHECK_PT_BUFFCOUNT_INDIVIDUALITY = "checkPtBuffcountIndividuality",
    CHECK_SELF_BUFF_ACTIVE = "checkSelfBuffActive",
    CHECK_PT_BUFF_ACTIVE = "checkPtBuffActive",
    CHECK_OPPONENT_BUFF_ACTIVE = "checkOpponentBuffActive",
    COUNT_ENEMY_COMMAND_SPELL_HIGHER = "countEnemyCommandSpellHigher",
    CHECK_PT_ALL_INDIVIDUALITY = "checkPtAllIndividuality",
    CHECK_OPPONENT_ALL_INDIVIDUALITY = "checkOpponentAllIndividuality",
    STAR_HIGHER = "starHigher",
    STAR_LOWER = "starLower",
    CHECK_OPPONENT_HP_HIGHER = "checkOpponentHpHigher",
    CHECK_OPPONENT_HP_LOWER = "checkOpponentHpLower",
    CHECK_TARGET_POSITION = "checkTargetPosition",
    CHECK_SELF_BUFF_ACTIVE_AND_PASSIVE_INDIVIDUALITY = "checkSelfBuffActiveAndPassiveIndividuality",
    CHECK_PT_BUFF_ACTIVE_AND_PASSIVE_INDIVIDUALITY = "checkPtBuffActiveAndPassiveIndividuality",
    CHECK_OPPONENT_BUFF_ACTIVE_AND_PASSIVE_INDIVIDUALITY = "checkOpponentBuffActiveAndPassiveIndividuality",
    CHECK_PT_ALL_BUFF = "checkPtAllBuff",
    CHECK_OPPONENT_ALL_BUFF = "checkOpponentAllBuff",
    CHECK_PT_ALL_BUFF_INDIVIDUALITY = "checkPtAllBuffIndividuality",
    CHECK_OPPONENT_ALL_BUFF_INDIVIDUALITY = "checkOpponentAllBuffIndividuality",
    COUNT_ALIVE_PT_ALL = "countAlivePtAll",
    COUNT_ALIVE_OPPONENT_ALL = "countAliveOpponentAll",
    CHECK_PT_ALL_BUFF_ACTIVE = "checkPtAllBuffActive",
    CHECK_OPPONENT_ALL_BUFF_ACTIVE = "checkOpponentAllBuffActive",
    COUNT_HIGHER_BUFF_INDIVIDUALITY_SUM_PT = "countHigherBuffIndividualitySumPt",
    COUNT_HIGHER_BUFF_INDIVIDUALITY_SUM_PT_ALL = "countHigherBuffIndividualitySumPtAll",
    COUNT_HIGHER_BUFF_INDIVIDUALITY_SUM_OPPONENT = "countHigherBuffIndividualitySumOpponent",
    COUNT_HIGHER_BUFF_INDIVIDUALITY_SUM_OPPONENT_ALL = "countHigherBuffIndividualitySumOpponentAll",
    COUNT_HIGHER_BUFF_INDIVIDUALITY_SUM_SELF = "countHigherBuffIndividualitySumSelf",
    COUNT_LOWER_BUFF_INDIVIDUALITY_SUM_PT = "countLowerBuffIndividualitySumPt",
    COUNT_LOWER_BUFF_INDIVIDUALITY_SUM_PT_ALL = "countLowerBuffIndividualitySumPtAll",
    COUNT_LOWER_BUFF_INDIVIDUALITY_SUM_OPPONENT = "countLowerBuffIndividualitySumOpponent",
    COUNT_LOWER_BUFF_INDIVIDUALITY_SUM_OPPONENT_ALL = "countLowerBuffIndividualitySumOpponentAll",
    COUNT_LOWER_BUFF_INDIVIDUALITY_SUM_SELF = "countLowerBuffIndividualitySumSelf",
    COUNT_EQUAL_BUFF_INDIVIDUALITY_SUM_PT = "countEqualBuffIndividualitySumPt",
    COUNT_EQUAL_BUFF_INDIVIDUALITY_SUM_PT_ALL = "countEqualBuffIndividualitySumPtAll",
    COUNT_EQUAL_BUFF_INDIVIDUALITY_SUM_OPPONENT = "countEqualBuffIndividualitySumOpponent",
    COUNT_EQUAL_BUFF_INDIVIDUALITY_SUM_OPPONENT_ALL = "countEqualBuffIndividualitySumOpponentAll",
    COUNT_EQUAL_BUFF_INDIVIDUALITY_SUM_SELF = "countEqualBuffIndividualitySumSelf",
    EXIST_INDIVIDUALITY_OPPONENT_FRONT = "existIndividualityOpponentFront",
    EXIST_INDIVIDUALITY_OPPONENT_CENTER = "existIndividualityOpponentCenter",
    EXIST_INDIVIDUALITY_OPPONENT_BACK = "existIndividualityOpponentBack",
    TOTAL_COUNT_HIGHER_INDIVIDUALITY_PT = "totalCountHigherIndividualityPt",
    TOTAL_COUNT_HIGHER_INDIVIDUALITY_PT_ALL = "totalCountHigherIndividualityPtAll",
    TOTAL_COUNT_HIGHER_INDIVIDUALITY_OPPONENT = "totalCountHigherIndividualityOpponent",
    TOTAL_COUNT_HIGHER_INDIVIDUALITY_OPPONENT_ALL = "totalCountHigherIndividualityOpponentAll",
    TOTAL_COUNT_HIGHER_INDIVIDUALITY_ALL_FIELD = "totalCountHigherIndividualityAllField",
    TOTAL_COUNT_LOWER_INDIVIDUALITY_PT = "totalCountLowerIndividualityPt",
    TOTAL_COUNT_LOWER_INDIVIDUALITY_PT_ALL = "totalCountLowerIndividualityPtAll",
    TOTAL_COUNT_LOWER_INDIVIDUALITY_OPPONENT = "totalCountLowerIndividualityOpponent",
    TOTAL_COUNT_LOWER_INDIVIDUALITY_OPPONENT_ALL = "totalCountLowerIndividualityOpponentAll",
    TOTAL_COUNT_LOWER_INDIVIDUALITY_ALL_FIELD = "totalCountLowerIndividualityAllField",
    TOTAL_COUNT_EQUAL_INDIVIDUALITY_PT = "totalCountEqualIndividualityPt",
    TOTAL_COUNT_EQUAL_INDIVIDUALITY_PT_ALL = "totalCountEqualIndividualityPtAll",
    TOTAL_COUNT_EQUAL_INDIVIDUALITY_OPPONENT = "totalCountEqualIndividualityOpponent",
    TOTAL_COUNT_EQUAL_INDIVIDUALITY_OPPONENT_ALL = "totalCountEqualIndividualityOpponentAll",
    TOTAL_COUNT_EQUAL_INDIVIDUALITY_ALL_FIELD = "totalCountEqualIndividualityAllField",
    PT_FRONT_DEAD_EQUAL = "ptFrontDeadEqual",
    PT_CENTER_DEAD_EQUAL = "ptCenterDeadEqual",
    PT_BACK_DEAD_EQUAL = "ptBackDeadEqual",
    COUNT_HIGHER_INDIVIDUALITY_PT_FRONT = "countHigherIndividualityPtFront",
    COUNT_HIGHER_INDIVIDUALITY_PT_CENTER = "countHigherIndividualityPtCenter",
    COUNT_HIGHER_INDIVIDUALITY_PT_BACK = "countHigherIndividualityPtBack",
    COUNT_HIGHER_INDIVIDUALITY_OPPONENT_FRONT = "countHigherIndividualityOpponentFront",
    COUNT_HIGHER_INDIVIDUALITY_OPPONENT_CENTER = "countHigherIndividualityOpponentCenter",
    COUNT_HIGHER_INDIVIDUALITY_OPPONENT_BACK = "countHigherIndividualityOpponentBack",
    COUNT_LOWER_INDIVIDUALITY_PT_FRONT = "countLowerIndividualityPtFront",
    COUNT_LOWER_INDIVIDUALITY_PT_CENTER = "countLowerIndividualityPtCenter",
    COUNT_LOWER_INDIVIDUALITY_PT_BACK = "countLowerIndividualityPtBack",
    COUNT_LOWER_INDIVIDUALITY_OPPONENT_FRONT = "countLowerIndividualityOpponentFront",
    COUNT_LOWER_INDIVIDUALITY_OPPONENT_CENTER = "countLowerIndividualityOpponentCenter",
    COUNT_LOWER_INDIVIDUALITY_OPPONENT_BACK = "countLowerIndividualityOpponentBack",
    COUNT_EQUAL_INDIVIDUALITY_PT_FRONT = "countEqualIndividualityPtFront",
    COUNT_EQUAL_INDIVIDUALITY_PT_CENTER = "countEqualIndividualityPtCenter",
    COUNT_EQUAL_INDIVIDUALITY_PT_BACK = "countEqualIndividualityPtBack",
    COUNT_EQUAL_INDIVIDUALITY_OPPONENT_FRONT = "countEqualIndividualityOpponentFront",
    COUNT_EQUAL_INDIVIDUALITY_OPPONENT_CENTER = "countEqualIndividualityOpponentCenter",
    COUNT_EQUAL_INDIVIDUALITY_OPPONENT_BACK = "countEqualIndividualityOpponentBack",
    CHECK_PRECEDING_ENEMY = "checkPrecedingEnemy",
    COUNT_HIGHER_REMAIN_TURN = "countHigherRemainTurn",
    COUNT_LOWER_REMAIN_TURN = "countLowerRemainTurn",
    COUNT_HIGHER_AI_171 = "countHigherAi171",
    COUNT_LOWER_AI_172 = "countLowerAi172",
    COUNT_EQUAL_AI_173 = "countEqualAi173",
    CHECK_AI_174 = "checkAi174",
    CHECK_SELF_NPTURN_HIGHER = "checkSelfNpturnHigher",
    CHECK_SELF_NPTURN_LOWER = "checkSelfNpturnLower",
    CHECK_USE_SKILL_THISTURN = "checkUseSkillThisturn",
    COUNT_CHAIN_HIGHER = "countChainHigher",
    COUNT_CHAIN_LOWER = "countChainLower",
    COUNT_CHAIN_EQUAL = "countChainEqual",
}

export enum AiTiming {
    DEAD = "dead",
    TURN_ENEMY_START = "turnEnemyStart",
    TURN_ENEMY_END = "turnEnemyEnd",
    TURN_PLAYER_START = "turnPlayerStart",
    TURN_PLAYER_END = "turnPlayerEnd",
    WAVE_START = "waveStart",
    TURN_START = "turnStart",
    UNKNOWN = "unknown",
}

export enum AiActType {
    NONE = "none",
    RANDOM = "random",
    ATTACK = "attack",
    SKILL_RANDOM = "skillRandom",
    SKILL1 = "skill1",
    SKILL2 = "skill2",
    SKILL3 = "skill3",
    ATTACK_A = "attackA",
    ATTACK_B = "attackB",
    ATTACK_Q = "attackQ",
    ATTACK_A_CRITICAL = "attackACritical",
    ATTACK_B_CRITICAL = "attackBCritical",
    ATTACK_Q_CRITICAL = "attackQCritical",
    ATTACK_CRITICAL = "attackCritical",
    SKILL_ID = "skillId",
    SKILL_ID_CHECKBUFF = "skillIdCheckbuff",
    RESURRECTION = "resurrection",
    PLAY_MOTION = "playMotion",
    NOBLE_PHANTASM = "noblePhantasm",
    BATTLE_END = "battleEnd",
    LOSE_END = "loseEnd",
    CHANGE_THINKING = "changeThinking",
}

export enum AiActTarget {
    NONE = "none",
    RANDOM = "random",
    HP_HIGHER = "hpHigher",
    HP_LOWER = "hpLower",
    NPTURN_LOWER = "npturnLower",
    NPGAUGE_HIGHER = "npgaugeHigher",
    REVENGE = "revenge",
    INDIVIDUALITY_ACTIVE = "individualityActive",
    BUFF_ACTIVE = "buffActive",
    FRONT = "front",
    CENTER = "center",
    BACK = "back",
}

export interface StageLink {
    questId: number;
    phase: number;
    stage: number;
}

export interface AiAct {
    id: number;
    type: AiActType;
    target: AiActTarget;
    targetIndividuality: Trait[];
    skillId?: number;
    skillLv?: number;
    skill?: Skill;
}

export interface Ai {
    id: number;
    idx: number;
    actNumInt: number;
    actNum: AiActNum;
    priority: number;
    probability: number;
    cond: AiCond;
    condNegative: boolean;
    vals: number[];
    aiAct: AiAct;
    avals: number[];
    parentAis: Record<AiType, number[]>;
    infoText: string;
    timing?: number;
    timingDescription?: AiTiming;
}

export interface AiCollection {
    mainAis: Ai[];
    relatedAis: Ai[];
    relatedQuests: StageLink[];
}
