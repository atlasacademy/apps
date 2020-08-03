import React from "react";
import {BuffType} from "../../Api/Data/Buff";
import Func, {DataVal, FuncType} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import BuffDescriptor from "../BuffDescriptor";
import TraitDescriptor from "../TraitDescriptor";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export const funcDescriptions = new Map<FuncType, string>([
    [FuncType.ABSORB_NPTURN, 'Absorb Charge'],
    [FuncType.ADD_STATE, 'Apply Buff'],
    [FuncType.ADD_STATE_SHORT, 'Apply Buff'],
    [FuncType.CARD_RESET, 'Shuffle Cards'],
    [FuncType.DAMAGE_NP, 'Deal Damage'],
    [FuncType.DAMAGE_NP_HPRATIO_LOW, 'Deal Damage with Bonus for Low Health'],
    [FuncType.DAMAGE_NP_INDIVIDUAL, 'Deal Damage with Bonus to Trait'],
    [FuncType.DAMAGE_NP_INDIVIDUAL_SUM, 'Deal Damage with Bonus per Trait'],
    [FuncType.DAMAGE_NP_PIERCE, 'Deal Damage that pierces defense'],
    [FuncType.DAMAGE_NP_RARE, 'Deal Damage with Bonus to Rarity'],
    [FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX, 'Deal Damage with Bonus to Trait'],
    [FuncType.DELAY_NPTURN, 'Drain Charge'],
    [FuncType.EVENT_DROP_UP, 'Increase Drop Amount'],
    [FuncType.ENEMY_ENCOUNT_COPY_RATE_UP, 'Create Clone of Enemy'],
    [FuncType.ENEMY_ENCOUNT_RATE_UP, 'Improve Appearance Rate of Enemy'],
    [FuncType.EXP_UP, 'Increase Master Exp'],
    [FuncType.EXTEND_SKILL, 'Increase Cooldowns'],
    [FuncType.FIX_COMMANDCARD, 'Lock Command Cards'],
    [FuncType.FORCE_INSTANT_DEATH, 'Force Instant Death'],
    [FuncType.GAIN_HP, 'Restore HP'],
    [FuncType.GAIN_HP_FROM_TARGETS, 'Absorb HP'],
    [FuncType.GAIN_HP_PER, 'Restore HP to Percent'],
    [FuncType.GAIN_NP, 'Charge NP'],
    [FuncType.GAIN_NP_BUFF_INDIVIDUAL_SUM, 'Charge NP per Trait'],
    [FuncType.GAIN_NP_FROM_TARGETS, 'Absorb NP'],
    [FuncType.GAIN_STAR, 'Gain Critical Stars'],
    [FuncType.HASTEN_NPTURN, 'Increase Charge'],
    [FuncType.INSTANT_DEATH, 'Apply Death'],
    [FuncType.LOSS_HP, 'Drain HP'],
    [FuncType.LOSS_HP_SAFE, 'Drain HP without killing'],
    [FuncType.LOSS_NP, 'Drain NP'],
    [FuncType.LOSS_STAR, 'Remove Critical Stars'],
    [FuncType.NONE, 'No Effect'],
    [FuncType.QP_DROP_UP, 'Increase QP Reward'],
    [FuncType.QP_UP, 'Increase QP Reward'],
    [FuncType.REPLACE_MEMBER, 'Swap members'],
    [FuncType.SERVANT_FRIENDSHIP_UP, 'Increase Bond Gain'],
    [FuncType.SHORTEN_SKILL, 'Reduce Cooldowns'],
    [FuncType.SUB_STATE, 'Remove Effects'],
    [FuncType.USER_EQUIP_EXP_UP, 'Increase Mystic Code Exp'],
]);

function handleBuffActionSection(region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.action,
        parts = section.parts;

    parts.push('Apply');
    func.buffs.forEach((buff, index) => {
        if (index > 0)
            parts.push('&');

        parts.push(<BuffDescriptor region={region} buff={buff}/>);
    });

    if (func.buffs[0]?.type === BuffType.FIELD_INDIVIDUALITY) {
        sections.amount.preposition = 'to';
    }

    sections.target.preposition = 'on';
    if (
        func.buffs[0]?.type === BuffType.COMMANDATTACK_FUNCTION
        || func.buffs[0]?.type === BuffType.NPATTACK_PREV_BUFF
    ) {
        sections.target.preposition = 'for';
    }
}

