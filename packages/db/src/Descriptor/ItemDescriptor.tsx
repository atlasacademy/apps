import { useRef } from "react";
import { Link } from "react-router-dom";

import { Item, Region } from "@atlasacademy/api-connector";

import ItemIcon from "../Component/ItemIcon";
import { mergeElements } from "../Helper/OutputHelper";
import useApi from "../Hooks/useApi";
import { lang } from "../Setting/Manager";
import TraitDescription from "./TraitDescription";

import "./Descriptor.css";

export default function ItemDescriptor(props: {
    region: Region;
    item: Item.Item;
    quantity?: number;
    height?: string | number;
    quantityHeight?: string | number;
}) {
    return (
        <>
            <Link to={`/${props.region}/item/${props.item.id}`} className="descriptor-link">
                <ItemIcon
                    region={props.region}
                    item={props.item}
                    quantity={props.quantity}
                    height={props.height}
                    quantityHeight={props.quantityHeight}
                />
                <span className="hover-text" lang={lang(props.region)}>
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

export function ItemDescriptorIndividuality(props: { region: Region; individuality: number }) {
    const individuality = useRef([props.individuality]);
    const { data: items } = useApi("searchItem", undefined, individuality.current);
    if (items && items.length > 0) {
        return (
            <>
                {mergeElements(
                    items.map((item) => <ItemDescriptor region={props.region} item={item} />),
                    " and "
                )}
            </>
        );
    } else {
        return <TraitDescription region={props.region} trait={props.individuality} />;
    }
}

export function ItemDescriptorId(props: {
    region: Region;
    itemId: number;
    quantity?: number;
    height?: string | number;
    quantityHeight?: string | number;
}) {
    const { data: item } = useApi("item", props.itemId);
    if (item !== undefined) {
        return (
            <>
                <ItemDescriptor
                    region={props.region}
                    item={item}
                    quantity={props.quantity}
                    height={props.height}
                    quantityHeight={props.quantityHeight}
                />
            </>
        );
    } else {
        return <>Item {props.itemId}</>;
    }
}

export function IconDescriptorMap(props: {
    region: Region;
    itemId: number;
    items: Map<number, Item.Item>;
    quantity?: number;
    height?: string | number;
    quantityHeight?: string | number;
}) {
    const item = props.items.get(props.itemId);
    if (item !== undefined) {
        return (
            <>
                <ItemDescriptor
                    region={props.region}
                    item={item}
                    quantity={props.quantity}
                    height={props.height}
                    quantityHeight={props.quantityHeight}
                />
            </>
        );
    } else {
        return <>Unknown Item {props.itemId}</>;
    }
}
