import { BattleTeam } from "@atlasacademy/battle";

import BattleManager from "../../paper-moon/BattleManager";
import api from "../../paper-moon/api";
import { battleSyncThunk } from "../battle/thunks";
import { battleSetupReady } from "../battleSetup/thunks";
import { AppThunk } from "../store";
import { playerActorConfigSlice } from "./slice";
import { PlayerActorConfigServantOptions } from "./types";

export const playerActorConfigAddThunk = (): AppThunk => {
    return async (dispatch, getState) => {
        await dispatch(playerActorConfigSlice.actions.setLoading(true));

        const state = getState(),
            id = state.playerActorConfig.servant;

        if (!state.playerActorConfig.ready) return;

        const servant = id ? await api.servant(id) : null;
        if (!servant) {
            alert("Failed to load servant");
        } else {
            BattleManager.addServant({
                servant,
                team: BattleTeam.PLAYER,
                level: state.playerActorConfig.servantOptions.level as number,
            });
            await dispatch(battleSyncThunk());
        }

        await dispatch(battleSetupReady());
        await dispatch(playerActorConfigSlice.actions.setLoading(false));
        await dispatch(playerActorConfigSlice.actions.setOpen(false));
    };
};

export const playerActorConfigCloseThunk = (): AppThunk => {
    return async (dispatch) => {
        await dispatch(playerActorConfigSlice.actions.setReady(false));
        await dispatch(playerActorConfigSlice.actions.setLoading(false));
        await dispatch(playerActorConfigSlice.actions.setOpen(false));
        await dispatch(battleSetupReady());
    };
};

export const playerActorConfigOpenServantThunk = (id: number): AppThunk => {
    return async (dispatch) => {
        await dispatch(playerActorConfigSlice.actions.setServant(id));
        await dispatch(
            playerActorConfigSlice.actions.setServantOptions({
                name: "",
                level: "",
            })
        );
        await dispatch(playerActorConfigSlice.actions.setCraftEssence(undefined));
        await dispatch(playerActorConfigSlice.actions.setReady(false));
        await dispatch(playerActorConfigSlice.actions.setLoading(true));
        await dispatch(playerActorConfigSlice.actions.setOpen(true));

        const servant = await api.servant(id);
        await dispatch(
            playerActorConfigSlice.actions.setDefaultServantOptions({
                level: servant.lvMax,
                name: servant.name,
            })
        );
        await dispatch(
            playerActorConfigSlice.actions.setServantOptions({
                level: servant.lvMax,
                name: servant.name,
            })
        );
        await dispatch(playerActorConfigSlice.actions.setReady(true));
        await dispatch(playerActorConfigSlice.actions.setLoading(false));
    };
};

export const playerActorConfigValidateServantOptions = (): AppThunk => {
    return async (dispatch, getState) => {
        const state = getState(),
            defaultServantOptions = state.playerActorConfig.defaultServantOptions,
            servantOptions = { ...state.playerActorConfig.servantOptions };

        if (!servantOptions.name) servantOptions.name = defaultServantOptions.name;

        servantOptions.level = parseInt(servantOptions.level.toString());
        if (
            isNaN(servantOptions.level) ||
            !isFinite(servantOptions.level) ||
            servantOptions.level > 100 ||
            servantOptions.level < 1
        ) {
            servantOptions.level = defaultServantOptions.level;
        }

        await dispatch(playerActorConfigSlice.actions.setServantOptions(servantOptions));
        await dispatch(playerActorConfigSlice.actions.setReady(true));
    };
};

export const playerActorConfigUpdateServantOptions = (options: PlayerActorConfigServantOptions): AppThunk => {
    return async (dispatch) => {
        await dispatch(playerActorConfigSlice.actions.setReady(false));
        await dispatch(playerActorConfigSlice.actions.setServantOptions(options));
    };
};
