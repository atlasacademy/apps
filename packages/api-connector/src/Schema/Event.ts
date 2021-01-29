import EventType from "../Enum/EventType";

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
    noticeBanner: string;
    banner: string;
    icon: string;
    bannerPriority: number;
    noticeAt: number;
    startedAt: number;
    endedAt: number;
    finishedAt: number;
    materialOpenedAt: number;
    warIds: number[];
}
