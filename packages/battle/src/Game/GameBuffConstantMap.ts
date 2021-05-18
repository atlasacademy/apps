import {BuffType} from "@atlasacademy/api-connector/dist/Schema/Buff";

export enum GameBuffGroup {
    ATK = "atk",
    COMMAND_ATK = "commandAtk",
    COMMAND_DEF = "commandDef",
    MAX_HP_VALUE = "maxhpValue",
    MULTI_ATTACK = "multiattack",
}

export enum GameBuffLimit {
    NORMAL = "normal",
    UPPER = "upper",
    NONE = "none",
}

export interface GameBuffConstant {
    limit: GameBuffLimit,
    plusTypes: BuffType[],
    minusTypes: BuffType[],
    baseParam: number,
    baseValue: number,
    isRec: boolean,
    plusAction: number,
    maxRate: number[],
}

type GameBuffConstantMap = {
    [key in GameBuffGroup]?: GameBuffConstant
}

export default GameBuffConstantMap;
