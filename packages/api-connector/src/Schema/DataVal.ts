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
}

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
}
