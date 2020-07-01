import Trait from "../Api/Data/Trait";

export function hasTraitId(traits: Trait[], id: number): boolean {
    return traits.filter(trait => trait.id === id).length > 0;
}
