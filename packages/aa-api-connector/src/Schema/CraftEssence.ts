import EntityType from "../Enum/EntityType";
import Profile from "./Profile";
import Skill from "./Skill";

export interface CraftEssenceAssetMap {
    equip?: {
        [key: number]: string;
    }
}

export interface CraftEssenceAssets {
    charaGraph: CraftEssenceAssetMap;
    faces: CraftEssenceAssetMap;
}

interface CraftEssence {
    id: number;
    collectionNo: number;
    name: string;
    type: EntityType;
    rarity: number;
    cost: number;
    lvMax: number;
    extraAssets: CraftEssenceAssets;
    atkBase: number;
    atkMax: number;
    hpBase: number;
    hpMax: number;
    growthCurve: number;
    atkGrowth: number[];
    hpGrowth: number[];
    skills: Skill[];
    profile?: Profile;
}

export default CraftEssence;
