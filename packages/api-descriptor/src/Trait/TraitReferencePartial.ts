import { Trait } from "@atlasacademy/api-connector";

import { ReferencePartial, ReferenceType } from "../Descriptor";

export default class TraitReferencePartial extends ReferencePartial {
    constructor(trait: Trait.Trait | number) {
        super(ReferenceType.TRAIT, trait);
    }
}
