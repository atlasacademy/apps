import { Card } from "@atlasacademy/api-connector";

import { BasePartial, Descriptor, TextPartial, ValuePartial, ValueType } from "../Descriptor";
import { toTitleCase } from "../Helpers";

const cardIdMap = new Map<number, Card>([
    [1, Card.NONE],
    [2, Card.BUSTER],
    [3, Card.ARTS],
    [4, Card.QUICK],
    [5, Card.EXTRA],
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
