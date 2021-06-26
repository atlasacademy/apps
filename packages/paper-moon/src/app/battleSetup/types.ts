import {BattleTeam} from "@atlasacademy/battle";

export interface BattleSetupServantItem {
    id: number,
    collectionNo: number,
    name: string,
}

export interface BattleSetupActorOptions {
}

export interface BattleSetupState {
    pending: boolean,
    canAddActor: boolean,
    servantList: BattleSetupServantItem[],
    selectedServant?: number,
    selectedTeam: BattleTeam,
    actorOptions?: BattleSetupActorOptions,
}
