import {BattleTeam} from "@atlasacademy/battle";
import BattleManager from "../../paper-moon/BattleManager";
import {AppThunk} from "../store";
import {battleSlice} from "./slice";

export const battleSyncThunk = (): AppThunk => {
    return async dispatch => {
        const battle = BattleManager.battle();

        await dispatch(battleSlice.actions.setPlayerActors(
            battle.actors().activeActorsByTeam(BattleTeam.PLAYER).map(actor => ({
                id: actor.id(),
                face: actor.face(),
                name: actor.name(),
            }))
        ));

        await dispatch(battleSlice.actions.setEnemyActors(
            battle.actors().activeActorsByTeam(BattleTeam.ENEMY).map(actor => ({
                id: actor.id(),
                face: actor.face(),
                name: actor.name(),
            }))
        ));
    };
};
