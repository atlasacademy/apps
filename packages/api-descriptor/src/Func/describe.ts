import {DataVal, Func} from "@atlasacademy/api-connector";
import {BasePartial, Descriptor} from "../Descriptor";

export default function (func: Func.Func,
                         dataVal: DataVal.DataVal[],
                         followerDataVal?: DataVal.DataVal[],
                         hideScaling?: boolean,
                         forceLevel?: number): Descriptor {
    const partials: BasePartial[] = [];

    return new Descriptor(partials);
}
