import AssetCollection from "./AssetCollection";
import ClassName from "./ClassName";
import EntityType from "./EntityType";
import Profile from "./Profile";
import Skill from "./Skill";

interface CraftEssence {
    id: number;
    collectionNo: number;
    name: string;
    className: ClassName;
    type: EntityType;
    rarity: number;
    cost: number;
    lvMax: number;
    extraAssets: AssetCollection;
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
