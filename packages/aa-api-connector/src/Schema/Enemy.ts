import EntityType from "../Enum/EntityType";
import BaseEntity from "./BaseEntity";

interface Enemy extends BaseEntity {
    type: EntityType.ENEMY;
}

export default Enemy;
