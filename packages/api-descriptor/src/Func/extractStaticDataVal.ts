import {DataVal} from "@atlasacademy/api-connector/dist/Schema/DataVal";
import getStaticDataValFields from "./extractStaticDataValFields";

export default function extractStaticDataVal(dataVals: DataVal[]): DataVal {
    const fields = getStaticDataValFields(dataVals),
        hasDependingVals = dataVals.filter(val => val.DependFuncVals !== undefined).length > 0,
        staticVals: DataVal = {};

    for (let x in fields) {
        // @ts-ignore
        staticVals[fields[x]] = vals[0][fields[x]];
    }

    if (hasDependingVals) {
        const dependingVals: DataVal[] = dataVals.map(val => val.DependFuncVals ?? {});

        staticVals.DependFuncVals = extractStaticDataVal(dependingVals);
    }

    return staticVals;
}
