import {Trait} from "@atlasacademy/api-connector";
import {Descriptor, ParticlePartial, TextPartial, ValuePartial, ValueType} from "../Descriptor";
import TraitOverrideNames from "./TraitOverrideNames";

function toTitleCase(value: string): string {
    const matches = value.match(/[A-Z]*[a-z0-9]*/g);
    if (!matches || !matches.length)
        return value;

    const words = matches
        .filter(word => word.length > 0)
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });

    return words.join(' ');
}

export default function (trait: Trait.Trait | number): Descriptor {
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
            new TextPartial(toTitleCase(name))
        ]);
    }

    return new Descriptor([
        new ParticlePartial('unknown('),
        new ValuePartial(ValueType.UNKNOWN, id),
        new ParticlePartial(')'),
    ]);
}
