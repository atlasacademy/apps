import Card from "../Enum/Card";
import { EntityBasic, Entity } from "./Entity";
import { Func } from "./Func";
import { SkillScript } from "./Skill";
import { Trait } from "./Trait";

export interface NoblePhantasmGain {
    buster: number[];
    arts: number[];
    quick: number[];
    extra: number[];
    defence: number[];
    np: number[];
}

export interface NoblePhantasmBasic {
    id: number;
    name: string;
    ruby: string;
    reverse?: {
        basic?: {
            servant?: EntityBasic[];
        };
    };
}

export interface NoblePhantasm extends NoblePhantasmBasic {
    id: number;
    num: number;
    card: Card;
    name: string;
    ruby: string;
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
    script: SkillScript;
    functions: Func[];
    reverse?: {
        basic?: {
            servant?: EntityBasic[];
        };
        nice?: {
            servant?: Entity[];
        };
    };
}
