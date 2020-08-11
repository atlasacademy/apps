import EntityType from "../Enum/EntityType";
import BaseEntity from "./BaseEntity";
import Profile from "./Profile";

interface CraftEssence extends BaseEntity {
    type: EntityType.SERVANT_EQUIP;
    profile?: Profile;
}

export default CraftEssence;
