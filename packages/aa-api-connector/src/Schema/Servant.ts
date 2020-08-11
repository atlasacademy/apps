import EntityType from "../Enum/EntityType";
import BaseEntity from "./BaseEntity";
import Profile from "./Profile";

interface Servant extends BaseEntity {
    type: EntityType.NORMAL | EntityType.HEROINE;
    profile?: Profile,
}

export default Servant;
