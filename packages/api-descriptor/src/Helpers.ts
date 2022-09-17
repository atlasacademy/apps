import { BasePartial, ParticlePartial } from "./Descriptor";

export function insertParticles(partials: BasePartial[], particle: string): BasePartial[] {
    const newPartialList: BasePartial[] = [];

    for (let i = 0; i < partials.length; i++) {
        if (i > 0) {
            newPartialList.push(new ParticlePartial(particle));
        }

        newPartialList.push(partials[i]);
    }

    return newPartialList;
}

export function toTitleCase(value: string): string {
    const matches = value.match(/NP|[A-Z]*[a-z0-9]*/g);
    if (!matches || !matches.length) return value;

    const words = matches
        .filter((word) => word.length > 0)
        .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });

    return words.join(" ");
}

export function hasUniqueValues(values: (number | number[] | undefined)[]): boolean {
    if (values.length === 0) return false;

    return (
        new Set(
            values.map((value) => {
                if (Array.isArray(value)) return value.join(",");

                return value;
            })
        ).size > 1
    );
};
