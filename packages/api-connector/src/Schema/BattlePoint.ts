export interface BattlePointPhase {
    phase: number;
    value: number;
    name: string;
    effectId: number;
}

export enum BattlePointFlag {
    NONE = "none",
    NOT_TARGET_OTHER_PLAYER = "notTargetOtherPlayer",
    HIDE_UI_GAUGE_ALL_TIME = "hideUiGaugeAllTime",
    HIDE_UI_GAUGE_WHEN_CANT_ADD_POINT = "hideUiGaugeWhenCantAddPoint",
    HIDE_UI_GAUGE_WHEN_CANT_ADD_POINT_AND_FOLLOWER_SUPPORT = "hideUiGaugeWhenCantAddPointAndFollowerSupport",
    BATTLE_POINT_CHECK_AS_PERCENTAGE = "battlePointCheckAsPercentage",
    RESET_VALUE_ON_CONTINUE = "resetValueOnContinue",
}

export interface BattlePoint {
    id: number;
    flags: BattlePointFlag[];
    phases: BattlePointPhase[];
}
