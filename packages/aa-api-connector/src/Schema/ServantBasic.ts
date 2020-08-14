import EntityType from "../Enum/EntityType";
import BaseEntityBasic from "./BaseEntityBasic";

interface ServantBasic extends BaseEntityBasic {
    type: EntityType.NORMAL | EntityType.HEROINE;
}

export default ServantBasic;
