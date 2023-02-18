import { ReverseData, ReverseDepth } from "../ApiConnector";
import { AiType } from "./Ai";
import { CommandCode, CommandCodeBasic } from "./CommandCode";
import { CommonRelease } from "./CommonRelease";
import { Entity, EntityBasic } from "./Entity";
import { Func } from "./Func";
import { MysticCode, MysticCodeBasic } from "./MysticCode";
import { Trait } from "./Trait";

export enum SkillType {
    ACTIVE = "active",
    PASSIVE = "passive",
}

export enum SkillScriptCond {
    NONE = "NONE",
    NP_HIGHER = "NP_HIGHER",
    NP_LOWER = "NP_LOWER",
    STAR_HIGHER = "STAR_HIGHER",
    STAR_LOWER = "STAR_LOWER",
    HP_VAL_HIGHER = "HP_VAL_HIGHER",
    HP_VAL_LOWER = "HP_VAL_LOWER",
    HP_PER_HIGHER = "HP_PER_HIGHER",
    HP_PER_LOWER = "HP_PER_LOWER",
}

export interface SelectAddInfoBtnCond {
    cond: SkillScriptCond;
    value?: number;
}

export interface SelectAddInfoButton {
    name: string;
    conds: SelectAddInfoBtnCond[];
}

export interface SelectAddInfo {
    title: string;
    btn: SelectAddInfoButton[];
}

export interface SkillScript {
    NP_HIGHER?: number[];
    NP_LOWER?: number[];
    STAR_HIGHER?: number[];
    STAR_LOWER?: number[];
    HP_VAL_HIGHER?: number[];
    HP_VAL_LOWER?: number[];
    HP_PER_HIGHER?: number[];
    HP_PER_LOWER?: number[];
    additionalSkillId?: number[];
    additionalSkillActorType?: number[];
    SelectAddInfo?: SelectAddInfo[];
}

export interface ExtraPassive {
    num: number;
    priority: number;
    condQuestId: number;
    condQuestPhase: number;
    condLv: number;
    condLimitCount: number;
    condFriendshipRank: number;
    eventId: number;
    flag: number;
    startedAt: number;
    endedAt: number;
}

export interface SkillAdd {
    priority: number;
    releaseConditions: CommonRelease[];
    name: string;
    ruby: string;
}

export interface SkillGroupOverwrite {
    level: number;
    skillGroupId: number;
    startedAt: number;
    endedAt: number;
    icon?: string;
    detail: string;
    unmodifiedDetail: string;
    functions: Func[];
}

export interface SkillBasic {
    id: number;
    name: string;
    ruby: string;
    icon?: string;
    reverse?: {
        basic?: {
            servant?: EntityBasic[];
            MC?: MysticCodeBasic[];
            CC?: CommandCodeBasic[];
        };
    };
}

export interface Skill extends SkillBasic {
    id: number;
    num?: number;
    name: string;
    originalName: string;
    ruby: string;
    detail?: string;
    type: SkillType;
    strengthStatus?: number;
    priority?: number;
    condQuestId?: number;
    condQuestPhase?: number;
    condLv: number;
    condLimitCount: number;
    icon?: string;
    coolDown: number[];
    actIndividuality: Trait[];
    script: SkillScript;
    extraPassive: ExtraPassive[];
    skillAdd: SkillAdd[];
    aiIds?: Record<AiType, number[]>;
    groupOverwrites?: SkillGroupOverwrite[];
    functions: Func[];
    reverse?: {
        basic?: {
            servant?: EntityBasic[];
            MC?: MysticCodeBasic[];
            CC?: CommandCodeBasic[];
        };
        nice?: {
            servant?: Entity[];
            MC?: MysticCode[];
            CC?: CommandCode[];
        };
    };
}

export type SkillSearchOptions = {
    name?: string;
    type?: SkillType[];
    num?: number[];
    priority?: number[];
    strengthStatus?: number[];
    lvl1coolDown?: number[];
    numFunctions?: number[];
    svalsContain?: string;
    triggerSkillId?: number[];
    reverse?: boolean;
    reverseData?: ReverseData;
    reverseDepth?: ReverseDepth;
};
