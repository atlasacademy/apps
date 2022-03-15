import { Func } from "@atlasacademy/api-connector";

import { default as describeBuff } from "../../Buff/describe";
import { BasePartial, ParticlePartial, TextPartial } from "../../Descriptor";
import { default as describeTrait } from "../../Trait/describe";

const funcDescriptions = new Map<Func.FuncType, string>([
    [Func.FuncType.ABSORB_NPTURN, "Absorb NP Charge"],
    [Func.FuncType.ADD_STATE, "Apply Buff"],
    [Func.FuncType.ADD_STATE_SHORT, "Apply Buff"],
    [Func.FuncType.CARD_RESET, "Shuffle Cards"],
    [Func.FuncType.CHANGE_BGM_COSTUME, "Change BGM"],
    [Func.FuncType.DAMAGE_NP, "Deal Damage"],
    [Func.FuncType.DAMAGE_NP_HPRATIO_LOW, "Deal Damage with Bonus for Low Health"],
    [Func.FuncType.DAMAGE_NP_INDIVIDUAL, "Deal Damage with Bonus to Trait"],
    [Func.FuncType.DAMAGE_NP_INDIVIDUAL_SUM, "Deal Damage with Bonus per Trait"],
    [Func.FuncType.DAMAGE_NP_PIERCE, "Deal Damage that pierces defense"],
    [Func.FuncType.DAMAGE_NP_RARE, "Deal Damage with Bonus to Rarity"],
    [Func.FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX, "Deal Damage with Bonus to Trait"],
    [Func.FuncType.DAMAGE_VALUE, "Deal Damage"],
    [Func.FuncType.DELAY_NPTURN, "Drain Charge"],
    [Func.FuncType.EVENT_DROP_UP, "Increase Drop Amount"],
    [Func.FuncType.EVENT_POINT_UP, "Increase Drop Amount"],
    [Func.FuncType.EVENT_DROP_RATE_UP, "Increase Drop Rate"],
    [Func.FuncType.EVENT_POINT_RATE_UP, "Increase Drop Rate"],
    [Func.FuncType.ENEMY_ENCOUNT_COPY_RATE_UP, "Create Clone of Enemy"],
    [Func.FuncType.ENEMY_ENCOUNT_RATE_UP, "Improve Appearance Rate of Enemy"],
    [Func.FuncType.EXP_UP, "Increase Master Exp"],
    [Func.FuncType.EXTEND_SKILL, "Increase Cooldowns"],
    [Func.FuncType.FIX_COMMANDCARD, "Lock Command Cards"],
    [Func.FuncType.FRIEND_POINT_UP, "Increase Friend Point"],
    [Func.FuncType.FRIEND_POINT_UP_DUPLICATE, "Increase Friend Point (stackable)"],
    [Func.FuncType.FORCE_INSTANT_DEATH, "Force Instant Death"],
    [Func.FuncType.GAIN_HP, "Restore HP"],
    [Func.FuncType.GAIN_HP_FROM_TARGETS, "Absorb HP"],
    [Func.FuncType.GAIN_HP_PER, "Restore HP to Percent"],
    [Func.FuncType.GAIN_NP, "Charge NP"],
    [Func.FuncType.GAIN_NP_BUFF_INDIVIDUAL_SUM, "Charge NP per Trait"],
    [Func.FuncType.GAIN_NP_FROM_TARGETS, "Absorb NP Charge"],
    [Func.FuncType.GAIN_STAR, "Gain Critical Stars"],
    [Func.FuncType.HASTEN_NPTURN, "Increase Charge"],
    [Func.FuncType.INSTANT_DEATH, "Apply Death"],
    [Func.FuncType.LOSS_HP, "Drain HP"],
    [Func.FuncType.LOSS_HP_SAFE, "Drain HP without killing"],
    [Func.FuncType.LOSS_NP, "Drain NP"],
    [Func.FuncType.LOSS_STAR, "Remove Critical Stars"],
    [Func.FuncType.MOVE_STATE, "Move Effects"],
    [Func.FuncType.MOVE_TO_LAST_SUBMEMBER, "Move to last reserve slot"],
    [Func.FuncType.NONE, "No Effect"],
    [Func.FuncType.QP_DROP_UP, "Increase QP Reward"],
    [Func.FuncType.QP_UP, "Increase QP Reward"],
    [Func.FuncType.REPLACE_MEMBER, "Swap members"],
    [Func.FuncType.SERVANT_FRIENDSHIP_UP, "Increase Bond Gain"],
    [Func.FuncType.SHORTEN_SKILL, "Reduce Cooldowns"],
    [Func.FuncType.SUB_STATE, "Remove Effects"],
    [Func.FuncType.USER_EQUIP_EXP_UP, "Increase Mystic Code Exp"],
]);

export default function (func: Func.Func): BasePartial[] {
    const partials: BasePartial[] = [];

    switch (func.funcType) {
        case Func.FuncType.ADD_STATE:
        case Func.FuncType.ADD_STATE_SHORT:
            return describeBuffActionSection(partials, func);
        case Func.FuncType.SUB_STATE:
            return describeCleanseActionSection(partials, func);
        case Func.FuncType.GAIN_NP_BUFF_INDIVIDUAL_SUM:
            return describeChargeNpPerTraitActionSection(partials, func);
        case Func.FuncType.DAMAGE_NP:
        case Func.FuncType.DAMAGE_NP_HPRATIO_LOW:
        case Func.FuncType.DAMAGE_NP_INDIVIDUAL:
        case Func.FuncType.DAMAGE_NP_INDIVIDUAL_SUM:
        case Func.FuncType.DAMAGE_NP_PIERCE:
        case Func.FuncType.DAMAGE_NP_RARE:
        case Func.FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX:
            addPartials(partials, [new TextPartial("Deal damage")]);

            return partials;
    }

    addPartials(partials, [new TextPartial(funcDescriptions.get(func.funcType) ?? func.funcType)]);

    return partials;
}

function addPartials(partials: BasePartial[], additional: BasePartial[], preposition?: string) {
    if (!additional.length) return;

    if (partials.length) partials.push(new ParticlePartial(preposition ?? " "));

    partials.push(...additional);
}

function describeBuffActionSection(partials: BasePartial[], func: Func.Func): BasePartial[] {
    const buffDescriptions: BasePartial[] = [];

    func.buffs.forEach((buff) => {
        addPartials(buffDescriptions, describeBuff(buff).partials(), " & ");
    });

    addPartials(partials, [new TextPartial("Apply")]);
    addPartials(partials, buffDescriptions);

    return partials;
}

function describeCleanseActionSection(partials: BasePartial[], func: Func.Func): BasePartial[] {
    const traitDescriptions: BasePartial[] = [];

    func.traitVals?.forEach((trait) => {
        addPartials(traitDescriptions, describeTrait(trait).partials(), " or ");
    });

    addPartials(partials, [new TextPartial("Remove Effects")]);
    addPartials(partials, traitDescriptions, " with ");

    return partials;
}

function describeChargeNpPerTraitActionSection(partials: BasePartial[], func: Func.Func): BasePartial[] {
    const traitDescriptions: BasePartial[] = [];

    func.traitVals?.forEach((trait) => {
        addPartials(traitDescriptions, describeTrait(trait).partials(), " & ");
    });

    addPartials(partials, [new TextPartial("Charge NP")]);
    addPartials(partials, traitDescriptions, " per ");

    return partials;
}
