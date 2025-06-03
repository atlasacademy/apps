import { Fragment, useState } from "react";
import { Button, Tab, Table, Tabs } from "react-bootstrap";

import { Item, Region, Shop } from "@atlasacademy/api-connector";

import { CommandCodeDescriptorId } from "../Descriptor/CommandCodeDescriptor";
import EntityReferenceDescriptor from "../Descriptor/EntityReferenceDescriptor";
import ItemDescriptor, { ItemDescriptorId } from "../Descriptor/ItemDescriptor";
import ItemSetDescriptor from "../Descriptor/ItemSetDescriptor";
import usePaginator from "../Hooks/usePaginator";
import useShop from "../Hooks/useShop";

interface Props {
    region: Region;
}

interface PropsShopRows {
    shop: Shop.Shop;
    region: Region;
    itemMap: Map<number, Item.Item>;
}

const ShopRow: React.FC<PropsShopRows> = ({ shop, region, itemMap = new Map() }) => {
    switch (shop.purchaseType) {
        case Shop.PurchaseType.SET_ITEM:
            const ItemSets = shop.itemSet.map((set) => {
                return (
                    <li>
                        <ItemSetDescriptor itemSet={set} itemMap={itemMap} region={region} key={set.targetId} />
                    </li>
                );
            });

            return (
                <tr>
                    <td style={{ width: "33%" }}>
                        <img src={shop.image} alt={shop.name} width="45px" height="45px" /> {shop.name}
                        <ul>{ItemSets}</ul>
                    </td>
                    <td style={{ width: "33%" }}>None</td>
                    <td style={{ width: "33%" }}>
                        <ItemDescriptor item={shop.cost.item} quantity={shop.cost.amount} region={region} height={60} />
                    </td>
                </tr>
            );
        case Shop.PurchaseType.ITEM:
            const Items = shop.targetIds.map((itemId) => (
                <ItemDescriptorId height={45} region={Region.JP} itemId={itemId} quantity={shop.limitNum} />
            ));

            return (
                <tr>
                    <td style={{ width: "33%" }}>{Items}</td>
                    <td style={{ width: "33%" }}>None</td>
                    <td style={{ width: "33%" }}>
                        <ItemDescriptor item={shop.cost.item} quantity={shop.cost.amount} region={region} height={60} />
                    </td>
                </tr>
            );
        case Shop.PurchaseType.COMMAND_CODE:
            const commandsCodes = shop.targetIds.map((id) => <CommandCodeDescriptorId ccId={id} region={region} />);

            return (
                <tr>
                    <td style={{ width: "33%" }}>{commandsCodes}</td>
                    <td style={{ width: "33%" }}>None</td>
                    <td style={{ width: "33%" }}>
                        <ItemDescriptor item={shop.cost.item} quantity={shop.cost.amount} region={region} height={60} />
                    </td>
                </tr>
            );
        default:
            const entities = shop.targetIds.map((id) => {
                console.log(shop);

                if (id === 0) {
                    return (
                        <Fragment>
                            <img src={shop.image} width={128} height={128} alt={shop.name} />
                            <span className="hover-text">{shop.name}</span>
                        </Fragment>
                    );
                } else {
                    return <EntityReferenceDescriptor region={region} svtId={id} />;
                }
            });

            return (
                <tr>
                    <td style={{ width: "33%" }}>{entities}</td>
                    <td style={{ width: "33%" }}>None</td>
                    <td style={{ width: "33%" }}>
                        <ItemDescriptor item={shop.cost.item} quantity={shop.cost.amount} region={region} height={60} />
                    </td>
                </tr>
            );
    }
};

interface ShopTableProps {
    shops: Shop.Shop[];
    region: Region;
    itemCache: Map<number, Item.Item>;
}

const ShopTable: React.FC<ShopTableProps> = ({ shops, itemCache, region }) => {
    return (
        <Table className="mt-4" striped bordered hover responsive>
            <thead>
                <tr>
                    <th style={{ width: "33%" }}>Item</th>
                    <th style={{ width: "33%" }}>Requeriments</th>
                    <th style={{ width: "33%" }}>Cost</th>
                </tr>
            </thead>
            <tbody>
                {shops.map((shop) => (
                    <ShopRow region={region} shop={shop} key={shop.id} itemMap={itemCache} />
                ))}
            </tbody>
        </Table>
    );
};

const ShopPage: React.FC<Props> = ({ region }) => {
    const [availableActive, setAvailableActive] = useState(true);
    const { SelectShopEvent, currentShop, itemCache } = useShop({ selectEventCallback });

    const btnStyle = availableActive ? "success" : "danger";
    const now = Date.now() / 1000;
    const filteredShops = currentShop.shops
        .filter((shop) => !availableActive || (shop.openedAt <= now && shop.closedAt >= now))
        .sort((a, b) => b.openedAt - a.openedAt);

    const {
        items: shops,
        Paginator,
        goToPage,
    } = usePaginator<Shop.Shop>(filteredShops, { itemsPerPage: 20, maxVisibleButtons: 10 });

    function selectEventCallback() {
        goToPage(1); // Reset paginator when change tabs
    }

    return (
        <main>
            <h1>Davinci Shop</h1>

            <section className="d-flex align-items-center justify-content-between w-full my-4">
                <Button onClick={() => setAvailableActive(!availableActive)} variant={btnStyle}>
                    Available
                </Button>
                <Paginator />
            </section>

            <Tabs onSelect={SelectShopEvent} className="mt-4" defaultActiveKey="mana" id="shops">
                <Tab eventKey="mana" title="Shop Prisma">
                    <ShopTable itemCache={itemCache} shops={shops} region={region} />
                </Tab>
                <Tab eventKey="rarePri" title="Shop Rare Prisma">
                    <ShopTable itemCache={itemCache} shops={shops} region={region} />
                </Tab>
            </Tabs>
        </main>
    );
};

export default ShopPage;
