import { Battle } from "../Battle";
import { BattleTeam } from "../Enum/BattleTeam";
import { BattleCommandAction, BattleCommandActionFactory } from "./BattleCommandAction";

const targetAllyMap = new Map<number, BattleCommandAction>([
        [1, BattleCommandAction.TARGET_ALLY_1],
        [2, BattleCommandAction.TARGET_ALLY_2],
        [3, BattleCommandAction.TARGET_ALLY_3],
    ]),
    targetAllySelectMap = new Map<number, BattleCommandAction>([
        [1, BattleCommandAction.TARGET_ALLY_SELECT_1],
        [2, BattleCommandAction.TARGET_ALLY_SELECT_2],
        [3, BattleCommandAction.TARGET_ALLY_SELECT_3],
    ]),
    targetAllyReserveMap = new Map<number, BattleCommandAction>([
        [4, BattleCommandAction.TARGET_ALLY_RESERVE_1],
        [5, BattleCommandAction.TARGET_ALLY_RESERVE_2],
        [6, BattleCommandAction.TARGET_ALLY_RESERVE_3],
    ]),
    targetEnemyMap = new Map<number, BattleCommandAction>([
        [1, BattleCommandAction.TARGET_ENEMY_1],
        [2, BattleCommandAction.TARGET_ENEMY_2],
        [3, BattleCommandAction.TARGET_ENEMY_3],
    ]),
    targetEnemySelectMap = new Map<number, BattleCommandAction>([
        [1, BattleCommandAction.TARGET_ENEMY_SELECT_1],
        [2, BattleCommandAction.TARGET_ENEMY_SELECT_2],
        [3, BattleCommandAction.TARGET_ENEMY_SELECT_3],
    ]);

export default function (battle: Battle): BattleCommandAction[] {
    const available: BattleCommandAction[] = [],
        allyPositions = battle
            .actors()
            .aliveActorsByTeam(BattleTeam.PLAYER)
            .map((actor) => actor.position()),
        enemyPositions = battle
            .actors()
            .aliveActorsByTeam(BattleTeam.ENEMY)
            .map((actor) => actor.position());

    allyPositions.forEach((position) => {
        let action;

        action = targetAllyMap.get(position);
        if (action) available.push(action);

        action = targetAllySelectMap.get(position);
        if (action) available.push(action);

        action = targetAllyReserveMap.get(position);
        if (action) available.push(action);
    });

    enemyPositions.forEach((position) => {
        let action;

        action = targetEnemyMap.get(position);
        if (action) available.push(action);

        action = targetEnemySelectMap.get(position);
        if (action) available.push(action);
    });

    battle
        .actors()
        .activeActorsByTeam(BattleTeam.PLAYER)
        .forEach((actor) => {
            for (let pos = 1; pos <= 3; pos++) {
                const skill = actor.skill(pos);
                if (!skill || !skill.available()) continue;

                const action = BattleCommandActionFactory.servantSkillAction(actor.position(), pos);
                if (action) available.push(action);
            }
        });

    return available.sort((a, b) => {
        return a > b ? 1 : -1;
    });
}
