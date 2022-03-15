import React from "react";

import Region from "@atlasacademy/api-connector/dist/Enum/Region";
import {
    Descriptor,
    PartialType,
    ParticlePartial,
    ReferencePartial,
    ReferenceType,
    TextPartial,
    ValuePartial,
    ValueType,
} from "@atlasacademy/api-descriptor";

import CardDescription from "./CardDescription";
import SkillDescriptor from "./SkillDescriptor";
import SkillReferenceDescriptor from "./SkillReferenceDescriptor";
import TraitDescription from "./TraitDescription";

interface IProps {
    region: Region;
    descriptor: Descriptor;
}

class Description extends React.Component<IProps> {
    private static renderParticle(partial: ParticlePartial): string {
        return partial.value;
    }

    private static renderReferenceAsString(partial: ReferencePartial): string {
        if (partial.referenceType === ReferenceType.CARD) {
            return CardDescription.renderAsString(partial.value);
        } else if (partial.referenceType === ReferenceType.SKILL) {
            if (typeof partial.value === "number") {
                return SkillReferenceDescriptor.renderAsString(partial.value);
            } else {
                return SkillDescriptor.renderAsString(partial.value);
            }
        } else if (partial.referenceType === ReferenceType.TRAIT) {
            return TraitDescription.renderAsString(partial.value);
        }

        return partial.value.toString();
    }

    private static renderText(partial: TextPartial): string {
        return partial.value;
    }

    private static renderValue(partial: ValuePartial): string {
        if (partial.valueType === ValueType.PERCENT) {
            return partial.value.toString() + "%";
        }

        return partial.value.toString();
    }

    static renderAsString(descriptor: Descriptor): string {
        const partials = descriptor.partials(),
            fragments: string[] = [];

        for (let i = 0; i < partials.length; i++) {
            const partial = partials[i];

            if (partial.type === PartialType.PARTICLE) {
                fragments.push(Description.renderParticle(partial));
            } else if (partial.type === PartialType.REFERENCE) {
                fragments.push(Description.renderReferenceAsString(partial as ReferencePartial));
            } else if (partial.type === PartialType.TEXT) {
                fragments.push(Description.renderText(partial));
            } else if (partial.type === PartialType.VALUE) {
                fragments.push(Description.renderValue(partial as ValuePartial));
            } else {
                fragments.push(partial.value.toString());
            }
        }

        return fragments.join("");
    }

    private renderReference(partial: ReferencePartial, key: number) {
        if (partial.referenceType === ReferenceType.CARD) {
            return <CardDescription key={key} region={this.props.region} card={partial.value} />;
        } else if (partial.referenceType === ReferenceType.SKILL) {
            if (typeof partial.value === "number") {
                return <SkillReferenceDescriptor key={key} region={this.props.region} id={partial.value} />;
            } else {
                return <SkillDescriptor key={key} region={this.props.region} skill={partial.value} />;
            }
        } else if (partial.referenceType === ReferenceType.TRAIT) {
            return <TraitDescription key={key} region={this.props.region} trait={partial.value} />;
        }

        return partial.value.toString();
    }

    render() {
        const partials = this.props.descriptor.partials(),
            fragments = [];

        for (let i = 0; i < partials.length; i++) {
            const partial = partials[i];

            if (partial.type === PartialType.PARTICLE) {
                fragments.push(Description.renderParticle(partial));
            } else if (partial.type === PartialType.REFERENCE) {
                fragments.push(this.renderReference(partial as ReferencePartial, i));
            } else if (partial.type === PartialType.TEXT) {
                fragments.push(Description.renderText(partial));
            } else if (partial.type === PartialType.VALUE) {
                fragments.push(Description.renderValue(partial as ValuePartial));
            } else {
                fragments.push(partial.value.toString());
            }
        }

        return <React.Fragment>{fragments}</React.Fragment>;
    }
}

export default Description;
