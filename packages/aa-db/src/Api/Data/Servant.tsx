import Attribute from "./Attribute";
import Card from "./Card";
import ClassName from "./ClassName";
import Gender from "./Gender";
import AssetCollection from "./AssetCollection";
import NoblePhantasm from "./NoblePhantasm";
import EntityType from "./EntityType";
import Skill from "./Skill";
import Trait from "./Trait";

interface Servant {
    id: number;
    collectionNo: number;
    name: string;
    className: ClassName;
    type: EntityType;
    rarity: number;
    cost: number;
    lvMax: number;
    extraAssets: AssetCollection;
    gender: Gender;
    attribute: Attribute;
    traits: Trait[];
    starAbsorb: number;
    starGen: number;
    instantDeathChance: number;
    cards: Card[];
    npGain: {
        buster?: number;
        arts?: number;
        quick?: number;
        extra?: number;
        defence?: number;
    }
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
    // ascensionMaterials
    // skillMaterials
    skills: Skill[];
    // classPassive
    noblePhantasms: NoblePhantasm[];
    // profile
}

export default Servant;
