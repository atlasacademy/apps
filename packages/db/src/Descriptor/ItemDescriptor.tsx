import { Region, Item } from "@atlasacademy/api-connector";
import { useState, useEffect } from "react";
import Api from "../Api";
import TraitDescription from "./TraitDescription";

export default function ItemDescriptor(props: {
  region: Region;
  individuality: number;
}) {
  const [items, setItems] = useState<Item.Item[]>(null as any);
  useEffect(() => {
    Api.searchItem(undefined, [props.individuality]).then((s) => setItems(s));
  }, [props.region, props.individuality]);
  if (items && items.length > 0) {
    return <>{items.map((item) => item.name).join(" and ")}</>;
  } else {
    return (
      <TraitDescription region={props.region} trait={props.individuality} />
    );
  }
}