function handleCleanseActionSection(region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.action,
        parts = section.parts;

    parts.push(funcDescriptions.get(func.funcType) ?? func.funcType);

    if (func.traitVals?.length) {
        parts.push('with');

        func.traitVals.forEach((trait, index) => {
            if (index > 0)
                parts.push('or');

            parts.push(<TraitDescriptor region={region} trait={trait}/>);
        });
    }

    sections.target.preposition = 'on';
}

function handleChargeNpPerTraitActionSection(region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.action,
        parts = section.parts;

    parts.push('Charge NP per');

    if (func.traitVals?.length) {
        func.traitVals.forEach((trait, index) => {
            if (index > 0)
                parts.push('&');

            parts.push(<TraitDescriptor region={region} trait={trait}/>);
        });
    }

    parts.push('traits');

    sections.amount.preposition = 'by';
    sections.target.preposition = 'for';
}

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.action,
        parts = section.parts;

    if (func.funcType === FuncType.ADD_STATE || func.funcType === FuncType.ADD_STATE_SHORT) {
        handleBuffActionSection(region, sections, func, dataVal);

        return;
    } else if (func.funcType === FuncType.SUB_STATE) {
        handleCleanseActionSection(region, sections, func, dataVal);

        return;
    } else if (func.funcType === FuncType.GAIN_NP_BUFF_INDIVIDUAL_SUM) {
        handleChargeNpPerTraitActionSection(region, sections, func, dataVal);

        return;
    } else if (
        func.funcType === FuncType.DAMAGE_NP
        || func.funcType === FuncType.DAMAGE_NP_HPRATIO_LOW
        || func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL
        || func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL_SUM
        || func.funcType === FuncType.DAMAGE_NP_PIERCE
        || func.funcType === FuncType.DAMAGE_NP_RARE
        || func.funcType === FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX
    ) {
        parts.push('Deal damage');
        sections.amount.preposition = 'of';

        return;
    }

    switch (func.funcType) {
        case FuncType.ABSORB_NPTURN:
        case FuncType.GAIN_HP_FROM_TARGETS:
        case FuncType.GAIN_NP_FROM_TARGETS:
            sections.amount.preposition = 'of';
            sections.target.preposition = 'from';
            break;
        case FuncType.CARD_RESET:
        case FuncType.GAIN_STAR:
        case FuncType.LOSS_STAR:
        case FuncType.NONE:
            sections.target.showing = false;
            break;
        case FuncType.DELAY_NPTURN:
        case FuncType.LOSS_HP:
        case FuncType.LOSS_HP_SAFE:
        case FuncType.LOSS_NP:
            sections.amount.preposition = 'by';
            sections.target.preposition = 'from';
            break;
        case FuncType.ENEMY_ENCOUNT_COPY_RATE_UP:
        case FuncType.ENEMY_ENCOUNT_RATE_UP:
        case FuncType.FIX_COMMANDCARD:
            sections.amount.showing = false;
            sections.target.showing = false;
            break;
        case FuncType.EVENT_DROP_UP:
        case FuncType.EXP_UP:
        case FuncType.QP_DROP_UP:
        case FuncType.QP_UP:
        case FuncType.SERVANT_FRIENDSHIP_UP:
        case FuncType.USER_EQUIP_EXP_UP:
            sections.chance.showing = false;
            sections.amount.preposition = 'by';
            sections.target.showing = false;
            break;
        case FuncType.EXTEND_SKILL:
        case FuncType.GAIN_HP:
        case FuncType.GAIN_NP:
        case FuncType.HASTEN_NPTURN:
        case FuncType.SHORTEN_SKILL:
            sections.amount.preposition = 'by';
            sections.target.preposition = 'for';
            break;
        case FuncType.FORCE_INSTANT_DEATH:
        case FuncType.INSTANT_DEATH:
            sections.amount.showing = false;
            sections.target.preposition = 'on';
            break;
        case FuncType.GAIN_HP_PER:
            sections.amount.preposition = 'of';
            sections.target.preposition = 'for';
            break;
        case FuncType.REPLACE_MEMBER:
            sections.amount.showing = false;
            sections.target.preposition = 'with';
            break;
    }

    parts.push(funcDescriptions.get(func.funcType) ?? func.funcType);
}
