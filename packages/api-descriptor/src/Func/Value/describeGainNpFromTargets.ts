import { DataVal } from "@atlasacademy/api-connector";

import { BasePartial, ParticlePartial, TextPartial, ValuePartial, ValueType } from "../../Descriptor";

export default function (staticDataVal: DataVal.DataVal, mutatingDataVal: DataVal.DataVal): BasePartial[] {
    const funcId = staticDataVal.DependFuncId ?? mutatingDataVal.DependFuncId,
        from: BasePartial[] = [],
        to: BasePartial[] = [];

    switch (funcId) {
        case 474:
            if (
                staticDataVal.DependFuncVals?.Value2 == undefined &&
                mutatingDataVal.DependFuncVals?.Value2 !== undefined
            ) {
                // Table Values
                to.push(new ValuePartial(ValueType.PERCENT, mutatingDataVal.DependFuncVals.Value2 / 100));
            } else if (staticDataVal.DependFuncVals?.Value !== undefined) {
                // Table Description and Detailed Effects Description
                const charge = staticDataVal.DependFuncVals.Value;
                from.push(
                    new ValuePartial(ValueType.NUMBER, charge),
                    new ParticlePartial(" "),
                    new TextPartial("NP bar" + (charge > 1 ? "s" : ""))
                );
                to.push(new TextPartial("Gain "));
                if (staticDataVal.DependFuncVals?.Value2 !== undefined) {
                    // Detailed Effects Description
                    to.push(new ValuePartial(ValueType.PERCENT, staticDataVal.DependFuncVals.Value2 / 100));
                }
                to.push(new TextPartial(" NP per enemy drained "));
            }

            break;
        case 3962:
            if (mutatingDataVal.DependFuncVals?.Value !== undefined) {
                to.push(new ValuePartial(ValueType.PERCENT, mutatingDataVal.DependFuncVals.Value / 100));
            }
            break;
    }

    if (from.length && to.length) {
        return from.concat([new ParticlePartial(" => ")], to);
    } else if (from.length) {
        return from;
    } else if (to.length) {
        return to;
    }

    return [];
}
