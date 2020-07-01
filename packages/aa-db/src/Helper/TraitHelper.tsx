import React from "react";
import Trait from "../Api/Data/Trait";
import {Renderable} from "./Renderable";

export function describeTrait(trait: Trait): Renderable {
    return (
        // <Link to={`/trait/${trait.id}`}>
        <span>
            {trait.name}{trait.name === 'unknown' ? `(${trait.id})` : null}
        </span>
        // </Link>
    );
}

export function hasTraitId(traits: Trait[], id: number): boolean {
    return traits.filter(trait => trait.id === id).length > 0;
}
