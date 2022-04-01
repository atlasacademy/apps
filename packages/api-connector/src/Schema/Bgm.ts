import CondType from "../Enum/Cond";
import { Shop } from "./Shop";

export interface Bgm {
    id: number;
    name: string;
    fileName: string;
    notReleased: boolean;
    audioAsset?: string;
}

export interface BgmRelease {
    id: number;
    type: CondType;
    condGroup: number;
    targetIds: number[];
    vals: number[];
    priority: number;
    closedMessage: string;
}

export interface BgmEntity {
    id: number;
    name: string;
    originalName: string;
    fileName: string;
    audioAsset?: string;
    priority: number;
    detail: string;
    notReleased: boolean;
    shop?: Shop;
    logo: string;
    releaseConditions: BgmRelease[];
}
