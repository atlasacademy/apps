import ClassName from "../Enum/ClassName";
import CondType from "../Enum/Cond";
import { Bgm } from "./Bgm";
import { Gift } from "./Gift";
import { Item } from "./Item";
import { QuestEnemy } from "./QuestEnemy";
import { SupportServant } from "./SupportServant";
import { Trait } from "./Trait";

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

export interface QuestMessage {
    idx: number;
    message: string;
    condType: CondType;
    targetId: number;
    targetNum: number;
}

export interface Stage {
    wave: number;
    bgm: Bgm;
    fieldAis: { day?: number; raid?: number; id: number }[];
    enemies: QuestEnemy[];
}

export interface QuestBasic {
    id: number;
    name: string;
    type: QuestType;
    consumeType: QuestConsumeType;
    consume: number;
    spotId: number;
    warId: number;
    noticeAt: number;
    openedAt: number;
    closedAt: number;
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
    phasesWithEnemies: number[];
    phasesNoBattle: number[];
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
    battleBgId: number;
    scripts: { scriptId: string; script: string }[];
    messages: QuestMessage[];
    supportServants: SupportServant[];
    stages: Stage[];
}
