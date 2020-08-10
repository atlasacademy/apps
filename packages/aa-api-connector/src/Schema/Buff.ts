import BuffType from "../Enum/BuffType";
import Func from "./Func";
import Trait from "./Trait";

export default interface Buff {
    id: number;
    name: string;
    detail: string;
    icon?: string;
    type: BuffType;
    vals: Trait[];
    tvals: Trait[];
    ckSelfIndv: Trait[];
    ckOpIndv: Trait[];
    maxRate: number;
    reverseFunctions?: Func[];
}
