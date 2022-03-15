import { AiType } from "./Ai";
import { CommandCodeBasic, CommandCode } from "./CommandCode";
import { CommonRelease } from "./CommonRelease";
import { EntityBasic, Entity } from "./Entity";
import { Func } from "./Func";
import { MysticCodeBasic, MysticCode } from "./MysticCode";
import { Trait } from "./Trait";

export enum SkillType {
    ACTIVE = "active",
    PASSIVE = "passive",
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
