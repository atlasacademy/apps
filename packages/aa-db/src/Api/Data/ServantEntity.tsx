import Attribute from "./Attribute";
import ClassName from "./ClassName";
import Gender from "./Gender";
import ServantAsset from "./ServantAsset";
import ServantType from "./ServantType";

interface ServantEntity {
    id: number;
    collectionNo: number;
    name: string;
    className: ClassName;
    type: ServantType;
    rarity: number;
    cost: number;
    lvMax: number;
    extraAssets: ServantAsset;
    gender: Gender;
    attribute: Attribute;
}

export default ServantEntity;
