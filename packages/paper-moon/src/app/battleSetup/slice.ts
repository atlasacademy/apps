import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BattleTeam} from "@atlasacademy/battle";
import {BattleSetupActorOptions, BattleSetupServantItem, BattleSetupState} from "./types";

const initialState: BattleSetupState = {
    pending: true,
    canAddActor: true,
    servantList: [],
    selectedTeam: BattleTeam.PLAYER,
};

export const battleSetupSlice = createSlice({
    name: 'battleSetup',
    initialState,
    reducers: {
        setActorOptions: (state, action: PayloadAction<BattleSetupActorOptions | undefined>) => {
            state.actorOptions = action.payload;
        },
        setCanAddActor: (state, action: PayloadAction<boolean>) => {
            state.canAddActor = action.payload;
        },
        setPending: (state, action: PayloadAction<boolean>) => {
            state.pending = action.payload;
        },
        setServantList: (state, action: PayloadAction<BattleSetupServantItem[]>) => {
            state.servantList = action.payload;
        },
        selectServant: (state, action: PayloadAction<number>) => {
            state.selectedServant = action.payload;
        },
        selectTeam: (state, action: PayloadAction<BattleTeam>) => {
            state.selectedTeam = action.payload;
        }
    }
})
