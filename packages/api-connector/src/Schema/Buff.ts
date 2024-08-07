import { ReverseData, ReverseDepth } from "../ApiConnector";
import ClassName from "../Enum/ClassName";
import { Func } from "./Func";
import { Trait } from "./Trait";

export enum BuffAction {
    NONE = "none",
    COMMAND_ATK = "commandAtk",
    COMMAND_DEF = "commandDef",
    ATK = "atk",
    DEFENCE = "defence",
    DEFENCE_PIERCE = "defencePierce",
    SPECIALDEFENCE = "specialdefence",
    DAMAGE = "damage",
    DAMAGE_INDIVIDUALITY = "damageIndividuality",
    DAMAGE_INDIVIDUALITY_ACTIVEONLY = "damageIndividualityActiveonly",
    SELFDAMAGE = "selfdamage",
    CRITICAL_DAMAGE = "criticalDamage",
    NPDAMAGE = "npdamage",
    GIVEN_DAMAGE = "givenDamage",
    RECEIVE_DAMAGE = "receiveDamage",
    PIERCE_INVINCIBLE = "pierceInvincible",
    INVINCIBLE = "invincible",
    BREAK_AVOIDANCE = "breakAvoidance",
    AVOIDANCE = "avoidance",
    OVERWRITE_BATTLECLASS = "overwriteBattleclass",
    OVERWRITE_CLASSRELATIO_ATK = "overwriteClassrelatioAtk",
    OVERWRITE_CLASSRELATIO_DEF = "overwriteClassrelatioDef",
    COMMAND_NP_ATK = "commandNpAtk",
    COMMAND_NP_DEF = "commandNpDef",
    DROP_NP = "dropNp",
    DROP_NP_DAMAGE = "dropNpDamage",
    COMMAND_STAR_ATK = "commandStarAtk",
    COMMAND_STAR_DEF = "commandStarDef",
    CRITICAL_POINT = "criticalPoint",
    STARWEIGHT = "starweight",
    TURNEND_NP = "turnendNp",
    TURNEND_STAR = "turnendStar",
    TURNEND_HP_REGAIN = "turnendHpRegain",
    TURNEND_HP_REDUCE = "turnendHpReduce",
    GAIN_HP = "gainHp",
    TURNVAL_NP = "turnvalNp",
    GRANT_STATE = "grantState",
    RESISTANCE_STATE = "resistanceState",
    AVOID_STATE = "avoidState",
    DONOT_ACT = "donotAct",
    DONOT_SKILL = "donotSkill",
    DONOT_NOBLE = "donotNoble",
    DONOT_RECOVERY = "donotRecovery",
    INDIVIDUALITY_ADD = "individualityAdd",
    INDIVIDUALITY_SUB = "individualitySub",
    HATE = "hate",
    CRITICAL_RATE = "criticalRate",
    AVOID_INSTANTDEATH = "avoidInstantdeath",
    RESIST_INSTANTDEATH = "resistInstantdeath",
    NONRESIST_INSTANTDEATH = "nonresistInstantdeath",
    REGAIN_NP_USED_NOBLE = "regainNpUsedNoble",
    FUNCTION_DEAD = "functionDead",
    MAXHP_RATE = "maxhpRate",
    MAXHP_VALUE = "maxhpValue",
    FUNCTION_WAVESTART = "functionWavestart",
    FUNCTION_SELFTURNEND = "functionSelfturnend",
    GIVE_GAIN_HP = "giveGainHp",
    FUNCTION_COMMANDATTACK_AFTER = "functionCommandattackAfter",
    FUNCTION_DEADATTACK = "functionDeadattack",
    FUNCTION_ENTRY = "functionEntry",
    CHAGETD = "chagetd",
    GRANT_SUBSTATE = "grantSubstate",
    TOLERANCE_SUBSTATE = "toleranceSubstate",
    GRANT_INSTANTDEATH = "grantInstantdeath",
    FUNCTION_DAMAGE = "functionDamage",
    FUNCTION_REFLECTION = "functionReflection",
    MULTIATTACK = "multiattack",
    GIVE_NP = "giveNp",
    RESISTANCE_DELAY_NPTURN = "resistanceDelayNpturn",
    PIERCE_DEFENCE = "pierceDefence",
    GUTS_HP = "gutsHp",
    FUNCGAIN_NP = "funcgainNp",
    FUNC_HP_REDUCE = "funcHpReduce",
    FUNCTION_NPATTACK = "functionNpattack",
    FIX_COMMANDCARD = "fixCommandcard",
    DONOT_GAINNP = "donotGainnp",
    FIELD_INDIVIDUALITY = "fieldIndividuality",
    DONOT_ACT_COMMANDTYPE = "donotActCommandtype",
    DAMAGE_EVENT_POINT = "damageEventPoint",
    DAMAGE_SPECIAL = "damageSpecial",
    FUNCTION_ATTACK_AFTER = "functionAttackAfter",
    FUNCTION_COMMANDCODEATTACK_BEFORE = "functionCommandcodeattackBefore",
    DONOT_NOBLE_COND_MISMATCH = "donotNobleCondMismatch",
    DONOT_SELECT_COMMANDCARD = "donotSelectCommandcard",
    DONOT_REPLACE = "donotReplace",
    SHORTEN_USER_EQUIP_SKILL = "shortenUserEquipSkill",
    TD_TYPE_CHANGE = "tdTypeChange",
    OVERWRITE_CLASS_RELATION = "overwriteClassRelation",
    FUNCTION_COMMANDATTACK_BEFORE = "functionCommandattackBefore",
    FUNCTION_GUTS = "functionGuts",
    CRITICAL_RATE_DAMAGE_TAKEN = "criticalRateDamageTaken",
    CRITICAL_STAR_DAMAGE_TAKEN = "criticalStarDamageTaken",
    SKILL_RANK_CHANGE = "skillRankChange",
    AVOIDANCE_INDIVIDUALITY = "avoidanceIndividuality",
    CHANGE_COMMAND_CARD_TYPE = "changeCommandCardType",
    SPECIAL_INVINCIBLE = "specialInvincible",
    PREVENT_DEATH_BY_DAMAGE = "preventDeathByDamage",
    FUNCTION_COMMANDCODEATTACK_AFTER = "functionCommandcodeattackAfter",
    FUNCTION_ATTACK_BEFORE = "functionAttackBefore",
    DONOT_SKILL_SELECT = "donotSkillSelect",
    INVISIBLE_BATTLE_CHARA = "invisibleBattleChara",
    BUFF_RATE = "buffRate",
    COUNTER_FUNCTION = "counterFunction",
    NOT_TARGET_SKILL = "notTargetSkill",
    TO_FIELD_CHANGE_FIELD = "toFieldChangeField",
    TO_FIELD_AVOID_BUFF = "toFieldAvoidBuff",
    GRANT_STATE_UP_ONLY = "grantStateUpOnly",
    TURNEND_HP_REDUCE_TO_REGAIN = "turnendHpReduceToRegain",
    FUNCTION_SELFTURNSTART = "functionSelfturnstart",
    OVERWRITE_DEAD_TYPE = "overwriteDeadType",
    ACTION_COUNT = "actionCount",
    SHIFT_GUTS = "shiftGuts",
    TO_FIELD_SUB_INDIVIDUALITY_FIELD = "toFieldSubIndividualityField",
    MASTER_SKILL_VALUE_UP = "masterSkillValueUp",
    BUFF_CONVERT = "buffConvert",
    SUB_FIELD_INDIVIDUALITY = "subFieldIndividuality",
    FUNCTION_COMMANDCODEATTACK_BEFORE_MAIN_ONLY = "functionCommandcodeattackBeforeMainOnly",
    FUNCTION_COMMANDCODEATTACK_AFTER_MAIN_ONLY = "functionCommandcodeattackAfterMainOnly",
    FUNCTION_COMMANDATTACK_BEFORE_MAIN_ONLY = "functionCommandattackBeforeMainOnly",
    FUNCTION_COMMANDATTACK_AFTER_MAIN_ONLY = "functionCommandattackAfterMainOnly",
    FUNCTION_ATTACK_BEFORE_MAIN_ONLY = "functionAttackBeforeMainOnly",
    FUNCTION_ATTACK_AFTER_MAIN_ONLY = "functionAttackAfterMainOnly",
    FUNCTION_SKILL_AFTER = "functionSkillAfter",
    FUNCTION_SKILL_AFTER_MAIN_ONLY = "functionSkillAfterMainOnly",
    FUNCTION_TREASURE_DEVICE_AFTER = "functionTreasureDeviceAfter",
    FUNCTION_TREASURE_DEVICE_AFTER_MAIN_ONLY = "functionTreasureDeviceAfterMainOnly",
    GUTS = "guts",
    PREVENT_INVISIBLE_WHEN_INSTANT_DEATH = "preventInvisibleWhenInstantDeath",
    OVERWRITE_SUBATTRIBUTE = "overwriteSubattribute",
    AVOIDANCE_ATTACK_DEATH_DAMAGE = "avoidanceAttackDeathDamage",
    AVOID_FUNCTION_EXECUTE_SELF = "avoidFunctionExecuteSelf",
    FUNCTION_CONTINUE = "functionContinue",
    PIERCE_SUBDAMAGE = "pierceSubdamage",
    RECEIVE_DAMAGE_PIERCE = "receiveDamagePierce",
    SPECIAL_RECEIVE_DAMAGE = "specialReceiveDamage",
    FUNC_HP_REDUCE_VALUE = "funcHpReduceValue",
    CHANGE_BGM = "changeBgm",
    FUNCTION_CONFIRM_COMMAND = "functionConfirmCommand",
    FUNCTION_SKILL_BEFORE = "functionSkillBefore",
    FUNCTION_SKILL_TARGETED_BEFORE = "functionSkillTargetedBefore",
    FUNCTION_FIELD_INDIVIDUALITY_CHANGED = "functionFieldIndividualityChanged",
    FUNCTION_TREASURE_DEVICE_BEFORE = "functionTreasureDeviceBefore",
    FUNCTION_STEP_IN_AFTER = "functionStepInAfter",
    SHORTEN_SKILL_AFTER_USE_SKILL = "shortenSkillAfterUseSkill",
}

