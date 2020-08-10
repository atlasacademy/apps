import Attribute from "../Enum/Attribute";
import Card from "../Enum/Card";
import ClassName from "../Enum/ClassName";
import EntityType from "../Enum/EntityType";
import Gender from "../Enum/Gender";
import Item from "./Item";
import NoblePhantasm from "./NoblePhantasm";
import Profile from "./Profile";
import Skill from "./Skill";
import Trait from "./Trait";

export interface ServantAssetMap {
    ascension?: {
        [key: number]: string;
    }
    costume?: {
        [key: number]: string;
    }
}

export interface ServantAssets {
    charaGraph: ServantAssetMap;
    faces: ServantAssetMap;
    commands: ServantAssetMap;
    status: ServantAssetMap;
}

export interface ServantLevelUpMaterials {
    items: { item: Item, amount: number }[],
    qp: number,
}

export interface ServantLevelUpMaterialProgression {
    [key: string]: ServantLevelUpMaterials;
}

interface Servant {
    id: number;
    collectionNo: number;
    name: string;
    className: ClassName;
    type: EntityType;
    rarity: number;
    cost: number;
    lvMax: number;
    extraAssets: ServantAssets;
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
    ascensionMaterials: ServantLevelUpMaterialProgression;
    skillMaterials: ServantLevelUpMaterialProgression;
    skills: Skill[];
    classPassive: Skill[],
    noblePhantasms: NoblePhantasm[];
    profile?: Profile,
}

export default Servant;
