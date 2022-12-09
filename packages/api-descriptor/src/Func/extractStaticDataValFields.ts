import { DataVal } from "@atlasacademy/api-connector";

import { hasUniqueValues } from "../Helpers";

export default function (vals: DataVal.DataVal[]): DataVal.DataValField[] {
    return Object.values(DataVal.DataValField).filter((field) => {
        const values = vals.map((val) => val[field]);

        return !hasUniqueValues(values);
    });
}
