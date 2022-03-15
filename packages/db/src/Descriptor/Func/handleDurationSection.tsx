import { DataVal, Func, Region } from "@atlasacademy/api-connector";

import { FuncDescriptorSections } from "./FuncDescriptorSections";

export default function handleDurationSection(
    region: Region,
    sections: FuncDescriptorSections,
    func: Func.BasicFunc,
    dataVal: DataVal.DataVal
): void {
    const section = sections.duration,
        parts = section.parts;

    if (dataVal.Count && dataVal.Count > 0 && dataVal.Turn && dataVal.Turn > 0) {
        const countDesc = dataVal.Count === 1 ? "1 Time" : `${dataVal.Count} Times`,
            turnDesc = dataVal.Turn === 1 ? "1 Turn" : `${dataVal.Turn} Turns`;

        parts.push(`(${turnDesc}, ${countDesc})`);
    } else if (dataVal.Turn && dataVal.Turn > 0) {
        parts.push(dataVal.Turn === 1 ? "(1 Turn)" : `(${dataVal.Turn} Turns)`);
    } else if (dataVal.Count && dataVal.Count > 0) {
        parts.push(dataVal.Count === 1 ? "(1 Time)" : `(${dataVal.Count} Times)`);
    } else {
        section.showing = false;
    }
}
