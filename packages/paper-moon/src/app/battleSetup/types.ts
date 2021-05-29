import {BattleTeam} from "@atlasacademy/battle";

export interface BattleSetupServantItem {
    id: number,
    collectionNo: number,
    name: string,
}

export interface BattleSetupActorOptions {
}

export interface BattleSetupState {
    servantList: BattleSetupServantItem[],
    selectedServant?: number,
    selectedTeam: BattleTeam,
    actorOptions?: BattleSetupActorOptions,
}
