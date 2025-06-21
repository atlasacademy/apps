import useApi from "../Hooks/useApi";
import { Region, Shop } from "@atlasacademy/api-connector";
import { Item } from "@atlasacademy/api-connector";
import CondTargetNumDescriptor from "./CondTargetNumDescriptor";
import ShopPurchaseDescriptor from "./ShopPurchaseDescriptor";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import ItemDescriptor from "./ItemDescriptor";

interface Props {
    shopId: number;
    region: Region;
    itemMap?: Map<number, Item.Item>;
    shopParent?: Shop.Shop;
}

const ShopReferenceDescriptor: React.FC<Props> = ({ shopId, region, itemMap, shopParent }) => {
    const { data: shop } = useApi("shop", shopId);

    if (itemMap && shopParent && shop) {
        return <ShopPurchaseDescriptor shop={shop} region={region} itemMap={itemMap} />
    }
    
    return shop ? shop.name : "Shop " + shopId;
};

export default ShopReferenceDescriptor;
