import EventType from "../Enum/EventType";
import { Gift } from "./Gift";
import { Shop } from "./Shop";

export interface EventReward {
    groupId: number;
    point: number;
    gifts: Gift[];
    bgImagePoint: string;
    bgImageGet: string;
}

export interface EventBasic {
    id: number;
    type: EventType;
    name: string;
    noticeAt: number;
    startedAt: number;
    endedAt: number;
    finishedAt: number;
    materialOpenedAt: number;
    warIds: number[];
}

export interface Event {
    id: number;
    type: EventType;
    name: string;
    shortName: string;
    detail: string;
    noticeBanner?: string;
    banner?: string;
    icon?: string;
    bannerPriority: number;
    noticeAt: number;
    startedAt: number;
    endedAt: number;
    finishedAt: number;
    materialOpenedAt: number;
    warIds: number[];
    shop: Shop[];
    rewards: EventReward[];
}
