import { Func } from "@atlasacademy/api-connector";

export const targetSameTeam = (target: Func.FuncTargetType): boolean => {
    return [
        Func.FuncTargetType.PT_ALL,
        Func.FuncTargetType.PT_ANOTHER,
        Func.FuncTargetType.PT_FULL,
        Func.FuncTargetType.PT_ONE,
        Func.FuncTargetType.PT_ONE_ANOTHER_RANDOM,
        Func.FuncTargetType.PT_ONE_HP_LOWEST_RATE,
        Func.FuncTargetType.PT_ONE_HP_LOWEST_VALUE,
        Func.FuncTargetType.PT_ONE_OTHER,
        Func.FuncTargetType.PT_OTHER,
        Func.FuncTargetType.PT_OTHER_FULL,
        Func.FuncTargetType.PT_RANDOM,
        Func.FuncTargetType.PT_SELF_AFTER,
        Func.FuncTargetType.PT_SELF_ANOTHER_FIRST,
        Func.FuncTargetType.PT_SELF_ANOTHER_LAST,
        Func.FuncTargetType.PT_SELF_ANOTHER_RANDOM,
        Func.FuncTargetType.PT_SELF_BEFORE,
    ].includes(target);
};

export const targetOpposingTeam = (target: Func.FuncTargetType): boolean => {
    return [
        Func.FuncTargetType.ENEMY,
        Func.FuncTargetType.ENEMY_ALL,
        Func.FuncTargetType.ENEMY_ANOTHER,
        Func.FuncTargetType.ENEMY_FULL,
        Func.FuncTargetType.ENEMY_ONE_ANOTHER_RANDOM,
        Func.FuncTargetType.ENEMY_ONE_NO_TARGET_NO_ACTION,
        Func.FuncTargetType.ENEMY_OTHER,
        Func.FuncTargetType.ENEMY_OTHER_FULL,
        Func.FuncTargetType.ENEMY_RANDOM,
    ].includes(target);
};
