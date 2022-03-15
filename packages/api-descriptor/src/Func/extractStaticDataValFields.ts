import { DataVal } from "@atlasacademy/api-connector";

export default function (vals: DataVal.DataVal[]): DataVal.DataValField[] {
    return Object.values(DataVal.DataValField).filter((field) => {
        const values = vals.map((val) => val[field]);

        return (
            new Set(
                values.map((value) => {
                    if (Array.isArray(value)) return value.join(",");

                    return value;
                })
            ).size > 1
        );
    });
}
