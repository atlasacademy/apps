import { Buff, DataVal, Func } from "@atlasacademy/api-connector";

import getValList from "./getValList";

export interface relatedSkill {
    skillId: number;
    skillLvs: number[];
}

export default function (func: Func.Func, dataVals?: DataVal.DataVal[]): relatedSkill[] {
    const vals = dataVals ?? getValList(func);

    if (func.funcType !== Func.FuncType.ADD_STATE && func.funcType !== Func.FuncType.ADD_STATE_SHORT) return [];

    const buff = func.buffs[0];
    if (
        buff.type === Buff.BuffType.ATTACK_FUNCTION ||
        buff.type === Buff.BuffType.ATTACK_BEFORE_FUNCTION ||
        buff.type === Buff.BuffType.COMMANDATTACK_FUNCTION ||
        buff.type === Buff.BuffType.COMMANDATTACK_BEFORE_FUNCTION ||
        buff.type === Buff.BuffType.COMMANDCODEATTACK_FUNCTION ||
        buff.type === Buff.BuffType.COMMANDCODEATTACK_AFTER_FUNCTION ||
        buff.type === Buff.BuffType.DAMAGE_FUNCTION ||
        buff.type === Buff.BuffType.DEAD_FUNCTION ||
        buff.type === Buff.BuffType.DELAY_FUNCTION ||
        buff.type === Buff.BuffType.ENTRY_FUNCTION ||
        buff.type === Buff.BuffType.GUTS_FUNCTION ||
        buff.type === Buff.BuffType.SELFTURNEND_FUNCTION ||
        buff.type === Buff.BuffType.WAVESTART_FUNCTION ||
        buff.type === Buff.BuffType.REFLECTION_FUNCTION
    ) {
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
