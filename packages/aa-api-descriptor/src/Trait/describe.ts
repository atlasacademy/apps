import {Trait} from "@atlasacademy/api-connector";
import {Descriptor, ParticlePartial, TextPartial, ValuePartial, ValueType} from "../Descriptor";
import TraitOverrideNames from "./TraitOverrideNames";

export default function (trait: Trait | number): Descriptor {
    const id = typeof trait === 'number' ? trait : trait.id;

    const overrideName = TraitOverrideNames.get(id);
    if (overrideName !== undefined) {
        return new Descriptor([
            new TextPartial(overrideName)
        ]);
    }

    const name = typeof trait === "number" ? 'unknown' : trait.name;
    if (name !== 'unknown') {
        return new Descriptor([
            new TextPartial(name)
        ]);
    }

    return new Descriptor([
        new ParticlePartial('unknown('),
        new ValuePartial(ValueType.UNKNOWN, id),
        new ParticlePartial(')'),
    ]);
}