export enum BuffLimit {
    NONE = "none",
    UPPER = "upper",
    LOWER = "lower",
    NORMAL = "normal",
}

export enum BuffType {
    NONE = "none",
    UP_COMMANDATK = "upCommandatk",
    UP_STARWEIGHT = "upStarweight",
    UP_CRITICALPOINT = "upCriticalpoint",
    DOWN_CRITICALPOINT = "downCriticalpoint",
    REGAIN_NP = "regainNp",
    REGAIN_STAR = "regainStar",
    REGAIN_HP = "regainHp",
    REDUCE_HP = "reduceHp",
    UP_ATK = "upAtk",
    DOWN_ATK = "downAtk",
    UP_DAMAGE = "upDamage",
    DOWN_DAMAGE = "downDamage",
    ADD_DAMAGE = "addDamage",
    SUB_DAMAGE = "subDamage",
    UP_NPDAMAGE = "upNpdamage",
    DOWN_NPDAMAGE = "downNpdamage",
    UP_DROPNP = "upDropnp",
    UP_CRITICALDAMAGE = "upCriticaldamage",
    DOWN_CRITICALDAMAGE = "downCriticaldamage",
    UP_SELFDAMAGE = "upSelfdamage",
    DOWN_SELFDAMAGE = "downSelfdamage",
    ADD_SELFDAMAGE = "addSelfdamage",
    SUB_SELFDAMAGE = "subSelfdamage",
    AVOIDANCE = "avoidance",
    BREAK_AVOIDANCE = "breakAvoidance",
    INVINCIBLE = "invincible",
    UP_GRANTSTATE = "upGrantstate",
    DOWN_GRANTSTATE = "downGrantstate",
    UP_TOLERANCE = "upTolerance",
    DOWN_TOLERANCE = "downTolerance",
    AVOID_STATE = "avoidState",
    DONOT_ACT = "donotAct",
    DONOT_SKILL = "donotSkill",
    DONOT_NOBLE = "donotNoble",
    DONOT_RECOVERY = "donotRecovery",
    DISABLE_GENDER = "disableGender",
    GUTS = "guts",
    UP_HATE = "upHate",
    ADD_INDIVIDUALITY = "addIndividuality",
    SUB_INDIVIDUALITY = "subIndividuality",
    UP_DEFENCE = "upDefence",
    DOWN_DEFENCE = "downDefence",
    UP_COMMANDSTAR = "upCommandstar",
    UP_COMMANDNP = "upCommandnp",
    UP_COMMANDALL = "upCommandall",
    DOWN_COMMANDALL = "downCommandall",
    DOWN_STARWEIGHT = "downStarweight",
    REDUCE_NP = "reduceNp",
    DOWN_DROPNP = "downDropnp",
    UP_GAIN_HP = "upGainHp",
    DOWN_GAIN_HP = "downGainHp",
    DOWN_COMMANDATK = "downCommandatk",
    DOWN_COMMANSTAR = "downCommanstar",
    DOWN_COMMANDNP = "downCommandnp",
    UP_CRITICALRATE = "upCriticalrate",
    DOWN_CRITICALRATE = "downCriticalrate",
    PIERCE_INVINCIBLE = "pierceInvincible",
    AVOID_INSTANTDEATH = "avoidInstantdeath",
    UP_RESIST_INSTANTDEATH = "upResistInstantdeath",
    UP_NONRESIST_INSTANTDEATH = "upNonresistInstantdeath",
    DELAY_FUNCTION = "delayFunction",
    REGAIN_NP_USED_NOBLE = "regainNpUsedNoble",
    DEAD_FUNCTION = "deadFunction",
    UP_MAXHP = "upMaxhp",
    DOWN_MAXHP = "downMaxhp",
    ADD_MAXHP = "addMaxhp",
    SUB_MAXHP = "subMaxhp",
    BATTLESTART_FUNCTION = "battlestartFunction",
    WAVESTART_FUNCTION = "wavestartFunction",
    SELFTURNEND_FUNCTION = "selfturnendFunction",
    DAMAGE_FUNCTION = "damageFunction",
    UP_GIVEGAIN_HP = "upGivegainHp",
    DOWN_GIVEGAIN_HP = "downGivegainHp",
    COMMANDATTACK_AFTER_FUNCTION = "commandattackAfterFunction",
    DEADATTACK_FUNCTION = "deadattackFunction",
    UP_SPECIALDEFENCE = "upSpecialdefence",
    DOWN_SPECIALDEFENCE = "downSpecialdefence",
    UP_DAMAGEDROPNP = "upDamagedropnp",
    DOWN_DAMAGEDROPNP = "downDamagedropnp",
    ENTRY_FUNCTION = "entryFunction",
    UP_CHAGETD = "upChagetd",
    REFLECTION_FUNCTION = "reflectionFunction",
    UP_GRANT_SUBSTATE = "upGrantSubstate",
    DOWN_GRANT_SUBSTATE = "downGrantSubstate",
    UP_TOLERANCE_SUBSTATE = "upToleranceSubstate",
    DOWN_TOLERANCE_SUBSTATE = "downToleranceSubstate",
    UP_GRANT_INSTANTDEATH = "upGrantInstantdeath",
    DOWN_GRANT_INSTANTDEATH = "downGrantInstantdeath",
    GUTS_RATIO = "gutsRatio",
    UP_DEFENCECOMMANDALL = "upDefencecommandall",
    DOWN_DEFENCECOMMANDALL = "downDefencecommandall",
    OVERWRITE_BATTLECLASS = "overwriteBattleclass",
    OVERWRITE_CLASSRELATIO_ATK = "overwriteClassrelatioAtk",
    OVERWRITE_CLASSRELATIO_DEF = "overwriteClassrelatioDef",
    UP_DAMAGE_INDIVIDUALITY = "upDamageIndividuality",
    DOWN_DAMAGE_INDIVIDUALITY = "downDamageIndividuality",
    UP_DAMAGE_INDIVIDUALITY_ACTIVEONLY = "upDamageIndividualityActiveonly",
    DOWN_DAMAGE_INDIVIDUALITY_ACTIVEONLY = "downDamageIndividualityActiveonly",
    UP_NPTURNVAL = "upNpturnval",
    DOWN_NPTURNVAL = "downNpturnval",
    MULTIATTACK = "multiattack",
    UP_GIVE_NP = "upGiveNp",
    DOWN_GIVE_NP = "downGiveNp",
    UP_RESISTANCE_DELAY_NPTURN = "upResistanceDelayNpturn",
    DOWN_RESISTANCE_DELAY_NPTURN = "downResistanceDelayNpturn",
    PIERCE_DEFENCE = "pierceDefence",
    UP_GUTS_HP = "upGutsHp",
    DOWN_GUTS_HP = "downGutsHp",
    UP_FUNCGAIN_NP = "upFuncgainNp",
    DOWN_FUNCGAIN_NP = "downFuncgainNp",
    UP_FUNC_HP_REDUCE = "upFuncHpReduce",
    DOWN_FUNC_HP_REDUCE = "downFuncHpReduce",
    UP_DEFENCE_COMMANDDAMAGE = "upDefenceCommanddamage",
    DOWN_DEFENCE_COMMANDDAMAGE = "downDefenceCommanddamage",
    NPATTACK_PREV_BUFF = "npattackPrevBuff",
    FIX_COMMANDCARD = "fixCommandcard",
    DONOT_GAINNP = "donotGainnp",
    FIELD_INDIVIDUALITY = "fieldIndividuality",
    DONOT_ACT_COMMANDTYPE = "donotActCommandtype",
    UP_DAMAGE_EVENT_POINT = "upDamageEventPoint",
    UP_DAMAGE_SPECIAL = "upDamageSpecial",
    ATTACK_AFTER_FUNCTION = "attackAfterFunction",
    COMMANDCODEATTACK_BEFORE_FUNCTION = "commandcodeattackBeforeFunction",
    DONOT_NOBLE_COND_MISMATCH = "donotNobleCondMismatch",
    DONOT_SELECT_COMMANDCARD = "donotSelectCommandcard",
    DONOT_REPLACE = "donotReplace",
    SHORTEN_USER_EQUIP_SKILL = "shortenUserEquipSkill",
    TD_TYPE_CHANGE = "tdTypeChange",
    OVERWRITE_CLASS_RELATION = "overwriteClassRelation",
    TD_TYPE_CHANGE_ARTS = "tdTypeChangeArts",
    TD_TYPE_CHANGE_BUSTER = "tdTypeChangeBuster",
    TD_TYPE_CHANGE_QUICK = "tdTypeChangeQuick",
    COMMANDATTACK_BEFORE_FUNCTION = "commandattackBeforeFunction",
    GUTS_FUNCTION = "gutsFunction",
    UP_CRITICAL_RATE_DAMAGE_TAKEN = "upCriticalRateDamageTaken",
    DOWN_CRITICAL_RATE_DAMAGE_TAKEN = "downCriticalRateDamageTaken",
    UP_CRITICAL_STAR_DAMAGE_TAKEN = "upCriticalStarDamageTaken",
    DOWN_CRITICAL_STAR_DAMAGE_TAKEN = "downCriticalStarDamageTaken",
    SKILL_RANK_UP = "skillRankUp",
    AVOIDANCE_INDIVIDUALITY = "avoidanceIndividuality",
    CHANGE_COMMAND_CARD_TYPE = "changeCommandCardType",
    SPECIAL_INVINCIBLE = "specialInvincible",
    PREVENT_DEATH_BY_DAMAGE = "preventDeathByDamage",
    COMMANDCODEATTACK_AFTER_FUNCTION = "commandcodeattackAfterFunction",
    ATTACK_BEFORE_FUNCTION = "attackBeforeFunction",
    DONOT_SKILL_SELECT = "donotSkillSelect",
    BUFF_RATE = "buffRate",
    INVISIBLE_BATTLE_CHARA = "invisibleBattleChara",
    COUNTER_FUNCTION = "counterFunction",
    NOT_TARGET_SKILL = "notTargetSkill",
    HP_REDUCE_TO_REGAIN = "hpReduceToRegain",
    SELFTURNSTART_FUNCTION = "selfturnstartFunction",
    OVERWRITE_DEAD_TYPE = "overwriteDeadType",
    UP_ACTION_COUNT = "upActionCount",
    DOWN_ACTION_COUNT = "downActionCount",
    SHIFT_GUTS = "shiftGuts",
    SHIFT_GUTS_RATIO = "shiftGutsRatio",
    MASTER_SKILL_VALUE_UP = "masterSkillValueUp",
    BUFF_CONVERT = "buffConvert",
    SUB_FIELD_INDIVIDUALITY = "subFieldIndividuality",
    COMMANDCODEATTACK_BEFORE_FUNCTION_MAIN_ONLY = "commandcodeattackBeforeFunctionMainOnly",
    COMMANDCODEATTACK_AFTER_FUNCTION_MAIN_ONLY = "commandcodeattackAfterFunctionMainOnly",
    COMMANDATTACK_BEFORE_FUNCTION_MAIN_ONLY = "commandattackBeforeFunctionMainOnly",
    COMMANDATTACK_AFTER_FUNCTION_MAIN_ONLY = "commandattackAfterFunctionMainOnly",
    ATTACK_BEFORE_FUNCTION_MAIN_ONLY = "attackBeforeFunctionMainOnly",
    ATTACK_AFTER_FUNCTION_MAIN_ONLY = "attackAfterFunctionMainOnly",
    WAR_BOARD_NOT_ATTACKED = "warBoardNotAttacked",
    WAR_BOARD_IGNORE_DEFEATPOINT = "warBoardIgnoreDefeatpoint",
    SKILL_AFTER_FUNCTION = "skillAfterFunction",
    TREASURE_DEVICE_AFTER_FUNCTION = "treasureDeviceAfterFunction",
    SKILL_AFTER_FUNCTION_MAIN_ONLY = "skillAfterFunctionMainOnly",
    TREASURE_DEVICE_AFTER_FUNCTION_MAIN_ONLY = "treasureDeviceAfterFunctionMainOnly",
    PREVENT_INVISIBLE_WHEN_INSTANT_DEATH = "preventInvisibleWhenInstantDeath",
    OVERWRITE_SUBATTRIBUTE = "overwriteSubattribute",
    AVOIDANCE_ATTACK_DEATH_DAMAGE = "avoidanceAttackDeathDamage",
    AVOID_FUNCTION_EXECUTE_SELF = "avoidFunctionExecuteSelf",
    PIERCE_SUBDAMAGE = "pierceSubdamage",
    CONTINUE_FUNCTION = "continueFunction",
    ADD_SPECIALDAMAGE = "addSpecialdamage",
    SUB_SPECIALDAMAGE = "subSpecialdamage",
    ADD_FUNC_HP_REDUCE = "addFuncHpReduce",
    SUB_FUNC_HP_REDUCE = "subFuncHpReduce",
    CHANGE_BGM = "changeBgm",
    CONFIRM_COMMAND_FUNCTION = "confirmCommandFunction",
    SKILL_BEFORE_FUNCTION = "skillBeforeFunction",
    SKILL_TARGETED_BEFORE_FUNCTION = "skillTargetedBeforeFunction",
    FIELD_INDIVIDUALITY_CHANGED_FUNCTION = "fieldIndividualityChangedFunction",
    TREASURE_DEVICE_BEFORE_FUNCTION = "treasureDeviceBeforeFunction",
    STEP_IN_AFTER_FUNCTION = "stepInAfterFunction",
    SHORTEN_SKILL_AFTER_USE_SKILL = "shortenSkillAfterUseSkill",
    TO_FIELD_CHANGE_FIELD = "toFieldChangeField",
    TO_FIELD_AVOID_BUFF = "toFieldAvoidBuff",
    TO_FIELD_SUB_INDIVIDUALITY_FIELD = "toFieldSubIndividualityField",
}

