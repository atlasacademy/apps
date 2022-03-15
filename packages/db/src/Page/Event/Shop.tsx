import { faEdit, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Alert, Button, ButtonGroup, Dropdown, Form, InputGroup, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Item, Region, Shop } from "@atlasacademy/api-connector";

import ItemIcon from "../../Component/ItemIcon";
import CondTargetNumDescriptor from "../../Descriptor/CondTargetNumDescriptor";
import { gemIds, magicGemIds, secretGemIds, monumentIds, pieceIds } from "../../Descriptor/MultipleDescriptors";
import ScriptDescriptor from "../../Descriptor/ScriptDescriptor";
import ShopPurchaseDescriptor from "../../Descriptor/ShopPurchaseDescriptor";
import { colorString } from "../../Helper/StringHelper";
import Manager from "../../Setting/Manager";

import "../../Helper/StringHelper.css";
import "./Shop.css";

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

const IconLink = ({ region, item }: { region: Region; item: Item.Item }) => (
    <Link to={`/${region}/item/${item.id}`}>
        <ItemIcon region={region} item={item} height={40} />
    </Link>
);

interface IProps {
    region: Region;
    shops: Shop.Shop[];
    itemMap: Map<number, Item.Item>;
    filters: Map<number, number>;
    onChange?: (record: Map<number, number>) => void;
}

