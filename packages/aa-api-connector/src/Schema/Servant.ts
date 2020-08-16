import {Entity, EntityBasic, EntityType} from "./Entity";
import {Profile} from "./Profile";

export interface Servant extends Entity {
    type: EntityType.NORMAL | EntityType.HEROINE;
    profile?: Profile,
}

export interface ServantBasic extends EntityBasic {
    type: EntityType.NORMAL | EntityType.HEROINE;
}
