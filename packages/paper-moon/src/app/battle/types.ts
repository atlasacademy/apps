import {Card} from "@atlasacademy/api-connector";

export interface BattleStateActor {
    id: number,
    name: string,
    face?: string,
    currentHealth: number,
    maxHealth: number,
}

export interface BattleQueuedAttack {
    actorId: number,
    card: Card
}

export type BattleEvent = {
    type: 'damage',
    actorId: number,
    targetId: number,
    np: boolean,
    card: Card,
    num: number,
    damage: number,
    npGainedOnAttack: number,
    npGainedOnDefence: number,
    stars: number,
}

export interface BattleState {
    running: boolean,
    playerActing: boolean,
    playerAttacking: boolean,
    playerTurn: boolean,
    playerActors: BattleStateActor[],
    enemyActors: BattleStateActor[],
    queuedAttacks: BattleQueuedAttack[],
    events: BattleEvent[],
}
