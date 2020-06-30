import Func, {DataVal, DataValField, FuncTargetType, FuncType} from "../Api/Data/Func";
import {buffIsFlatValue} from "./BuffHelper";

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

export function describeFunc(func: Func): string {
    const isLevel = funcUpdatesByLevel(func),
        isOvercharge = isLevel ? false : funcUpdatesByOvercharge(func),
        dataVals = isLevel ? getLevelDataValList(func) : (isOvercharge ? getOverchargeDataValList(func) : func.svals),
        staticValues = getStaticFieldValues(dataVals);

    let description = '';

    if (staticValues.Rate && staticValues.Rate !== 1000) {
        description += (staticValues.Rate / 10) + '% Chance to ';
    }

    if (func.funcType === FuncType.DAMAGE_NP) {
        description += 'Deal damage ';
    } else if (func.funcType === FuncType.DAMAGE_NP_PIERCE) {
        description += 'Deal damage that pierces defence ';
    } else if (func.funcType === FuncType.ADD_STATE || func.funcType === FuncType.ADD_STATE_SHORT) {
        description += 'Apply ' + func.buffs.map(buff => `"${buff.detail}"`).join(' & ') + ' ';
    } else if (func.funcType === FuncType.GAIN_NP) {
        description += 'Charge NP ';
    } else if (func.funcType === FuncType.GAIN_HP) {
        description += 'Gain HP ';
    }

    if (func.funcTargetType === FuncTargetType.ENEMY_ALL) {
        description += 'to all enemies ';
    } else if (func.funcTargetType === FuncTargetType.PT_ALL) {
        description += 'to party ';
    } else if (func.funcTargetType === FuncTargetType.PT_OTHER) {
        description += 'to other party members ';
    } else if (func.funcTargetType === FuncTargetType.SELF) {
        description += 'to self ';
    }

    if (staticValues.Turn) {
        description += (staticValues.Turn === 1 ? '(1 Turn)' : `(${staticValues.Turn} Turns)`) + ' ';
    }

    if (isLevel) {
        description += '<LEVEL> ';
    }

    if (isOvercharge) {
        description += '<OVERCHARGE> ';
    }

    return description;
}

export function describeMutators(func: Func): string[] {
    const isLevel = funcUpdatesByLevel(func),
        isOvercharge = isLevel ? false : funcUpdatesByOvercharge(func),
        dataVals = isLevel ? getLevelDataValList(func) : (isOvercharge ? getOverchargeDataValList(func) : func.svals),
        mutatingVals = getMutatingFieldValues(dataVals);

    return mutatingVals.map(mutatingVal => {
        let description = '';

        if (mutatingVal.Value) {
            if (func.buffs[0] && buffIsFlatValue(func.buffs[0])) {
                description += mutatingVal.Value + ' ';
            } else if (func.funcType === FuncType.GAIN_NP || func.funcType === FuncType.LOSS_NP) {
                description += (mutatingVal.Value / 100) + '% ';
            } else if (func.funcType === FuncType.GAIN_HP || func.funcType === FuncType.LOSS_HP) {
                description += mutatingVal.Value + ' ';
            } else {
                description += (mutatingVal.Value / 10) + '% ';
            }
        }

        return description;
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
