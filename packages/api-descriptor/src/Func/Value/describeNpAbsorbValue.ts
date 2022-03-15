import { DataVal } from "@atlasacademy/api-connector";

import { BasePartial, ParticlePartial, TextPartial, ValuePartial, ValueType } from "../../Descriptor";

export default function (staticDataVal: DataVal.DataVal, mutatingDataVal: DataVal.DataVal): BasePartial[] {
    const funcId = staticDataVal.DependFuncId ?? mutatingDataVal.DependFuncId,
        from: BasePartial[] = [],
        to: BasePartial[] = [];

    switch (funcId) {
        case 469:
            if (mutatingDataVal.DependFuncVals?.Value !== undefined) {
                from.push(new ValuePartial(ValueType.PERCENT, mutatingDataVal.DependFuncVals.Value / 100));
            }

            if (mutatingDataVal.DependFuncVals?.Value2 !== undefined) {
                const charge = mutatingDataVal.DependFuncVals?.Value2 / 100;
                to.push(
                    new TextPartial("Gain "),
                    new ValuePartial(ValueType.NUMBER, charge),
                    new ParticlePartial(" "),
                    new TextPartial("NP bar" + (charge > 1 ? "s" : "") + " per enemy drained"),
                    new ParticlePartial(" ")
                );
            }

            break;
        case 5061:
            if (mutatingDataVal.DependFuncVals?.Value !== undefined) {
                to.push(new ValuePartial(ValueType.NUMBER, mutatingDataVal.DependFuncVals.Value));
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
