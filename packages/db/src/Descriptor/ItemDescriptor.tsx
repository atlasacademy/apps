import { Item, Region } from "@atlasacademy/api-connector";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Api";
import ItemIcon from "../Component/ItemIcon";
import { mergeElements } from "../Helper/OutputHelper";
import TraitDescription from "./TraitDescription";

export default function ItemDescriptor(props: {
    region: Region;
    item: Item.Item;
    quantity?: number;
    height?: string | number;
    quantityHeight?: string | number;
}) {
    return (
        <>
            <Link
                style={{ textDecoration: "none", whiteSpace: "nowrap" }}
                to={`/${props.region}/item/${props.item.id}`}
            >
                <ItemIcon
                    region={props.region}
                    item={props.item}
                    quantity={props.quantity}
                    height={props.height}
                    quantityHeight={props.quantityHeight}
                />
                <span className="hoverText" style={{ whiteSpace: "normal" }}>
                    {props.item.name}
                </span>
            </Link>
        </>
    );
}

export function ItemDescriptorIconOnly(props: {
    region: Region;
    item: Item.Item;
    quantity?: number;
    height?: string | number;
    quantityHeight?: string | number;
}) {
    return (
        <>
            <Link to={`/${props.region}/item/${props.item.id}`}>
                <ItemIcon
                    region={props.region}
                    item={props.item}
                    quantity={props.quantity}
                    height={props.height}
                    quantityHeight={props.quantityHeight}
                />
            </Link>
        </>
    );
}

export function ItemDescriptorIndividuality(props: {
    region: Region;
    individuality: number;
}) {
    const [items, setItems] = useState<Item.Item[]>(null as any);
    useEffect(() => {
        Api.searchItem(undefined, [props.individuality]).then((s) =>
            setItems(s)
        );
    }, [props.region, props.individuality]);
    if (items && items.length > 0) {
        return (
            <>
                {mergeElements(
                    items.map((item) => (
                        <ItemDescriptor region={props.region} item={item} />
                    )),
                    " and "
                )}
            </>
        );
    } else {
        return (
            <TraitDescription
                region={props.region}
                trait={props.individuality}
            />
        );
    }
}
