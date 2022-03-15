import { Card } from "@atlasacademy/api-connector";
import { BattleTeam } from "@atlasacademy/battle";

import BattleManager from "../../paper-moon/BattleManager";
import { AppThunk } from "../store";
import castBattleEvent from "./castBattleEvent";
import { battleSlice } from "./slice";
import { BattleStateActorSkill } from "./types";

export const battleQueueAttack = (actorId: number, card: Card): AppThunk => {
    return async (dispatch, getState) => {
        let state = getState();
        if (!state.battle.playerAttacking) {
            await dispatch(battleSlice.actions.startPlayerAttacking());
        }

        await dispatch(
            battleSlice.actions.queueAction({
                actorId,
                card,
            })
        );

        // refresh state
        state = getState();
        if (state.battle.queuedAttacks.length < 3) return;

        await dispatch(battleSlice.actions.stopPlayerAction());
        BattleManager.battle().clearEvents();
        await BattleManager.attack(state.battle.queuedAttacks);
        await dispatch(battleSyncThunk());
    };
};

export const battleTriggerSkillThunk = (actorId: number, skillPosition: number): AppThunk => {
    return async (dispatch, getState) => {
        const battle = BattleManager.battle(),
            actor = battle.getActor(actorId);

        if (!actor || !actor.isAlive()) return;

        const skill = actor.skill(skillPosition);
        if (!skill || !skill.available()) return;

        battle.clearEvents();
        await skill.activate(battle);
        await dispatch(battleSyncThunk());
    };
};

export const battleStartThunk = (): AppThunk => {
    return async (dispatch) => {
        await dispatch(battleSlice.actions.startBattle());
        await BattleManager.setup();
        await BattleManager.start();
        await dispatch(battleSyncThunk());
        await dispatch(battleSlice.actions.startPlayerTurn());
    };
};

export const battleSyncThunk = (): AppThunk => {
    return async (dispatch) => {
        const battle = BattleManager.battle();

        await dispatch(
            battleSlice.actions.setPlayerActors(
                battle
                    .actors()
                    .actorsByTeam(BattleTeam.PLAYER)
                    .map((actor) => ({
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
            )
        );

        await dispatch(
            battleSlice.actions.setEnemyActors(
                battle
                    .actors()
                    .actorsByTeam(BattleTeam.ENEMY)
                    .map((actor) => ({
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
            )
        );

        const skills: BattleStateActorSkill[] = [];
        battle
            .actors()
            .all()
            .forEach((actor) => {
                for (let i = 1; i <= 3; i++) {
                    const skill = actor.skill(i);
                    if (!skill) continue;

                    skills.push({
                        actorId: actor.id(),
                        position: i,
                        name: skill.name(),
                        icon: skill.icon(),
                        available: skill.available(),
                        cooldown: skill.cooldown(),
                    });
                }
            });

        await dispatch(battleSlice.actions.setActorSkills(skills));
        await dispatch(battleSlice.actions.setEvents(battle.getEvents().map(castBattleEvent)));
    };
};
