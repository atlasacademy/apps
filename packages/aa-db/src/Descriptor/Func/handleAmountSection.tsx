import {Buff, DataVal, Func, Region} from "@atlasacademy/api-connector";
import React from "react";
import BuffValueDescriptor from "../BuffValueDescriptor";
import FuncValueDescriptor from "../FuncValueDescriptor";
import SkillReferenceDescriptor from "../SkillReferenceDescriptor";
import TraitDescription from "../TraitDescription";
import {FuncDescriptorSections} from "./FuncDescriptorSections";

export default function (region: Region, sections: FuncDescriptorSections, func: Func.Func, dataVal: DataVal.DataVal, support?: boolean): void {
    const section = sections.amount,
        parts = section.parts;

    if (support) {
        parts.push('( Support only:');
    }

    if (func.buffs[0]?.type === Buff.BuffType.ADD_INDIVIDUALITY && typeof dataVal.Value === "number") {
        parts.push(
            <TraitDescription region={region} trait={dataVal.Value}/>
        );
    } else if (
        (
            func.buffs[0]?.type === Buff.BuffType.ATTACK_FUNCTION
            || func.buffs[0]?.type === Buff.BuffType.COMMANDATTACK_FUNCTION
            || func.buffs[0]?.type === Buff.BuffType.COMMANDATTACK_BEFORE_FUNCTION
            || func.buffs[0]?.type === Buff.BuffType.COMMANDCODEATTACK_FUNCTION
            || func.buffs[0]?.type === Buff.BuffType.DAMAGE_FUNCTION
            || func.buffs[0]?.type === Buff.BuffType.DEAD_FUNCTION
            || func.buffs[0]?.type === Buff.BuffType.DELAY_FUNCTION
            || func.buffs[0]?.type === Buff.BuffType.GUTS_FUNCTION
            || func.buffs[0]?.type === Buff.BuffType.SELFTURNEND_FUNCTION
        )
        && typeof dataVal.Value === "number"
    ) {
        section.preposition = undefined;
        parts.push('that triggers');
        parts.push(
            <SkillReferenceDescriptor region={region} id={dataVal.Value}/>
        );
    } else if (func.funcType === Func.FuncType.CARD_RESET && dataVal.Value) {
        section.preposition = undefined;
        parts.push(`${dataVal.Value} time${dataVal.Value > 1 ? 's' : ''}`);
    } else if (func.funcType === Func.FuncType.DAMAGE_NP_INDIVIDUAL_SUM) {
        parts.push(<FuncValueDescriptor region={region} func={func} staticDataVal={dataVal} dataVal={dataVal}
                                        hideRate={true}/>);
    } else if (
        (
            func.funcType === Func.FuncType.ABSORB_NPTURN
            || func.funcType === Func.FuncType.GAIN_HP_FROM_TARGETS
            || func.funcType === Func.FuncType.GAIN_NP_FROM_TARGETS
        ) && dataVal.DependFuncId
    ) {
        if (dataVal.DependFuncVals?.Value) {
            section.parts.push(<FuncValueDescriptor region={region} func={func} staticDataVal={dataVal}
                                                    dataVal={dataVal} hideRate={true}/>);
        } else {
            section.showing = false;
        }
    } else if (dataVal.AddCount && (
        func.funcType === Func.FuncType.EVENT_DROP_UP
        || func.funcType === Func.FuncType.EXP_UP
        || func.funcType === Func.FuncType.QP_UP
        || func.funcType === Func.FuncType.USER_EQUIP_EXP_UP
    )) {
        parts.push(<FuncValueDescriptor region={region} func={func} staticDataVal={dataVal} dataVal={dataVal}/>);
    } else if (dataVal.RateCount && (
        func.funcType === Func.FuncType.QP_DROP_UP
        || func.funcType === Func.FuncType.SERVANT_FRIENDSHIP_UP
        || func.funcType === Func.FuncType.USER_EQUIP_EXP_UP
    )) {
        parts.push(<FuncValueDescriptor region={region} func={func} staticDataVal={dataVal} dataVal={dataVal}/>);
    } else if (func.buffs[0]?.type === Buff.BuffType.NPATTACK_PREV_BUFF) {
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
    } else if (!dataVal.Value && dataVal.Correction) {
        section.preposition = 'with';
        parts.push('bonus');
        parts.push(<FuncValueDescriptor region={region} func={func} staticDataVal={dataVal} dataVal={dataVal}
                                        hideRate={true}/>);
    } else {
        section.showing = false;
    }

    if (support) {
        parts.push(')');
    }
}
