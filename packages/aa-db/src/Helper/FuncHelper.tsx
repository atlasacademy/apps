import React from "react";
import Func, {DataVal, DataValField, FuncTargetType, FuncType} from "../Api/Data/Func";
import Region from "../Api/Data/Region";
import BuffDescription from "../Component/BuffDescription";
import TraitDescription from "../Component/TraitDescription";
import {describeBuffValue} from "./BuffHelper";
import {asPercent, joinElements} from "./OutputHelper";
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

export function describeFunc(region: Region, func: Func): Renderable {
    const isLevel = funcUpdatesByLevel(func),
        isOvercharge = funcUpdatesByOvercharge(func),
        dataVals = isLevel && isOvercharge
            ? getMixedDataValList(func)
            : (isOvercharge ? getOverchargeDataValList(func) : getLevelDataValList(func)),
        staticValues = getStaticFieldValues(dataVals);

    const parts: Renderable[] = [],
        sectionFlags = {
            chance: true,
            action: true,
            amountPreposition: 'of',
            amount: true,
            affects: true,
            targetPreposition: 'to',
            target: true,
            duration: true,
            scaling: true,
        };

    if (sectionFlags.chance && staticValues.Rate && staticValues.Rate !== 1000) {
        parts.push((staticValues.Rate / 10) + '% Chance to');
    } else if (!staticValues.Rate && func.funcType !== FuncType.NONE) {
        parts.push('Chance to');
    }

    if (sectionFlags.action) {
        if (func.funcType === FuncType.ADD_STATE || func.funcType === FuncType.ADD_STATE_SHORT) {
            parts.push('Apply');
            func.buffs.forEach((buff, index) => {
                if (index > 0)
                    parts.push('&');

                parts.push(<BuffDescription region={region} buff={buff}/>);
            });
            sectionFlags.targetPreposition = 'on';
        } else if (func.funcType === FuncType.SUB_STATE) {
            parts.push('Cleanse debuffs');
            sectionFlags.targetPreposition = 'for';
        } else if (func.funcType === FuncType.DAMAGE_NP) {
            parts.push('Deal damage');
            sectionFlags.amountPreposition = 'for';
        } else if (
            func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL
            || func.funcType === FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX
        ) {
            if (staticValues.Target) {
                parts.push(
                    <span>Deal damage (additional to targets with {
                        <TraitDescription region={region} trait={staticValues.Target}/>
                    })</span>
                );
            } else {
                parts.push('Deal damage');
            }
            sectionFlags.amountPreposition = 'for';
        } else if (func.funcType === FuncType.DAMAGE_NP_PIERCE) {
            parts.push('Deal damage that pierces defence');
            sectionFlags.amountPreposition = 'for';
        } else if (func.funcType === FuncType.DELAY_NPTURN) {
            parts.push('Drain Charge');
            sectionFlags.targetPreposition = 'from';
        } else if (func.funcType === FuncType.GAIN_HP) {
            parts.push('Gain HP');
            sectionFlags.targetPreposition = 'on';
        } else if (func.funcType === FuncType.GAIN_NP) {
            parts.push('Charge NP');
            sectionFlags.targetPreposition = 'for';
        } else if (func.funcType === FuncType.GAIN_STAR) {
            parts.push('Gain Critical Stars');
            sectionFlags.target = false;
        } else if (func.funcType === FuncType.INSTANT_DEATH) {
            parts.push('Apply Death');
        } else if (func.funcType === FuncType.LOSS_HP_SAFE) {
            parts.push('Lose HP')
            sectionFlags.target = false;
        } else if (func.funcType === FuncType.NONE) {
            parts.push('No Effect');
            sectionFlags.target = false;
        }
    }

    if (sectionFlags.amount && staticValues.Value) {
        if (func.buffs[0]) {
            parts.push('of ' + describeBuffValue(func.buffs[0], staticValues.Value));
        } else {
            // there are some properties that we don't want back as the description
            const prunedValues = {...staticValues};
            prunedValues.Rate = undefined;

            parts.push('of ' + describeFuncValue(func, prunedValues));
        }
    }

    if (sectionFlags.affects && func.functvals.length) {
        parts.push('for all');
        func.functvals.forEach((trait, index) => {
            if (index > 0)
                parts.push('&');

            parts.push(<TraitDescription region={region} trait={trait}/>);
        });
    }

    if (sectionFlags.target) {
        parts.push(sectionFlags.targetPreposition);
        if (func.funcTargetType === FuncTargetType.ENEMY) {
            parts.push('enemy');
        } else if (func.funcTargetType === FuncTargetType.ENEMY_ALL) {
            parts.push('all enemies');
        } else if (func.funcTargetType === FuncTargetType.PT_ALL) {
            parts.push('party');
        } else if (func.funcTargetType === FuncTargetType.PT_ONE) {
            parts.push('party member');
        } else if (func.funcTargetType === FuncTargetType.PT_OTHER) {
            parts.push('party except self');
        } else if (func.funcTargetType === FuncTargetType.SELF) {
            parts.push('self');
        }
    }

    if (sectionFlags.duration) {
        if (staticValues.Count && staticValues.Count > 0 && staticValues.Turn && staticValues.Turn > 0) {
            const countDesc = staticValues.Count === 1 ? '1 Time' : `${staticValues.Count} Times`,
                turnDesc = staticValues.Turn === 1 ? '1 Turn' : `${staticValues.Turn} Turns`;

            parts.push(`(${turnDesc}, ${countDesc})`);
        } else if (staticValues.Turn && staticValues.Turn > 0) {
            parts.push(staticValues.Turn === 1 ? '(1 Turn)' : `(${staticValues.Turn} Turns)`);
        } else if (staticValues.Count && staticValues.Count > 0) {
            parts.push(staticValues.Count === 1 ? '(1 Time)' : `(${staticValues.Count} Times)`);
        }
    }

    if (sectionFlags.scaling) {
        if (isLevel) {
            parts.push('<LEVEL>');
        }

        if (isOvercharge) {
            parts.push('<OVERCHARGE>');
        }
    }

    return (
        <span>
            {joinElements(parts, ' ').map(
                (element, index) => <span key={index}>{element}</span>
            )}
        </span>
    );
}

