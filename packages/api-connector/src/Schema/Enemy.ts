import { Entity, EntityBasic, EntityType } from "./Entity";

export interface Enemy extends Entity {
    type: EntityType.ENEMY;
}

export interface EnemyBasic extends EntityBasic {
    type: EntityType.ENEMY;
}
