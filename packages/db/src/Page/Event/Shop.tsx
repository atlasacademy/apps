import { Alert, Button, Form, InputGroup, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ItemIcon from "../../Component/ItemIcon";
import ShopPurchaseDescriptor from "../../Descriptor/ShopPurchaseDescriptor";
import { handleNewLine } from "../../Helper/OutputHelper";
import { colorString } from "../../Helper/StringHelper";
import Manager from "../../Setting/Manager";
import ScriptDescriptor from "../../Descriptor/ScriptDescriptor";
import { Item, Region, Shop } from "@atlasacademy/api-connector";

const ScriptLink = (props: { region: Region; shop: Shop.Shop }) => {
    const { region, shop } = props;
    if (shop.scriptId === undefined) return null;
    return (
        <>
            <br />
            <ScriptDescriptor
                region={region}
                scriptId={shop.scriptId}
                scriptName={shop.scriptName}
                scriptType="Valentine Script"
            />
        </>
    );
};

const IconLink = ({ region, item } : { region : Region, item : Item.Item }) => (
    <Link to={`/${region}/item/${item.id}`}>
        <ItemIcon region={region} item={item} height={40} />
    </Link>
)

interface IProps {
    region: Region,
    shops: Shop.Shop[],
    itemMap: Map<number, Item.Item>,
    filters: Map<number, number>,
    onChange?: (record : Map<number, number>) => void;
}

const ShopTab = ({ region, shops, itemMap, filters, onChange } : IProps) => {
    let shopEnabled = Manager.shopPlannerEnabled();
    let counted = shops
        .filter(shop => shopEnabled ? filters.has(shop.id) : true)
        .map(shop => [
            shop.cost.item, (shopEnabled ? filters.get(shop.id)! : shop.limitNum) * shop.cost.amount
        ] as const);

    let items = new Map(counted.map(tuple => [tuple[0].id, tuple[0]]));

    let amounts = new Map<number, number>();
    for (let [item, amount] of counted)
        if (amounts.has(item.id))
            amounts.set(item.id, (amounts.get(item.id) ?? 0) + amount);
        else
            amounts.set(item.id, amount);

    return (
        <>
            <br />
            <Alert variant="success">
                {shopEnabled
                    ? (amounts.size ? 'Total amount for chosen items: ' : 'No item was chosen. Choose at least one to get calculations.')
                    : 'Total currency amount needed to clear the shop: '}
                {[...amounts]
                    .filter(([_, amount]) => amount)
                    .map(
                    ([itemId, amount]) => (
                        <span style={{ whiteSpace: 'nowrap' }}>
                            <b>{amount.toLocaleString()}</b> <IconLink region={region} item={items.get(itemId)!} />&nbsp;
                        </span>
                    )
                )}
            </Alert>
            <Table hover responsive className="shopTable">
                <thead>
                    <tr>
                        <th style={{ textAlign: "left" }}>Detail</th>
                        <th>Currency</th>
                        <th>Cost</th>
                        <th>Item</th>
                        <th>Set</th>
                        <th>Limit</th>
                        {shopEnabled && <th>Target</th>}
                    </tr>
                </thead>
                <tbody>
                    {shops
                        .sort((a, b) => a.priority - b.priority)
                        .map((shop) => {
                            let limitNumIndicator = shopEnabled
                                ? (
                                    <Button variant="light" onClick={() => {
                                        filters.set(shop.id, shop.limitNum);
                                        onChange?.(filters);
                                    }}>
                                        {shop.limitNum.toLocaleString()}
                                    </Button>
                                )
                                : <>{shop.limitNum.toLocaleString()}</>

                            return (
                                <tr key={shop.id}>
                                    <td style={{ minWidth: "10em" }}>
                                        <b>{shop.name}</b>
                                        <div style={{ fontSize: "0.75rem" }}>
                                            {handleNewLine(
                                                colorString(shop.detail)
                                            )}
                                            <ScriptLink
                                                region={region}
                                                shop={shop}
                                            />
                                        </div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.payType !== Shop.PayType.FREE ? (
                                            <IconLink region={region} item={shop.cost.item} />
                                        ) : null}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.payType !== Shop.PayType.FREE
                                            ? shop.cost.amount.toLocaleString()
                                            : null}
                                    </td>
                                    <td>
                                        <ShopPurchaseDescriptor
                                            region={region}
                                            shop={shop}
                                            itemMap={itemMap}
                                        />
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.setNum.toLocaleString()}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.limitNum === 0 ? <>Unlimited</> : limitNumIndicator}
                                    </td>
                                    {shopEnabled && (
                                        <>
                                            <td style={{ textAlign: 'center', maxWidth: '5em' }}>
                                                <InputGroup size='sm'>
                                                    <Form.Control
                                                        type="number"
                                                        value={filters.get(shop.id) ?? 0}
                                                        min={0}
                                                        max={shop.limitNum || undefined}
                                                        onChange={event => {
                                                            let value = +event.target.value;
                                                            if (value)
                                                                filters.set(shop.id, value);
                                                            else
                                                                filters.delete(shop.id);
                                                            onChange?.(filters);
                                                        }}/>
                                                </InputGroup>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </>
    );
}

export default ShopTab;