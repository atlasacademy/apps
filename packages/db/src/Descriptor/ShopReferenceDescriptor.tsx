import useApi from "../Hooks/useApi";
import { Region, Shop } from "@atlasacademy/api-connector";
import { Item } from "@atlasacademy/api-connector";
import CondTargetNumDescriptor from "./CondTargetNumDescriptor";
import ItemDescriptor from "./ItemDescriptor";
import ShopPurchaseDescriptor from "./ShopPurchaseDescriptor";

interface Props {
    shopId: number;
    region: Region;
    itemMap?: Map<number, Item.Item>;
    shopParent?: Shop.Shop;
}

const ShopReferenceDescriptor: React.FC<Props> = ({ shopId, region, itemMap, shopParent }) => {
    const { data: shop } = useApi("shop", shopId);

    if (itemMap && shopParent && shop) {
        const conditions = shop.releaseConditions.map((condition) => (
            <CondTargetNumDescriptor
                region={region}
                cond={condition.condType}
                num={condition.condNum}
                targets={condition.condValues}
                shop={shop}
                items={itemMap}
            />
        ));


        return (
            <table>
                <tr>
                    <th colSpan={2}>
                        <ShopPurchaseDescriptor shop={shop} region={region} itemMap={itemMap} />
                    </th>
                </tr>
                <tr>
                    <td style={{ width: "50%" }}>
                        {conditions}
                    </td>
                    <td style={{ width: "50%" }}>
                        <ItemDescriptor item={shop.cost.item} quantity={shop.cost.amount} region={region} height={60} />
                    </td>
                </tr>
            </table>
        )
    } else if (shop) {
        return (
            <span>{shop.name}</span>
        )
    }

    return null;
};

export default ShopReferenceDescriptor;
