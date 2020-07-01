import ClassName from "./ClassName";
import Trait from "./Trait";

export enum QuestType {
    MAIN = "main",
    FREE = "free",
    FRIENDSHIP = "friendship",
    EVENT = "event",
    HERO_BALLAD = "heroballad",
}

export enum QuestConsumeType {
    NONE = "none",
    AP = "ap",
    RP = "rp",
    ITEM = "item",
    AP_ADD_ITEM = "apAddItem",
}

interface Quest {
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

export default Quest;
