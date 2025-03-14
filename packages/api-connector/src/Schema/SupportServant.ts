import CondType from "../Enum/Cond";
import { CraftEssence } from "./CraftEssence";
import { EntityBasic } from "./Entity";
import { NoblePhantasm } from "./NoblePhantasm";
import { EnemySkill, QuestEnemy } from "./QuestEnemy";
import { Skill } from "./Skill";
import { Trait } from "./Trait";

export enum SupportServantFlag {
    NPC = "npc",
    HIDE_SUPPORT = "hideSupport",
    NOT_USED_TREASURE_DEVICE = "notUsedTreasureDevice",
    NO_DISPLAY_BONUS_ICON = "noDisplayBonusIcon",
    APPLY_SVT_CHANGE = "applySvtChange",
    HIDE_EQUIP = "hideEquip",
    NO_DISPLAY_BONUS_ICON_EQUIP = "noDisplayBonusIconEquip",
    HIDE_TREASURE_DEVICE_LV = "hideTreasureDeviceLv",
    HIDE_TREASURE_DEVICE_DETAIL = "hideTreasureDeviceDetail",
    HIDE_RARITY = "hideRarity",
    NOT_CLASS_BOARD = "notClassBoard",
}

export enum NpcFollowerFlag {
    RECOMMENDED_ICON = "recommendedIcon",
    IS_MY_SVT_OR_NPC = "isMySvtOrNpc",
    FIXED_NPC = "fixedNpc",
}

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

export interface SupportServantPassiveSkill {
    skillId: number;
    skill?: Skill;
    skillLv?: number;
}

export interface SupportServant {
    id: number;
    npcSvtFollowerId: number;
    priority: number;
    name: string;
    originalName: string;
    svt: EntityBasic;
    releaseConditions: SupportServantRelease[];
    lv: number;
    atk: number;
    hp: number;
    traits: Trait[];
    skills: EnemySkill;
    noblePhantasm: SupportServantTd;
    passiveSkills: SupportServantPassiveSkill[];
    flags: SupportServantFlag[];
    followerFlags: NpcFollowerFlag[];
    equips: SupportServantEquip[];
    script: SupportServantScript;
    limit: SupportServantLimit;
    misc: SupportServantMisc;
    detail?: QuestEnemy;
}
