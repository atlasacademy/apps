import React from "react";
import {Link} from "react-router-dom";
import Buff, {BuffType} from "../Api/Data/Buff";
import BuffIcon from "../Component/BuffIcon";
import {Renderable} from "./Renderable";
import {hasTraitId} from "./TraitHelper";

export function buffIsFlatValue(buff: Buff) {
    switch (buff.type) {
        case BuffType.SUB_SELFDAMAGE:
            return true;
        default:
            return false;
    }
}

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
