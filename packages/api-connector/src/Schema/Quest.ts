import ClassName from "../Enum/ClassName";
import CondType from "../Enum/Cond";
import { Bgm } from "./Bgm";
import { Gift } from "./Gift";
import { Trait } from "./Trait";
import { Item } from "./Item";

export enum QuestConsumeType {
    NONE = "none",
    AP = "ap",
    RP = "rp",
    ITEM = "item",
    AP_AND_ITEM = "apAndItem",
}

export enum QuestType {
    MAIN = "main",
    FREE = "free",
    FRIENDSHIP = "friendship",
    EVENT = "event",
    HERO_BALLAD = "heroballad",
    WAR_BOARD = "warBoard",
}

export interface QuestRelease {
    type: CondType;
    targetId: number;
    value: number;
    closedMessage: string;
}

export interface Stage {
    bgm: Bgm;
}

export interface Quest {
    id: number;
    name: string;
    type: QuestType;
    consumeType: QuestConsumeType;
    consume: number;
    consumeItem: { item: Item; amount: number }[];
    spotId: number;
    warId: number;
    gifts: Gift[];
    releaseConditions: QuestRelease[];
    phases: number[];
    noticeAt: number;
    openedAt: number;
    closedAt: number;
}

export interface QuestPhase extends Quest {
    phase: number;
    className: ClassName[];
    individuality: Trait[];
    qp: number;
    exp: number;
    bond: number;
    stages: Stage[];
}
