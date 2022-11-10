import { DataVal, Func } from "@atlasacademy/api-connector";

import { BasePartial, ParticlePartial, TextPartial, ValuePartial, ValueType } from "../../Descriptor";
import { targetOpposingTeam, targetSameTeam } from "../getOpponentType";

export default function (
    staticDataVal: DataVal.DataVal,
    mutatingDataVal: DataVal.DataVal,
    dependFunc: Func.BasicFunc
): BasePartial[] {
    const from: BasePartial[] = [],
        to: BasePartial[] = [];

    if (targetOpposingTeam(dependFunc?.funcTargetType)) {
        if (staticDataVal.DependFuncVals?.Value2 == undefined && mutatingDataVal.DependFuncVals?.Value2 !== undefined) {
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
    } else if (targetSameTeam(dependFunc?.funcTargetType)) {
        if (mutatingDataVal.DependFuncVals?.Value !== undefined) {
            to.push(new ValuePartial(ValueType.PERCENT, mutatingDataVal.DependFuncVals.Value / 100));
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
