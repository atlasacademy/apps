import Skill from "./Skill";

export interface MysticCodeAssets {
    item: {
        male: string;
        female: string;
    }
    masterFace: {
        male: string;
        female: string;
    }
    masterFigure: {
        male: string;
        female: string;
    }
}

interface MysticCode {
    id: number;
    name: string;
    detail: string;
    maxLv: number;
    extraAssets: MysticCodeAssets;
    skills: Skill[];
    expRequired: number[];
}

export default MysticCode;
