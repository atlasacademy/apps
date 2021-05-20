import { Trait } from "@atlasacademy/api-connector";

export const checkTrait = (
    self?: Trait.Trait[],
    target?: Trait.Trait[]
): boolean => {
    if (target === undefined || self === undefined || target.length === 0)
        return true;
    if (self.length === 0) return false;

    const selfNums = self.map((trait) => trait.id);
    const targetNums = target.map((target) => target.id);

    for (let selfNum of selfNums) {
        for (let targetNum of targetNums) {
            if (selfNum === targetNum) {
                return true;
            }
        }
    }

    return false;
};
