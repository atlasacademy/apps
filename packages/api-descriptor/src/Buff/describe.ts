import {Buff, Trait} from "@atlasacademy/api-connector";
import {BasePartial, Descriptor, ParticlePartial, TextPartial} from "../Descriptor";
import {insertParticles, toTitleCase} from "../Helpers";
import TraitReferencePartial from "../Trait/TraitReferencePartial";
import {getTraitDescription, getUpDownBuffType} from "./BuffHelpers";
import {buffTriggerTypes, buffTypeDescriptions} from "./BuffTypes";

function appendTraitFilters(
    selfTraits: Trait.Trait[],
    targetTraits: Trait.Trait[],
    selfParticle = "for",
    targetParticle = "vs."
): BasePartial[] {
    const partials: BasePartial[] = [],
        selfTraitFilters = traitReferences(selfTraits),
        targetTraitFilters = traitReferences(targetTraits);

    if (selfTraitFilters.length) {
        partials.push(new ParticlePartial(` ${selfParticle} `));
        partials.push(...selfTraitFilters);
    }

    if (targetTraitFilters.length) {
        partials.push(new ParticlePartial(` ${targetParticle} `));
        partials.push(...targetTraitFilters);
    }

    return partials;
}

function traitReferences(traits: Trait.Trait[]): BasePartial[] {
    return insertParticles(
        traits.map(trait => new TraitReferencePartial(trait)),
        ' & '
    );
}

export default function (buff: Buff.BasicBuff): Descriptor {
    const partials: BasePartial[] = [],
        upDownBuffType = getUpDownBuffType(buff.type),
        triggerType = buffTriggerTypes.get(buff.type),
        traitDescription = getTraitDescription(buff),
        typeDescription = buffTypeDescriptions.get(buff.type);

    if (buff.type === Buff.BuffType.PREVENT_DEATH_BY_DAMAGE && typeDescription) {
        partials.push(new TextPartial(typeDescription));
        partials.push(...appendTraitFilters(buff.ckSelfIndv, buff.ckOpIndv, "for", "from"));
    } else if (upDownBuffType) {
        if (upDownBuffType.up === buff.type) {
            partials.push(new TextPartial(`${upDownBuffType.description} Up`));
        } else {
            partials.push(new TextPartial(`${upDownBuffType.description} Down`));
        }

        partials.push(...appendTraitFilters(buff.ckSelfIndv, buff.ckOpIndv));
    } else if (traitDescription) {
        partials.push(new TextPartial(traitDescription));
        partials.push(...appendTraitFilters(buff.ckSelfIndv, buff.ckOpIndv));
    } else if (typeDescription) {
        partials.push(new TextPartial(typeDescription));
        partials.push(...appendTraitFilters(buff.ckSelfIndv, buff.ckOpIndv));
    } else if (triggerType) {
        partials.push(new TextPartial('Trigger Skills'));
        partials.push(new ParticlePartial(triggerType.after ? ' on ' : ' before '));

        if (triggerType.when) {
            partials.push(new TextPartial(triggerType.when));
            partials.push(new ParticlePartial(' '));
        }

        if (buff.ckSelfIndv.length) {
            partials.push(...traitReferences(buff.ckSelfIndv));
            partials.push(new ParticlePartial(' '));
        }

        partials.push(new TextPartial(triggerType.event));
        partials.push(...appendTraitFilters([], buff.ckOpIndv));
    } else if (buff.name) {
        partials.push(new TextPartial(buff.name));
    } else {
        partials.push(new TextPartial(toTitleCase(buff.type)));
    }

    if (buff.script.INDIVIDUALITIE) {
        partials.push(new TextPartial(' if self has '));
        partials.push(...traitReferences([buff.script.INDIVIDUALITIE]));
    }

    return new Descriptor(partials);
}
