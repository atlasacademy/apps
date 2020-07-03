import Func, {DataVal, FuncType} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.chance,
        parts = section.parts;

    if (dataVal.Rate && dataVal.Rate !== 1000) {
        parts.push((dataVal.Rate / 10) + '% Chance to');
    } else if (!dataVal.Rate && func.funcType !== FuncType.NONE) {
        parts.push('Chance to');
    } else {
        section.showing = false;
    }
}
