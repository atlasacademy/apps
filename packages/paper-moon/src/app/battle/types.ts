export interface BattleStateActor {
    id: number,
    name: string,
    face?: string,
}

export interface BattleState {
    running: boolean,
    playerActors: BattleStateActor[],
    enemyActors: BattleStateActor[],
}
