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
    const matches = value.match(/[A-Z]*[a-z0-9]*/g);
    if (!matches || !matches.length) return value;

    const words = matches
        .filter((word) => word.length > 0)
        .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });

    return words.join(" ");
}
