import { Bgm } from "./Bgm";
import { Quest } from "./Quest";

export enum WarStartType {
    NONE = "none",
    SCRIPT = "script",
    QUEST = "quest",
}

export interface Map {
    id: number;
    mapImage?: string;
    mapImageW: number;
    mapImageH: number;
    headerImage?: string;
    bgm: Bgm;
}

export interface Spot {
    id: number;
    joinSpotIds: number[];
    mapId: number;
    name: string;
    image?: string;
    x: number;
    y: number;
    imageOfsX: number;
    imageOfsY: number;
    nameOfsX: number;
    nameOfsY: number;
    questOfsX: number;
    questOfsY: number;
    nextOfsX: number;
    nextOfsY: number;
    closedMessage: string;
    quests: Quest[];
}

export interface War {
    id: number;
    coordinates: number[][];
    age: string;
    name: string;
    longName: string;
    banner?: string;
    headerImage?: string;
    priority: number;
    parentWarId: number;
    materialParentWarId: number;
    emptyMessage: string;
    bgm: Bgm;
    scriptId: string;
    startType: WarStartType;
    targetId: number;
    eventId: number;
    lastQuestId: number;
    maps: Map[];
    spots: Spot[];
}

export interface WarBasic {
    id: number;
    coordinates: number[][];
    age: string;
    name: string;
    longName: string;
    eventId: number;
}
