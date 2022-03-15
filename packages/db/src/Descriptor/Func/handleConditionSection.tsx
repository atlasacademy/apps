import { DataVal, Func, Region } from "@atlasacademy/api-connector";

import { FuncDescriptorSections } from "./FuncDescriptorSections";

export default function handleConditionSection(
    region: Region,
    sections: FuncDescriptorSections,
    func: Func.BasicFunc,
    dataVal: DataVal.DataVal
): void {
    const section = sections.condition,
        parts = section.parts;

    if (dataVal.StarHigher !== undefined) parts.push(`[${dataVal.StarHigher}+ Critical Stars]`);
}
