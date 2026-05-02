import { Card } from "@atlasacademy/api-connector";

import { ReferencePartial, ReferenceType } from "../Descriptor.js";

export default class CardReferencePartial extends ReferencePartial {
    constructor(card: Card | number) {
        super(ReferenceType.CARD, card);
    }
}