export enum ClassRelationOverwriteType {
    OVERWRITE_FORCE = "overwriteForce",
    OVERWRITE_MORE_THAN_TARGET = "overwriteMoreThanTarget",
    OVERWRITE_LESS_THAN_TARGET = "overwriteLessThanTarget",
}

export interface RelationOverwriteDetail {
    damageRate: number;
    type: ClassRelationOverwriteType;
}

export interface BuffRelationOverwrite {
    atkSide: Record<ClassName, Record<ClassName, RelationOverwriteDetail>>;
    defSide: Record<ClassName, Record<ClassName, RelationOverwriteDetail>>;
}

export enum BuffConvertType {
    NONE = "none",
    BUFF = "buff",
    INDIVIDUALITY = "individuality",
}

export enum BuffConvertLimitType {
    ALL = "all",
    SELF = "self",
}

export interface BuffConvertScript {
    OverwritePopupText: string[];
}

export interface BuffConvert<T> {
    targetLimit: BuffConvertLimitType;
    convertBuffs: T[];
    script: BuffConvertScript;
    effectId: number;
}

export interface BuffConvertNone<T> extends BuffConvert<T> {
    convertType: BuffConvertType.NONE;
    targets: never[];
}

export interface BuffConvertIndividuality<T> extends BuffConvert<T> {
    convertType: BuffConvertType.INDIVIDUALITY;
    targets: Trait[];
}

