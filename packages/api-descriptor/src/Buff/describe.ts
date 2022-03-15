import { Buff, Trait } from "@atlasacademy/api-connector";

import { BasePartial, Descriptor, ParticlePartial, TextPartial, ValuePartial, ValueType } from "../Descriptor";
import { insertParticles, toTitleCase } from "../Helpers";
import TraitReferencePartial from "../Trait/TraitReferencePartial";
import { getTraitDescription, getUpDownBuffType } from "./BuffHelpers";
import { buffTriggerTypes, buffTypeDescriptions } from "./BuffTypes";

function appendTraitFilters(
    selfTraits: Trait.Trait[],
    targetTraits: Trait.Trait[],
    checkIndvType?: number,
    selfParticle = "for",
    targetParticle = "vs."
): BasePartial[] {
    if (checkIndvType === 1) {
        selfParticle = "if self has";
        targetParticle = "if target has";
    }
    const partials: BasePartial[] = [],
        selfTraitFilters = traitReferences(selfTraits, checkIndvType),
        targetTraitFilters = traitReferences(targetTraits, checkIndvType);

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

function traitReferences(traits: Trait.Trait[], checkIndvType?: number): BasePartial[] {
    const joinWord = checkIndvType === 1 ? " and " : " or ";
    return insertParticles(
        traits.map((trait) => new TraitReferencePartial(trait)),
        joinWord
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
        partials.push(...appendTraitFilters(buff.ckSelfIndv, buff.ckOpIndv, buff.script.checkIndvType, "for", "from"));
    } else if (upDownBuffType) {
        if (upDownBuffType.up === buff.type) {
            partials.push(new TextPartial(`${upDownBuffType.description} Up`));
        } else {
            partials.push(new TextPartial(`${upDownBuffType.description} Down`));
        }

        partials.push(...appendTraitFilters(buff.ckSelfIndv, buff.ckOpIndv, buff.script.checkIndvType));
    } else if (traitDescription) {
        if (buff.type === Buff.BuffType.DONOT_ACT && buff.script.DamageRelease === -1) {
            partials.push(new TextPartial("Permanent "));
        }
        partials.push(new TextPartial(traitDescription));
        partials.push(...appendTraitFilters(buff.ckSelfIndv, buff.ckOpIndv, buff.script.checkIndvType));
    } else if (typeDescription) {
        partials.push(new TextPartial(typeDescription));
        partials.push(...appendTraitFilters(buff.ckSelfIndv, buff.ckOpIndv, buff.script.checkIndvType));
    } else if (triggerType && triggerType.counterNp) {
        partials.push(new TextPartial("NP Counter"));
    } else if (triggerType) {
        partials.push(new TextPartial("Trigger Skill"));
        partials.push(new ParticlePartial(triggerType.after ? " on " : " before "));

        if (triggerType.when) {
            partials.push(new TextPartial(triggerType.when));
            partials.push(new ParticlePartial(" "));
        }

        if (buff.ckSelfIndv.length) {
            partials.push(...traitReferences(buff.ckSelfIndv));
            partials.push(new ParticlePartial(" "));
        }

        partials.push(new TextPartial(triggerType.event));
        partials.push(...appendTraitFilters([], buff.ckOpIndv, buff.script.checkIndvType));
    } else if (buff.name) {
        partials.push(new TextPartial(buff.name));
    } else {
        partials.push(new TextPartial(toTitleCase(buff.type)));
    }

    if (buff.script.INDIVIDUALITIE !== undefined) {
        partials.push(new TextPartial(" if owner has "));
        partials.push(...traitReferences([buff.script.INDIVIDUALITIE]));
    }

    if (buff.type === Buff.BuffType.BUFF_RATE && buff.script.UpBuffRateBuffIndiv !== undefined) {
        partials.push(new TextPartial(" for "));
        partials.push(...traitReferences(buff.script.UpBuffRateBuffIndiv, 0));
    }

    if (buff.script.HP_LOWER !== undefined) {
        partials.push(new TextPartial(" if HP is below "));
        partials.push(new ValuePartial(ValueType.PERCENT, buff.script.HP_LOWER / 10));
    }

    return new Descriptor(partials);
}
