import { Buff } from "@atlasacademy/api-connector";

import { ReferencePartial, ReferenceType } from "../Descriptor";

export default class BuffReferencePartial extends ReferencePartial {
    constructor(buff: Buff.Buff | number) {
        super(ReferenceType.BUFF, buff);
    }
}
