export interface EnemyActorConfigServantOptions {
    name: string;
}

export interface EnemyActorConfigState {
    open: boolean;
    loading: boolean;
    servant?: number;
    servantOptions?: EnemyActorConfigServantOptions;
}
