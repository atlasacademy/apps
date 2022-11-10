import { DataVal, Func } from "@atlasacademy/api-connector";

import { BasePartial, ParticlePartial, TextPartial, ValuePartial, ValueType } from "../../Descriptor";
import { targetOpposingTeam, targetSameTeam } from "../getOpponentType";

export default function (
    staticDataVal: DataVal.DataVal,
    mutatingDataVal: DataVal.DataVal,
    dependFunc: Func.BasicFunc
): BasePartial[] {
    const funcId = staticDataVal.DependFuncId ?? mutatingDataVal.DependFuncId,
        from: BasePartial[] = [],
        to: BasePartial[] = [];

    if (targetOpposingTeam(dependFunc?.funcTargetType)) {
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
    } else if (targetSameTeam(dependFunc?.funcTargetType)) {
        if (mutatingDataVal.DependFuncVals?.Value !== undefined) {
            to.push(new ValuePartial(ValueType.NUMBER, mutatingDataVal.DependFuncVals.Value));
        }
    } else {
        to.push(new TextPartial(JSON.stringify(mutatingDataVal.DependFuncVals)));
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
