export enum RestrictionType {
    INDIVIDUALITY = "individuality",
    RARITY = "rarity",
    TOTAL_COST = "totalCost",
    LV = "lv",
    SUPPORT_ONLY = "supportOnly",
    UNIQUE_SVT_ONLY = "uniqueSvtOnly",
    FIXED_SUPPORT_POSITION = "fixedSupportPosition",
    FIXED_MY_SVT_INDIVIDUALITY_POSITION_MAIN = "fixedMySvtIndividualityPositionMain",
    FIXED_MY_SVT_INDIVIDUALITY_SINGLE = "fixedMySvtIndividualitySingle",
    SVT_NUM = "svtNum",
    MY_SVT_NUM = "mySvtNum",
    MY_SVT_OR_NPC = "mySvtOrNpc",
    ALLOUT_BATTLE_UNIQUE_SVT = "alloutBattleUniqueSvt",
    FIXED_SVT_INDIVIDUALITY_POSITION_MAIN = "fixedSvtIndividualityPositionMain",
    UNIQUE_INDIVIDUALITY = "uniqueIndividuality",
    MY_SVT_OR_SUPPORT = "mySvtOrSupport",
    DATA_LOST_BATTLE_UNIQUE_SVT = "dataLostBattleUniqueSvt",
}

export enum RestrictionRange {
    NONE = "none",
    EQUAL = "equal",
    NOT_EQUAL = "notEqual",
    ABOVE = "above",
    BELOW = "below",
    BETWEEN = "between",
}

export interface Restriction {
    id: number;
    name: string;
    type: RestrictionType;
    rangeType: RestrictionRange;
    targetVals: number[];
    targetVals2: number[];
}
