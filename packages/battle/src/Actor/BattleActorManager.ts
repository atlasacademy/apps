import { Func } from "@atlasacademy/api-connector";

import { Battle } from "../Battle";
import { BattleTeam } from "../Enum/BattleTeam";
import { BattleActor } from "./BattleActor";

export enum BattleSelectType {
    ACTIVE,
    SELECT,
    RESERVE,
}

export interface BattleActorManagerState {
    actors: BattleActor[];
    enemySelect: number;
    enemyTarget: number;
    playerSelect: number;
    playerSelectReserve: number;
    playerTarget: number;
}

export default class BattleActorManager {
    public state: BattleActorManagerState;

    constructor(state: BattleActorManagerState | null) {
        this.state = state ?? {
            actors: [],
            enemySelect: 0,
            enemyTarget: 0,
            playerSelect: 0,
            playerSelectReserve: 0,
            playerTarget: 0,
        };
    }

    clone(): BattleActorManager {
        return new BattleActorManager({
            ...this.state,
            actors: this.state.actors.map((actor) => actor.clone()),
        });
    }

    activeActorsByTeam(team: BattleTeam): BattleActor[] {
        return this.aliveActorsByTeam(team).filter((actor) => actor.state.position > 0 && actor.state.position <= 3);
    }

    actorById(id: number): BattleActor | undefined {
        return this.state.actors.filter((actor) => actor.props.id === id).shift();
    }

    actorByPosition(team: BattleTeam, position: number): BattleActor | undefined {
        return this.aliveActorsByTeam(team)
            .filter((actor) => actor.state.position === position)
            .shift();
    }

    actorsByTeam(team: BattleTeam): BattleActor[] {
        return this.state.actors
            .filter((actor) => actor.props.team === team)
            .sort((a, b) => a.state.position - b.state.position);
    }

    add(actor: BattleActor) {
        actor.state.position = this.reserveActorsByTeam(actor.props.team, actor.props.phase).length + 4;

        this.state.actors.push(actor);
        this.resetPositions();
        this.resetSelection();
    }

    all(): BattleActor[] {
        return this.state.actors;
    }

    aliveActorsByTeam(team: BattleTeam): BattleActor[] {
        return this.actorsByTeam(team).filter((actor) => actor.isAlive());
    }

    getActiveTarget(actor: BattleActor): BattleActor | undefined {
        const team = actor.props.team,
            opponentTeam = team === BattleTeam.PLAYER ? BattleTeam.ENEMY : BattleTeam.PLAYER;

        let position: number;
        switch (team) {
            case BattleTeam.PLAYER:
                position = this.state.enemyTarget;
                break;
            case BattleTeam.ENEMY:
                position = this.state.playerTarget;
                break;
        }

        return this.actorByPosition(opponentTeam, position);
    }

    getTargets(actor: BattleActor, targetType: Func.FuncTargetType): BattleActor[] {
        const targets: (BattleActor | undefined)[] = [],
            team = actor.props.team,
            opponentTeam = team === BattleTeam.PLAYER ? BattleTeam.ENEMY : BattleTeam.PLAYER,
            targetOpponent = team === BattleTeam.PLAYER ? this.state.playerTarget : this.state.enemyTarget,
            targetOpponentActor = this.actorByPosition(opponentTeam, targetOpponent),
            targetAlly = team === BattleTeam.PLAYER ? this.state.playerSelect : this.state.enemySelect,
            targetAllyActor = this.actorByPosition(team, targetAlly),
            targetAllySubActor = this.actorByPosition(team, this.state.playerSelectReserve);

        switch (targetType) {
            case Func.FuncTargetType.SELF:
                targets.push(this.actorById(actor.props.id));
                break;
            case Func.FuncTargetType.PT_ONE:
            case Func.FuncTargetType.PT_RANDOM:
                targets.push(targetAllyActor);
                break;
            case Func.FuncTargetType.PT_ALL:
                targets.push(...this.activeActorsByTeam(team));
                break;
            case Func.FuncTargetType.ENEMY:
            case Func.FuncTargetType.ENEMY_RANDOM:
                targets.push(targetOpponentActor);
                break;
            case Func.FuncTargetType.ENEMY_ALL:
                targets.push(...this.activeActorsByTeam(opponentTeam));
                break;
            case Func.FuncTargetType.PT_FULL:
                targets.push(...this.aliveActorsByTeam(team));
                break;
            case Func.FuncTargetType.ENEMY_FULL:
                targets.push(...this.aliveActorsByTeam(opponentTeam));
                break;
            case Func.FuncTargetType.PT_OTHER:
                targets.push(...this.activeActorsByTeam(team).filter((_actor) => _actor.props.id !== actor.props.id));
                break;
            case Func.FuncTargetType.PT_ONE_OTHER:
                targets.push(
                    ...this.activeActorsByTeam(team).filter((_actor) => _actor.props.id !== targetAllyActor?.props.id)
                );
                break;
            case Func.FuncTargetType.ENEMY_OTHER:
                targets.push(
                    ...this.activeActorsByTeam(team).filter(
                        (_actor) => _actor.props.id !== targetOpponentActor?.props.id
                    )
                );
                break;
            case Func.FuncTargetType.PT_OTHER_FULL:
                targets.push(...this.aliveActorsByTeam(team).filter((_actor) => _actor.props.id !== actor.props.id));
                break;
            case Func.FuncTargetType.ENEMY_OTHER_FULL:
                targets.push(
                    ...this.aliveActorsByTeam(opponentTeam).filter(
                        (_actor) => _actor.props.id !== targetOpponentActor?.props.id
                    )
                );
                break;
            case Func.FuncTargetType.PTSELECT_ONE_SUB:
                if (targetAllyActor && targetAllySubActor) targets.push(targetAllyActor, targetAllySubActor);
                break;
            case Func.FuncTargetType.PTSELECT_SUB:
                targets.push(targetAllySubActor);
                break;
            case Func.FuncTargetType.PT_SELF_ANOTHER_FIRST:
                targets.push(
                    this.activeActorsByTeam(team)
                        .filter((_actor) => _actor.props.id !== actor.props.id)
                        .shift()
                );
                break;
            case Func.FuncTargetType.PT_SELF_ANOTHER_LAST:
                targets.push(
                    this.activeActorsByTeam(team)
                        .filter((_actor) => _actor.props.id !== actor.props.id)
                        .pop()
                );
                break;
            default:
                throw new Error("UNHANDLED FuncTargetType: " + targetType);
        }

        const validTargets: BattleActor[] = [];

        targets.forEach((target) => {
            if (target !== undefined) validTargets.push(target);
        });

        return validTargets;
    }

