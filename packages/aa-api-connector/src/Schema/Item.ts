import ItemBackgroundType from "../Enum/ItemBackgroundType";
import ItemType from "../Enum/ItemType";

interface Item {
    id: number;
    name: string;
    type: ItemType;
    icon: string;
    background: ItemBackgroundType;
}

export default Item;
