import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { BattleTeam } from "@atlasacademy/battle";

import { BattleSetupOptionList, BattleSetupState } from "./types";

const initialState: BattleSetupState = {
    pending: true,
    canAddActor: true,
    servantList: [],
    craftEssenceList: [],
    selectedTeam: BattleTeam.PLAYER,
};

export const battleSetupSlice = createSlice({
    name: "battleSetup",
    initialState,
    reducers: {
        setCanAddActor: (state, action: PayloadAction<boolean>) => {
            state.canAddActor = action.payload;
        },
        setCraftEssenceList: (state, action: PayloadAction<BattleSetupOptionList[]>) => {
            state.craftEssenceList = action.payload;
        },
        setPending: (state, action: PayloadAction<boolean>) => {
            state.pending = action.payload;
        },
        setServantList: (state, action: PayloadAction<BattleSetupOptionList[]>) => {
            state.servantList = action.payload;
        },
        selectServant: (state, action: PayloadAction<number>) => {
            state.selectedServant = action.payload;
        },
        selectTeam: (state, action: PayloadAction<BattleTeam>) => {
            state.selectedTeam = action.payload;
        },
    },
});
