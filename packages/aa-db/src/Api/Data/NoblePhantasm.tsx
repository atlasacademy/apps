import Card from "./Card";
import Func from "./Func";
import Servant from "./Servant";
import Trait from "./Trait";

interface NoblePhantasm {
    id: number;
    num: number;
    card: Card;
    name: string;
    rank: string;
    type: string;
    detail: string;
    npNpGain: number;
    npDistribution: number[];
    strengthStatus: number;
    priority: number;
    condQuestId: number;
    condQuestPhase: number;
    individuality: Trait[];
    functions: Func[];
    reverseServants: Servant[];
}

export default NoblePhantasm;
