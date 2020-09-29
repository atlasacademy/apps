import {DataVal, Func} from "@atlasacademy/api-connector";

export default function (func: Func.Func): DataVal.DataVal[] {
    return func.svals.concat(
        func.svals2 ?? [],
        func.svals3 ?? [],
        func.svals4 ?? [],
        func.svals5 ?? [],
    );
}
