import CraftEssence from "./CraftEssence";
import Func from "./Func";
import MysticCode from "./MysticCode";
import Servant from "./Servant";
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
    coolDown: number[];
    actIndividuality: Trait[];
    functions: Func[];
    reverseServants: (Servant | CraftEssence)[];
    reverseMC: MysticCode[];
}

export default Skill;
