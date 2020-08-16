import Trait from "@atlasacademy/api-connector/dist/Schema/Trait";
import {ReferencePartial, ReferenceType} from "../Descriptor";

export default class TraitReferencePartial extends ReferencePartial {
    constructor(trait: Trait | number) {
        super(ReferenceType.TRAIT, trait);
    }
}
