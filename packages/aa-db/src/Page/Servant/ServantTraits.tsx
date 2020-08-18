import {Region, Servant, Trait} from "@atlasacademy/api-connector";
import React from "react";
import TraitDescription from "../../Descriptor/TraitDescription";
import {mergeElements} from "../../Helper/OutputHelper";

interface TraitDiff {
    type: "Ascension" | "Costume",
    id: number,
    addedTraits: number[];
    removedTraits: number[];
}

interface IProps {
    region: Region;
    servant: Servant.Servant;
}

class ServantTraits extends React.Component<IProps> {
    private getOverrideTraits(): Trait.Trait[] {
        return [
            {id: this.props.servant.id, name: `Self`}
        ];
    }

    private getTraitDiffs(): TraitDiff[] {
        const diffs: TraitDiff[] = [],
            existingIds = this.props.servant.traits.map(trait => trait.id);

        for (let x in this.props.servant.ascensionAdd.individuality.ascension) {
            const key = parseInt(x),
                traits = this.props.servant.ascensionAdd.individuality.ascension[key],
                ids = traits.map(trait => trait.id),
                addedTraits = ids.filter(id => existingIds.indexOf(id) === -1),
                removedTraits = existingIds.filter(id => ids.indexOf(id) === -1);

            if (ids.length > 0) {
                diffs.push({type: "Ascension", id: key, addedTraits, removedTraits});
            }
        }

        for (let x in this.props.servant.ascensionAdd.individuality.costume) {
            const key = parseInt(x),
                traits = this.props.servant.ascensionAdd.individuality.costume[key],
                ids = traits.map(trait => trait.id),
                addedTraits = ids.filter(id => existingIds.indexOf(id) === -1),
                removedTraits = existingIds.filter(id => ids.indexOf(id) === -1);

            if (ids.length === 0)
                continue;

            diffs.push({type: "Costume", id: key, addedTraits, removedTraits});
        }

        return diffs;
    }

    render() {
        return (
            <div>
                <h3>Basic Traits</h3>
                <p>
                    {mergeElements(
                        this.props.servant.traits.map(trait => <TraitDescription region={this.props.region}
                                                                                 trait={trait}
                                                                                 overrideTraits={this.getOverrideTraits()}/>),
                        ', '
                    )}
                </p>

                {this.getTraitDiffs().map((diffs, i) => (
                    <div key={i}>
                        {diffs.addedTraits.length > 0 ? (
                            <div>
                                <h3>{diffs.type} {diffs.id}: Additional Traits</h3>
                                <p>
                                    {mergeElements(
                                        diffs.addedTraits.map(id => <TraitDescription region={this.props.region}
                                                                                      trait={id}
                                                                                      overrideTraits={this.getOverrideTraits()}/>),
                                        ', '
                                    )}
                                </p>
                            </div>
                        ) : undefined}

                        {diffs.removedTraits.length > 0 ? (
                            <div>
                                <h3>{diffs.type} {diffs.id}: Removed Traits</h3>
                                <p>
                                    {mergeElements(
                                        diffs.removedTraits.map(id => <TraitDescription region={this.props.region}
                                                                                        trait={id}
                                                                                        overrideTraits={this.getOverrideTraits()}/>),
                                        ', '
                                    )}
                                </p>
                            </div>
                        ) : undefined}
                    </div>
                ))}

                <br/>
                <br/>
                <br/>
            </div>
        );
    }
}

export default ServantTraits;
