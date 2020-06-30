import Func from "./Func";
import Trait from "./Trait";

interface Skill {
    id: number;
    num: number;
    name: string;
    detail: string;
    strengthStatus: number;
    priority: number;
    condQuestId: number;
    condQuestPhase: number;
    icon: string;
    cooldown: number[];
    actIndividuality: Trait[];
    functions: Func[];
}

export default Skill;
