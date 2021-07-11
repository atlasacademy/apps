import CondType from "../Enum/Cond";
import { CraftEssence } from "./CraftEssence";
import { EntityBasic } from "./Entity";
import { NoblePhantasm } from "./NoblePhantasm";
import { EnemySkill } from "./QuestEnemy";
import { Trait } from "./Trait";

export interface SupportServantRelease {
    type: CondType;
    targetId: number;
    value: number;
}

export interface SupportServantTd {
    noblePhantasmId: number;
    noblePhantasm?: NoblePhantasm;
    noblePhantasmLv: number;
}

export interface SupportServantEquip {
    equip: CraftEssence;
    lv: number;
    limitCount: number;
}

export interface SupportServantScript {
    dispLimitCount?: number;
}

export interface SupportServantLimit {
    limitCount: number;
}

export interface SupportServantMisc {
    followerFlag: number;
    svtFollowerFlag: number;
}

export interface SupportServant {
    id: number;
    priority: number;
    name: string;
    svt: EntityBasic;
    releaseConditions: SupportServantRelease[];
    lv: number;
    atk: number;
    hp: number;
    traits: Trait[];
    skills: EnemySkill;
    noblePhantasm: SupportServantTd;
    equips: SupportServantEquip[];
    script: SupportServantScript;
    limit: SupportServantLimit;
    misc: SupportServantMisc;
}
