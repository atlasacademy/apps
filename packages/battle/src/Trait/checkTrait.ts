import { Trait } from "@atlasacademy/api-connector";

import { getNum } from "./getTraitNums";

/**
 * Individuality::CheckIndividualities
 * @param self
 * @param target
 */
export const checkTrait = <T extends Trait.Trait | number | string>(self?: T[], target?: T[]): boolean => {
    if (target === undefined || self === undefined || target.length === 0) return true;
    if (self.length === 0) return false;

    const selfNums = self.map((trait) => getNum(trait));
    const targetNums = target.map((trait) => getNum(trait));

    for (let selfNum of selfNums) {
        for (let targetNum of targetNums) {
            if (selfNum === targetNum) {
                return true;
            }
        }
    }

    return false;
};
