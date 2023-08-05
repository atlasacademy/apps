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

    if (dataVal.TriggeredTargetHpRateRange !== undefined) {
        const rateRange = dataVal.TriggeredTargetHpRateRange,
            percentage = parseInt(rateRange.slice(1)) / 10;

        let direction = "";
        switch (rateRange[0]) {
            case "<":
                direction = "below";
                break;
            case ">":
                direction = "above";
                break;
            case "=":
                direction = "at";
                break;
        }

        parts.push(`If targets' HPs are ${direction} ${percentage}%,`);
    }
}
