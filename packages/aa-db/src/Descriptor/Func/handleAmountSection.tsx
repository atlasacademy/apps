import React from "react";
import {BuffType} from "../../Api/Data/Buff";
import Func, {DataVal, FuncType} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import BuffValueDescriptor from "../BuffValueDescriptor";
import FuncValueDescriptor from "../FuncValueDescriptor";
import SkillReferenceDescriptor from "../SkillReferenceDescriptor";
import TraitDescriptor from "../TraitDescriptor";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal): void {
    const section = sections.amount,
        parts = section.parts;

    if (func.buffs[0]?.type === BuffType.ADD_INDIVIDUALITY && dataVal.Value) {
        parts.push(
            <TraitDescriptor region={region} trait={dataVal.Value}/>
        );
    } else if (
        (
            func.buffs[0]?.type === BuffType.ATTACK_FUNCTION
            || func.buffs[0]?.type === BuffType.COMMANDATTACK_FUNCTION
            || func.buffs[0]?.type === BuffType.COMMANDATTACK_BEFORE_FUNCTION
        )
        && dataVal.Value
    ) {
        section.preposition = undefined;
        parts.push('that triggers');
        parts.push(
            <SkillReferenceDescriptor region={region} id={dataVal.Value}/>
        );
    } else if (func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL_SUM) {
        const prunedValues = {...dataVal};
        if (prunedValues.Rate === 1000)
            prunedValues.Rate = undefined;

        parts.push(<FuncValueDescriptor region={region} func={func} dataVal={prunedValues}/>);
    } else if (func.buffs[0]?.type === BuffType.NPATTACK_PREV_BUFF) {
        if (dataVal.SkillID === undefined) {
            section.showing = false;
            return;
        }

        section.preposition = undefined;
        parts.push('that triggers');
        parts.push(
            <SkillReferenceDescriptor region={region} id={dataVal.SkillID}/>
        );
    } else if (func.buffs[0] && dataVal.Value) {
        parts.push(<BuffValueDescriptor region={region} buff={func.buffs[0]} dataVal={dataVal}/>);
    } else if (dataVal.Value) {
        // there are some properties that we don't want back as the description
        const prunedValues = {...dataVal};
        prunedValues.Rate = undefined;

        parts.push(<FuncValueDescriptor region={region} func={func} dataVal={prunedValues}/>);
    } else {
        section.showing = false;
    }
}
