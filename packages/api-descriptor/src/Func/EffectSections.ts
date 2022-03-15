import { BasePartial } from "../Descriptor";

export class EffectSection {
    public showing: boolean = true;
    public parts: BasePartial[] = [];
    public preposition?: string;

    constructor(preposition?: string) {
        this.preposition = preposition;
    }
}

export class EffectSections {
    public team = new EffectSection();
    public chance = new EffectSection();
    public action = new EffectSection();
    public affects = new EffectSection();
    public amount = new EffectSection("of");
    public target = new EffectSection("to");
    public duration = new EffectSection();
    public scaling = new EffectSection();
}