export interface BuffConvertBuff<T> extends BuffConvert<T> {
    convertType: BuffConvertType.BUFF;
    targets: T[];
}

export interface BuffScript<T> {
    checkIndvType?: number;
    CheckOpponentBuffTypes?: BuffType[];
    relationId?: BuffRelationOverwrite;
    ReleaseText?: string;
    DamageRelease?: number;
    INDIVIDUALITIE?: Trait;
    INDIVIDUALITIE_COUNT_ABOVE?: number;
    INDIVIDUALITIE_COUNT_BELOW?: number;
    INDIVIDUALITIE_AND?: Trait[];
    INDIVIDUALITIE_OR?: Trait[];
    UpBuffRateBuffIndiv?: Trait[];
    HP_LOWER?: number;
    HP_HIGHER?: number;
    CounterMessage?: string;
    avoidanceText?: string;
    gutsText?: string;
    missText?: string;
    AppId?: number;
    IncludeIgnoreIndividuality?: number;
    ProgressSelfTurn?: number;
    TargetIndiv?: Trait;
    extendLowerLimit?: number;
    convert?: BuffConvertIndividuality<T> | BuffConvertBuff<T> | BuffConvertNone<T>;
    useFirstTimeInTurn?: number;
    fromCommandSpell?: number;
    fromMasterEquip?: number;
}

