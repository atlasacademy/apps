import React from "react";
import Func, {DataVal, DataValField, FuncTargetType, FuncType} from "../Api/Data/Func";
import {joinElements} from "./ArrayHelper";
import {buffIsFlatValue, describeBuff} from "./BuffHelper";
import {asPercent} from "./OutputHelper";
import {Renderable} from "./Renderable";

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

export function describeFunc(func: Func): Renderable {
    const isLevel = funcUpdatesByLevel(func),
        isOvercharge = isLevel ? false : funcUpdatesByOvercharge(func),
        dataVals = isLevel ? getLevelDataValList(func) : (isOvercharge ? getOverchargeDataValList(func) : func.svals),
        staticValues = getStaticFieldValues(dataVals);

    const parts: (string|JSX.Element)[] = [];

    if (staticValues.Rate && staticValues.Rate !== 1000) {
        parts.push((staticValues.Rate / 10) + '% Chance to');
    }

    if (func.funcType === FuncType.DAMAGE_NP) {
        parts.push('Deal damage');
    } else if (func.funcType === FuncType.DAMAGE_NP_PIERCE) {
        parts.push('Deal damage that pierces defence');
    } else if (func.funcType === FuncType.ADD_STATE || func.funcType === FuncType.ADD_STATE_SHORT) {
        parts.push('Apply');
        func.buffs.forEach((buff, index) => {
            if (index > 0)
                parts.push('&');

            parts.push(<span>"{describeBuff(buff)}"</span>);
        });
    } else if (func.funcType === FuncType.GAIN_NP) {
        parts.push('Charge NP');
    } else if (func.funcType === FuncType.GAIN_HP) {
        parts.push('Gain HP');
    }

    if (func.funcTargetType === FuncTargetType.ENEMY_ALL) {
        parts.push('to all enemies');
    } else if (func.funcTargetType === FuncTargetType.PT_ALL) {
        parts.push('to party');
    } else if (func.funcTargetType === FuncTargetType.PT_OTHER) {
        parts.push('to other party members');
    } else if (func.funcTargetType === FuncTargetType.SELF) {
        parts.push('to self');
    }

    if (staticValues.Turn) {
        parts.push(staticValues.Turn === 1 ? '(1 Turn)' : `(${staticValues.Turn} Turns)`);
    }

    if (isLevel) {
        parts.push('<LEVEL>');
    }

    if (isOvercharge) {
        parts.push('<OVERCHARGE>');
    }

    return (
        <span>
            {joinElements(parts, ' ').map(
                (element, index) => <span key={index}>{element}</span>
            )}
        </span>
    );
}

export function describeMutators(func: Func): Renderable[] {
    const isLevel = funcUpdatesByLevel(func),
        isOvercharge = isLevel ? false : funcUpdatesByOvercharge(func),
        dataVals = isLevel ? getLevelDataValList(func) : (isOvercharge ? getOverchargeDataValList(func) : func.svals),
        mutatingVals = getMutatingFieldValues(dataVals);

    return mutatingVals.map(mutatingVal => {
        let parts:string[] = [];

        if (mutatingVal.Value) {
            if (func.buffs[0] && buffIsFlatValue(func.buffs[0])) {
                parts.push(mutatingVal.Value.toString());
            } else if (func.funcType === FuncType.GAIN_NP || func.funcType === FuncType.LOSS_NP) {
                parts.push(asPercent(mutatingVal.Value, 2));
            } else if (func.funcType === FuncType.GAIN_HP || func.funcType === FuncType.LOSS_HP) {
                parts.push(mutatingVal.Value.toString());
            } else {
                parts.push(asPercent(mutatingVal.Value, 1));
            }
        }

        return parts.join(' ');
    }).filter(description => description.length);
}

export function funcUpdatesByLevel(func: Func): boolean {
    return hasChangingDataVals(getLevelDataValList(func));
}

export function funcUpdatesByOvercharge(func: Func): boolean {
    return hasChangingDataVals(getOverchargeDataValList(func));
}

export function getLevelDataValList(func: Func): DataVal[] {
    return func.svals;
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
    let vals = [func.svals[0]];

    if (func.svals2)
        vals.push(func.svals2[0]);
    if (func.svals3)
        vals.push(func.svals3[0]);
    if (func.svals4)
        vals.push(func.svals4[0]);
    if (func.svals5)
        vals.push(func.svals5[0]);

    return vals.filter(val => val !== undefined);
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
