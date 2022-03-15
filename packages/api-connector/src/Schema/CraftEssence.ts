import { Entity, EntityBasic, EntityType } from "./Entity";
import { Profile } from "./Profile";

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
