import Card from "../Enum/Card";
import BaseEntity from "./BaseEntity";
import Func from "./Func";
import Trait from "./Trait";

export interface NoblePhantasmGain {
    buster: number[];
    arts: number[];
    quick: number[];
    extra: number[];
    defence: number[];
    np: number[];
}

interface NoblePhantasm {
    id: number;
    num: number;
    card: Card;
    name: string;
    icon?: string;
    rank: string;
    type: string;
    detail?: string;
    npGain: NoblePhantasmGain;
    npDistribution: number[];
    strengthStatus: number;
    priority: number;
    condQuestId: number;
    condQuestPhase: number;
    individuality: Trait[];
    functions: Func[];
    reverse?: {
        nice?: {
            servant?: BaseEntity[];
        }
    }
}

export default NoblePhantasm;
