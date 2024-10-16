import { Func } from "./Func";

export interface CheckBattlePointPhaseRange {
    battlePointId: number;
    range: string[];
}

export interface DamageRateBattlePointPhase {
    battlePointPhase: number;
    value: number;
}

interface BaseDataVal {
    Rate?: number;
    Turn?: number;
    Count?: number;
    Value?: number;
    Value2?: number;
    UseRate?: number;
    Target?: number;
    Correction?: number;
    ParamAdd?: number;
    ParamMax?: number;
    HideMiss?: number;
    OnField?: number;
    HideNoEffect?: number;
    Unaffected?: number;
    ShowState?: number;
    AuraEffectId?: number;
    ActSet?: number;
    ActSetWeight?: number;
    ShowQuestNoEffect?: number;
    CheckDead?: number;
    RatioHPHigh?: number;
    RatioHPLow?: number;
    SetPassiveFrame?: number;
    ProcPassive?: number;
    ProcActive?: number;
    HideParam?: number;
    SkillID?: number;
    SkillLV?: number;
    ShowCardOnly?: number;
    EffectSummon?: number;
    RatioHPRangeHigh?: number;
    RatioHPRangeLow?: number;
    TargetList?: number[];
    OpponentOnly?: number;
    StatusEffectId?: number;
    EndBattle?: number;
    LoseBattle?: number;
    AddIndividualty?: number;
    AddLinkageTargetIndividualty?: number;
    SameBuffLimitTargetIndividuality?: number;
    SameBuffLimitNum?: number;
    CheckDuplicate?: number;
    OnFieldCount?: number;
    TargetRarityList?: number[];
    DependFuncId?: number;
    DependFunc?: Func;
    InvalidHide?: number;
    OutEnemyNpcId?: number;
    InEnemyNpcId?: number;
    OutEnemyPosition?: number;
    IgnoreIndividuality?: number;
    StarHigher?: number;
    ChangeTDCommandType?: number;
    ShiftNpcId?: number;
    DisplayLastFuncInvalidType?: number;
    AndCheckIndividualityList?: number[];
    WinBattleNotRelatedSurvivalStatus?: number;
    ForceSelfInstantDeath?: number;
    ChangeMaxBreakGauge?: number;
    ParamAddMaxValue?: number;
    ParamAddMaxCount?: number;
    LossHpNoChangeDamage?: number;
    IncludePassiveIndividuality?: number;
    MotionChange?: number;
    PopLabelDelay?: number;
    NoTargetNoAct?: number;
    CardIndex?: number;
    CardIndividuality?: number;
    WarBoardTakeOverBuff?: number;
    ParamAddSelfIndividuality?: number[];
    ParamAddOpIndividuality?: number[];
    ParamAddFieldIndividuality?: number[];
    ParamAddValue?: number;
    MultipleGainStar?: number;
    NoCheckIndividualityIfNotUnit?: number;
    ForcedEffectSpeedOne?: number;
    SetLimitCount?: number;
    CheckEnemyFieldSpace?: number;
    TriggeredFuncPosition?: number;
    DamageCount?: number;
    DamageRates?: number[];
    OnPositions?: number[];
    OffPositions?: number[];
    TargetIndiv?: number;
    IncludeIgnoreIndividuality?: number;
    EvenIfWinDie?: number;
    CallSvtEffectId?: number;
    ForceAddState?: number;
    UnSubState?: number;
    ForceSubState?: number;
    IgnoreIndivUnreleaseable?: number;
    OnParty?: number;
    ApplySupportSvt?: number;
    Individuality?: number;
    EventId?: number;
    AddCount?: number;
    RateCount?: number;
    DropRateCount?: number;
    CounterId?: number;
    CounterLv?: number;
    CounterOc?: number;
    UseTreasureDevice?: number;
    SkillReaction?: number;
    BehaveAsFamilyBuff?: number;
    UnSubStateWhileLinkedToOthers?: number;
    NotAccompanyWhenLinkedTargetMoveState?: number;
    NotTargetSkillIdArray?: number[];
    ShortTurn?: number;
    FieldIndividuality?: number[];
    BGId?: number;
    BGType?: number;
    BgmId?: number;
    TakeOverFieldState?: number;
    TakeOverNextWaveBGAndBGM?: number;
    RemoveFieldBuffActorDeath?: number;
    FieldBuffGrantType?: number;
    Priority?: number;
    AddIndividualityEx?: number;
    IgnoreResistance?: number;
    GainNpTargetPassiveIndividuality?: number;
    HpReduceToRegainIndiv?: number;
    DisplayActualRecoveryHpFlag?: number;
    ShiftDeckIndex?: number;
    PopValueText?: string;
    IsLossHpPerNow?: number;
    CopyTargetFunctionType?: number[];
    CopyFunctionTargetPTOnly?: number;
    IgnoreValueUp?: number;
    ApplyValueUp?: DataValField[];
    ActNoDamageBuff?: number;
    ActSelectIndex?: number;
    CopyTargetBuffType?: number[];
    NotSkillCopyTargetFuncIds?: number[];
    NotSkillCopyTargetIndividualities?: number[];
    ClassIconAuraEffectId?: number;
    ActMasterGenderType?: number;
    IntervalTurn?: number;
    IntervalCount?: number;
    TriggeredFieldCountTarget?: number;
    TriggeredFieldCountRange?: number[];
    TargetEnemyRange?: number[];
    TriggeredFuncPositionSameTarget?: number;
    TriggeredFuncPositionAll?: number;
    TriggeredTargetHpRange?: string;
    TriggeredTargetHpRateRange?: string;
    ExcludeUnSubStateIndiv?: number;
    ProgressTurnOnBoard?: number;
    CheckTargetResurrectable?: number;
    CancelTransform?: number;
    UnSubStateWhenContinue?: number;
    CheckTargetHaveDefeatPoint?: number;
    NPFixedDamageValue?: number;
    IgnoreShiftSafeDamage?: number;
    ActAttackFunction?: number;
    DelayRemoveBuffExpiredOnPlayerTurn?: number;
    AllowRemoveBuff?: number;
    NotExecFunctionIfKeepAliveOnWarBoard?: number;
    SnapShotParamAddSelfIndv?: number[];
    SnapShotParamAddOpIndv?: number[];
    SnapShotParamAddFieldIndv?: number[];
    SnapShotParamAddValue?: number;
    SnapShotParamAddMaxValue?: number;
    SnapShotParamAddMaxCount?: number;
    NotExecOnTransform?: number;
    NotRemoveOnTransform?: number;
    PriorityBgm?: number;
    BgmAllowSubPlaying?: number;
    BgPriority?: number;
    PriorityBg?: number;
    ResetPriorityBgmAtWaveStart?: number;
    ControlOtherBgmAtOverStageBgm_Priority?: number;
    ControlOtherBgmAtOverStageBgm_Target?: number;
    ExtendBuffHalfTurnInOpponentTurn?: number;
    ShortenBuffHalfTurnInOpponentTurn?: number;
    ExtendBuffHalfTurnInPartyTurn?: number;
    ShortenBuffHalfTurnInPartyTurn?: number;
    LinkageBuffGrantSuccessEvenIfOtherFailed?: number;
    DisplayNoEffectCauses?: string;
    BattlePointId?: number;
    BattlePointValue?: number;
    BattlePointUiUpdateType?: number;
    BattlePointOverwrite?: number;
    CheckOverChargeStageRange?: string[];
    CheckBattlePointPhaseRange?: CheckBattlePointPhaseRange[];
    StartingPosition?: number[];
    FriendShipAbove?: number;
    DamageRateBattlePointPhase?: DamageRateBattlePointPhase[];
    ParamAddBattlePointPhaseId?: number;
    ParamAddBattlePointPhaseValue?: number;
    ShortenMaxCountEachSkill?: number[];
    ChargeHpMaxBeforeBreakGaugeUp?: number;
    TargetFunctionIndividuality?: number[];
    TargetBuffIndividuality?: number[];
    TargetEnemyClass?: number[];
    ParamAddIndividualityTargetType?: number;
    TriggeredFuncIndexAndCheckList?: number;
    FuncCheckTargetIndividualityTargetType?: number;
    FuncCheckTargetIndividualityCountHigher?: number;
    FuncCheckTargetIndividualityCountLower?: number;
    FuncCheckTargetIndividualityCountEqual?: number;
    ParamAddSelfIndividualityAndCheck?: number;
    ParamAddOpIndividualityAndCheck?: number;
    ParamAddFieldIndividualityAndCheck?: number;
    SnapShotParamAddSelfIndividualityAndCheck?: number;
    SnapShotParamAddOpIndividualityAndCheck?: number;
    SnapShotParamAddFieldIndividualityAndCheck?: number;
}

