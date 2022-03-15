import { Entity, EntityBasic, EntityType } from "./Entity";
import { Profile } from "./Profile";

export interface ServantScript {
    SkillRankUp?: {
        [key: number]: number[];
    };
    svtBuffTurnExtend?: boolean;
}

export interface Servant extends Entity {
    type: EntityType.NORMAL | EntityType.HEROINE | EntityType.ENEMY_COLLECTION_DETAIL;
    script: ServantScript;
    profile?: Profile;
}

export interface ServantBasic extends EntityBasic {
    type: EntityType.NORMAL | EntityType.HEROINE | EntityType.ENEMY_COLLECTION_DETAIL;
}

export enum ServantFrameType {
    BLACK = "black",
    BRONZE = "bronze",
    SILVER = "silver",
    GOLD = "gold",
    FRAME_0801 = "frame0801",
    FRAME_0802 = "frame0802",
    FRAME_0803 = "frame0803",
    FRAME_0804 = "frame0804",
}

export interface GrailCostInfo {
    qp: number;
    addLvMax: number;
    frameType: ServantFrameType;
}

export type GrailCostInfoMap = {
    [key in number]?: {
        [key in number]?: GrailCostInfo;
    };
};