export interface BasicBuff {
    id: number;
    name: string;
    icon?: string;
    type: BuffType;
    script: BuffScript<BasicBuff>;
    vals: Trait[];
    tvals: Trait[];
    ckSelfIndv: Trait[];
    ckOpIndv: Trait[];
    reverse?: {
        basic?: {
            function?: Func[];
        };
    };
}

export interface Buff extends BasicBuff {
    script: BuffScript<Buff>;
    originalName: string;
    originalScript: Record<string, any>;
    detail: string;
    buffGroup: number;
    maxRate: number;
    reverse?: {
        basic?: {
            function?: Func[];
        };
        nice?: {
            function?: Func[];
        };
    };
}

export interface BuffConstant {
    limit: BuffLimit;
    plusTypes: BuffType[];
    minusTypes: BuffType[];
    baseParam: number;
    baseValue: number;
    isRec: boolean;
    plusAction: number;
    maxRate: number[];
}

export type BuffConstantMap = {
    [key in BuffAction]?: BuffConstant;
};

export type BuffSearchOptions = {
    name?: string;
    type?: BuffType[];
    buffGroup?: number[];
    vals?: number[];
    tvals?: number[];
    ckSelfIndv?: number[];
    ckOpIndv?: number[];
    reverse?: boolean;
    reverseData?: ReverseData;
    reverseDepth?: ReverseDepth;
};
