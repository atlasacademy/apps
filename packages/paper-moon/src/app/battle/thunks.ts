import {BattleTeam} from "@atlasacademy/battle";
import {Card} from "@atlasacademy/api-connector";
import BattleDamageEvent from "@atlasacademy/battle/dist/Event/BattleDamageEvent";
import BattleManager from "../../paper-moon/BattleManager";
import {AppThunk} from "../store";
import {battleSlice} from "./slice";

export const battleQueueAttack = (actorId: number, card: Card): AppThunk => {
    return async (dispatch, getState) => {
        let state = getState();
        if (!state.battle.playerAttacking) {
            await dispatch(battleSlice.actions.startPlayerAttacking());
        }

        await dispatch(battleSlice.actions.queueAction({
            actorId,
            card
        }));

        // refresh state
        state = getState();
        if (state.battle.queuedAttacks.length < 3)
            return;

        await dispatch(battleSlice.actions.stopPlayerAction());
        BattleManager.battle().clearEvents();
        await BattleManager.attack(state.battle.queuedAttacks);
        await dispatch(battleSyncThunk());
    };
};

export const battleStartThunk = (): AppThunk => {
    return async dispatch => {
        await dispatch(battleSlice.actions.startBattle());
        await BattleManager.setup();
        await BattleManager.start();
        await dispatch(battleSlice.actions.startPlayerTurn());
    };
}

export const battleSyncThunk = (): AppThunk => {
    return async dispatch => {
        const battle = BattleManager.battle();

        await dispatch(battleSlice.actions.setPlayerActors(
            battle.actors().actorsByTeam(BattleTeam.PLAYER).map(actor => ({
                id: actor.id(),
                face: actor.face(),
                name: actor.name(),
                currentHealth: actor.state.health,
                maxHealth: actor.state.maxHealth,
            }))
        ));

        await dispatch(battleSlice.actions.setEnemyActors(
            battle.actors().actorsByTeam(BattleTeam.ENEMY).map(actor => ({
                id: actor.id(),
                face: actor.face(),
                name: actor.name(),
                currentHealth: actor.state.health,
                maxHealth: actor.state.maxHealth,
            }))
        ));

        await dispatch(battleSlice.actions.setEvents(
            battle.getEvents().map(event => {
                if (event instanceof BattleDamageEvent) {
                    return {
                        type: "damage",
                        actorId: event.actor.id(),
                        targetId: event.target.id(),
                        np: event.reference.attack.np,
                        card: event.reference.attack.card,
                        num: event.reference.attack.num,
                        damage: event.reference.damage,
                        npGainedOnAttack: event.reference.npGainedOnAttack,
                        npGainedOnDefence: event.reference.npGainedOnDefence,
                        stars: event.reference.stars,
                    };
                } else {
                    throw Error('Unhandled event type');
                }
            })
        ));
    };
};
