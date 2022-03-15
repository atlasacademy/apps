import React from "react";

import { Region, Servant, Trait, CondType } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import CondTargetValueDescriptor from "../../Descriptor/CondTargetValueDescriptor";
import TraitDescription from "../../Descriptor/TraitDescription";
import { mergeElements } from "../../Helper/OutputHelper";

interface TraitDiff {
    type: "Ascension" | "Costume";
    id: number;
    addedTraits: Trait.Trait[];
    removedTraits: Trait.Trait[];
}

interface IProps {
    region: Region;
    servant: Servant.Servant;
}

class ServantTraits extends React.Component<IProps> {
    private getOverrideTraits(): Trait.Trait[] {
        return [{ id: this.props.servant.id, name: `Self` }];
    }

    private getTraitDiffs(): TraitDiff[] {
        const diffs: TraitDiff[] = [],
            existingTraits = this.props.servant.traits,
            existingIds = this.props.servant.traits.map((trait) => trait.id);

        for (let x in this.props.servant.ascensionAdd.individuality.ascension) {
            const key = parseInt(x),
                traits = this.props.servant.ascensionAdd.individuality.ascension[key],
                ids = traits.map((trait) => trait.id),
                addedTraits = traits.filter((trait) => existingIds.indexOf(trait.id) === -1),
                removedTraits = existingTraits.filter((trait) => ids.indexOf(trait.id) === -1);

            if (ids.length > 0) {
                diffs.push({ type: "Ascension", id: key, addedTraits, removedTraits });
            }
        }

        for (let x in this.props.servant.ascensionAdd.individuality.costume) {
            const key = parseInt(x),
                traits = this.props.servant.ascensionAdd.individuality.costume[key],
                ids = traits.map((trait) => trait.id),
                addedTraits = traits.filter((trait) => existingIds.indexOf(trait.id) === -1),
                removedTraits = existingTraits.filter((trait) => ids.indexOf(trait.id) === -1);

            if (ids.length === 0) continue;

            diffs.push({ type: "Costume", id: key, addedTraits, removedTraits });
        }

        return diffs;
    }

    private describeDiff(diff: TraitDiff): string {
        if (diff.type === "Costume") {
            const costumes = this.props.servant.profile?.costume;
            if (costumes !== undefined) {
                const costume = costumes[diff.id];
                if (costume !== undefined) {
                    return `Costume ${costume.name}`;
                }
            }
        }
        return `${diff.type} ${diff.id}`;
    }

    render() {
        return (
            <div>
                <h3>Basic Traits</h3>
                <p>
                    {mergeElements(
                        this.props.servant.traits.map((trait) => (
                            <TraitDescription
                                region={this.props.region}
                                trait={trait}
                                overrideTraits={this.getOverrideTraits()}
                            />
                        )),
                        ", "
                    )}
                </p>

                {this.getTraitDiffs().map((diffs, i) => (
                    <div key={i}>
                        {diffs.addedTraits.length > 0 ? (
                            <div>
                                <h3>{this.describeDiff(diffs)} Additional Traits</h3>
                                <p>
                                    {mergeElements(
                                        diffs.addedTraits.map((trait) => (
                                            <TraitDescription
                                                region={this.props.region}
                                                trait={trait}
                                                overrideTraits={this.getOverrideTraits()}
                                            />
                                        )),
                                        ", "
                                    )}
                                </p>
                            </div>
                        ) : undefined}

                        {diffs.removedTraits.length > 0 ? (
                            <div>
                                <h3>{this.describeDiff(diffs)} Removed Traits</h3>
                                <p>
                                    {mergeElements(
                                        diffs.removedTraits.map((trait) => (
                                            <TraitDescription
                                                region={this.props.region}
                                                trait={trait}
                                                overrideTraits={this.getOverrideTraits()}
                                            />
                                        )),
                                        ", "
                                    )}
                                </p>
                            </div>
                        ) : undefined}
                    </div>
                ))}

                {this.props.servant.traitAdd.length > 0 ? (
                    <>
                        <h3>Extra Traits</h3>
                        <ul>
                            {this.props.servant.traitAdd.map((traitAdd) => (
                                <li key={traitAdd.idx}>
                                    {traitAdd.idx}:{" "}
                                    {mergeElements(
                                        traitAdd.trait.map((trait) => (
                                            <TraitDescription region={this.props.region} trait={trait} />
                                        )),
                                        ", "
                                    )}
                                    {traitAdd.condType !== CondType.NONE &&
                                    traitAdd.condType !== undefined &&
                                    traitAdd.condId !== undefined &&
                                    traitAdd.condNum !== undefined ? (
                                        <>
                                            <br />
                                            Condition:{" "}
                                            <CondTargetValueDescriptor
                                                region={this.props.region}
                                                cond={traitAdd.condType}
                                                target={traitAdd.condId}
                                                value={traitAdd.condNum}
                                            />
                                        </>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : null}

                <h3>Attack Traits</h3>
                <ul>
                    {Object.entries(this.props.servant.cardDetails).map((value) => {
                        const [card, cardDetail] = value;
                        if (cardDetail !== undefined) {
                            return (
                                <li key={card}>
                                    {toTitleCase(card)}:{" "}
                                    {mergeElements(
                                        cardDetail.attackIndividuality.map((trait) => (
                                            <TraitDescription
                                                region={this.props.region}
                                                trait={trait}
                                                owner="buffs"
                                                ownerParameter="ckOpIndv"
                                            />
                                        )),
                                        ", "
                                    )}
                                </li>
                            );
                        } else {
                            return null;
                        }
                    })}
                </ul>
            </div>
        );
    }
}

export default ServantTraits;
