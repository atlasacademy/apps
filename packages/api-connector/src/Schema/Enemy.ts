import {Entity, EntityType} from "./Entity";

export interface Enemy extends Entity {
    type: EntityType.ENEMY;
}
