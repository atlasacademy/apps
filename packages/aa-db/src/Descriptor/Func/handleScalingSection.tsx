import Func, {DataVal} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import {funcUpdatesByLevel, funcUpdatesByOvercharge} from "../../Helper/FuncHelper";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.scaling,
        parts = section.parts,
        isLevel = funcUpdatesByLevel(func),
        isOvercharge = funcUpdatesByOvercharge(func);

    if (isLevel) {
        parts.push('<LEVEL>');
    }

    if (isOvercharge) {
        parts.push('<OVERCHARGE>');
    }
}
