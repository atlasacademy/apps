import { BattleTeam } from "@atlasacademy/battle";

import apiConnector from "../../paper-moon/api";
import { enemyActorConfigOpenServantThunk } from "../enemyActorConfig/thunks";
import { playerActorConfigOpenServantThunk } from "../playerActorConfig/thunks";
import { AppThunk } from "../store";
import { battleSetupSlice } from "./slice";

export const battleSetupAddActorThunk = (): AppThunk => {
    return async (dispatch, getState) => {
        const state = getState(),
            id = state.battleSetup.selectedServant,
            team = state.battleSetup.selectedTeam;

        if (!id || state.battleSetup.pending || !state.battleSetup.canAddActor) {
            return;
        }

        await dispatch(battleSetupSlice.actions.setPending(true));
        if (team === BattleTeam.PLAYER) {
            await dispatch(playerActorConfigOpenServantThunk(id));
        } else {
            await dispatch(enemyActorConfigOpenServantThunk(id));
        }
    };
};

export const battleSetupInitThunk = (): AppThunk => {
    return async (dispatch) => {
        const servantList = await apiConnector.servantList();
        await dispatch(
            battleSetupSlice.actions.setServantList(
                servantList.map((servant) => ({
                    id: servant.id,
                    collectionNo: servant.collectionNo,
                    name: servant.name,
                }))
            )
        );

        if (servantList.length > 0) await dispatch(battleSetupSelectServantThunk(servantList[0].id));

        const craftEssenceList = await apiConnector.craftEssenceList();
        await dispatch(
            battleSetupSlice.actions.setCraftEssenceList(
                craftEssenceList.map((craftEssence) => ({
                    id: craftEssence.id,
                    collectionNo: craftEssence.collectionNo,
                    name: craftEssence.name,
                }))
            )
        );

        await dispatch(battleSetupSlice.actions.setPending(false));
    };
};

export const battleSetupReady = (): AppThunk => {
    return async (dispatch, getState) => {
        await dispatch(battleSetupUpdateCanAddActor());
        await dispatch(battleSetupSlice.actions.setPending(false));
    };
};

export const battleSetupSelectServantThunk = (id: number): AppThunk => {
    return async (dispatch) => {
        await dispatch(battleSetupSlice.actions.selectServant(id));
    };
};

export const battleSetupSelectTeamThunk = (team: BattleTeam): AppThunk => {
    return async (dispatch) => {
        await dispatch(battleSetupSlice.actions.selectTeam(team));
        await dispatch(battleSetupUpdateCanAddActor());
    };
};

export const battleSetupUpdateCanAddActor = (): AppThunk => {
    return async (dispatch, getState) => {
        const state = getState(),
            team = state.battleSetup.selectedTeam;

        if (team === BattleTeam.PLAYER) {
            const canAddActor = state.battle.playerActors.length < 3;

            await dispatch(battleSetupSlice.actions.setCanAddActor(canAddActor));
        } else {
            const canAddActor = state.battle.enemyActors.length < 1;

            await dispatch(battleSetupSlice.actions.setCanAddActor(canAddActor));
        }
    };
};
