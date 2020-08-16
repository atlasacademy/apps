import ClassName from "../Enum/ClassName";
import {Trait} from "./Trait";

export enum QuestConsumeType {
    NONE = "none",
    AP = "ap",
    RP = "rp",
    ITEM = "item",
    AP_ADD_ITEM = "apAddItem",
}

export enum QuestType {
    MAIN = "main",
    FREE = "free",
    FRIENDSHIP = "friendship",
    EVENT = "event",
    HERO_BALLAD = "heroballad",
}

export interface QuestPhase {
    id: number;
    phase: number;
    name: string;
    type: QuestType;
    consumeType: QuestConsumeType;
    consume: number;
    spotId: number;
    className: ClassName[];
    individuality: Trait[];
    qp: number;
    exp: number;
    bond: number;
    noticeAt: number;
    openedAt: number;
    closedAt: number;
}
