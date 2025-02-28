import { Buff, DataVal, Func } from "@atlasacademy/api-connector";

import { buffTriggerTypes } from "../Buff/BuffTypes";
import getValList from "./getValList";

export interface relatedSkill {
    skillId: number;
    skillLvs: number[];
}

export default function (func: Func.Func, dataVals?: DataVal.DataVal[]): relatedSkill[] {
    const vals = dataVals ?? getValList(func);

    if (func.funcType === Func.FuncType.GENERATE_BATTLE_SKILL_DROP) {
        return getUniqueDataValField(vals, DataVal.DataValField.VALUE);
    }

    if (func.funcType !== Func.FuncType.ADD_STATE && func.funcType !== Func.FuncType.ADD_STATE_SHORT) return [];

    const buffTriggerType = buffTriggerTypes.get(func.buffs[0].type);
    if (buffTriggerType !== undefined && !buffTriggerType.counterNp) {
        return getUniqueDataValField(
            vals,
            buffTriggerType.skill ?? DataVal.DataValField.VALUE,
            buffTriggerType.level ?? DataVal.DataValField.VALUE2
        );
    }

    return [];
}

function getUniqueDataValField(
    dataVals: DataVal.DataVal[],
    idField: DataVal.DataValField,
    lvField?: DataVal.DataValField
): relatedSkill[] {
    let relatedSkills: Record<number, relatedSkill> = {};

    dataVals.forEach((dataVal) => {
        const skillId = dataVal[idField];
        const skillLv = lvField ? dataVal[lvField] : 1;
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
