import { Trait } from "@atlasacademy/api-connector";

import { Descriptor, ParticlePartial, TextPartial, ValuePartial, ValueType } from "../Descriptor";
import { toTitleCase } from "../Helpers";
import TraitOverrideNames from "./TraitOverrideNames";

export default function (trait: Trait.Trait | number, traitList?: Trait.Trait[]): Descriptor {
    const id = typeof trait === "number" ? trait : trait.id;
    const negative = typeof trait === "number" ? trait < 0 : trait.negative;
    const negativeText = negative ? "Not " : "";

    const overrideName = TraitOverrideNames.get(id);
    if (overrideName !== undefined) {
        return new Descriptor([new TextPartial(negativeText), new TextPartial(overrideName)]);
    }

    const matchingTrait = (traitList ?? []).find((traitEntity) => traitEntity.id === id);
    if (matchingTrait && matchingTrait.name !== "unknown") {
        return new Descriptor([new TextPartial(negativeText), new TextPartial(matchingTrait.name)]);
    }

    const name = typeof trait === "number" ? "unknown" : trait.name;
    if (name !== "unknown") {
        return new Descriptor([new TextPartial(negativeText), new TextPartial(toTitleCase(name))]);
    }

    return new Descriptor([
        new TextPartial(negativeText),
        new ParticlePartial("unknown("),
        new ValuePartial(ValueType.UNKNOWN, id),
        new ParticlePartial(")"),
    ]);
}
