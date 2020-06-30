import React from "react";
import Trait from "../Api/Data/Trait";
import {Renderable} from "./Renderable";

export function describeTrait(trait: Trait): Renderable {
    return <span key={`trait-${trait.id}`}>{trait.name}</span>;
}

export function hasTraitId(traits: Trait[], id: number): boolean {
    return traits.filter(trait => trait.id === id).length > 0;
}
