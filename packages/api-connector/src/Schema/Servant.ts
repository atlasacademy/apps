import { Entity, EntityBasic, EntityScript, EntityType } from "./Entity";
import { Profile } from "./Profile";

export interface ServantScript extends EntityScript {}

export interface Servant extends Entity {
    type: EntityType.NORMAL | EntityType.HEROINE | EntityType.ENEMY_COLLECTION_DETAIL;
    profile?: Profile;
}

export interface ServantWithLore extends Servant {
    profile: NonNullable<Servant["profile"]>;
}

export interface ServantBasic extends EntityBasic {
    type: EntityType.NORMAL | EntityType.HEROINE | EntityType.ENEMY_COLLECTION_DETAIL;
}

export enum ServantFrameType {
    BLACK = "black",
    BRONZE = "bronze",
    SILVER = "silver",
    GOLD = "gold",
    GOLD_RED = "goldRed",
    GOLD_RED_GREAT = "goldRedGreat",
    GOLD_BLACK = "goldBlack",
    GOLD_BLACK_GREAT = "goldBlackGreat",
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
