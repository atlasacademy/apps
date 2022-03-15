import { Item, Quest, Region } from "@atlasacademy/api-connector";

import { mergeElements } from "../Helper/OutputHelper";
import ItemDescriptor from "./ItemDescriptor";

export default function QuestConsumeDescriptor(props: {
    region: Region;
    consumeType: Quest.QuestConsumeType;
    consume: number;
    consumeItem: { item: Item.Item; amount: number }[];
}) {
    const consume = props.consume;
    switch (props.consumeType) {
        case Quest.QuestConsumeType.NONE:
            return <>None</>;
        case Quest.QuestConsumeType.AP:
            return <>{consume} AP</>;
        case Quest.QuestConsumeType.RP:
            return <>{consume} BP</>;
        case Quest.QuestConsumeType.ITEM:
            return (
                <>
                    {mergeElements(
                        props.consumeItem.map((item) => (
                            <>
                                <ItemDescriptor region={props.region} item={item.item} /> x{item.amount}
                            </>
                        )),
                        ", "
                    )}
                </>
            );
        case Quest.QuestConsumeType.AP_AND_ITEM:
            return (
                <>
                    {consume} AP +{" "}
                    {mergeElements(
                        props.consumeItem.map((item) => (
                            <>
                                <ItemDescriptor region={props.region} item={item.item} /> x{item.amount}
                            </>
                        )),
                        ", "
                    )}
                </>
            );
        default:
            return (
                <>
                    {consume} x {props.consumeType}
                </>
            );
    }
}
