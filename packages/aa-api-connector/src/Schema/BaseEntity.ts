import Attribute from "../Enum/Attribute";
import Card from "../Enum/Card";
import ClassName from "../Enum/ClassName";
import EntityType from "../Enum/EntityType";
import Gender from "../Enum/Gender";
import Item from "./Item";
import NoblePhantasm from "./NoblePhantasm";
import Skill from "./Skill";
import Trait from "./Trait";

export interface EntityAssetMap {
    ascension?: {
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
    charaGraph: EntityAssetMap;
    commands: EntityAssetMap;
    equipFace: EntityAssetMap;
    faces: EntityAssetMap;
    narrowFigure: EntityAssetMap;
    status: EntityAssetMap;
}

export interface EntityLevelUpMaterials {
    items: { item: Item, amount: number }[],
    qp: number,
}

export interface EntityLevelUpMaterialProgression {
    [key: string]: EntityLevelUpMaterials;
}

interface BaseEntity {
    id: number;
    collectionNo: number;
    name: string;
    className: ClassName;
    type: EntityType;
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
    growthCurve: number;
    atkGrowth: number[];
    hpGrowth: number[];
    bondGrowth: number[];
    bondEquip: number;
    ascensionMaterials: EntityLevelUpMaterialProgression;
    skillMaterials: EntityLevelUpMaterialProgression;
    skills: Skill[];
    classPassive: Skill[],
    noblePhantasms: NoblePhantasm[];
}

export default BaseEntity;
