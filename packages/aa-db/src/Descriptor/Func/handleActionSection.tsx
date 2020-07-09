import React from "react";
import {BuffType} from "../../Api/Data/Buff";
import Func, {DataVal, FuncType} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import {joinElements} from "../../Helper/OutputHelper";
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

        sections.target.preposition = 'on';
    } else if (func.funcType === FuncType.CARD_RESET) {
        parts.push('Shuffle Cards');

        sections.target.showing = false;
    } else if (func.funcType === FuncType.DAMAGE_NP) {
        parts.push('Deal damage');

        sections.amount.preposition = 'for';
    } else if (
        func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL
        || func.funcType === FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX
    ) {
        if (typeof dataVal.Target === "number") {
            parts.push(
                <span>Deal damage (additional to targets with {
                    <TraitDescriptor region={region} trait={dataVal.Target}/>
                })</span>
            );
        } else {
            parts.push('Deal damage');
        }

        sections.amount.preposition = 'for';
    } else if (func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL_SUM) {
        let additional = [];

        if (typeof dataVal.TargetList === "number") {
            additional.push('to targets with');
            additional.push(<TraitDescriptor region={region} trait={dataVal.TargetList}/>);
        }

        if (dataVal.ParamAddMaxCount) {
            additional.push(`[Limit ${dataVal.ParamAddMaxCount}]`);
        }

        parts.push('Deal damage');

        if (additional.length) {
            parts.push(<React.Fragment>
                (additional
                {' '}
                {joinElements(additional, ' ')
                    .map((element, index) => {
                        return <React.Fragment key={index}>{element}</React.Fragment>;
                    })
                })
            </React.Fragment>)
        }
    } else if (func.funcType === FuncType.DAMAGE_NP_RARE) {
        parts.push('Deal damage');

        if (typeof dataVal.TargetRarityList === "string") {
            parts.push('that deals additional to');
            parts.push(dataVal.TargetRarityList);
            parts.push(dataVal.TargetRarityList.split('/').length > 1 ? 'rarities' : 'rarity');
        }

        sections.amount.preposition = 'for';
    } else if (func.funcType === FuncType.DAMAGE_NP_PIERCE) {
        parts.push('Deal damage that pierces defence');

        sections.amount.preposition = 'for';
    } else if (func.funcType === FuncType.DELAY_NPTURN) {
        parts.push('Drain Charge');

        sections.target.preposition = 'from';
    } else if (func.funcType === FuncType.FORCE_INSTANT_DEATH) {
        parts.push('Force Instant Death');

        sections.target.preposition = 'on';
    } else if (func.funcType === FuncType.GAIN_HP) {
        parts.push('Restore HP');

        sections.target.preposition = 'for';
    } else if (func.funcType === FuncType.GAIN_NP) {
        parts.push('Charge NP');

        sections.target.preposition = 'for';
    } else if (func.funcType === FuncType.GAIN_HP_FROM_TARGETS) {
        let drainAmount,
            drainTargets;

        switch (dataVal.DependFuncId) {
            case 711:
                drainAmount = `${dataVal.DependFuncVals?.Value ?? ''} HP`;
                drainTargets = "All Enemies";
                break;
        }

        parts.push(
            `Drain ${drainAmount} from ${drainTargets} and Restore HP`
        );

        sections.target.preposition = 'for';
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
    } else if (func.funcType === FuncType.GAIN_STAR) {
        parts.push('Gain Critical Stars');

        sections.target.showing = false;
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
    } else if (func.funcType === FuncType.NONE) {
        parts.push('No Effect');

        sections.target.showing = false;
    } else {
        parts.push(func.funcType);
    }
}
