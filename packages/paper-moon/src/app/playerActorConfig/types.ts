export interface PlayerActorConfigServantOptions {
    name: string;
    level: string | number;
}

export interface PlayerActorConfigState {
    open: boolean;
    loading: boolean;
    ready: boolean;
    servant?: number;
    servantOptions: PlayerActorConfigServantOptions;
    defaultServantOptions: PlayerActorConfigServantOptions;
    craftEssence?: number;
}
