import { Card } from "@atlasacademy/api-connector";
import { BattleTeam } from "@atlasacademy/battle";

export interface BattleStateActor {
    id: number;
    name: string;
    face?: string;
    team: BattleTeam;
    currentHealth: number;
    maxHealth: number;
    currentGauge: number;
    gaugeLineCount: number;
    gaugeLineMax: number;
}

export interface BattleStateActorSkill {
    actorId: number;
    position: number;
    name: string;
    icon?: string;
    available: boolean;
    cooldown: number;
}

export interface BattleQueuedAttack {
    actorId: number;
    card: Card;
}

export type BattleEvent = {
    actorId?: number;
    targetId?: number;
    description: string;
};

export interface BattleState {
    running: boolean;
    actorSkills: BattleStateActorSkill[];
    playerActing: boolean;
    playerAttacking: boolean;
    playerTurn: boolean;
    playerActors: BattleStateActor[];
    enemyActors: BattleStateActor[];
    queuedAttacks: BattleQueuedAttack[];
    events: BattleEvent[];
}
