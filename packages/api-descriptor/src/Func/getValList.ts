import { DataVal, Func } from "@atlasacademy/api-connector";

export default function getValList(func: Func.Func, level?: number, overcharge?: number): DataVal.DataVal[] {
    if (level === undefined && overcharge === undefined) {
        return func.svals.concat(func.svals2 ?? [], func.svals3 ?? [], func.svals4 ?? [], func.svals5 ?? []);
    }

    if (typeof level === "number" && overcharge === undefined) {
        const vals: DataVal.DataVal[] = [],
            oc1 = (func.svals ?? [])[level - 1] ?? undefined,
            oc2 = (func.svals2 ?? [])[level - 1] ?? undefined,
            oc3 = (func.svals3 ?? [])[level - 1] ?? undefined,
            oc4 = (func.svals4 ?? [])[level - 1] ?? undefined,
            oc5 = (func.svals5 ?? [])[level - 1] ?? undefined;

        if (oc1) vals.push(oc1);
        if (oc2) vals.push(oc2);
        if (oc3) vals.push(oc3);
        if (oc4) vals.push(oc4);
        if (oc5) vals.push(oc5);

        return vals;
    }

    if (level === undefined && typeof overcharge === "number") {
        switch (overcharge) {
            case 1:
                return func.svals ?? [];
            case 2:
                return func.svals2 ?? [];
            case 3:
                return func.svals3 ?? [];
            case 4:
                return func.svals4 ?? [];
            case 5:
                return func.svals5 ?? [];
            default:
                return [];
        }
    }

    if (typeof level === "number" && typeof overcharge === "number") {
        const vals = getValList(func, undefined, overcharge),
            val = vals[level - 1] ?? undefined;

        return val ? [val] : [];
    }

    return [];
}
