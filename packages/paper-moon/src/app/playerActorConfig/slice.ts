import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PlayerActorConfigServantOptions, PlayerActorConfigState } from "./types";

const initialState: PlayerActorConfigState = {
    open: false,
    loading: false,
    ready: false,
    servantOptions: {
        name: "",
        level: "",
    },
    defaultServantOptions: {
        name: "",
        level: "",
    },
};

export const playerActorConfigSlice = createSlice({
    name: "playerActorConfig",
    initialState,
    reducers: {
        setCraftEssence: (state, action: PayloadAction<number | undefined>) => {
            state.craftEssence = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setOpen: (state, action: PayloadAction<boolean>) => {
            state.open = action.payload;
        },
        setReady: (state, action: PayloadAction<boolean>) => {
            state.ready = action.payload;
        },
        setServant: (state, action: PayloadAction<number | undefined>) => {
            state.servant = action.payload;
        },
        setServantOptions: (state, action: PayloadAction<PlayerActorConfigServantOptions>) => {
            state.servantOptions = action.payload;
        },
        setDefaultServantOptions: (state, action: PayloadAction<PlayerActorConfigServantOptions>) => {
            state.defaultServantOptions = action.payload;
        },
    },
});
