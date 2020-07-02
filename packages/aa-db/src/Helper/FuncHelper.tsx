import React from "react";
import Func, {DataVal, DataValField} from "../Api/Data/Func";
import Region from "../Api/Data/Region";
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

const hasUniqueValues = function (values: (number | undefined)[]): boolean {
    return new Set(values).size > 1;
};

export function describeMutators(region: Region, func: Func): Renderable[] {
    const isLevel = funcUpdatesByLevel(func),
        isOvercharge = funcUpdatesByOvercharge(func),
        dataVals = isLevel && isOvercharge
            ? getMixedDataValList(func)
            : (isOvercharge ? getOverchargeDataValList(func) : getLevelDataValList(func)),
        mutatingVals = getMutatingFieldValues(dataVals);

    return mutatingVals
        .map(mutatingVal => <FuncValueDescriptor region={region} func={func} dataVal={mutatingVal}/>);
}

export function funcUpdatesByLevel(func: Func): boolean {
    return hasChangingDataVals(getLevelDataValList(func));
}

export function funcUpdatesByOvercharge(func: Func): boolean {
    return hasChangingDataVals(getOverchargeDataValList(func));
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

    const fields = getMutatingFieldNames(vals);

    return vals.map(val => {
        const mutatingVals: DataVal = {};

        for (let x in fields) {
            mutatingVals[fields[x]] = val[fields[x]];
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
        staticVals: DataVal = {};

    for (let x in fields) {
        staticVals[fields[x]] = vals[0][fields[x]];
    }

    return staticVals;
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
