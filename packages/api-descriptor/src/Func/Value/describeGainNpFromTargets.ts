import {DataVal} from "@atlasacademy/api-connector";
import {BasePartial, ParticlePartial, TextPartial, ValuePartial, ValueType} from "../../Descriptor";

export default function (staticDataVal: DataVal.DataVal,
                         mutatingDataVal: DataVal.DataVal): BasePartial[] {
    const funcId = staticDataVal.DependFuncId ?? mutatingDataVal.DependFuncId,
        from: BasePartial[] = [],
        to: BasePartial[] = [];

    switch (funcId) {
        case 474:
            if (mutatingDataVal.DependFuncVals?.Value !== undefined) {
                const charge = mutatingDataVal.DependFuncVals.Value / 100;
                from.push(
                    new ValuePartial(ValueType.NUMBER, charge),
                    new ParticlePartial(' '),
                    new TextPartial('Charge' + (charge > 1 ? 's' : '')),
                );
            }

            if (mutatingDataVal.DependFuncVals?.Value2 !== undefined) {
                to.push(new ValuePartial(
                    ValueType.PERCENT,
                    mutatingDataVal.DependFuncVals.Value2 / 100
                ));
            }

            break;
        case 3962:
            if (mutatingDataVal.DependFuncVals?.Value !== undefined) {
                to.push(new ValuePartial(
                    ValueType.PERCENT,
                    mutatingDataVal.DependFuncVals.Value / 100
                ));
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
