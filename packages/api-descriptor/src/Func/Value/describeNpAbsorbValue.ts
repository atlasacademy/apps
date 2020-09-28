import {DataVal} from "@atlasacademy/api-connector";
import {BasePartial, Descriptor, ParticlePartial, TextPartial, ValuePartial, ValueType} from "../../Descriptor";

export default function (staticDataVal: DataVal.DataVal,
                         mutatingDataVal: DataVal.DataVal): BasePartial[] {
    const funcId = staticDataVal.DependFuncId ?? mutatingDataVal.DependFuncId,
        from: BasePartial[] = [],
        to: BasePartial[] = [];

    switch (funcId) {
        case 469:
            if (mutatingDataVal.DependFuncVals?.Value !== undefined) {
                from.push(new ValuePartial(
                    ValueType.PERCENT,
                    mutatingDataVal.DependFuncVals.Value / 100
                ));
            }

            if (mutatingDataVal.DependFuncVals?.Value2 !== undefined) {
                const charge = mutatingDataVal.DependFuncVals?.Value2 / 100;
                to.push(
                    new ValuePartial(ValueType.NUMBER, charge),
                    new ParticlePartial(' '),
                    new TextPartial('Charge' + (charge > 1 ? 's' : '')),
                );
            }

            break;
        case 5061:
            if (mutatingDataVal.DependFuncVals?.Value !== undefined) {
                to.push(
                    new ValuePartial(ValueType.NUMBER, mutatingDataVal.DependFuncVals.Value)
                );
            }

            break;
    }

    if (from.length && to.length) {
        return from.concat(
            [new ParticlePartial(' => ')],
            to
        );
    } else if (from.length) {
        return from;
    } else if (to.length) {
        return to;
    }

    return [];
}
