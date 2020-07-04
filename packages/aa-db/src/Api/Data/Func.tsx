import Buff from "./Buff";
import NoblePhantasm from "./NoblePhantasm";
import Skill from "./Skill";
import Trait from "./Trait";

export enum FuncType {
    NONE = "none",
    ADD_STATE = "addState",
    SUB_STATE = "subState",
    DAMAGE = "damage",
    DAMAGE_NP = "damageNp",
    GAIN_STAR = "gainStar",
    GAIN_HP = "gainHp",
    GAIN_NP = "gainNp",
    LOSS_NP = "lossNp",
    SHORTEN_SKILL = "shortenSkill",
    EXTEND_SKILL = "extendSkill",
    RELEASE_STATE = "releaseState",
    LOSS_HP = "lossHp",
    INSTANT_DEATH = "instantDeath",
    DAMAGE_NP_PIERCE = "damageNpPierce",
    DAMAGE_NP_INDIVIDUAL = "damageNpIndividual",
    ADD_STATE_SHORT = "addStateShort",
    GAIN_HP_PER = "gainHpPer",
    DAMAGE_NP_STATE_INDIVIDUAL = "damageNpStateIndividual",
    HASTEN_NPTURN = "hastenNpturn",
    DELAY_NPTURN = "delayNpturn",
    DAMAGE_NP_HPRATIO_HIGH = "damageNpHpratioHigh",
    DAMAGE_NP_HPRATIO_LOW = "damageNpHpratioLow",
    CARD_RESET = "cardReset",
    REPLACE_MEMBER = "replaceMember",
    LOSS_HP_SAFE = "lossHpSafe",
    DAMAGE_NP_COUNTER = "damageNpCounter",
    DAMAGE_NP_STATE_INDIVIDUAL_FIX = "damageNpStateIndividualFix",
    DAMAGE_NP_SAFE = "damageNpSafe",
    CALL_SERVANT = "callServant",
    PT_SHUFFLE = "ptShuffle",
    LOSS_STAR = "lossStar",
    CHANGE_SERVANT = "changeServant",
    CHANGE_BG = "changeBg",
    DAMAGE_VALUE = "damageValue",
    WITHDRAW = "withdraw",
    FIX_COMMANDCARD = "fixCommandcard",
    SHORTEN_BUFFTURN = "shortenBuffturn",
    EXTEND_BUFFTURN = "extendBuffturn",
    SHORTEN_BUFFCOUNT = "shortenBuffcount",
    EXTEND_BUFFCOUNT = "extendBuffcount",
    CHANGE_BGM = "changeBgm",
    DISPLAY_BUFFSTRING = "displayBuffstring",
    EXP_UP = "expUp",
    QP_UP = "qpUp",
    DROP_UP = "dropUp",
    FRIEND_POINT_UP = "friendPointUp",
    EVENT_DROP_UP = "eventDropUp",
    EVENT_DROP_RATE_UP = "eventDropRateUp",
    EVENT_POINT_UP = "eventPointUp",
    EVENT_POINT_RATE_UP = "eventPointRateUp",
    TRANSFORM_SERVANT = "transformServant",
    QP_DROP_UP = "qpDropUp",
    SERVANT_FRIENDSHIP_UP = "servantFriendshipUp",
    USER_EQUIP_EXP_UP = "userEquipExpUp",
    CLASS_DROP_UP = "classDropUp",
    ENEMY_ENCOUNT_COPY_RATE_UP = "enemyEncountCopyRateUp",
    ENEMY_ENCOUNT_RATE_UP = "enemyEncountRateUp",
    ENEMY_PROB_DOWN = "enemyProbDown",
    GET_REWARD_GIFT = "getRewardGift",
    SEND_SUPPORT_FRIEND_POINT = "sendSupportFriendPoint",
    MOVE_POSITION = "movePosition",
    REVIVAL = "revival",
    DAMAGE_NP_INDIVIDUAL_SUM = "damageNpIndividualSum",
}

export enum FuncTargetType {
    SELF = "self",
    PT_ONE = "ptOne",
    PT_ANOTHER = "ptAnother",
    PT_ALL = "ptAll",
    ENEMY = "enemy",
    ENEMY_ANOTHER = "enemyAnother",
    ENEMY_ALL = "enemyAll",
    PT_FULL = "ptFull",
    ENEMY_FULL = "enemyFull",
    PT_OTHER = "ptOther",
    PT_ONE_OTHER = "ptOneOther",
    PT_RANDOM = "ptRandom",
    ENEMY_OTHER = "enemyOther",
    ENEMY_RANDOM = "enemyRandom",
    PT_OTHER_FULL = "ptOtherFull",
    ENEMY_OTHER_FULL = "enemyOtherFull",
    PTSELECT_ONE_SUB = "ptselectOneSub",
    PTSELECT_SUB = "ptselectSub",
    PT_ONE_ANOTHER_RANDOM = "ptOneAnotherRandom",
    PT_SELF_ANOTHER_RANDOM = "ptSelfAnotherRandom",
    ENEMY_ONE_ANOTHER_RANDOM = "enemyOneAnotherRandom",
    PT_SELF_ANOTHER_FIRST = "ptSelfAnotherFirst",
    PT_SELF_BEFORE = "ptSelfBefore",
    PT_SELF_AFTER = "ptSelfAfter",
    PT_SELF_ANOTHER_LAST = "ptSelfAnotherLast",
    COMMAND_TYPE_SELF_TREASURE_DEVICE = "commandTypeSelfTreasureDevice",
}

