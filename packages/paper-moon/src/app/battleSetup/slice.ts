import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BattleTeam} from "@atlasacademy/battle";
import {BattleSetupActorOptions, BattleSetupServantItem, BattleSetupState} from "./types";

const initialState: BattleSetupState = {
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
