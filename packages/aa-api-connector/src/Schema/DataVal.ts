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
    Individuality?: number;
    EventId?: number;
    AddCount?: number;
    RateCount?: number;
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
    INDIVIDUALITY = "Individuality",
    EVENT_ID = "EventId",
    ADD_COUNT = "AddCount",
    RATE_COUNT = "RateCount",
}
