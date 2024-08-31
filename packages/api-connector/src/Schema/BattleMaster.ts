import { CommonRelease } from "./CommonRelease";
import { Gender } from "./Entity";

export interface BattleMasterImage {
    id: number;
    type: Gender;
    faceIcon?: string;
    skillCutin?: string;
    skillCutinOffsetX: number;
    skillCutinOffsetY: number;
    commandSpellCutin?: string;
    commandSpellCutinOffsetX: number;
    commandSpellCutinOffsetY: number;
    resultImage?: string;
    releaseConditions: CommonRelease[];
}
