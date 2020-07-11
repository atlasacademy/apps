import AssetCollection, {AssetBundle, AssetMap} from "./AssetCollection";
import ClassName from "./ClassName";
import EntityType from "./EntityType";
import Profile from "./Profile";
import Skill from "./Skill";

export interface CraftEssenceAssetBundle extends AssetBundle {
    ascension: AssetMap;
    costume: AssetMap;
    equip: AssetMap;
    cc: AssetMap;
}

export interface CraftEssenceAssetCollection extends AssetCollection {
    charaGraph: CraftEssenceAssetBundle;
    faces: CraftEssenceAssetBundle;
}

interface CraftEssence {
    id: number;
    collectionNo: number;
    name: string;
    className: ClassName;
    type: EntityType;
    rarity: number;
    cost: number;
    lvMax: number;
    extraAssets: CraftEssenceAssetCollection;
    atkBase: number;
    atkMax: number;
    hpBase: number;
    hpMax: number;
    growthCurve: number;
    atkGrowth: number[];
    hpGrowth: number[];
    skills: Skill[];
    profile: Profile;
}

export default CraftEssence;
