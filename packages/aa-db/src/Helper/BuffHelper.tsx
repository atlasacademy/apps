import Buff, {BuffType} from "../Api/Data/Buff";

export function buffIsFlatValue(buff: Buff) {
    switch (buff.type) {
        case BuffType.SUB_SELFDAMAGE:
            return true;
        default:
            return false;
    }
}
