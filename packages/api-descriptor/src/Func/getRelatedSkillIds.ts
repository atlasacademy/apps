import { Buff, DataVal, Func } from "@atlasacademy/api-connector";

import { buffTriggerTypes } from "../Buff/BuffTypes";
import getValList from "./getValList";

export interface relatedSkill {
    skillId: number;
    skillLvs: number[];
}

export default function (func: Func.Func, dataVals?: DataVal.DataVal[]): relatedSkill[] {
    const vals = dataVals ?? getValList(func);

    if (func.funcType !== Func.FuncType.ADD_STATE && func.funcType !== Func.FuncType.ADD_STATE_SHORT) return [];

    const buff = func.buffs[0];
    if (buffTriggerTypes.has(buff.type)) {
        return getUniqueDataValField(vals, DataVal.DataValField.VALUE, DataVal.DataValField.VALUE2);
    }

    if (buff.type === Buff.BuffType.NPATTACK_PREV_BUFF) {
        return getUniqueDataValField(vals, DataVal.DataValField.SKILL_ID, DataVal.DataValField.SKILL_LV);
    }

    return [];
}

function getUniqueDataValField(
    dataVals: DataVal.DataVal[],
    idField: DataVal.DataValField,
    lvField: DataVal.DataValField
): relatedSkill[] {
    let relatedSkills: Record<number, relatedSkill> = {};

    dataVals.forEach((dataVal) => {
        const skillId = dataVal[idField];
        const skillLv = dataVal[lvField];
        if (typeof skillId === "number" && typeof skillLv === "number") {
            if (skillId in relatedSkills) {
                relatedSkills[skillId].skillLvs.push(skillLv);
            } else {
                relatedSkills[skillId] = { skillId: skillId, skillLvs: [skillLv] };
            }
        }
    });

    return Array.from(Object.values(relatedSkills));
}
