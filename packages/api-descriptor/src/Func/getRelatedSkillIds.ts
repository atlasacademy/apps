import {Buff, DataVal, Func} from "@atlasacademy/api-connector";
import getValList from "./getValList";

export default function (func: Func.Func, dataVals?: DataVal.DataVal[]): number[] {
    const vals = dataVals ?? getValList(func);

    if (func.funcType !== Func.FuncType.ADD_STATE && func.funcType !== Func.FuncType.ADD_STATE_SHORT)
        return [];

    const buff = func.buffs[0];
    if (
        buff.type === Buff.BuffType.ATTACK_FUNCTION
        || buff.type === Buff.BuffType.COMMANDATTACK_FUNCTION
        || buff.type === Buff.BuffType.COMMANDATTACK_BEFORE_FUNCTION
        || buff.type === Buff.BuffType.COMMANDCODEATTACK_FUNCTION
        || buff.type === Buff.BuffType.DAMAGE_FUNCTION
        || buff.type === Buff.BuffType.DEAD_FUNCTION
        || buff.type === Buff.BuffType.DELAY_FUNCTION
        || buff.type === Buff.BuffType.GUTS_FUNCTION
        || buff.type === Buff.BuffType.SELFTURNEND_FUNCTION
    ) {
        return getUniqueDataValField(vals, DataVal.DataValField.VALUE);
    }

    if (buff.type === Buff.BuffType.NPATTACK_PREV_BUFF) {
        return getUniqueDataValField(vals, DataVal.DataValField.SKILL_ID);
    }

    return [];
}

function getUniqueDataValField(dataVals: DataVal.DataVal[], field: DataVal.DataValField): number[] {
    const vals = new Set<number>();

    dataVals.forEach(dataVal => {
        const value = dataVal[field];
        if (typeof value === "number")
            vals.add(value);
    });

    return Array.from(vals);
}
