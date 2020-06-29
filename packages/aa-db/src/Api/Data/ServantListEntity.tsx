import ClassName from "./ClassName";
import ServantType from "./ServantType";

interface ServantListEntity {
    id: number;
    collectionNo: number;
    type: ServantType;
    name: string;
    className: ClassName;
    rarity: number;
    face: string;
}

export default ServantListEntity;