export enum FuncTargetTeam {
    PLAYER = "player",
    ENEMY = "enemy",
    PLAYER_AND_ENEMY = "playerAndEnemy",
}

export enum DataValField {
    RATE = "Rate",
    TURN = "Turn",
    COUNT = "Count",
    VALUE = "Value",
    VALUE2 = "Value2",
    USE_RATE = "UseRate",
    TARGET = "Target",
    CORRECTION = "Correction",
    PARAM_ADD = "ParamAdd",
    PARAM_MAX = "ParamMax",
    HIDE_MISS = "HideMiss",
    ON_FIELD = "OnField",
    HIDE_NO_EFFECT = "HideNoEffect",
    UNAFFECTED = "Unaffected",
    SHOW_STATE = "ShowState",
    AURA_EFFECT_ID = "AuraEffectId",
    ACT_SET = "ActSet",
    ACT_SET_WEIGHT = "ActSetWeight",
    SHOW_QUEST_NO_EFFECT = "ShowQuestNoEffect",
    CHECK_DEAD = "CheckDead",
    RATIO_HP_HIGH = "RatioHPHigh",
    RATIO_HP_LOW = "RatioHPLow",
    SET_PASSIVE_FRAME = "SetPassiveFrame",
    PROC_PASSIVE = "ProcPassive",
    PROC_ACTIVE = "ProcActive",
    HIDE_PARAM = "HideParam",
    SKILL_ID = "SkillID",
    SKILL_LV = "SkillLV",
    SHOW_CARD_ONLY = "ShowCardOnly",
    EFFECT_SUMMON = "EffectSummon",
    RATIO_HP_RANGE_HIGH = "RatioHPRangeHigh",
    RATIO_HP_RANGE_LOW = "RatioHPRangeLow",
    TARGET_LIST = "TargetList",
    OPPONENT_ONLY = "OpponentOnly",
    TARGET_RARITY_LIST = "TargetRarityList",
    DEPEND_FUNC_ID = "DependFuncId",
    DEPEND_FUNC_VALS = "DependFuncVals",
    INVALID_HIDE = "InvalidHide",
    OUT_ENEMY_NPC_ID = "OutEnemyNpcId",
    IN_ENEMY_NPC_ID = "InEnemyNpcId",
    OUT_ENEMY_POSITION = "OutEnemyPosition",
    IGNORE_INDIVIDUALITY = "IgnoreIndividuality",
    STAR_HIGHER = "StarHigher",
    CHANGE_TD_COMMAND_TYPE = "ChangeTDCommandType",
    SHIFT_NPC_ID = "ShiftNpcId",
    DISPLAY_LAST_FUNC_INVALID_TYPE = "DisplayLastFuncInvalidType",
    AND_CHECK_INDIVIDUALITY_LIST = "AndCheckIndividualityList",
    WIN_BATTLE_NOT_RELATED_SURVIVAL_STATUS = "WinBattleNotRelatedSurvivalStatus",
    FORCE_SELF_INSTANT_DEATH = "ForceSelfInstantDeath",
    CHANGE_MAX_BREAK_GAUGE = "ChangeMaxBreakGauge",
    PARAM_ADD_MAX_VALUE = "ParamAddMaxValue",
    PARAM_ADD_MAX_COUNT = "ParamAddMaxCount",
    LOSS_HP_NO_CHANGE_DAMAGE = "LossHpNoChangeDamage",
    INCLUDE_PASSIVE_INDIVIDUALITY = "IncludePassiveIndividuality",
}

export type DataVal = {
    [key in DataValField]?: number;
}

export default interface Func {
    funcId: number;
    funcType: FuncType;
    funcTargetType: FuncTargetType;
    funcTargetTeam: FuncTargetTeam;
    funcPopupText: string;
    funcPopupIcon?: string;
    functvals: Trait[];
    funcquestTvals: number[];
    traitVals?: Trait[];
    buffs: Buff[];
    svals?: DataVal[];
    svals2?: DataVal[];
    svals3?: DataVal[];
    svals4?: DataVal[];
    svals5?: DataVal[];
    reverseSkills: Skill[];
    reverseTds: NoblePhantasm[];
}
