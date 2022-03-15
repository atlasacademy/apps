import { Buff, DataVal, Func } from "@atlasacademy/api-connector";

import getValList from "./getValList";

export interface relatedNp {
    npId: number;
    npLvs: number[];
    npOCs: number[];
}

export default function (func: Func.Func, dataVals?: DataVal.DataVal[]): relatedNp[] {
    const vals = dataVals ?? getValList(func);

    if (func.funcType !== Func.FuncType.ADD_STATE && func.funcType !== Func.FuncType.ADD_STATE_SHORT) return [];

    const buff = func.buffs[0];
    if (buff.type === Buff.BuffType.COUNTER_FUNCTION) {
        return getUniqueDataValField(
            vals,
            DataVal.DataValField.COUNTER_ID,
            DataVal.DataValField.COUNTER_LV,
            DataVal.DataValField.COUNTER_OC
        );
    }

    return [];
}

function getUniqueDataValField(
    dataVals: DataVal.DataVal[],
    idField: DataVal.DataValField,
    lvField: DataVal.DataValField,
    ocField: DataVal.DataValField
): relatedNp[] {
    let relatedNps: Record<number, relatedNp> = {};

    dataVals.forEach((dataVal) => {
        const npId = dataVal[idField];
        const npLv = dataVal[lvField];
        const npOC = dataVal[ocField];
        if (typeof npId === "number" && typeof npLv === "number" && typeof npOC === "number") {
            if (npId in relatedNps) {
                relatedNps[npId].npLvs.push(npLv);
                relatedNps[npId].npOCs.push(npOC);
            } else {
                relatedNps[npId] = { npId: npId, npLvs: [npLv], npOCs: [npOC] };
            }
        }
    });

    return Array.from(Object.values(relatedNps));
}
