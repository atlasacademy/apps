import { Descriptor } from "../Descriptor.js";
import { relatedSkill } from "./getRelatedSkillIds.js";

export interface Breakdown {
    readonly descriptor: Descriptor;
    readonly mutatorDescriptors: Descriptor[];
    readonly relatedSkillIds: relatedSkill[];
}
