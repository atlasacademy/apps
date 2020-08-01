import Attribute from "./Attribute";
import Card from "./Card";
import ClassName from "./ClassName";
import Gender from "./Gender";
import AssetCollection, {AssetBundle, AssetMap} from "./AssetCollection";
import Item from "./Item";
import NoblePhantasm from "./NoblePhantasm";
import EntityType from "./EntityType";
import Profile from "./Profile";
import Skill from "./Skill";
import Trait from "./Trait";

export interface ServantAssetBundle extends AssetBundle {
    ascension?: AssetMap;
    costume?: AssetMap;
    equip?: AssetMap;
    cc?: AssetMap;
}

export interface ServantAssetCollection extends AssetCollection {
    charaGraph: ServantAssetBundle;
    faces: ServantAssetBundle;
    commands: ServantAssetBundle;
    status: ServantAssetBundle;
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
    extraAssets: ServantAssetCollection;
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
    profile: Profile,
}

export default Servant;
