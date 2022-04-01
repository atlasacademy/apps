import { CommonRelease } from "./CommonRelease";
import { Skill } from "./Skill";

export interface MysticCodeAssets {
    item: {
        male: string;
        female: string;
    };
    masterFace: {
        male: string;
        female: string;
    };
    masterFigure: {
        male: string;
        female: string;
    };
}

export interface MysticCodeBasic {
    id: number;
    name: string;
    item: {
        male: string;
        female: string;
    };
}

export interface MysticCodeCostume {
    id: number;
    releaseConditions: CommonRelease[];
    extraAssets: MysticCodeAssets;
}

export interface MysticCode {
    id: number;
    name: string;
    originalName: string;
    detail: string;
    maxLv: number;
    extraAssets: MysticCodeAssets;
    skills: Skill[];
    expRequired: number[];
    costumes: MysticCodeCostume[];
}
