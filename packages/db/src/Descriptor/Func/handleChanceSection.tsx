import {DataVal, Func, Region} from "@atlasacademy/api-connector";
import {asPercent} from "../../Helper/OutputHelper";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func.BasicFunc, dataVal: DataVal.DataVal): void {
    const section = sections.chance,
        parts = section.parts;

    if (dataVal.ActSet && dataVal.ActSetWeight) {
        parts.push(`[Weight: ${dataVal.ActSetWeight}]`);
    }

    if (dataVal.Rate && dataVal.Rate < 0) {
        parts.push('Guaranteed to');
    } else if (typeof dataVal.Rate === "number" && dataVal.Rate !== 1000) {
        parts.push((dataVal.Rate / 10) + '% Chance to');
    } else if (dataVal.RateCount && (
        func.funcType === Func.FuncType.ENEMY_ENCOUNT_COPY_RATE_UP
        || func.funcType === Func.FuncType.ENEMY_ENCOUNT_RATE_UP
    )) {
        parts.push(asPercent(dataVal.RateCount, 1) + ' Chance per Target to');
    } else if (!dataVal.Rate && func.funcType !== Func.FuncType.NONE) {
        parts.push('Chance to');
    }

    if (parts.length === 0) {
        section.showing = false;
    }
}
