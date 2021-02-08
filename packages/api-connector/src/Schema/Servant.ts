import {Entity, EntityBasic, EntityType} from "./Entity";
import {Profile} from "./Profile";
import {Trait} from "./Trait";

interface ServantAscensionAdditionDetails<T> {
    ascension: {
        [key: number]: T;
    }
    costume: {
        [key: number]: T;
    }
}

export interface ServantAscensionAdditions {
    individuality: ServantAscensionAdditionDetails<Trait[]>;
    voicePrefix: ServantAscensionAdditionDetails<number>;
    overWriteServantName: ServantAscensionAdditionDetails<string>;
    overWriteServantBattleName: ServantAscensionAdditionDetails<string>;
    overWriteTDName: ServantAscensionAdditionDetails<string>;
    overWriteTDRuby: ServantAscensionAdditionDetails<string>;
    overWriteTDFileName: ServantAscensionAdditionDetails<string>;
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
