import { DataVal, Func } from "@atlasacademy/api-connector";

import { BasePartial, ParticlePartial, TextPartial, ValuePartial, ValueType } from "../../Descriptor";

export default function (func: Func.Func, dataVal: DataVal.DataVal): BasePartial[] {
    const partials: BasePartial[] = [];

    if (dataVal.ActSet && dataVal.ActSetWeight) {
        addPartials(partials, [
            new ParticlePartial("["),
            new TextPartial("Weight"),
            new ParticlePartial(": "),
            new ValuePartial(ValueType.NUMBER, dataVal.ActSetWeight),
            new ParticlePartial("]"),
        ]);
    }

    if (typeof dataVal.Rate === "number" && dataVal.Rate < 0) {
        addPartials(partials, [new TextPartial("Guaranteed"), new ParticlePartial(" to")]);
    } else if (typeof dataVal.Rate === "number" && dataVal.Rate !== 1000) {
        addPartials(partials, [
            new ValuePartial(ValueType.PERCENT, dataVal.Rate / 10),
            new ParticlePartial(" "),
            new TextPartial("Chance"),
            new ParticlePartial(" to"),
        ]);
    } else if (
        dataVal.RateCount &&
        (func.funcType === Func.FuncType.ENEMY_ENCOUNT_COPY_RATE_UP ||
            func.funcType === Func.FuncType.ENEMY_ENCOUNT_RATE_UP)
    ) {
        addPartials(partials, [
            new ValuePartial(ValueType.PERCENT, dataVal.RateCount / 10),
            new ParticlePartial(" "),
            new TextPartial("Chance per Target"),
            new ParticlePartial(" to"),
        ]);
    } else if (!dataVal.Rate) {
        addPartials(partials, [new TextPartial("Chance"), new ParticlePartial(" to")]);
    }

    return partials;
}

function addPartials(partials: BasePartial[], additional: BasePartial[]) {
    if (!additional.length) return;

    if (partials.length) partials.push(new ParticlePartial(" "));

    partials.push(...additional);
}
