import EventType from "../Enum/EventType";

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