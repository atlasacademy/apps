import {Entity, EntityBasic, EntityType} from "./Entity";
import {Profile} from "./Profile";
import {Trait} from "./Trait";

export interface ServantAscensionAdditions {
    individuality: {
        ascension?: {
            [key: number]: Trait[];
        }
        costume?: {
            [key: number]: Trait[];
        }
    }
}

export interface ServantScript {
    SkillRankUp?: {
        [key: number]: number[];
    }
}

export interface Servant extends Entity {
    type: EntityType.NORMAL | EntityType.HEROINE;
    ascensionAdd: ServantAscensionAdditions;
    script: ServantScript;
    profile?: Profile,
}

export interface ServantBasic extends EntityBasic {
    type: EntityType.NORMAL | EntityType.HEROINE;
}
