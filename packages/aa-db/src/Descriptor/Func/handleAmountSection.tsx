import React from "react";
import {BuffType} from "../../Api/Data/Buff";
import Func, {DataVal, FuncType} from "../../Api/Data/Func";
import Region from "../../Api/Data/Region";
import BuffValueDescriptor from "../BuffValueDescriptor";
import FuncValueDescriptor from "../FuncValueDescriptor";
import SkillReferenceDescriptor from "../SkillReferenceDescriptor";
import TraitDescriptor from "../TraitDescriptor";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func, dataVal: DataVal, support?: boolean): void {
    const section = sections.amount,
        parts = section.parts;

    if (support) {
        parts.push('( Support only:');
    }

    if (func.buffs[0]?.type === BuffType.ADD_INDIVIDUALITY && typeof dataVal.Value === "number") {
        parts.push(
            <TraitDescriptor region={region} trait={dataVal.Value}/>
        );
    } else if (
        (
            func.buffs[0]?.type === BuffType.ATTACK_FUNCTION
            || func.buffs[0]?.type === BuffType.COMMANDATTACK_FUNCTION
            || func.buffs[0]?.type === BuffType.COMMANDATTACK_BEFORE_FUNCTION
            || func.buffs[0]?.type === BuffType.COMMANDCODEATTACK_FUNCTION
            || func.buffs[0]?.type === BuffType.DAMAGE_FUNCTION
            || func.buffs[0]?.type === BuffType.DEAD_FUNCTION
            || func.buffs[0]?.type === BuffType.DELAY_FUNCTION
            || func.buffs[0]?.type === BuffType.SELFTURNEND_FUNCTION
        )
        && typeof dataVal.Value === "number"
    ) {
        section.preposition = undefined;
        parts.push('that triggers');
        parts.push(
            <SkillReferenceDescriptor region={region} id={dataVal.Value}/>
        );
    } else if (func.funcType === FuncType.CARD_RESET && dataVal.Value) {
        section.preposition = undefined;
        parts.push(`${dataVal.Value} time${dataVal.Value > 1 ? 's' : ''}`);
    } else if (func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL_SUM) {
        parts.push(<FuncValueDescriptor region={region} func={func} staticDataVal={dataVal} dataVal={dataVal}
                                        hideRate={true}/>);
    } else if (
        (
            func.funcType === FuncType.ABSORB_NPTURN
            || func.funcType === FuncType.GAIN_HP_FROM_TARGETS
            || func.funcType === FuncType.GAIN_NP_FROM_TARGETS
        ) && dataVal.DependFuncId
    ) {
        if (dataVal.DependFuncVals?.Value) {
            section.parts.push(<FuncValueDescriptor region={region} func={func} staticDataVal={dataVal}
                                                    dataVal={dataVal} hideRate={true}/>);
        } else {
            section.showing = false;
        }
    } else if (dataVal.AddCount && (
        func.funcType === FuncType.EVENT_DROP_UP
        || func.funcType === FuncType.EXP_UP
        || func.funcType === FuncType.QP_UP
        || func.funcType === FuncType.USER_EQUIP_EXP_UP
    )) {
        parts.push(<FuncValueDescriptor region={region} func={func} staticDataVal={dataVal} dataVal={dataVal}/>);
    } else if (dataVal.RateCount && (
        func.funcType === FuncType.QP_DROP_UP
        || func.funcType === FuncType.SERVANT_FRIENDSHIP_UP
        || func.funcType === FuncType.USER_EQUIP_EXP_UP
    )) {
        parts.push(<FuncValueDescriptor region={region} func={func} staticDataVal={dataVal} dataVal={dataVal}/>);
    } else if (func.buffs[0]?.type === BuffType.NPATTACK_PREV_BUFF) {
        if (typeof dataVal.SkillID !== "number") {
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
        parts.push(<FuncValueDescriptor region={region} func={func} staticDataVal={dataVal} dataVal={dataVal}
                                        hideRate={true}/>);
    } else {
        section.showing = false;
    }

    if (support) {
        parts.push(')');
    }
}
