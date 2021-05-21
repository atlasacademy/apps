export interface MasterLevelInfo {
    requiredExp: number;
    maxAp: number;
    maxCost: number;
    maxFriend: number;
}

export type MasterLevelInfoMap = {
    [key in number]?: MasterLevelInfo;
};
