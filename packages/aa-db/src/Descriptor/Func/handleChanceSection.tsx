import {Func, Region} from "@atlasacademy/api-connector";
import FuncType from "@atlasacademy/api-connector/dist/Enum/FuncType";
import DataVal from "@atlasacademy/api-connector/dist/Schema/DataVal";
import {asPercent} from "../../Helper/OutputHelper";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.chance,
        parts = section.parts;

    if (dataVal.Rate && dataVal.Rate < 0) {
        parts.push('Guaranteed to');
    } else if (typeof dataVal.Rate === "number" && dataVal.Rate !== 1000) {
        parts.push((dataVal.Rate / 10) + '% Chance to');
    } else if (dataVal.RateCount && (
        func.funcType === FuncType.ENEMY_ENCOUNT_COPY_RATE_UP
        || func.funcType === FuncType.ENEMY_ENCOUNT_RATE_UP
    )) {
        parts.push(asPercent(dataVal.RateCount, 1) + ' Chance per Target to');
    } else if (!dataVal.Rate && func.funcType !== FuncType.NONE) {
        parts.push('Chance to');
    } else {
        section.showing = false;
    }
}
