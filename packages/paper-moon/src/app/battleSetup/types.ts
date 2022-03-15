import { BattleTeam } from "@atlasacademy/battle";

export interface BattleSetupOptionList {
    id: number;
    collectionNo: number;
    name: string;
}

export interface BattleSetupState {
    pending: boolean;
    canAddActor: boolean;
    servantList: BattleSetupOptionList[];
    craftEssenceList: BattleSetupOptionList[];
    selectedServant?: number;
    selectedTeam: BattleTeam;
}
