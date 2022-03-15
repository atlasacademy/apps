import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { EnemyActorConfigServantOptions, EnemyActorConfigState } from "./types";

const initialState: EnemyActorConfigState = {
    open: false,
    loading: false,
};

export const enemyActorConfigSlice = createSlice({
    name: "enemyActorConfig",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setOpen: (state, action: PayloadAction<boolean>) => {
            state.open = action.payload;
        },
        setServant: (state, action: PayloadAction<number | undefined>) => {
            state.servant = action.payload;
        },
        setServantOptions: (state, action: PayloadAction<EnemyActorConfigServantOptions | undefined>) => {
            state.servantOptions = action.payload;
        },
    },
});
