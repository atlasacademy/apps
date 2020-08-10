import Skill from "./Skill";

export interface CraftEssenceAssetMap {
    cc?: {
        [key: number]: string;
    }
}

export interface CommandCodeAssets {
    charaGraph: CraftEssenceAssetMap;
    faces: CraftEssenceAssetMap;
}

interface CommandCode {
    id: number;
    collectionNo: number;
    name: string;
    rarity: number;
    extraAssets: CommandCodeAssets;
    skills: Skill[];
    comment: string;
}

export default CommandCode;
