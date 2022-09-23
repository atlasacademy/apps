import { Card } from "@atlasacademy/api-connector";

import { BasePartial, Descriptor, TextPartial, ValuePartial, ValueType } from "../Descriptor";
import { toTitleCase } from "../Helpers";

const cardIdMap = new Map<number, Card>([
    [0, Card.NONE],
    [1, Card.ARTS],
    [2, Card.BUSTER],
    [3, Card.QUICK],
    [4, Card.EXTRA],
    [5, Card.BLANK],
    [10, Card.WEAK],
    [11, Card.STRENGTH],
]);

export default function (card: Card | number): Descriptor {
    const partials: BasePartial[] = [],
        cardType: Card | undefined = typeof card === "number" ? cardIdMap.get(card) : card;

    if (cardType) {
        partials.push(new TextPartial(toTitleCase(cardType)));
    } else if (typeof card === "number") {
        partials.push(new ValuePartial(ValueType.UNKNOWN, card));
    } else {
        partials.push(new TextPartial(toTitleCase(card)));
    }

    return new Descriptor(partials);
}
