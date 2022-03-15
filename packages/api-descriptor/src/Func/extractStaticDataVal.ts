import { DataVal } from "@atlasacademy/api-connector";

import getStaticDataValFields from "./extractStaticDataValFields";

export default function extractStaticDataVal(dataVals: DataVal.DataVal[]): DataVal.DataVal {
    const fields = getStaticDataValFields(dataVals),
        hasDependingVals = dataVals.filter((val) => val.DependFuncVals !== undefined).length > 0,
        staticVals: DataVal.DataVal = {};

    for (let x in fields) {
        // @ts-ignore
        staticVals[fields[x]] = vals[0][fields[x]];
    }

    if (hasDependingVals) {
        const dependingVals: DataVal.DataVal[] = dataVals.map((val) => val.DependFuncVals ?? {});

        staticVals.DependFuncVals = extractStaticDataVal(dependingVals);
    }

    return staticVals;
}
