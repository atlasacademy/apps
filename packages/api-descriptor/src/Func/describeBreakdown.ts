import { DataVal, Func } from "@atlasacademy/api-connector";

import { Descriptor } from "../Descriptor.js";
import { Breakdown } from "./Breakdown.js";
import describe from "./describe.js";
import describeValue from "./describeValue.js";
import getMutatingDataVal from "./getMutatingDataVal.js";
import getRelatedSkillIds from "./getRelatedSkillIds.js";
import getStaticDataVal from "./getStaticDataVal.js";
import getValList from "./getValList.js";

export default function (func: Func.Func): Breakdown[] {
    const levels = getLevels(func),
        overchargeLevels = getOverchargeLevels(func),
        levelScaling = isLevelScaling(func, levels),
        overchargeScaling = overchargeLevels > 1 ? isOverchargeScaling(func, overchargeLevels) : false,
        staticDataVal = getStaticDataVal(func);

    if (levelScaling && overchargeScaling) {
        const breakdowns: Breakdown[] = [];

        for (let level = 1; level <= levels; level++) {
            const mutatingDataVal = Array(overchargeLevels)
                .fill(null)
                .map((_, overcharge) => {
                    return getMutatingDataVal(func, level, overcharge);
                });

            breakdowns.push(breakdownFunc(func, level, staticDataVal, mutatingDataVal));
        }

        return breakdowns;
    } else if (levelScaling) {
        const mutatingDataVal = Array(levels)
            .fill(null)
            .map((_, level) => {
                return getMutatingDataVal(func, level);
            });

        return [breakdownFunc(func, undefined, staticDataVal, mutatingDataVal)];
    } else if (overchargeScaling) {
        const mutatingDataVal = Array(overchargeLevels)
            .fill(null)
            .map((_, overcharge) => {
                return getMutatingDataVal(func, 1, overcharge);
            });

        return [breakdownFunc(func, undefined, staticDataVal, mutatingDataVal)];
    } else {
        return [breakdownFunc(func, undefined, staticDataVal, Array(levels).fill({}))];
    }
}

function breakdownFunc(
    func: Func.Func,
    level: number | undefined,
    staticVal: DataVal.DataVal,
    mutatingVals: DataVal.DataVal[]
): Breakdown {
    const dataVals = getValList(func, level),
        followerDataVals = func.followerVals,
        descriptor = describe(func, dataVals, followerDataVals, level),
        relatedSkillIds = getRelatedSkillIds(func, dataVals),
        mutatorDescriptors: Descriptor[] = [];

    mutatingVals.forEach((mutatingVal) => {
        const mutatorDescriptor = describeValue(func, staticVal, mutatingVal);

        if (mutatorDescriptor !== undefined) mutatorDescriptors.push(mutatorDescriptor);
    });

    return { descriptor, mutatorDescriptors, relatedSkillIds };
}

function getLevels(func: Func.Func): number {
    return func.svals.length;
}

function getOverchargeLevels(func: Func.Func): number {
    let levels = 1;

    if (func.svals2 !== undefined) levels++;
    if (func.svals3 !== undefined) levels++;
    if (func.svals4 !== undefined) levels++;
    if (func.svals5 !== undefined) levels++;

    return levels;
}

function isDataValsDifferent(val1: DataVal.DataVal, val2: DataVal.DataVal): boolean {
    return JSON.stringify(val1) === JSON.stringify(val2);
}

function isLevelScaling(func: Func.Func, levels: number): boolean {
    const val1 = getMutatingDataVal(func, 1),
        val2 = getMutatingDataVal(func, levels);

    return isDataValsDifferent(val1, val2);
}

function isOverchargeScaling(func: Func.Func, levels: number): boolean {
    const val1 = getMutatingDataVal(func, 1, 1),
        val2 = getMutatingDataVal(func, 1, levels);

    return isDataValsDifferent(val1, val2);
}
