import { DataVal, Func, Region } from "@atlasacademy/api-connector";
import { FuncDescriptor } from "@atlasacademy/api-descriptor";

import FuncValueDescriptor from "../Descriptor/FuncValueDescriptor";
import { dedupe } from "./ArrayHelper";
import { Renderable } from "./OutputHelper";

const hasChangingDataVals = function (vals: DataVal.DataVal[]): boolean {
    if (!vals.length) return false;

    let previous = vals[0];
    for (let i = 1; i < vals.length; i++) {
        if (JSON.stringify(previous) !== JSON.stringify(vals[i])) return true;

        previous = vals[i];
    }

    return false;
};

const hasUniqueValues = function (values: (string | string[] | number | number[] | undefined)[]): boolean {
    if (values.length === 0) return false;

    return (
        new Set(
            values.map((value) => {
                if (Array.isArray(value)) return value.join(",");

                return value;
            })
        ).size > 1
    );
};

export function describeMutators(
    region: Region,
    func: Func.Func,
    dependFuncs: Map<number, Func.BasicFunc>
): Renderable[] {
    const dataVals = getDataValList(func),
        staticVals = getStaticFieldValues(dataVals),
        mutatingVals = getMutatingFieldValues(dataVals);

    return mutatingVals.map((mutatingVal) => (
        <FuncValueDescriptor
            region={region}
            func={func}
            staticDataVal={staticVals}
            dataVal={mutatingVal}
            dependFunc={dependFuncs.get(mutatingVal.DependFuncId ?? staticVals.DependFuncId ?? -1)}
        />
    ));
}

export function funcUpdatesByLevel(func: Partial<Func.Func>): boolean {
    return hasChangingDataVals(getLevelDataValList(func));
}

export function funcUpdatesByOvercharge(func: Partial<Func.Func>): boolean {
    return hasChangingDataVals(getOverchargeDataValList(func));
}

export function getDataValList(func: Partial<Func.Func>): DataVal.DataVal[] {
    const isLevel = funcUpdatesByLevel(func),
        isOvercharge = funcUpdatesByOvercharge(func);

    return isLevel && isOvercharge
        ? getMixedDataValList(func)
        : isOvercharge
        ? getOverchargeDataValList(func)
        : getLevelDataValList(func);
}

export function getFollowerDataValList(func: Partial<Func.Func>): DataVal.DataVal[] {
    return func.followerVals ?? [];
}

export function getLevelDataValList(func: Partial<Func.Func>): DataVal.DataVal[] {
    return func.svals ?? [];
}

export function getMixedDataValList(func: Partial<Func.Func>): DataVal.DataVal[] {
    const dataVals = [];

    for (let i = 1; i <= 5; i++) {
        let dataVal = getTargetVersionValues(func, i, i);
        if (dataVal !== undefined) dataVals.push(dataVal);
    }

    return dataVals;
}

export function getMutatingFieldNames(vals: DataVal.DataVal[]): DataVal.DataValField[] {
    return Object.values(DataVal.DataValField).filter((field) => {
        const values = vals.map((val) => val[field]);

        return hasUniqueValues(values);
    });
}

export function getMutatingFieldValues(vals: DataVal.DataVal[]): DataVal.DataVal[] {
    if (!vals.length) return [];

    const fields = getMutatingFieldNames(vals),
        hasDependingVals = vals.filter((val) => val.DependFuncVals !== undefined).length > 0,
        dependingVals: DataVal.DataVal[] | undefined = hasDependingVals
            ? vals.map((val) => (val.DependFuncVals ?? {}) as DataVal.DataVal)
            : undefined,
        dependingMutatingValues = dependingVals ? getMutatingFieldValues(dependingVals) : [],
        staticValues = getStaticFieldValues(vals);

    return vals.map((val, index) => {
        const mutatingVals: DataVal.DataVal = {};

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

export function getOverchargeDataValList(func: Partial<Func.Func>): DataVal.DataVal[] {
    const dataVals = [];

    for (let i = 1; i <= 5; i++) {
        let dataVal = getTargetVersionValues(func, 1, i);
        if (dataVal !== undefined) dataVals.push(dataVal);
    }

    return dataVals;
}

export function getStaticFieldNames(vals: DataVal.DataVal[]): DataVal.DataValField[] {
    return Object.values(DataVal.DataValField).filter((field) => {
        const values = vals.map((val) => val[field]);

        return !hasUniqueValues(values);
    });
}

export function getStaticFieldValues(vals: DataVal.DataVal[]): DataVal.DataVal {
    if (!vals.length) return {};

    const fields = getStaticFieldNames(vals),
        staticVals: DataVal.DataVal = {},
        hasDependingVals = vals.filter((val) => val.DependFuncVals !== undefined).length > 0,
        dependingVals: DataVal.DataVal[] | undefined = hasDependingVals
            ? vals.map((val) => (val.DependFuncVals ?? {}) as DataVal.DataVal)
            : undefined,
        dependingStaticValues = dependingVals ? getStaticFieldValues(dependingVals) : undefined;

    for (let x in fields) {
        // @ts-ignore
        staticVals[fields[x]] = vals[0][fields[x]];
    }

    if (hasDependingVals) staticVals.DependFuncVals = dependingStaticValues;

    return staticVals;
}

export function getTargetFollowerVersionValues(func: Partial<Func.Func>, level: number): DataVal.DataVal | undefined {
    if (func.followerVals === undefined) return undefined;

    return func.followerVals[level - 1];
}

export function getTargetVersionValues(
    func: Partial<Func.Func>,
    level: number,
    overcharge: number = 1
): DataVal.DataVal | undefined {
    if (func.svals === undefined) return undefined;

    let dataVals;

    if (overcharge === 2 && func.svals2) dataVals = func.svals2;
    else if (overcharge === 3 && func.svals3) dataVals = func.svals3;
    else if (overcharge === 4 && func.svals4) dataVals = func.svals4;
    else if (overcharge === 5 && func.svals5) dataVals = func.svals5;
    else dataVals = func.svals;

    return dataVals[level - 1];
}

export function hasFollowerDataVals(func: Partial<Func.Func>): boolean {
    return func.followerVals !== undefined;
}

export function isPlayerSideFunction(func: Func.Func) {
    let playerTargetEnemies =
        FuncDescriptor.targetOpposingTeam(func.funcTargetType) && func.funcTargetTeam !== Func.FuncTargetTeam.PLAYER;

    let playerTargetPlayers =
        !FuncDescriptor.targetOpposingTeam(func.funcTargetType) && func.funcTargetTeam !== Func.FuncTargetTeam.ENEMY;

    return playerTargetEnemies || playerTargetPlayers;
}

export function getDependFuncIds(func: Func.Func): number[] {
    const allDependFuncIds = [func.svals, func.svals2, func.svals3, func.svals4, func.svals5].map((svals) =>
        svals !== undefined ? svals.map((sval) => sval.DependFuncId) : []
    );
    return dedupe(allDependFuncIds.flat()).filter((funcId) => funcId !== undefined) as number[];
}
