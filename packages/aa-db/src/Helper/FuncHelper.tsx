import {BuffType, DataValField, Func, Region} from "@atlasacademy/api-connector";
import FuncType from "@atlasacademy/api-connector/dist/Enum/FuncType";
import DataVal from "@atlasacademy/api-connector/dist/Schema/DataVal";
import React from "react";
import FuncValueDescriptor from "../Descriptor/FuncValueDescriptor";
import {Renderable} from "./OutputHelper";

const hasChangingDataVals = function (vals: DataVal[]): boolean {
    if (!vals.length)
        return false;

    let previous = vals[0];
    for (let i = 1; i < vals.length; i++) {
        if (JSON.stringify(previous) !== JSON.stringify(vals[i]))
            return true;

        previous = vals[i];
    }

    return false;
};

const hasUniqueValues = function (values: (number | number[] | undefined)[]): boolean {
    if (values.length === 0)
        return false;

    return new Set(
        values.map(value => {
            if (Array.isArray(value))
                return value.join(',');

            return value;
        })
    ).size > 1;
};

export function describeMutators(region: Region, func: Func): Renderable[] {
    const dataVals = getDataValList(func),
        staticVals = getStaticFieldValues(dataVals),
        mutatingVals = getMutatingFieldValues(dataVals);

    return mutatingVals
        .map(mutatingVal => <FuncValueDescriptor region={region} func={func} staticDataVal={staticVals}
                                                 dataVal={mutatingVal}/>);
}

export function funcUpdatesByLevel(func: Func): boolean {
    return hasChangingDataVals(getLevelDataValList(func));
}

export function funcUpdatesByOvercharge(func: Func): boolean {
    return hasChangingDataVals(getOverchargeDataValList(func));
}

export function getDataValList(func: Func): DataVal[] {
    const isLevel = funcUpdatesByLevel(func),
        isOvercharge = funcUpdatesByOvercharge(func);

    return isLevel && isOvercharge
        ? getMixedDataValList(func)
        : (isOvercharge ? getOverchargeDataValList(func) : getLevelDataValList(func));
}

export function getFollowerDataValList(func: Func): DataVal[] {
    return func.followerVals ?? [];
}

export function getLevelDataValList(func: Func): DataVal[] {
    return func.svals ?? [];
}

export function getMixedDataValList(func: Func): DataVal[] {
    const dataVals = [];

    for (let i = 1; i <= 5; i++) {
        let dataVal = getTargetVersionValues(func, i, i);
        if (dataVal !== undefined)
            dataVals.push(dataVal);
    }

    return dataVals;
}

export function getMutatingFieldNames(vals: DataVal[]): DataValField[] {
    return Object.values(DataValField).filter(field => {
        const values = vals.map(val => val[field]);

        return hasUniqueValues(values);
    });
}

export function getMutatingFieldValues(vals: DataVal[]): DataVal[] {
    if (!vals.length)
        return [];

    const fields = getMutatingFieldNames(vals),
        hasDependingVals = vals.filter(val => val.DependFuncVals !== undefined).length > 0,
        dependingVals: (DataVal[] | undefined) = (
            hasDependingVals
                ? vals.map(val => (val.DependFuncVals ?? {}) as DataVal)
                : undefined
        ),
        dependingMutatingValues = dependingVals ? getMutatingFieldValues(dependingVals) : [],
        staticValues = getStaticFieldValues(vals);

    return vals.map((val, index) => {
        const mutatingVals: DataVal = {};

        for (let x in fields) {
            const fieldName = fields[x];

            // @ts-ignore
            mutatingVals[fieldName] = val[fieldName];
        }

        if (staticValues.DependFuncId && dependingMutatingValues[index]) {
            mutatingVals.DependFuncId = staticValues.DependFuncId;
            mutatingVals.DependFuncVals = dependingMutatingValues[index];
        }

        return mutatingVals;
    });
}

export function getOverchargeDataValList(func: Func): DataVal[] {
    const dataVals = [];

    for (let i = 1; i <= 5; i++) {
        let dataVal = getTargetVersionValues(func, 1, i);
        if (dataVal !== undefined)
            dataVals.push(dataVal);
    }

    return dataVals;
}

export function getRelatedSkillIds(func: Func): number[] {
    if (func.funcType !== FuncType.ADD_STATE && func.funcType !== FuncType.ADD_STATE_SHORT)
        return [];

    const buff = func.buffs[0];
    if (
        buff.type === BuffType.ATTACK_FUNCTION
        || buff.type === BuffType.COMMANDATTACK_FUNCTION
        || buff.type === BuffType.COMMANDATTACK_BEFORE_FUNCTION
        || buff.type === BuffType.COMMANDCODEATTACK_FUNCTION
        || buff.type === BuffType.DAMAGE_FUNCTION
        || buff.type === BuffType.DEAD_FUNCTION
        || buff.type === BuffType.DELAY_FUNCTION
        || buff.type === BuffType.GUTS_FUNCTION
        || buff.type === BuffType.SELFTURNEND_FUNCTION
    ) {
        const dataVals = getDataValList(func),
            dataVal = dataVals[0];

        return typeof dataVal.Value === "number" ? [dataVal.Value] : [];
    }

    if (buff.type === BuffType.NPATTACK_PREV_BUFF) {
        const dataVals = getDataValList(func),
            dataVal = dataVals[0];

        return typeof dataVal.SkillID === "number" ? [dataVal.SkillID] : [];
    }

    return [];
}

export function getStaticFieldNames(vals: DataVal[]): DataValField[] {
    return Object.values(DataValField).filter(field => {
        const values = vals.map(val => val[field]);

        return !hasUniqueValues(values);
    });
}

export function getStaticFieldValues(vals: DataVal[]): DataVal {
    if (!vals.length)
        return {};

    const fields = getStaticFieldNames(vals),
        staticVals: DataVal = {},
        hasDependingVals = vals.filter(val => val.DependFuncVals !== undefined).length > 0,
        dependingVals: (DataVal[] | undefined) = (
            hasDependingVals
                ? vals.map(val => (val.DependFuncVals ?? {}) as DataVal)
                : undefined
        ),
        dependingStaticValues = dependingVals ? getStaticFieldValues(dependingVals) : undefined;

    for (let x in fields) {
        // @ts-ignore
        staticVals[fields[x]] = vals[0][fields[x]];
    }

    if (hasDependingVals)
        staticVals.DependFuncVals = dependingStaticValues;

    return staticVals;
}

export function getTargetFollowerVersionValues(func: Func, level: number): DataVal | undefined {
    if (func.followerVals === undefined)
        return undefined;

    return func.followerVals[level - 1];
}

export function getTargetVersionValues(func: Func, level: number, overcharge: number = 1): DataVal | undefined {
    if (func.svals === undefined)
        return undefined;

    let dataVals;

    if (overcharge === 2 && func.svals2)
        dataVals = func.svals2;
    else if (overcharge === 3 && func.svals3)
        dataVals = func.svals3;
    else if (overcharge === 4 && func.svals4)
        dataVals = func.svals4;
    else if (overcharge === 5 && func.svals5)
        dataVals = func.svals5;
    else
        dataVals = func.svals;

    return dataVals[level - 1];
}

export function hasFollowerDataVals(func: Func): boolean {
    return func.followerVals !== undefined;
}