    phase(): number {
        const enemies = this.state.actors
                .filter((actor) => actor.props.team === BattleTeam.ENEMY)
                .sort((a, b) => a.props.phase - b.props.phase),
            remainingEnemy = enemies.filter((enemy) => enemy.isAlive())[0],
            lastEnemy = enemies[enemies.length - 1];

        if (!lastEnemy) return 0;

        return remainingEnemy ? remainingEnemy.props.phase : lastEnemy.props.phase;
    }

    reserveActorsByTeam(team: BattleTeam, phase: number): BattleActor[] {
        return this.aliveActorsByTeam(team)
            .filter((actor) => actor.props.phase === phase)
            .filter((actor) => actor.state.position > 3);
    }

    setBattle(battle: Battle) {
        this.state.actors.forEach((actor) => actor.setBattle(battle));
    }

    targetEnemy(position: number, type: BattleSelectType) {
        switch (type) {
            case BattleSelectType.ACTIVE:
                this.state.enemyTarget = position;
                break;
            case BattleSelectType.SELECT:
                this.state.enemySelect = position;
                break;
        }

        this.resetSelection();
    }

    targetAlly(position: number, type: BattleSelectType) {
        switch (type) {
            case BattleSelectType.ACTIVE:
                this.state.playerTarget = position;
                break;
            case BattleSelectType.SELECT:
                this.state.playerSelect = position;
                break;
            case BattleSelectType.RESERVE:
                this.state.playerSelectReserve = position;
                break;
        }

        this.resetSelection();
    }

    private resetPositions() {
        const teams = [BattleTeam.PLAYER, BattleTeam.ENEMY];

        for (let i in teams) {
            const team = teams[i],
                phase = team === BattleTeam.PLAYER ? 1 : this.phase();

            let activeActors: BattleActor[] = this.activeActorsByTeam(team),
                reserveActors: BattleActor[] = this.reserveActorsByTeam(team, phase),
                activeActorPositions = activeActors.map((actor) => actor.state.position);

            if (activeActors.length >= 3 || reserveActors.length === 0) continue;

            for (let position = 1; position <= 3; position++) {
                if (activeActorPositions.includes(position)) continue;

                let nextActor = reserveActors.shift();
                if (!nextActor) continue;

                nextActor.state.position = position;
                for (let j = 0; j < reserveActors.length; j++) {
                    reserveActors[j].state.position = j + 4;
                }
            }
        }
    }

    private resetSelection() {
        const enemyPositions = this.activeActorsByTeam(BattleTeam.ENEMY).map((actor) => actor.state.position),
            newEnemyPosition = enemyPositions[0],
            playerPositions = this.activeActorsByTeam(BattleTeam.PLAYER).map((actor) => actor.state.position),
            newPlayerPosition = playerPositions[0];

        if (!this.state.enemySelect || !enemyPositions.includes(this.state.enemySelect))
            this.state.enemySelect = newEnemyPosition;
        if (!this.state.enemyTarget || !enemyPositions.includes(this.state.enemyTarget))
            this.state.enemyTarget = newEnemyPosition;
        if (!this.state.playerSelect || !playerPositions.includes(this.state.playerSelect))
            this.state.playerSelect = newPlayerPosition;
        if (!this.state.playerTarget || !playerPositions.includes(this.state.playerTarget))
            this.state.playerTarget = newPlayerPosition;

        if (this.state.playerSelectReserve) {
            const actor = this.actorByPosition(BattleTeam.PLAYER, this.state.playerSelectReserve);
            if (!actor) this.state.playerSelectReserve = 0;
        }

        if (!this.state.playerSelectReserve && this.actorByPosition(BattleTeam.PLAYER, 4)) {
            this.state.playerSelectReserve = 4;
        }
    }
}
