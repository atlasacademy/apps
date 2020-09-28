import {DataVal, Func, Region} from "@atlasacademy/api-connector";
import {funcUpdatesByLevel, funcUpdatesByOvercharge} from "../../Helper/FuncHelper";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func.Func, dataVal: DataVal.DataVal): void {
    const section = sections.scaling,
        parts = section.parts,
        isLevel = funcUpdatesByLevel(func),
        isOvercharge = funcUpdatesByOvercharge(func);

    if (!isLevel && !isOvercharge) {
        section.showing = false;
        return;
    }

    if (isLevel) {
        parts.push('<LEVEL>');
    }

    if (isOvercharge) {
        parts.push('<OVERCHARGE>');
    }
}
