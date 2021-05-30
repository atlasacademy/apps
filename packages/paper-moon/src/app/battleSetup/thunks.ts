import apiConnector from "../../paper-moon/api";
import BattleManager from "../../paper-moon/BattleManager";
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

export const battleSetupAddActorThunk = (): AppThunk => {
    return async (dispatch, getState) => {
        const state = getState(),
            id = state.battleSetup.selectedServant;

        if (!id)
            return;

        const servant = await apiConnector.servant(id),
            team = state.battleSetup.selectedTeam;

        if (!servant)
            return;

        BattleManager.addActor(servant, team);
    }
}