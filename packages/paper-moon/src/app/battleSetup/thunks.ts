import {BattleTeam} from "@atlasacademy/battle";
import apiConnector from "../../paper-moon/api";
import BattleManager from "../../paper-moon/BattleManager";
import {battleSyncThunk} from "../battle/thunks";
import {AppThunk} from "../store";
import {battleSetupSlice} from "./slice";

export const battleSetupInitThunk = (): AppThunk => {
    return async dispatch => {
        const servantList = await apiConnector.servantList();
        await dispatch(battleSetupSlice.actions.setServantList(
            servantList.map(servant => ({
                id: servant.id,
                collectionNo: servant.collectionNo,
                name: servant.name
            }))
        ));

        if (servantList.length > 0)
            await dispatch(battleSetupSelectServantThunk(servantList[0].id));

        await dispatch(battleSetupSlice.actions.setPending(false));
    };
};

export const battleSetupSelectServantThunk = (id: number): AppThunk => {
    return async dispatch => {
        await dispatch(battleSetupSlice.actions.selectServant(id));
        const servant = await apiConnector.servant(id);
        await dispatch(battleSetupSlice.actions.setActorOptions({
            servant
        }));
    };
}

export const battleSetupSelectTeamThunk = (team: BattleTeam): AppThunk => {
    return async dispatch => {
        await dispatch(battleSetupSlice.actions.selectTeam(team));
        await dispatch(battleSetupUpdateCanAddActor());
    };
}

export const battleSetupAddActorThunk = (): AppThunk => {
    return async (dispatch, getState) => {
        const state = getState(),
            id = state.battleSetup.selectedServant,
            team = state.battleSetup.selectedTeam;

        if (!id
            || state.battleSetup.pending
            || (team === BattleTeam.PLAYER && state.battle.playerActors.length >= 3)
            || (team === BattleTeam.ENEMY && state.battle.enemyActors.length >= 1)
        ) {
            return;
        }

        await dispatch(battleSetupSlice.actions.setPending(true));

        const servant = await apiConnector.servant(id);

        if (!servant)
            return;

        BattleManager.addActor(servant, team);
        await dispatch(battleSyncThunk());
        await dispatch(battleSetupUpdateCanAddActor());
        await dispatch(battleSetupSlice.actions.setPending(false));
    }
}

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
}
