import { DataVal } from "@atlasacademy/api-connector";

import { BasePartial, ParticlePartial, ValuePartial, ValueType } from "../../Descriptor";

export default function (staticDataVal: DataVal.DataVal, mutatingDataVal: DataVal.DataVal): BasePartial[] {
    const funcId = staticDataVal.DependFuncId ?? mutatingDataVal.DependFuncId,
        from: BasePartial[] = [],
        to: BasePartial[] = [];

    switch (funcId) {
        case 710:
        case 711:
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
