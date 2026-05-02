import { Entity, EntityBasic, EntityType } from "./Entity.js";
import { Profile } from "./Profile.js";

export interface CraftEssence extends Entity {
    type: EntityType.SERVANT_EQUIP;
    bondEquipOwner?: number;
    valentineEquipOwner?: number;
    profile?: Profile;
}

export interface CraftEssenceBasic extends EntityBasic {
    type: EntityType.SERVANT_EQUIP;
    bondEquipOwner?: number;
    valentineEquipOwner?: number;
}
