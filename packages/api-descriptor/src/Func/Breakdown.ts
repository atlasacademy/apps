import { Descriptor } from "../Descriptor";
import { relatedSkill } from "./getRelatedSkillIds";

export interface Breakdown {
    readonly descriptor: Descriptor;
    readonly mutatorDescriptors: Descriptor[];
    readonly relatedSkillIds: relatedSkill[];
}
