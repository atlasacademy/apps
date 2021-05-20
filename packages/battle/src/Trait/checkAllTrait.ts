import { Trait } from "@atlasacademy/api-connector";

export const checkAllTrait = (
    self?: Trait.Trait[],
    target?: Trait.Trait[]
): boolean => {
    if (target === undefined || self === undefined || target.length === 0)
        return true;
    if (self.length === 0) return false;

    const selfNums = self.map((trait) => trait.id);
    const targetNums = target.map((target) => target.id);

    for (let selfNum of targetNums) {
        if (!selfNums.includes(selfNum)) {
            return false;
        }
    }

    return true;
};
