import { Gift } from "./Gift";

export enum WarBoardStageSquareType {
    NORMAL = "normal",
    ITEM = "item",
    EFFECT = "effect",
    TREASURE = "treasure",
    WALL = "wall",
}

export enum WarBoardTreasureRarity {
    COMMON = "common",
    RARE = "rare",
    SRARE = "srare",
    COMMON_PLUS = "commonPlus",
    RARE_PLUS = "rarePlus",
    SRARE_PLUS = "srarePlus",
    COMMON_PLUS2 = "commonPlus2",
    RARE_PLUS2 = "rarePlus2",
    SRARE_PLUS2 = "srarePlus2",
    ITEM_ICON = "itemIcon",
    ITEM_ICON_PLUS = "itemIconPlus",
    ITEM_ICON_PLUS2 = "itemIconPlus2",
}
interface WarBoardTreasure {
    warBoardTreasureId: number;
    rarity: WarBoardTreasureRarity;
    gifts: Gift[];
}
interface WarBoardStageSquare {
    squareIndex: number;
    type: WarBoardStageSquareType;
    effectId: number;
    treasures: WarBoardTreasure[];
}
interface WarBoardStage {
    warBoardStageId: number;
    boardMessage: string;
    formationCost: number;
    questId: number;
    questPhase: number;
    squares: WarBoardStageSquare[];
}
export interface WarBoard {
    warBoardId: number;
    stages: WarBoardStage[];
}
