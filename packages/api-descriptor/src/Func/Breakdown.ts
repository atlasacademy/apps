import {Descriptor} from "../Descriptor";

export interface Breakdown {
    readonly descriptor: Descriptor;
    readonly mutatorDescriptors: Descriptor[];
    readonly relatedSkillIds: number[];
}
