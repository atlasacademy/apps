export interface EnemyMasterBattle {
    id: number;
    face: string;
    figure: string;
    commandSpellIcon: string;
    maxCommandSpell: number;
    offsetX: number;
    offsetY: number;
    cutin?: string[];
}

export interface EnemyMaster {
    id: number;
    name: string;
    battles: EnemyMasterBattle[];
}
