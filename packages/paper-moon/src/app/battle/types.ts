export interface BattleStateActor {
    id: number,
}

export interface BattleState {
    running: boolean,
    playerActors: BattleStateActor[],
    enemyActors: BattleStateActor[],
}
