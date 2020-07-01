import AssetCollection from "./AssetCollection";
import Skill from "./Skill";

interface CraftEssence {
    id: number;
    collectionNo: number;
    name: string;
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
}

export default CraftEssence;
