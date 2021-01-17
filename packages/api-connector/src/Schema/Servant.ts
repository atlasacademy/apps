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
    };
    voicePrefix: {
        ascension?: {
            [key: number]: number;
        }
        costume?: {
            [key: number]: number;
        }
    }
}

export interface ServantScript {
    SkillRankUp?: {
        [key: number]: number[];
    }
}

export interface Servant extends Entity {
    type: EntityType.NORMAL | EntityType.HEROINE | EntityType.ENEMY_COLLECTION_DETAIL;
    ascensionAdd: ServantAscensionAdditions;
    script: ServantScript;
    profile?: Profile,
}

export interface ServantBasic extends EntityBasic {
    type: EntityType.NORMAL | EntityType.HEROINE | EntityType.ENEMY_COLLECTION_DETAIL;
}
