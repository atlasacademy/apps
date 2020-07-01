import Buff, {BuffType} from "../Api/Data/Buff";
import {asPercent} from "./OutputHelper";

export function describeBuffValue(buff: Buff, value: number): string {
    switch (buff.type) {
        case BuffType.UP_ATK:
        case BuffType.DOWN_ATK:
        case BuffType.UP_COMMANDALL:
        case BuffType.DOWN_COMMANDALL:
        case BuffType.UP_CRITICALDAMAGE:
        case BuffType.DOWN_CRITICALDAMAGE:
        case BuffType.UP_DEFENCE:
        case BuffType.DOWN_DEFENCE:
        case BuffType.UP_DROPNP:
        case BuffType.DOWN_DROPNP:
        case BuffType.UP_HATE:
        case BuffType.UP_TOLERANCE:
        case BuffType.DOWN_TOLERANCE:
            return asPercent(value, 1);
    }

    return value.toString();
}