export function describeFuncValue(func: Func, dataVal: DataVal): string {
    let valueDescription = "";
    if (dataVal.Value !== undefined) {
        switch (func.funcType) {
            case FuncType.ADD_STATE:
            case FuncType.ADD_STATE_SHORT:
                valueDescription = describeBuffValue(func.buffs[0], dataVal.Value);
                break;
            case FuncType.DAMAGE_NP:
            case FuncType.DAMAGE_NP_INDIVIDUAL:
            case FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX:
            case FuncType.DAMAGE_NP_PIERCE:
                valueDescription = asPercent(dataVal.Value, 1);
                break;
            case FuncType.GAIN_NP:
            case FuncType.LOSS_NP:
                valueDescription = asPercent(dataVal.Value, 2);
                break;
            default:
                valueDescription = dataVal.Value.toString();
        }
    }

    let correctionDescription = "";
    if (dataVal.Correction !== undefined) {
        switch (func.funcType) {
            case FuncType.DAMAGE_NP_INDIVIDUAL:
            case FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX:
                correctionDescription = asPercent(dataVal.Correction, 1);
                break;
            default:
                correctionDescription = dataVal.Correction.toString();
        }
    }

    let chanceDescription = "";
    if (dataVal.Rate !== undefined) {
        chanceDescription = asPercent(dataVal.Rate, 1);
    }

    if (valueDescription && correctionDescription)
        return `${valueDescription} + ${correctionDescription}`;
    else if (chanceDescription)
        return chanceDescription;
    else if (correctionDescription)
        return correctionDescription;
    else
        return valueDescription;
}

export function describeMutators(func: Func): Renderable[] {
    const isLevel = funcUpdatesByLevel(func),
        isOvercharge = funcUpdatesByOvercharge(func),
        dataVals = isLevel && isOvercharge
            ? getMixedDataValList(func)
            : (isOvercharge ? getOverchargeDataValList(func) : getLevelDataValList(func)),
        mutatingVals = getMutatingFieldValues(dataVals);

    return mutatingVals
        .map(mutatingVal => describeFuncValue(func, mutatingVal))
        .filter(description => description.length);
}

export function funcUpdatesByLevel(func: Func): boolean {
    return hasChangingDataVals(getLevelDataValList(func));
}

export function funcUpdatesByOvercharge(func: Func): boolean {
    return hasChangingDataVals(getOverchargeDataValList(func));
}

export function getLevelDataValList(func: Func): DataVal[] {
    return [1,2,3,4,5].map(i => getTargetVersionValues(func, i, 1));
}

export function getMixedDataValList(func: Func): DataVal[] {
    return [1,2,3,4,5].map(i => getTargetVersionValues(func, i, i));
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
    return [1,2,3,4,5].map(i => getTargetVersionValues(func, 1, i));
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

export function getTargetVersionValues(func: Func, level: number, overcharge: number = 1): DataVal {
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

    return dataVals[level-1];
}
