import { ReverseData, ReverseDepth } from "../ApiConnector";
import Card from "../Enum/Card";
import { Entity, EntityBasic } from "./Entity";
import { Func } from "./Func";
import { SkillScript } from "./Skill";
import { Trait } from "./Trait";

export enum NoblePhantasmEffectFlag {
    SUPPORT = "support",
    ATTACK_ENEMY_ALL = "attackEnemyAll",
    ATTACK_ENEMY_ONE = "attackEnemyOne",
}

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
    npNum: number;
    card: Card;
    name: string;
    originalName: string;
    ruby: string;
    icon?: string;
    rank: string;
    type: string;
    effectFlags: NoblePhantasmEffectFlag[];
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

export type NPSearchOptions = {
    name?: string;
    card?: Card[];
    individuality?: number[];
    hits?: number[];
    strengthStatus?: number[];
    numFunctions?: number[];
    minNpNpGain?: number;
    maxNpNpGain?: number;
    svalsContain?: string;
    triggerSkillId?: number[];
    reverse?: boolean;
    reverseData?: ReverseData;
    reverseDepth?: ReverseDepth;
};
