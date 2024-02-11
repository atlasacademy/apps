import { useEffect, useState } from "react";
import { SelectCallback } from "react-bootstrap/esm/helpers";

import { Item, Shop } from "@atlasacademy/api-connector";

import Api from "../Api";

interface SProps {
    shops: Shop.Shop[];
    key?: Shop.ShopType;
}

export default function useShop() {
    const [currentShop, setCurrentShop] = useState<SProps>({ shops: [] });
    const [itemCache, setItemCache] = useState<Map<number, Item.Item>>(new Map());

    const SelectShopEvent: SelectCallback = async (key, ev) => {
        if (currentShop.key !== key) {
            const shopType = key as Shop.ShopType;
            const shops = await Api.searchShop({ type: [shopType] }); // Maybe is necesary memorize output of data to reduce requests flow to the server

            setCurrentShop({ shops, key: shopType });
        }
    };

    useEffect(() => {
        const InitialRenderSets = async () => {
            const itemList = await Api.itemList();
            const itemCache = new Map(itemList.map((item) => [item.id, item]));
            const shops = await Api.searchShop({ type: [Shop.ShopType.MANA] });

            setCurrentShop({ shops, key: Shop.ShopType.MANA });
            setItemCache(itemCache);
        };

        InitialRenderSets();
    }, []);

    return { SelectShopEvent, currentShop, itemCache };
}