export type BaseDataValType = BaseDataVal[keyof BaseDataVal];

export interface DataVal extends BaseDataVal {
    DependFuncVals?: BaseDataVal;
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
    STATUS_EFFECT_ID = "StatusEffectId",
    END_BATTLE = "EndBattle",
    LOSE_BATTLE = "LoseBattle",
    ADD_INDIVIDUALTY = "AddIndividualty",
    ADD_LINKAGE_TARGET_INDIVIDUALTY = "AddLinkageTargetIndividualty",
    SAME_BUFF_LIMIT_TARGET_INDIVIDUALITY = "SameBuffLimitTargetIndividuality",
    SAME_BUFF_LIMIT_NUM = "SameBuffLimitNum",
    CHECK_DUPLICATE = "CheckDuplicate",
    ON_FIELD_COUNT = "OnFieldCount",
    TARGET_RARITY_LIST = "TargetRarityList",
    DEPEND_FUNC_ID = "DependFuncId",
    DEPEND_FUNC = "DependFunc",
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
    MOTION_CHANGE = "MotionChange",
    POP_LABEL_DELAY = "PopLabelDelay",
    NO_TARGET_NO_ACT = "NoTargetNoAct",
    CARD_INDEX = "CardIndex",
    CARD_INDIVIDUALITY = "CardIndividuality",
    WAR_BOARD_TAKE_OVER_BUFF = "WarBoardTakeOverBuff",
    PARAM_ADD_SELF_INDIVIDUALITY = "ParamAddSelfIndividuality",
    PARAM_ADD_OP_INDIVIDUALITY = "ParamAddOpIndividuality",
    PARAM_ADD_FIELD_INDIVIDUALITY = "ParamAddFieldIndividuality",
    MULTIPLE_GAIN_STAR = "MultipleGainStar",
    NO_CHECK_INDIVIDUALITY_IF_NOT_UNIT = "NoCheckIndividualityIfNotUnit",
    FORCE_EFFECT_SPEED_ONE = "ForcedEffectSpeedOne",
    SET_LIMIT_COUNT = "SetLimitCount",
    CHECK_ENEMY_FIELD_SPACE = "CheckEnemyFieldSpace",
    TRIGGERED_FUNC_POSITION = "TriggeredFuncPosition",
    DAMAGE_COUNT = "DamageCount",
    DAMAGE_RATES = "DamageRates",
    ON_POSITIONS = "OnPositions",
    OFF_POSITIONS = "OffPositions",
    TARGET_INDIV = "TargetIndiv",
    INCLUDE_IGNORE_INDIVIDUALITY = "IncludeIgnoreIndividuality",
    EVEN_IF_WIN_DIE = "EvenIfWinDie",
    CALL_SVT_EFFECT_ID = "CallSvtEffectId",
    FORCE_ADD_STATE = "ForceAddState",
    UN_SUB_STATE = "UnSubState",
    FORCE_SUB_STATE = "ForceSubState",
    IGNORE_INDIV_UNRELEASEABLE = "IgnoreIndivUnreleaseable",
    ON_PARTY = "OnParty",
    PARAM_ADD_VALUE = "ParamAddValue",
    APPLY_SUPPORT_SVT = "ApplySupportSvt",
    INDIVIDUALITY = "Individuality",
    EVENT_ID = "EventId",
    ADD_COUNT = "AddCount",
    RATE_COUNT = "RateCount",
    DROP_RATE_COUNT = "DropRateCount",
    COUNTER_ID = "CounterId",
    COUNTER_LV = "CounterLv",
    COUNTER_OC = "CounterOc",
    USE_TREASURE_DEVICE = "UseTreasureDevice",
    SKILL_REACTION = "SkillReaction",
    BEHAVE_AS_FAMILY_BUFF = "BehaveAsFamilyBuff",
    UNSUBSTATE_WHILE_LINKED_TO_OTHERS = "UnSubStateWhileLinkedToOthers",
    NOT_ACCOMPANY_WHEN_LINKED_TARGET_MOVE_STATE = "NotAccompanyWhenLinkedTargetMoveState",
    NOT_TARGET_SKILL_ID_ARRAY = "NotTargetSkillIdArray",
    SHORT_TURN = "ShortTurn",
    FIELD_INDIVIDUALITY = "FieldIndividuality",
    BG_ID = "BGId",
    BG_TYPE = "BGType",
    BGM_ID = "BgmId",
    TAKE_OVER_FIELD_STATE = "TakeOverFieldState",
    TAKE_OVER_NEXT_WAVE_BG_AND_BGM = "TakeOverNextWaveBGAndBGM",
    REMOVE_FIELD_BUFF_ACTOR_DEATH = "RemoveFieldBuffActorDeath",
    FIELD_BUFF_GRANT_TYPE = "FieldBuffGrantType",
    PRIORITY = "Priority",
    ADD_INDIVIDUALITY_EX = "AddIndividualityEx",
    IGNORE_RESISTANCE = "IgnoreResistance",
    GAIN_NP_TARGET_PASSIVE_INDIVIDUALITY = "GainNpTargetPassiveIndividuality",
    HP_REDUCE_TO_REGAIN_INDIV = "HpReduceToRegainIndiv",
    DISPLAY_ACTUAL_RECOVERY_HP_FLAG = "DisplayActualRecoveryHpFlag",
    SHIFT_DECK_INDEX = "ShiftDeckIndex",
    POP_VALUE_TEXT = "PopValueText",
    IS_LOSS_HP_PER_NOW = "IsLossHpPerNow",
    COPY_TARGET_FUNCTION_TYPE = "CopyTargetFunctionType",
    COPY_FUNCTION_TARGET_PT_ONLY = "CopyFunctionTargetPTOnly",
    IGNORE_VALUE_UP = "IgnoreValueUp",
    APPLY_VALUE_UP = "ApplyValueUp",
    ACT_NO_DAMAGE_BUFF = "ActNoDamageBuff",
    ACT_SELECT_INDEX = "ActSelectIndex",
    COPY_TARGET_BUFF_TYPE = "CopyTargetBuffType",
    NOT_SKILL_COPY_TARGET_FUNC_IDS = "NotSkillCopyTargetFuncIds",
    NOT_SKILL_COPY_TARGET_INDIVIDUALITIES = "NotSkillCopyTargetIndividualities",
    CLASS_ICON_AURA_EFFECT_ID = "ClassIconAuraEffectId",
    ACT_MASTER_GENDER_TYPE = "ActMasterGenderType",
    INTERVAL_TURN = "IntervalTurn",
    INTERVAL_COUNT = "IntervalCount",
    TRIGGERED_FIELD_COUNT_TARGET = "TriggeredFieldCountTarget",
    TRIGGERED_FIELD_COUNT_RANGE = "TriggeredFieldCountRange",
    TARGET_ENEMY_RANGE = "TargetEnemyRange",
    TRIGGERED_FUNC_POSITION_SAME_TARGET = "TriggeredFuncPositionSameTarget",
    TRIGGERED_FUNC_POSITION_ALL = "TriggeredFuncPositionAll",
    TRIGGERED_TARGET_HP_RANGE = "TriggeredTargetHpRange",
    TRIGGERED_TARGET_HP_RATE_RANGE = "TriggeredTargetHpRateRange",
    EXCLUDE_UN_SUB_STATE_INDIV = "ExcludeUnSubStateIndiv",
    PROGRESS_TURN_ON_BOARD = "ProgressTurnOnBoard",
    CHECK_TARGET_RESURRECTABLE = "CheckTargetResurrectable",
    CANCEL_TRANSFORM = "CancelTransform",
    UN_SUB_STATE_WHEN_CONTINUE = "UnSubStateWhenContinue",
    CHECK_TARGET_HAVE_DEFEAT_POINT = "CheckTargetHaveDefeatPoint",
    NP_FIXED_DAMAGE_VALUE = "NPFixedDamageValue",
    IGNORE_SHIFT_SAFE_DAMAGE = "IgnoreShiftSafeDamage",
    ACT_ATTACK_FUNCTION = "ActAttackFunction",
    DELAY_REMOVE_BUFF_EXPIRED_ON_PLAYER_TURN = "DelayRemoveBuffExpiredOnPlayerTurn",
    ALLOW_REMOVE_BUFF = "AllowRemoveBuff",
    NOT_EXEC_FUNCTION_IF_KEEP_ALIVE_ON_WAR_BOARD = "NotExecFunctionIfKeepAliveOnWarBoard",
    SNAP_SHOT_PARAM_ADD_SELF_INDV = "SnapShotParamAddSelfIndv",
    SNAP_SHOT_PARAM_ADD_OP_INDV = "SnapShotParamAddOpIndv",
    SNAP_SHOT_PARAM_ADD_FIELD_INDV = "SnapShotParamAddFieldIndv",
    SNAP_SHOT_PARAM_ADD_VALUE = "SnapShotParamAddValue",
    SNAP_SHOT_PARAM_ADD_MAX_VALUE = "SnapShotParamAddMaxValue",
    SNAP_SHOT_PARAM_ADD_MAX_COUNT = "SnapShotParamAddMaxCount",
    NOT_EXEC_ON_TRANSFORM = "NotExecOnTransform",
    NOT_REMOVE_ON_TRANSFORM = "NotRemoveOnTransform",
    PRIORITY_BGM = "PriorityBgm",
    BGM_ALLOW_SUB_PLAYING = "BgmAllowSubPlaying",
    BG_PRIORITY = "BgPriority",
    PRIORITY_BG = "PriorityBg",
    RESET_PRIORITY_BGM_AT_WAVE_START = "ResetPriorityBgmAtWaveStart",
    CONTROL_OTHER_BGM_AT_OVER_STAGE_BGM_PRIORITY = "ControlOtherBgmAtOverStageBgm_Priority",
    CONTROL_OTHER_BGM_AT_OVER_STAGE_BGM_TARGET = "ControlOtherBgmAtOverStageBgm_Target",
    EXTEND_BUFF_HALF_TURN_IN_OPPONENT_TURN = "ExtendBuffHalfTurnInOpponentTurn",
    SHORTEN_BUFF_HALF_TURN_IN_OPPONENT_TURN = "ShortenBuffHalfTurnInOpponentTurn",
    EXTEND_BUFF_HALF_TURN_IN_PARTY_TURN = "ExtendBuffHalfTurnInPartyTurn",
    SHORTEN_BUFF_HALF_TURN_IN_PARTY_TURN = "ShortenBuffHalfTurnInPartyTurn",
    LINKAGE_BUFF_GRANT_SUCCESS_EVEN_IF_OTHER_FAILED = "LinkageBuffGrantSuccessEvenIfOtherFailed",
    DISPLAY_NO_EFFECT_CAUSES = "DisplayNoEffectCauses",
    BATTLE_POINT_ID = "BattlePointId",
    BATTLE_POINT_VALUE = "BattlePointValue",
    BATTLE_POINT_UI_UPDATE_TYPE = "BattlePointUiUpdateType",
    BATTLE_POINT_OVERWRITE = "BattlePointOverwrite",
    CHECK_OVER_CHARGE_STAGE_RANGE = "CheckOverChargeStageRange",
    CHECK_BATTLE_POINT_PHASE_RANGE = "CheckBattlePointPhaseRange",
    STARTING_POSITION = "StartingPosition",
    FRIEND_SHIP_ABOVE = "FriendShipAbove",
    DAMAGE_RATE_BATTLE_POINT_PHASE = "DamageRateBattlePointPhase",
    PARAM_ADD_BATTLE_POINT_PHASE_ID = "ParamAddBattlePointPhaseId",
    PARAM_ADD_BATTLE_POINT_PHASE_VALUE = "ParamAddBattlePointPhaseValue",
    SHORTEN_MAX_COUNT_EACH_SKILL = "ShortenMaxCountEachSkill",
    TARGET_FUNCTION_INDIVIDUALITY = "TargetFunctionIndividuality",
    TARGET_BUFF_INDIVIDUALITY = "TargetBuffIndividuality",
    TARGET_ENEMY_CLASS = "TargetEnemyClass",
    PARAM_ADD_INDIVIDUALITY_TARGET_TYPE = "ParamAddIndividualityTargetType",
    TRIGGERED_FUNC_INDEX_AND_CHECK_LIST = "TriggeredFuncIndexAndCheckList",
    FUNC_CHECK_TARGET_INDIVIDUALITY_TARGET_TYPE = "FuncCheckTargetIndividualityTargetType",
    FUNC_CHECK_TARGET_INDIVIDUALITY_COUNT_HIGHER = "FuncCheckTargetIndividualityCountHigher",
    FUNC_CHECK_TARGET_INDIVIDUALITY_COUNT_LOWER = "FuncCheckTargetIndividualityCountLower",
    FUNC_CHECK_TARGET_INDIVIDUALITY_COUNT_EQUAL = "FuncCheckTargetIndividualityCountEqual",
    PARAM_ADD_SELF_INDIVIDUALITY_AND_CHECK = "ParamAddSelfIndividualityAndCheck",
    PARAM_ADD_OP_INDIVIDUALITY_AND_CHECK = "ParamAddOpIndividualityAndCheck",
    PARAM_ADD_FIELD_INDIVIDUALITY_AND_CHECK = "ParamAddFieldIndividualityAndCheck",
    SNAP_SHOT_PARAM_ADD_SELF_INDIVIDUALITY_AND_CHECK = "SnapShotParamAddSelfIndividualityAndCheck",
    SNAP_SHOT_PARAM_ADD_OP_INDIVIDUALITY_AND_CHECK = "SnapShotParamAddOpIndividualityAndCheck",
    SNAP_SHOT_PARAM_ADD_FIELD_INDIVIDUALITY_AND_CHECK = "SnapShotParamAddFieldIndividualityAndCheck",
}
