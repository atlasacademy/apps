import { DataVal, Func } from "@atlasacademy/api-connector";

import extractStaticDataVal from "./extractStaticDataVal";
import getValList from "./getValList";

export default function (func: Func.Func): DataVal.DataVal {
    let vals = getValList(func);

    if (!vals.length) return {};

    return extractStaticDataVal(vals);
}
