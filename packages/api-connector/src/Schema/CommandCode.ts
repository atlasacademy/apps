import {Skill} from "./Skill";

export interface CommandCodeAssetMap {
    cc?: {
        [key: number]: string;
    }
}

export interface CommandCodeAssets {
    charaGraph: CommandCodeAssetMap;
    faces: CommandCodeAssetMap;
}

export interface CommandCode {
    id: number;
    collectionNo: number;
    name: string;
    rarity: number;
    extraAssets: CommandCodeAssets;
    skills: Skill[];
    comment: string;
}

export interface CommandCodeBasic {
    id: number;
    collectionNo: number;
    name: string;
    rarity: number;
    face: string;
}
