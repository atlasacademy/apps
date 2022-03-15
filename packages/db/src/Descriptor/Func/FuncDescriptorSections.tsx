import { Renderable } from "../../Helper/OutputHelper";

export class FuncDescriptorSection {
    public showing: boolean = true;
    public parts: Renderable[] = [];
    public preposition?: string;

    constructor(preposition?: string) {
        this.preposition = preposition;
    }
}

export class FuncDescriptorSections {
    public team = new FuncDescriptorSection();
    public condition = new FuncDescriptorSection();
    public chance = new FuncDescriptorSection();
    public action = new FuncDescriptorSection();
    public amount = new FuncDescriptorSection("of");
    public onField = new FuncDescriptorSection();
    public affects = new FuncDescriptorSection();
    public target = new FuncDescriptorSection("to");
    public duration = new FuncDescriptorSection();
    public scaling = new FuncDescriptorSection();
}
