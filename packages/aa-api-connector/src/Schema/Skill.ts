import SkillType from "../Enum/SkillType";
import CraftEssence from "./CraftEssence";
import Func from "./Func";
import MysticCode from "./MysticCode";
import Servant from "./Servant";
import Trait from "./Trait";

export interface SkillScript {
    NP_HIGHER?: number[];
    NP_LOWER?: number[];
    STAR_HIGHER?: number[];
    STAR_LOWER?: number[];
    HP_VAL_HIGHER?: number[];
    HP_VAL_LOWER?: number[];
    HP_PER_HIGHER?: number[];
    HP_PER_LOWER?: number[];
}

interface Skill {
    id: number;
    num?: number;
    name: string;
    detail?: string;
    type: SkillType;
    strengthStatus?: number;
    priority?: number;
    condQuestId?: number;
    condQuestPhase?: number;
    icon?: string;
    coolDown: number[];
    actIndividuality: Trait[];
    script: SkillScript;
    functions: Func[];
    reverseServants?: (Servant | CraftEssence)[];
    reverseMC?: MysticCode[];
}

export default Skill;
