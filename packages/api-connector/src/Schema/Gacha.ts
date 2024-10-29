import CondType from "../Enum/Cond";
import { CommonRelease } from "./CommonRelease";
import { PayType } from "./Shop";

export interface GachaStoryAdjust {
    idx: number;
    adjustId: number;
    condType: CondType;
    targetId: number;
    value: number;
    imageId: number;
}

export enum GachaFlag {
    PC_MESSAGE = "pcMessage",
    BONUS_SELECT = "bonusSelect",
    DISPLAY_FEATURED_SVT = "displayFeaturedSvt",
}

export interface GachaSub {
    id: number;
    priority: number;
    imageId: number;
    adjustAddId: number;
    openedAt: number;
    closedAt: number;
    releaseConditions: CommonRelease[];
    script: Record<string, any>;
}

export interface Gacha {
    id: number;
    name: string;
    imageId: number;
    type: PayType;
    adjustId: number;
    pickupId: number;
    drawNum1: number;
    drawNum2: number;
    maxDrawNum: number;
    openedAt: number;
    closedAt: number;
    detailUrl: string;
    flags: GachaFlag[];
    gachaSubs: GachaSub[];
    storyAdjusts: GachaStoryAdjust[];
}
