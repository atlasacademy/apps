import React from "react";
import {BuffType} from "../../Api/Data/Buff";
import Func, {DataVal, FuncType} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import BuffDescriptor from "../BuffDescriptor";
import TraitDescriptor from "../TraitDescriptor";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export const funcDescriptions = new Map<FuncType, string>([
    [FuncType.ADD_STATE, 'Apply Buff'],
    [FuncType.ADD_STATE_SHORT, 'Apply Buff'],
    [FuncType.CARD_RESET, 'Shuffle Cards'],
    [FuncType.DAMAGE_NP, 'Deal Damage'],
    [FuncType.DAMAGE_NP_INDIVIDUAL, 'Deal Damage with Bonus to Trait'],
    [FuncType.DAMAGE_NP_INDIVIDUAL_SUM, 'Deal Damage with Bonus per Trait'],
    [FuncType.DAMAGE_NP_PIERCE, 'Deal Damage that pierces defense'],
    [FuncType.DAMAGE_NP_RARE, 'Deal Damage with Bonus to Rarity'],
    [FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX, 'Deal Damage with Bonus to Trait'],
    [FuncType.DELAY_NPTURN, 'Drain Charge'],
    [FuncType.EXP_UP, 'Increase Master Exp'],
    [FuncType.FORCE_INSTANT_DEATH, 'Force Instant Death'],
    [FuncType.GAIN_HP, 'Restore HP'],
    [FuncType.GAIN_HP_FROM_TARGETS, 'Absorb HP'],
    [FuncType.GAIN_NP, 'Charge NP'],
    [FuncType.GAIN_STAR, 'Gain Critical Stars'],
    [FuncType.NONE, 'No Effect'],
    [FuncType.SUB_STATE, 'Remove Effects'],
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
                parts.push('&');

            parts.push(<TraitDescriptor region={region} trait={trait}/>);
        });
    }

    sections.target.preposition = 'on';
}

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.action,
        parts = section.parts;

    if (func.funcType === FuncType.ADD_STATE || func.funcType === FuncType.ADD_STATE_SHORT) {
        handleBuffActionSection(region, sections, func, dataVal);
    } else if (func.funcType === FuncType.SUB_STATE) {
        handleCleanseActionSection(region, sections, func, dataVal);
    } else if (
        func.funcType === FuncType.DAMAGE_NP
        || func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL
        || func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL_SUM
        || func.funcType === FuncType.DAMAGE_NP_PIERCE
        || func.funcType === FuncType.DAMAGE_NP_RARE
        || func.funcType === FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX
    ) {
        parts.push('Deal damage');

        sections.amount.preposition = 'of';
    } else if (
        func.funcType === FuncType.CARD_RESET
        || func.funcType === FuncType.GAIN_STAR
        || func.funcType === FuncType.NONE
    ) {
        parts.push(funcDescriptions.get(func.funcType) ?? func.funcType);

        sections.target.showing = false;
    } else if (func.funcType === FuncType.DELAY_NPTURN) {
        parts.push(funcDescriptions.get(func.funcType) ?? func.funcType);

        sections.target.preposition = 'from';
    } else if (func.funcType === FuncType.EXP_UP) {
        parts.push(funcDescriptions.get(func.funcType) ?? func.funcType);

        sections.chance.showing = false;
        sections.amount.preposition = 'by';
        sections.target.showing = false;
    } else if (func.funcType === FuncType.FORCE_INSTANT_DEATH) {
        parts.push(funcDescriptions.get(func.funcType) ?? func.funcType);

        sections.target.preposition = 'on';
    } else if (
        func.funcType === FuncType.GAIN_HP
        || func.funcType === FuncType.GAIN_NP
    ) {
        parts.push(funcDescriptions.get(func.funcType) ?? func.funcType);

        sections.amount.preposition = 'by';
        sections.target.preposition = 'for';
    } else if (func.funcType === FuncType.GAIN_HP_FROM_TARGETS) {
        parts.push(funcDescriptions.get(func.funcType) ?? func.funcType);

        sections.amount.preposition = 'of';
        sections.target.preposition = 'from';
    } else if (func.funcType === FuncType.GAIN_NP_FROM_TARGETS) {
        let drainAmount,
            drainTargets;

        switch (dataVal.DependFuncId) {
            case 474:
                drainAmount = `${dataVal.DependFuncVals?.Value ?? 1} Charge`;
                drainTargets = "All Enemies";
                break;
            case 3962:
                drainAmount = "NP";
                drainTargets = "All Other Allies";
                break;
        }

        parts.push(
            `Drain ${drainAmount} from ${drainTargets} and Charge NP`
        );

        sections.target.preposition = 'for';
    } else if (func.funcType === FuncType.HASTEN_NPTURN) {
        parts.push('Charge NP');

        sections.amount.preposition = 'by';
        sections.target.preposition = 'for';
    } else if (func.funcType === FuncType.INSTANT_DEATH) {
        parts.push('Apply Death');
    } else if (func.funcType === FuncType.LOSS_HP_SAFE) {
        parts.push('Drain HP');

        sections.target.preposition = 'from';
    } else if (func.funcType === FuncType.LOSS_NP) {
        parts.push('Drain NP');

        sections.target.preposition = 'from';
    } else {
        parts.push(funcDescriptions.get(func.funcType) ?? func.funcType);
    }
}
