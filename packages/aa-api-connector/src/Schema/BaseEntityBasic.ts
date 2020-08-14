import ClassName from "../Enum/ClassName";
import EntityType from "../Enum/EntityType";

interface BaseEntityBasic {
    id: number,
    collectionNo: number;
    name: string;
    type: EntityType;
    className: ClassName;
    rarity: number;
    face: string;
}

export default BaseEntityBasic;
