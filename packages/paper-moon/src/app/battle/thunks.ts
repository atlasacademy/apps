import {BattleTeam} from "@atlasacademy/battle";
import {Card} from "@atlasacademy/api-connector";
import BattleBuffEvent from "@atlasacademy/battle/dist/Event/BattleBuffEvent";
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
        await dispatch(battleSyncThunk());
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
                team: actor.team(),
                name: actor.name(),
                currentHealth: actor.state.health,
                maxHealth: actor.state.maxHealth,
                currentGauge: actor.state.gauge,
                gaugeLineCount: actor.props.gaugeLineCount,
                gaugeLineMax: actor.props.gaugeLineMax,
            }))
        ));

        await dispatch(battleSlice.actions.setEnemyActors(
            battle.actors().actorsByTeam(BattleTeam.ENEMY).map(actor => ({
                id: actor.id(),
                face: actor.face(),
                team: actor.team(),
                name: actor.name(),
                currentHealth: actor.state.health,
                maxHealth: actor.state.maxHealth,
                currentGauge: actor.state.gauge,
                gaugeLineCount: actor.props.gaugeLineCount,
                gaugeLineMax: actor.props.gaugeLineMax,
            }))
        ));

        await dispatch(battleSlice.actions.setEvents(
            battle.getEvents().map(event => {
                if (event instanceof BattleBuffEvent) {
                    let descriptionParts = [];

                    descriptionParts.push(`(${event.actor.id()}) ${event.actor.name()}`);
                    if (!event.success) descriptionParts.push('failed to');
                    descriptionParts.push(`applied buff ${event.reference.name()}`);
                    if (event.actor.id() !== event.target.id()) {
                        descriptionParts.push(`to (${event.target.id()}) ${event.target.name()}`);
                    }

                    return {
                        actorId: event.actor.id(),
                        targetId: event.target.id(),
                        description: descriptionParts.join(' '),
                    };
                } else if (event instanceof BattleDamageEvent) {
                    let descriptionParts = [];

                    descriptionParts.push(`(${event.actor.id()}) ${event.actor.name()}`);
                    descriptionParts.push(`dealt ${event.reference.damage}`);
                    descriptionParts.push(`to (${event.target.id()}) ${event.target.name()}`);

                    if (event.reference.attack.np)
                        descriptionParts.push('with NP');
                    else
                        descriptionParts.push(`with ${event.reference.attack.card.toUpperCase()} Card #${event.reference.attack.num}`);

                    let gained = [];
                    if (event.reference.npGainedOnAttack > 0)
                        gained.push(`${event.reference.npGainedOnAttack/100}% NP`);
                    if (event.reference.stars > 0)
                        gained.push(`${event.reference.stars} star(s)`);

                    if (gained.length)
                        descriptionParts.push(`and gained ${gained.join(' and ')}`);

                    if (event.reference.npGainedOnDefence > 0)
                        descriptionParts.push(`and target gained ${event.reference.npGainedOnDefence/100}% NP`);

                    return {
                        actorId: event.actor.id(),
                        targetId: event.target.id(),
                        description: descriptionParts.join(' '),
                    };
                } else {
                    return {
                        actorId: event.actor?.id(),
                        targetId: event.target?.id(),
                        description: `${event.constructor.name}`,
                    }
                }
            })
        ));
    };
};
