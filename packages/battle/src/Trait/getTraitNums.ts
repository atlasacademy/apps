import { Trait } from "@atlasacademy/api-connector";

export const getNum = (variable: Trait.Trait | number | string) => {
    if (typeof variable === "number" || typeof variable === "string") return variable;
    return (variable as Trait.Trait).id;
};
