import React from "react";
import Func, {DataVal, FuncType} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import BuffDescriptor from "../BuffDescriptor";
import TraitDescriptor from "../TraitDescriptor";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.action,
        parts = section.parts;

    if (func.funcType === FuncType.ADD_STATE || func.funcType === FuncType.ADD_STATE_SHORT) {
        parts.push('Apply');
        func.buffs.forEach((buff, index) => {
            if (index > 0)
                parts.push('&');

            parts.push(<BuffDescriptor region={region} buff={buff}/>);
        });

        sections.target.preposition = 'on';
    } else if (func.funcType === FuncType.SUB_STATE) {
        parts.push('Remove effects');

        if (func.traitVals?.length) {
            parts.push('with');

            func.traitVals.forEach((trait, index) => {
                if (index > 0)
                    parts.push('&');

                parts.push(<TraitDescriptor region={region} trait={trait}/>);
            });
        }

        sections.target.preposition = 'for';
    } else if (func.funcType === FuncType.DAMAGE_NP) {
        parts.push('Deal damage');

        sections.amount.preposition = 'for';
    } else if (
        func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL
        || func.funcType === FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX
    ) {
        if (dataVal.Target) {
            parts.push(
                <span>Deal damage (additional to targets with {
                    <TraitDescriptor region={region} trait={dataVal.Target}/>
                })</span>
            );
        } else {
            parts.push('Deal damage');
        }

        sections.amount.preposition = 'for';
    } else if (func.funcType === FuncType.DAMAGE_NP_PIERCE) {
        parts.push('Deal damage that pierces defence');

        sections.amount.preposition = 'for';
    } else if (func.funcType === FuncType.DELAY_NPTURN) {
        parts.push('Drain Charge');

        sections.target.preposition = 'from';
    } else if (func.funcType === FuncType.GAIN_HP) {
        parts.push('Gain HP');

        sections.target.preposition = 'on';
    } else if (func.funcType === FuncType.GAIN_NP) {
        parts.push('Charge NP');

        sections.target.preposition = 'for';
    } else if (func.funcType === FuncType.GAIN_STAR) {
        parts.push('Gain Critical Stars');

        sections.target.showing = false;
    } else if (func.funcType === FuncType.INSTANT_DEATH) {
        parts.push('Apply Death');
    } else if (func.funcType === FuncType.LOSS_HP_SAFE) {
        parts.push('Lose HP');

        sections.target.showing = false;
    } else if (func.funcType === FuncType.NONE) {
        parts.push('No Effect');

        sections.target.showing = false;
    } else {
        parts.push(func.funcType);
    }
}
