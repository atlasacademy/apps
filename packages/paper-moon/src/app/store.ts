import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import { battleSlice } from "./battle/slice";
import { battleSetupSlice } from "./battleSetup/slice";
import { enemyActorConfigSlice } from "./enemyActorConfig/slice";
import { playerActorConfigSlice } from "./playerActorConfig/slice";

export const store = configureStore({
    reducer: {
        battle: battleSlice.reducer,
        battleSetup: battleSetupSlice.reducer,
        enemyActorConfig: enemyActorConfigSlice.reducer,
        playerActorConfig: playerActorConfigSlice.reducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
