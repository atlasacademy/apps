import EntityType from "../Enum/EntityType";
import BaseEntityBasic from "./BaseEntityBasic";

interface CraftEssenceBasic extends BaseEntityBasic {
    type: EntityType.SERVANT_EQUIP;
}

export default CraftEssenceBasic;
