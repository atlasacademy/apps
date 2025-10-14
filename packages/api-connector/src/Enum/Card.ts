import { Trait } from "../Schema/Trait";

enum Card {
    NONE = "0",
    ARTS = "1",
    BUSTER = "2",
    QUICK = "3",
    EXTRA = "4",
    BLANK = "5",
    WEAK = "10",
    STRENGTH = "11",
    WEAKALT1 = "21",
    WEAKALT2 = "22",
    BUSTERALT1 = "60",
    ADDATTACK2 = "104",
}

export enum AttackType {
    ONE = "one",
    ALL = "all",
}

export default Card;

export interface CardConstant {
    individuality: Trait[];
    adjustAtk: number;
    adjustTdGauge: number;
    adjustCritical: number;
    addAtk: number;
    addTdGauge: number;
    addCritical: number;
}

export type CardConstantMap = {
    [key in Card]?: {
        [key in number]?: CardConstant;
    };
};