const ShopTab = ({ region, shops, itemMap, filters, onChange }: IProps) => {
    let [forceEnablePlanner, setForceEnablePlanner] = useState<boolean | undefined>(undefined);
    let [itemFilters, setItemFilters] = useState(new Set<number>());

    const allItems = new Map(shops.map((shop) => [shop.cost.item.id, shop.cost.item]));

    let shopEnabled = forceEnablePlanner === undefined ? Manager.shopPlannerEnabled() : forceEnablePlanner;
    let counted = shops
        .filter((shop) => (shopEnabled ? filters.has(shop.id) : true))
        .map(
            (shop) =>
                [shop.cost.item, (shopEnabled ? filters.get(shop.id)! : shop.limitNum) * shop.cost.amount] as const
        );

    let items = new Map(counted.map((tuple) => [tuple[0].id, tuple[0]]));

    let amounts = new Map<number, number>();
    for (let [item, amount] of counted)
        if (amounts.has(item.id)) amounts.set(item.id, (amounts.get(item.id) ?? 0) + amount);
        else amounts.set(item.id, amount);

    // reset filter if nothing is chosen
    if (!amounts.size && itemFilters.size) setItemFilters(new Set());

    const excludeItemIds = (itemIds: number[]) => {
        return new Map(
            shops
                .filter((shop) => shop.payType !== Shop.PayType.FREE)
                .filter((shop) => shop.limitNum !== 0)
                .filter((shop) => !itemIds.includes(shop.targetIds[0]) || shop.purchaseType !== Shop.PurchaseType.ITEM)
                .map((shop) => [shop.id, shop.limitNum])
        );
    };

    return (
        <>
            <Alert variant="success" style={{ margin: "1em 0", display: "flex" }}>
                <div style={{ flexGrow: 1 }}>
                    {shopEnabled
                        ? amounts.size > 0
                            ? "Total amount for chosen items: "
                            : "No item was chosen. Choose at least one to get calculations."
                        : "Total currency amount needed to clear the shop: "}
                    {[...amounts]
                        .filter(([_, amount]) => amount > 0)
                        .map(([itemId, amount]) => (
                            <span style={{ whiteSpace: "nowrap", paddingRight: "1ch" }} key={itemId}>
                                <IconLink region={region} item={items.get(itemId)!} />
                                <b>x{amount.toLocaleString()}</b>
                            </span>
                        ))}
                </div>
                <div style={{ flexBasis: "auto", paddingLeft: "10px" }}>
                    <Button
                        variant={shopEnabled ? "dark" : "success"}
                        onClick={() => setForceEnablePlanner(!forceEnablePlanner)}
                    >
                        <FontAwesomeIcon icon={faEdit} title={shopEnabled ? "Disable planner" : "Enable planner"} />
                    </Button>
                </div>
            </Alert>
            {shopEnabled && (
                <>
                    <ButtonGroup>
                        <Button disabled variant="outline-dark">
                            Quick toggle
                        </Button>
                        <Button variant="outline-success" onClick={() => onChange?.(excludeItemIds([]))}>
                            All
                        </Button>
                        <Button variant="outline-success" onClick={() => onChange?.(new Map())}>
                            None
                        </Button>
                        <Dropdown as={ButtonGroup}>
                            <Dropdown.Toggle variant="outline-success">Exclude</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    as={Button}
                                    onClick={() =>
                                        onChange?.(excludeItemIds([...gemIds, ...magicGemIds, ...secretGemIds]))
                                    }
                                >
                                    Gems
                                </Dropdown.Item>
                                <Dropdown.Item
                                    as={Button}
                                    onClick={() => onChange?.(excludeItemIds([...monumentIds, ...pieceIds]))}
                                >
                                    Monuments & Pieces
                                </Dropdown.Item>
                                <Dropdown.Item as={Button} onClick={() => onChange?.(excludeItemIds(monumentIds))}>
                                    Monuments
                                </Dropdown.Item>
                                <Dropdown.Item as={Button} onClick={() => onChange?.(excludeItemIds(pieceIds))}>
                                    Pieces
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </ButtonGroup>
                    <div>&nbsp;</div>
                </>
            )}
            <Table hover responsive className="shopTable">
                <thead>
                    <tr>
                        <th style={{ textAlign: "left" }}>Detail</th>
                        <th style={{ whiteSpace: "nowrap" }}>
                            Currency&nbsp;
                            <Dropdown as={ButtonGroup}>
                                <Dropdown.Toggle size="sm">
                                    <FontAwesomeIcon style={{ display: "inline" }} icon={faFilter} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {/* Actually a checkbox is the best here */}
                                    <Dropdown.Item
                                        as={Button}
                                        onClick={() => {
                                            setItemFilters(new Set());
                                        }}
                                    >
                                        Reset
                                    </Dropdown.Item>
                                    {[...allItems].map(([itemId, item]) => (
                                        <Dropdown.Item
                                            key={item.id}
                                            as={Button}
                                            onClick={() => {
                                                setItemFilters(new Set([itemId]));
                                            }}
                                        >
                                            <ItemIcon region={region} item={item} height={40} />
                                            {item.name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </th>
                        <th>Cost</th>
                        <th>Item</th>
                        <th>Release Conditions</th>
                        <th>Set</th>
                        <th>Limit</th>
                        {shopEnabled && <th>Target</th>}
                    </tr>
                </thead>
                <tbody>
                    {shops
                        .filter((shop) =>
                            itemFilters.size && amounts.size ? itemFilters.has(shop.cost.item.id) : true
                        )
                        .sort((a, b) => a.priority - b.priority)
                        .map((shop) => {
                            let limitNumIndicator = shopEnabled ? (
                                <Button
                                    variant="light"
                                    onClick={() => {
                                        filters.set(shop.id, shop.limitNum);
                                        onChange?.(filters);
                                    }}
                                >
                                    {shop.limitNum.toLocaleString()}
                                </Button>
                            ) : (
                                <>{shop.limitNum.toLocaleString()}</>
                            );

                            return (
                                <tr key={shop.id}>
                                    <td style={{ minWidth: "10em" }}>
                                        <b>{shop.name}</b>
                                        <div style={{ fontSize: "0.75rem" }} className="newline">
                                            {colorString(shop.detail)}
                                            <ScriptLink region={region} shop={shop} />
                                        </div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.payType !== Shop.PayType.FREE ? (
                                            <IconLink region={region} item={shop.cost.item} />
                                        ) : null}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.payType !== Shop.PayType.FREE ? shop.cost.amount.toLocaleString() : null}
                                    </td>
                                    <td>
                                        <ShopPurchaseDescriptor region={region} shop={shop} itemMap={itemMap} />
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.releaseConditions.map((cond, index) => (
                                            <div key={`${cond.condType}-${cond.condValues[0]}-${cond.condValues[0]}`}>
                                                {!["Unable to exchange, requirements not met", ""].includes(
                                                    cond.closedMessage
                                                )
                                                    ? `${cond.closedMessage} — `
                                                    : ""}
                                                <CondTargetNumDescriptor
                                                    region={region}
                                                    cond={cond.condType}
                                                    targets={cond.condValues}
                                                    num={cond.condNum}
                                                />
                                                {index !== shop.releaseConditions.length - 1 ? "," : ""}
                                            </div>
                                        ))}
                                    </td>
                                    <td style={{ textAlign: "center" }}>{shop.setNum.toLocaleString()}</td>
                                    <td style={{ textAlign: "center" }}>
                                        {shop.limitNum === 0 ? <>Unlimited</> : limitNumIndicator}
                                    </td>
                                    {shopEnabled && (
                                        <>
                                            <td style={{ textAlign: "center", maxWidth: "5em" }}>
                                                <InputGroup size="sm">
                                                    <Form.Control
                                                        type="number"
                                                        value={filters.get(shop.id) ?? 0}
                                                        min={0}
                                                        max={shop.limitNum || undefined}
                                                        onChange={(event) => {
                                                            let value = +event.target.value;
                                                            if (value) filters.set(shop.id, value);
                                                            else filters.delete(shop.id);
                                                            onChange?.(filters);
                                                        }}
                                                    />
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
};

export default ShopTab;
