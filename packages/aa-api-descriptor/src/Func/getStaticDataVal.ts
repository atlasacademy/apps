import {DataVal, Func} from "@atlasacademy/api-connector";
import getStaticDataValFields from "./getStaticDataValFields";

export default function (func: Func.Func): DataVal.DataVal {
    let vals: DataVal.DataVal[] = func.svals.concat(
        func.svals2 ?? [],
        func.svals3 ?? [],
        func.svals4 ?? [],
        func.svals5 ?? [],
    );

    if (!vals.length)
        return {};

    const staticVals = extractVals(vals),
        hasDependingVals = vals.filter(val => val.DependFuncVals !== undefined).length > 0;

    if (hasDependingVals) {
        const dependingVals: DataVal.DataVal[] = vals.map(val => val.DependFuncVals ?? {});

        staticVals.DependFuncVals = extractVals(dependingVals);
    }

    return staticVals;
}

function extractVals(vals: DataVal.DataVal[]): DataVal.DataVal {
    const fields = getStaticDataValFields(vals),
        staticVals: DataVal.DataVal = {};

    for (let x in fields) {
        // @ts-ignore
        staticVals[fields[x]] = vals[0][fields[x]];
    }

    return staticVals;
}
