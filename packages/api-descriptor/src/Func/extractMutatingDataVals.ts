import { DataVal } from "@atlasacademy/api-connector";

import getStaticDataValFields from "./extractStaticDataValFields";

export default function extractMutatingDataVals(dataVals: DataVal.DataVal[]): DataVal.DataVal[] {
    const staticFields = getStaticDataValFields(dataVals),
        hasDependingVals = dataVals.filter((val) => val.DependFuncVals !== undefined).length > 0,
        mutatingDataVals: DataVal.DataVal[] = [];

    dataVals.forEach((dataVal) => {
        const fields = Object.keys(dataVal),
            mutatingDataVal: DataVal.DataVal = {};

        fields.forEach((field) => {
            if (staticFields.indexOf(field as DataVal.DataValField) !== -1) return;

            // @ts-ignore
            mutatingDataVal[field] = dataVal[field];
        });

        mutatingDataVals.push(mutatingDataVal);
    });

    if (hasDependingVals) {
        const dependingVals: DataVal.DataVal[] = dataVals.map((val) => val.DependFuncVals ?? {}),
            dependingMutatingVals = extractMutatingDataVals(dependingVals);

        dependingMutatingVals.forEach((dependingMutatingVal, i) => {
            mutatingDataVals[i].DependFuncVals = dependingMutatingVal;
        });
    }

    return mutatingDataVals;
}
