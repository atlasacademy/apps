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

    const triggeredHpDataval = dataVal.TriggeredTargetHpRange ?? dataVal.TriggeredTargetHpRateRange;
    if (triggeredHpDataval !== undefined) {
        const compareKey = "<",
            rawValue = triggeredHpDataval.replace(compareKey, ""),
            hpValue = dataVal.TriggeredTargetHpRange !== undefined ? `${rawValue}HP` : `${parseInt(rawValue) / 10}%`;

        let direction = "";
        if (triggeredHpDataval[0] === compareKey) {
            direction = "below";
        } else if (triggeredHpDataval.endsWith(compareKey)) {
            direction = "above";
        }

        parts.push(`If targets' HPs are ${direction} ${hpValue},`);
    }
}
