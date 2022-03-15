import { DataVal, Func } from "@atlasacademy/api-connector";

import getStaticDataValFields from "./extractStaticDataValFields";

export default function (func: Func.Func, level: number, overcharge?: number): DataVal.DataVal {
    const staticFields = getStaticFields(func),
        dataVal = getDataValForLevel(func, level, overcharge),
        dataValFields = Object.keys(dataVal),
        mutatingDataVal: DataVal.DataVal = {};

    dataValFields.forEach((field) => {
        if (staticFields.indexOf(field as DataVal.DataValField) !== -1) return;

        // @ts-ignore
        mutatingDataVal[field] = dataVal[field];
    });

    return mutatingDataVal;
}

function getStaticFields(func: Func.Func): DataVal.DataValField[] {
    const vals: DataVal.DataVal[] = func.svals.concat(
        func.svals2 ?? [],
        func.svals3 ?? [],
        func.svals4 ?? [],
        func.svals5 ?? []
    );

    if (!vals.length) return [];

    return getStaticDataValFields(vals);
}

function getDataValForLevel(func: Func.Func, level: number, overcharge?: number): DataVal.DataVal {
    let svals: DataVal.DataVal[] = [];

    if (overcharge === undefined || overcharge === 1) {
        svals = func.svals;
    } else if (overcharge === 2) {
        svals = func.svals2 ?? [];
    } else if (overcharge === 3) {
        svals = func.svals3 ?? [];
    } else if (overcharge === 4) {
        svals = func.svals4 ?? [];
    } else if (overcharge === 5) {
        svals = func.svals5 ?? [];
    }

    return svals[level - 1] ?? {};
}
