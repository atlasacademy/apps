import { DataVal, Func } from "@atlasacademy/api-connector";

import { BasePartial, ParticlePartial, TextPartial, ValuePartial, ValueType } from "../../Descriptor";
import TraitReferencePartial from "../../Trait/TraitReferencePartial";
import describe from "../../Trait/describe";

export default function (func: Func.Func, dataVal: DataVal.DataVal): BasePartial[] {
    const partials: BasePartial[] = [];

    switch (func.funcType) {
        case Func.FuncType.DAMAGE_NP_HPRATIO_LOW:
            addPartials(partials, [
                new ParticlePartial("("),
                new TextPartial("additional for low HP"),
                new ParticlePartial(")"),
            ]);
            break;
        case Func.FuncType.DAMAGE_NP_INDIVIDUAL:
        case Func.FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX:
            addPartials(partials, [
                new ParticlePartial("("),
                new TextPartial("additional to targets"),
                new ParticlePartial(" with "),
                typeof dataVal.Target === "number"
                    ? new TraitReferencePartial(dataVal.Target)
                    : new TextPartial("trait"),
                new ParticlePartial(")"),
            ]);
            break;
        case Func.FuncType.DAMAGE_NP_INDIVIDUAL_SUM:
            const traitDescriptions: BasePartial[] = [];

            (dataVal.TargetList ?? []).forEach((id) => {
                addPartials(traitDescriptions, [new TraitReferencePartial(id)], " or ");
            });

            addPartials(partials, [new ParticlePartial("("), new TextPartial("bonus per trait")]);

            addPartials(partials, traitDescriptions, " of ");

            if (dataVal.ParamAddMaxCount)
                addPartials(partials, [
                    new ParticlePartial("["),
                    new TextPartial("Limit"),
                    new ParticlePartial(" "),
                    new ValuePartial(ValueType.NUMBER, dataVal.ParamAddMaxCount),
                    new ParticlePartial("]"),
                ]);

            partials.push(new ParticlePartial(")"));
            break;
        case Func.FuncType.DAMAGE_NP_RARE:
            const rarityDescriptions: BasePartial[] = [];

            (dataVal.TargetRarityList ?? []).forEach((rarity) => {
                addPartials(rarityDescriptions, [new ValuePartial(ValueType.NUMBER, rarity)], "/");
            });

            if (rarityDescriptions.length === 1) addPartials(rarityDescriptions, [new TextPartial("rarity")]);
            else addPartials(rarityDescriptions, [new TextPartial("rarities")]);

            addPartials(partials, [new ParticlePartial("("), new TextPartial("bonus to")]);

            addPartials(partials, rarityDescriptions);
            partials.push(new ParticlePartial(")"));
            break;
        case Func.FuncType.DAMAGE_NP_PIERCE:
            addPartials(partials, [
                new ParticlePartial("("),
                new TextPartial("that pierces defense"),
                new ParticlePartial(")"),
            ]);
            break;
        case Func.FuncType.EVENT_DROP_UP:
        case Func.FuncType.EVENT_POINT_UP:
        case Func.FuncType.EVENT_DROP_RATE_UP:
        case Func.FuncType.EVENT_POINT_RATE_UP:
        case Func.FuncType.ENEMY_ENCOUNT_COPY_RATE_UP:
        case Func.FuncType.ENEMY_ENCOUNT_RATE_UP:
            if (dataVal.Individuality)
                addPartials(partials, [new ParticlePartial("with "), new TraitReferencePartial(dataVal.Individuality)]);

            if (dataVal.EventId)
                addPartials(partials, [
                    new ParticlePartial("during "),
                    new TextPartial("event"),
                    new ParticlePartial(" "),
                    new TraitReferencePartial(dataVal.EventId),
                ]);
            break;
    }

    if (func.functvals.length) {
        addPartials(partials, [new ParticlePartial("if "), new TextPartial("on field"), new ParticlePartial(" ")]);

        func.functvals.forEach((trait) => {
            addPartials(partials, describe(trait).partials(), " & ");
        });
    }

    return partials;
}

function addPartials(partials: BasePartial[], additional: BasePartial[], preposition?: string) {
    if (!additional.length) return;

    if (partials.length) partials.push(new ParticlePartial(preposition ?? " "));

    partials.push(...additional);
}
