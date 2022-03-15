import React from "react";

import { DataVal, Func, Region } from "@atlasacademy/api-connector";

import FuncValueDescriptor from "../Descriptor/FuncValueDescriptor";
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

const hasUniqueValues = function (values: (number | number[] | undefined)[]): boolean {
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

export function describeMutators(region: Region, func: Func.Func): Renderable[] {
    const dataVals = getDataValList(func),
        staticVals = getStaticFieldValues(dataVals),
        mutatingVals = getMutatingFieldValues(dataVals);

    return mutatingVals.map((mutatingVal) => (
        <FuncValueDescriptor region={region} func={func} staticDataVal={staticVals} dataVal={mutatingVal} />
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
        [
            Func.FuncTargetType.ENEMY,
            Func.FuncTargetType.ENEMY_ANOTHER,
            Func.FuncTargetType.ENEMY_ALL,
            Func.FuncTargetType.ENEMY_FULL,
            Func.FuncTargetType.ENEMY_OTHER,
            Func.FuncTargetType.ENEMY_RANDOM,
            Func.FuncTargetType.ENEMY_OTHER_FULL,
            Func.FuncTargetType.ENEMY_ONE_ANOTHER_RANDOM,
        ].includes(func.funcTargetType) &&
        // must target at least enemy
        func.funcTargetTeam !== Func.FuncTargetTeam.PLAYER;

    let playerTargetPlayers =
        [
            Func.FuncTargetType.SELF,
            Func.FuncTargetType.PT_ONE,
            Func.FuncTargetType.PT_ANOTHER,
            Func.FuncTargetType.PT_ALL,
            Func.FuncTargetType.PT_FULL,
            Func.FuncTargetType.PT_OTHER,
            Func.FuncTargetType.PT_ONE_OTHER,
            Func.FuncTargetType.PT_RANDOM,
            Func.FuncTargetType.PT_OTHER_FULL,
            Func.FuncTargetType.PTSELECT_ONE_SUB,
            Func.FuncTargetType.PTSELECT_SUB,
            Func.FuncTargetType.PT_ONE_ANOTHER_RANDOM,
            Func.FuncTargetType.PT_SELF_ANOTHER_RANDOM,
            Func.FuncTargetType.PT_SELF_ANOTHER_FIRST,
            Func.FuncTargetType.PT_SELF_BEFORE,
            Func.FuncTargetType.PT_SELF_AFTER,
            Func.FuncTargetType.PT_SELF_ANOTHER_LAST,
            Func.FuncTargetType.COMMAND_TYPE_SELF_TREASURE_DEVICE,
        ].includes(func.funcTargetType) && func.funcTargetTeam !== Func.FuncTargetTeam.ENEMY;

    return playerTargetEnemies || playerTargetPlayers;
}
