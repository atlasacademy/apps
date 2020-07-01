import React from "react";
import {Link} from "react-router-dom";
import Buff, {BuffType} from "../Api/Data/Buff";
import BuffIcon from "../Component/BuffIcon";
import {asPercent} from "./OutputHelper";
import {Renderable} from "./Renderable";
import {hasTraitId} from "./TraitHelper";

export function describeBuff(buff: Buff): Renderable {
    let description = buff.name;

    if (buff.type === BuffType.DONOT_ACT) {
        if (hasTraitId(buff.vals, 3012)) {
            description = 'Charm';
        }
    }

    return (
        <Link to={`/buff/${buff.id}`}>
            {description} <BuffIcon location={buff.icon}/>
        </Link>
    );
}

export function describeBuffValue(buff: Buff, value: number): string {
    switch (buff.type) {
        case BuffType.UP_COMMANDALL:
        case BuffType.DOWN_COMMANDALL:
        case BuffType.UP_CRITICALDAMAGE:
        case BuffType.DOWN_CRITICALDAMAGE:
        case BuffType.UP_DEFENCE:
        case BuffType.DOWN_DEFENCE:
        case BuffType.UP_DROPNP:
        case BuffType.DOWN_DROPNP:
        case BuffType.UP_HATE:
            return asPercent(value, 1);
    }

    return value.toString();
}
