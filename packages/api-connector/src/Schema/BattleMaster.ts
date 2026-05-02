import { CommonRelease } from "./CommonRelease.js";
import { Gender } from "./Entity.js";

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
