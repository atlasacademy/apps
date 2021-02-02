import { Region, Item } from "@atlasacademy/api-connector";
import { useState, useEffect } from "react";
import Api from "../Api";
import TraitDescription from "./TraitDescription";
import ItemIcon from "../Component/ItemIcon";
import { mergeElements } from "../Helper/OutputHelper";

function getItemWithIcon(region: Region, item: Item.Item) {
  return (
    <>
      <ItemIcon region={region} item={item} />
      {item.name}
    </>
  );
}

export default function ItemDescriptor(props: {
  region: Region;
  individuality: number;
}) {
  const [items, setItems] = useState<Item.Item[]>(null as any);
  useEffect(() => {
    Api.searchItem(undefined, [props.individuality]).then((s) => setItems(s));
  }, [props.region, props.individuality]);
  if (items && items.length > 0) {
    return (
      <>
        {mergeElements(
          items.map((item) => getItemWithIcon(props.region, item)),
          " and "
        )}
      </>
    );
  } else {
    return (
      <TraitDescription region={props.region} trait={props.individuality} />
    );
  }
}
