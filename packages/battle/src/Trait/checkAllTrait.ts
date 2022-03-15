import { Trait } from "@atlasacademy/api-connector";

import { getNum } from "./getTraitNums";

export const checkAllTrait = <T extends Trait.Trait | number | string>(self?: T[], target?: T[]): boolean => {
    if (target === undefined || self === undefined || target.length === 0) return true;
    if (self.length === 0) return false;

    const selfNums = self.map((trait) => getNum(trait));
    const targetNums = target.map((trait) => getNum(trait));

    for (let selfNum of targetNums) {
        if (!selfNums.includes(selfNum)) {
            return false;
        }
    }

    return true;
};
