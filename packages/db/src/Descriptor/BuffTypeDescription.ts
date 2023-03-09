import { Buff } from "@atlasacademy/api-connector";
import { BuffDescriptor } from "@atlasacademy/api-descriptor";

const BuffTypeDescription = new Map<Buff.BuffType, string>(
    Object.values(Buff.BuffType).map((type) => {
        return [type, BuffDescriptor.describeType(type)];
    })
);

export default BuffTypeDescription;
