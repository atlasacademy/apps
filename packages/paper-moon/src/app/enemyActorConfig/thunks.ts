import { BattleTeam } from "@atlasacademy/battle";

import BattleManager from "../../paper-moon/BattleManager";
import api from "../../paper-moon/api";
import { battleSyncThunk } from "../battle/thunks";
import { battleSetupReady } from "../battleSetup/thunks";
import { AppThunk } from "../store";
import { enemyActorConfigSlice } from "./slice";

export const enemyActorConfigAddThunk = (): AppThunk => {
    return async (dispatch, getState) => {
        await dispatch(enemyActorConfigSlice.actions.setLoading(true));

        const state = getState(),
            id = state.enemyActorConfig.servant;

        const servant = id ? await api.servant(id) : null;
        if (!servant) {
            alert("Failed to load servant");
        } else {
            BattleManager.addServant({ servant, team: BattleTeam.ENEMY });
            await dispatch(battleSyncThunk());
        }

        await dispatch(battleSetupReady());
        await dispatch(enemyActorConfigSlice.actions.setLoading(false));
        await dispatch(enemyActorConfigSlice.actions.setOpen(false));
    };
};

export const enemyActorConfigCloseThunk = (): AppThunk => {
    return async (dispatch) => {
        await dispatch(battleSetupReady());
        await dispatch(enemyActorConfigSlice.actions.setLoading(false));
        await dispatch(enemyActorConfigSlice.actions.setOpen(false));
    };
};

export const enemyActorConfigOpenServantThunk = (id: number): AppThunk => {
    return async (dispatch) => {
        await dispatch(enemyActorConfigSlice.actions.setServant(id));
        await dispatch(enemyActorConfigSlice.actions.setServantOptions(undefined));
        await dispatch(enemyActorConfigSlice.actions.setLoading(true));
        await dispatch(enemyActorConfigSlice.actions.setOpen(true));

        const servant = await api.servant(id);
        await dispatch(
            enemyActorConfigSlice.actions.setServantOptions({
                name: servant.name,
            })
        );
        await dispatch(enemyActorConfigSlice.actions.setLoading(false));
    };
};
