import { DataVal } from "@atlasacademy/api-connector";

import getStaticDataValFields from "./extractStaticDataValFields";

export default function extractStaticDataVal(dataVals: DataVal.DataVal[]): DataVal.DataVal {
    if (!dataVals.length) return {};

    const fields = getStaticDataValFields(dataVals);
    const staticVals: DataVal.DataVal = {};
    const hasDependingVals = dataVals.filter((val) => val.DependFuncVals !== undefined).length > 0;

    const dependingVals: DataVal.DataVal[] | undefined = hasDependingVals
        ? dataVals.map((val) => (val.DependFuncVals ?? {}) as DataVal.DataVal)
        : undefined;

    const dependingStaticValues = dependingVals ? extractStaticDataVal(dependingVals) : undefined;

    for (let x in fields) {
        // @ts-ignore
        staticVals[fields[x]] = dataVals[0][fields[x]];
    }

    if (hasDependingVals) staticVals.DependFuncVals = dependingStaticValues;

    return staticVals;
}
