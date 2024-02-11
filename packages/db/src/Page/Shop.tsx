import { Tab, Tabs, Table } from "react-bootstrap"
import { Region, Shop, Item } from "@atlasacademy/api-connector";

import useShop from "../Hooks/useShop";
import EntityReferenceDescriptor from "../Descriptor/EntityReferenceDescriptor";
import ItemSetDescriptor from "../Descriptor/ItemSetDescriptor";
import { CommandCodeDescriptorId } from "../Descriptor/CommandCodeDescriptor";
import ItemDescriptor, { ItemDescriptorId } from "../Descriptor/ItemDescriptor";

interface Props {
    region: Region
}

interface PropsShopRows {
    shop: Shop.Shop
    region: Region
    itemMap: Map<number, Item.Item>
}

const ShopRow: React.FC<PropsShopRows> = ({ shop, region, itemMap = new Map()}) => {
    switch (shop.purchaseType) {
        case Shop.PurchaseType.SET_ITEM:
            const ItemSets = shop.itemSet.map((set) => {
                return (
                    <li>
                        <ItemSetDescriptor itemSet={set} itemMap={itemMap} region={region} key={set.targetId} />
                    </li>
                )
            })
            
            return (
                <tr>
                    <td style={{ width: "33%" }}>
                        <img src={shop.image} alt={shop.name} width="45px" height="45px" /> {shop.name}
                        <ul>
                            {ItemSets}
                        </ul>
                    </td>
                    <td style={{ width: "33%" }}>
                        None
                    </td>
                    <td style={{ width: "33%" }}>
                        <ItemDescriptor item={shop.cost.item} quantity={shop.cost.amount} region={region} height={60} />
                    </td>
                </tr>
            )
        case Shop.PurchaseType.ITEM:
            const Items = shop.targetIds.map(itemId => <ItemDescriptorId height={45} region={Region.JP} itemId={itemId} quantity={shop.limitNum} />)
            
            return (
                <tr>
                    <td style={{ width: "33%" }}>
                        {Items}
                    </td>
                    <td style={{ width: "33%" }}>
                        None
                    </td>
                    <td style={{ width: "33%" }}>
                        <ItemDescriptor item={shop.cost.item} quantity={shop.cost.amount} region={region} height={60} />
                    </td>
                </tr>
            )
        case Shop.PurchaseType.COMMAND_CODE:
            const commandsCodes = shop.targetIds.map((id) => <CommandCodeDescriptorId ccId={id} region={region} />)

            return (
                <tr>
                    <td style={{ width: "33%" }}>
                        {commandsCodes}
                    </td>
                    <td style={{ width: "33%" }}>
                        None
                    </td>
                    <td style={{ width: "33%" }}>
                        <ItemDescriptor item={shop.cost.item} quantity={shop.cost.amount} region={region} height={60} />
                    </td>
                </tr>
            )
        default:
            const entities = shop.targetIds.map((id) => <EntityReferenceDescriptor region={region} svtId={id} />)
            
            return (
                <tr>
                    <td style={{ width: "33%" }}>
                        {entities}
                    </td>
                    <td style={{ width: "33%" }}>
                        None
                    </td>
                    <td style={{ width: "33%" }}>
                        <ItemDescriptor item={shop.cost.item} quantity={shop.cost.amount} region={region} height={60} />
                    </td>
                </tr>
            )
    }
}

const ShopPage: React.FC<Props> = ({ region }) => {
   const { SelectShopEvent, currentShop, itemCache } = useShop()

    return (
        <main>
            <h1>Shops</h1>
            <Tabs onSelect={SelectShopEvent} className="mt-4" defaultActiveKey="mana" id="shops">
                <Tab eventKey="mana" title="Shop Prisma">
                    <Table className="mt-4" striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th style={{ width: "33%" }}>Item</th>
                                <th style={{ width: "33%" }}>Requeriments</th>
                                <th style={{ width: "33%" }}>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentShop.shops.map((shop) => <ShopRow region={region} shop={shop} key={shop.id} itemMap={itemCache} />)}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </main>
    )
}

export default ShopPage