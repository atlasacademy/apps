import ClassName from "./ClassName";
import EntityType from "./EntityType";

interface BasicListEntity {
    id: number;
    collectionNo: number;
    type: EntityType;
    name: string;
    className: ClassName;
    rarity: number;
    face: string;
}

export default BasicListEntity;
