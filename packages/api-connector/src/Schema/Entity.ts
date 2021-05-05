import Card from "../Enum/Card";
import ClassName from "../Enum/ClassName";
import {Item} from "./Item";
import {NoblePhantasm} from "./NoblePhantasm";
import {Skill} from "./Skill";
import {Trait} from "./Trait";

export enum Attribute {
    HUMAN = "human",
    SKY = "sky",
    EARTH = "earth",
    STAR = "star",
    BEAST = "beast",
    VOID = "void",
}

export enum EntityType {
    NORMAL = "normal",
    HEROINE = "heroine",
    COMBINE_MATERIAL = "combineMaterial",
    ENEMY = "enemy",
    ENEMY_COLLECTION = "enemyCollection",
    SERVANT_EQUIP = "servantEquip",
    STATUS_UP = "statusUp",
    SVT_EQUIP_MATERIAL = "svtEquipMaterial",
    ENEMY_COLLECTION_DETAIL = "enemyCollectionDetail",
    ALL = "all",
    // COMMAND_CODE = "commandCode",
}

export enum EntityFlag {
    ONLY_USE_FOR_NPC = "onlyUseForNpc",
    SVT_EQUIP_FRIEND_SHIP = "svtEquipFriendShip",
    IGNORE_COMBINE_LIMIT_SPECIAL = "ignoreCombineLimitSpecial",
    SVT_EQUIP_EXP = "svtEquipExp",
    SVT_EQUIP_CHOCOLATE = "svtEquipChocolate",
    NORMAL = "normal",
    GOETIA = "goetia",
}

export enum Gender {
    MALE = "male",
    FEMALE = "female",
    UNKNOWN = "unknown",
}

export interface EntityAssetMap {
    ascension?: {
        [key: number]: string;
    }
    story?: {
        [key: number]: string;
    }
    costume?: {
        [key: number]: string;
    }
    equip?: {
        [key: number]: string;
    }
    cc?: {
        [key: number]: string;
    }
}

export interface EntityAssets {
    charaFigure: EntityAssetMap;
    charaFigureForm: { [key: string]: EntityAssetMap };
    charaGraph: EntityAssetMap;
    commands: EntityAssetMap;
    equipFace: EntityAssetMap;
    faces: EntityAssetMap;
    narrowFigure: EntityAssetMap;
    status: EntityAssetMap;
    image: EntityAssetMap;
}

export interface EntityLevelUpMaterials {
    items: { item: Item, amount: number }[],
    qp: number,
}

export interface EntityLevelUpMaterialProgression {
    [key: string]: EntityLevelUpMaterials;
}

export interface Entity {
    id: number;
    collectionNo: number;
    name: string;
    ruby: string;
    className: ClassName;
    type: EntityType;
    flag: EntityFlag;
    rarity: number;
    cost: number;
    lvMax: number;
    extraAssets: EntityAssets,
    gender: Gender;
    attribute: Attribute;
    traits: Trait[];
    starAbsorb: number;
    starGen: number;
    instantDeathChance: number;
    cards: Card[];
    hitsDistribution: {
        buster?: number[];
        arts?: number[];
        quick?: number[];
        extra?: number[];
        weak?: number[];
        strength?: number[];
    },
    atkBase: number;
    atkMax: number;
    hpBase: number;
    hpMax: number;
    relateQuestIds: number[];
    growthCurve: number;
    atkGrowth: number[];
    hpGrowth: number[];
    bondGrowth: number[];
    bondEquip: number;
    valentineEquip: number[];
    ascensionMaterials: EntityLevelUpMaterialProgression;
    skillMaterials: EntityLevelUpMaterialProgression;
    costumeMaterials: EntityLevelUpMaterialProgression;
    skills: Skill[];
    classPassive: Skill[],
    noblePhantasms: NoblePhantasm[];
}

export interface EntityBasic {
    id: number,
    collectionNo: number;
    name: string;
    type: EntityType;
    flag: EntityFlag;
    className: ClassName;
    attribute: Attribute;
    rarity: number;
    atkMax: number;
    hpMax: number;
    face: string;
}
