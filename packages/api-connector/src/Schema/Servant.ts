import { Entity, EntityBasic, EntityType } from "./Entity";
import { ItemBackgroundType } from "./Item";
import { Profile } from "./Profile";

export interface ServantScript {
    SkillRankUp?: {
        [key: number]: number[];
    };
}

export interface Servant extends Entity {
    type:
        | EntityType.NORMAL
        | EntityType.HEROINE
        | EntityType.ENEMY_COLLECTION_DETAIL;
    script: ServantScript;
    profile?: Profile;
}

export interface ServantBasic extends EntityBasic {
    type:
        | EntityType.NORMAL
        | EntityType.HEROINE
        | EntityType.ENEMY_COLLECTION_DETAIL;
}

export interface GrailCostInfo {
    qp: number;
    addLvMax: number;
    frameType: ItemBackgroundType;
}

export type GrailCostInfoMap = {
    [key in number]?: {
        [key in number]?: GrailCostInfo;
    };
};
