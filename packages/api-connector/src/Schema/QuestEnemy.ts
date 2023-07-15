import { Attribute } from "./Attribute";
import { EntityBasic } from "./Entity";
import { GiftType } from "./Gift";
import { NoblePhantasm } from "./NoblePhantasm";
import { Skill } from "./Skill";
import { Trait } from "./Trait";

export enum EnemyDeathType {
    ESCAPE = "escape",
    STAND = "stand",
    EFFECT = "effect",
    WAIT = "wait",
}

export interface EnemyScript {
    deathType?: EnemyDeathType;
    appear?: boolean;
    noVoice?: boolean;
    raid?: number;
    superBoss?: number;
    hpBarType?: number;
    leader?: boolean;
    scale?: number;
    svtVoiceId?: number;
    treasureDeviceVoiceId?: string;
    changeAttri?: Attribute;
    billBoardGroup?: number;
    multiTargetCore?: boolean;
    multiTargetUp?: boolean;
    multiTargetUnder?: boolean;
    startPos?: boolean;
    deadChangePos?: number;
    call?: number[];
    shift?: number[];
    shiftPosition?: number;
    shiftClear?: Trait[];
    change?: number[];
    forceDropItem?: boolean;
    entryIndex?: number;
    treasureDeviceName?: string;
    treasureDeviceRuby?: string;
    npInfoEnable?: boolean;
    npCharge?: number;
    NoSkipDead?: boolean;
}

export interface EnemyInfoScript {
    isAddition?: boolean;
}

export interface EnemySkill {
    skillId1: number;
    skillId2: number;
    skillId3: number;
    skill1?: Skill;
    skill2?: Skill;
    skill3?: Skill;
    skillLv1: number;
    skillLv2: number;
    skillLv3: number;
}

export interface EnemyPassive {
    classPassive: Skill[];
    addPassive: Skill[];
    addPassiveLvs?: number[];
    appendPassiveSkillIds?: number[];
    appendPassiveSkillLvs?: number[];
}

export interface EnemyNoblePhantasm {
    noblePhantasmId: number;
    noblePhantasm?: NoblePhantasm;
    noblePhantasmLv: number;
    noblePhantasmLv1: number;
    noblePhantasmLv2?: number;
    noblePhantasmLv3?: number;
}

export interface EnemyLimit {
    limitCount: number;
    imageLimitCount: number;
    dispLimitCount: number;
    commandCardLimitCount: number;
    iconLimitCount: number;
    portraitLimitCount: number;
    battleVoice: number;
    exceedCount: number;
}

export interface EnemyServerMod {
    tdRate: number;
    tdAttackRate: number;
    starRate: number;
}

export interface EnemyAi {
    aiId: number;
    actPriority: number;
    maxActNum: number;
    minActNum?: number;
}

export interface EnemyMisc {
    displayType: number;
    npcSvtType: number;
    passiveSkill?: number[];
    equipTargetId1: number;
    equipTargetIds?: number[];
    npcSvtClassId: number;
    overwriteSvtId: number;
    userCommandCodeIds: number[];
    commandCardParam?: number[];
    status: number;
    hpGaugeType?: number;
    imageSvtId?: number;
    condVal?: number;
}

export interface EnemyDrop {
    type: GiftType;
    objectId: number;
    num: number;
    dropCount: number;
    runs: number;
    dropExpected: number;
    dropVariance: number;
}

export enum DeckType {
    ENEMY = "enemy",
    CALL = "call",
    SHIFT = "shift",
    CHANGE = "change",
    TRANSFORM = "transform",
    SKILL_SHIFT = "skillShift",
    MISSION_TARGET_SKILL_SHIFT = "missionTargetSkillShift",
    AI_NPC = "aiNpc",
    SVT_FOLLOWER = "svtFollower",
}

export enum RoleType {
    NORMAL = "normal",
    DANGER = "danger",
    SERVANT = "servant",
}

export interface QuestEnemy {
    deck: DeckType;
    deckId: number;
    userSvtId: number;
    uniqueId: number;
    npcId: number;
    roleType: RoleType;
    name: string;
    svt: EntityBasic;
    drops: EnemyDrop[];
    lv: number;
    exp: number;
    atk: number;
    hp: number;
    adjustAtk: number;
    adjustHp: number;
    deathRate: number;
    criticalRate: number;
    recover: number;
    chargeTurn: number;
    traits: Trait[];
    skills: EnemySkill;
    classPassive: EnemyPassive;
    noblePhantasm: EnemyNoblePhantasm;
    serverMod: EnemyServerMod;
    ai: EnemyAi;
    enemyScript: EnemyScript;
    originalEnemyScript: Record<string, any>;
    infoScript: EnemyInfoScript;
    originalInfoScript: Record<string, any>;
    limit: EnemyLimit;
    misc: EnemyMisc;
}
