import { Buff, DataVal, Func, Region } from "@atlasacademy/api-connector";

import { asPercent, mergeElements } from "../../Helper/OutputHelper";
import BuffValueDescription from "../BuffValueDescription";
import EntityReferenceDescriptor from "../EntityReferenceDescriptor";
import FuncValueDescriptor from "../FuncValueDescriptor";
import { NoblePhantasmDescriptorId } from "../NoblePhantasmDescriptor";
import SkillReferenceDescriptor from "../SkillReferenceDescriptor";
import TraitDescription from "../TraitDescription";
import { FuncDescriptorSections } from "./FuncDescriptorSections";

export default function handleAmountSection(
    region: Region,
    sections: FuncDescriptorSections,
    func: Func.BasicFunc,
    dataVal: DataVal.DataVal,
    support?: boolean
): void {
    const section = sections.amount,
        parts = section.parts;

    if (support) {
        parts.push("( Support only:");
    }

    if (func.buffs[0]?.type === Buff.BuffType.ADD_INDIVIDUALITY && typeof dataVal.Value === "number") {
        parts.push(<TraitDescription region={region} trait={dataVal.Value} />);
    } else if (
        (func.buffs[0]?.type === Buff.BuffType.ATTACK_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.ATTACK_BEFORE_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.COMMANDATTACK_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.COMMANDATTACK_BEFORE_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.COMMANDCODEATTACK_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.COMMANDCODEATTACK_AFTER_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.DAMAGE_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.DEAD_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.DELAY_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.ENTRY_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.GUTS_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.SELFTURNEND_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.WAVESTART_FUNCTION ||
            func.buffs[0]?.type === Buff.BuffType.REFLECTION_FUNCTION) &&
        typeof dataVal.Value === "number"
    ) {
        section.preposition = undefined;
        if (dataVal.UseRate !== undefined) {
            parts.push(`that has ${dataVal.UseRate / 10}% chance to trigger`);
        } else {
            parts.push("that triggers");
        }
        parts.push(<SkillReferenceDescriptor region={region} id={dataVal.Value} />);
    } else if (func.funcType === Func.FuncType.CARD_RESET && dataVal.Value) {
        section.preposition = undefined;
        parts.push(`${dataVal.Value} time${dataVal.Value > 1 ? "s" : ""}`);
    } else if (func.funcType === Func.FuncType.HASTEN_NPTURN && dataVal.Value) {
        section.preposition = undefined;
        parts.push(`by ${dataVal.Value}`);
    } else if (func.funcType === Func.FuncType.DAMAGE_NP_INDIVIDUAL_SUM) {
        if (dataVal.Value) parts.push(" of ");
        parts.push(
            <FuncValueDescriptor
                region={region}
                func={func}
                staticDataVal={dataVal}
                dataVal={dataVal}
                hideRate={true}
            />
        );
    } else if (func.funcType === Func.FuncType.DAMAGE_VALUE) {
        parts.push(`${dataVal.Value}–${dataVal.Value2} randomly`);
        if (dataVal.DamageRates !== undefined)
            parts.push(
                `in ${dataVal.DamageRates.length} hits [${dataVal.DamageRates.map((rate) => asPercent(rate, 0)).join(
                    ", "
                )}]`
            );
    } else if (
        (func.funcType === Func.FuncType.ABSORB_NPTURN ||
            func.funcType === Func.FuncType.GAIN_HP_FROM_TARGETS ||
            func.funcType === Func.FuncType.GAIN_NP_FROM_TARGETS) &&
        dataVal.DependFuncId
    ) {
        if (dataVal.DependFuncVals?.Value) {
            section.parts.push(
                <FuncValueDescriptor
                    region={region}
                    func={func}
                    staticDataVal={dataVal}
                    dataVal={dataVal}
                    hideRate={true}
                />
            );
        } else {
            section.showing = false;
        }
    } else if (
        dataVal.AddCount !== undefined &&
        (func.funcType === Func.FuncType.EXP_UP ||
            func.funcType === Func.FuncType.QP_UP ||
            func.funcType === Func.FuncType.USER_EQUIP_EXP_UP ||
            func.funcType === Func.FuncType.FRIEND_POINT_UP ||
            func.funcType === Func.FuncType.FRIEND_POINT_UP_DUPLICATE)
    ) {
        parts.push(<FuncValueDescriptor region={region} func={func} staticDataVal={dataVal} dataVal={dataVal} />);
    } else if (
        dataVal.RateCount !== undefined &&
        (func.funcType === Func.FuncType.QP_DROP_UP ||
            func.funcType === Func.FuncType.SERVANT_FRIENDSHIP_UP ||
            func.funcType === Func.FuncType.USER_EQUIP_EXP_UP ||
            func.funcType === Func.FuncType.EXP_UP)
    ) {
        parts.push(<FuncValueDescriptor region={region} func={func} staticDataVal={dataVal} dataVal={dataVal} />);
    } else if (func.funcType === Func.FuncType.TRANSFORM_SERVANT && dataVal.Value !== undefined) {
        parts.push(<EntityReferenceDescriptor region={region} svtId={dataVal.Value} />);
        if (dataVal.SetLimitCount !== undefined) parts.push(`at ascension ${dataVal.SetLimitCount}`);
    } else if (func.buffs[0]?.type === Buff.BuffType.NPATTACK_PREV_BUFF) {
        if (typeof dataVal.SkillID !== "number") {
            section.showing = false;
            return;
        }

        section.preposition = undefined;
        parts.push("that triggers");
        parts.push(<SkillReferenceDescriptor region={region} id={dataVal.SkillID} />);
    } else if (func.buffs[0]?.type === Buff.BuffType.COUNTER_FUNCTION) {
        if (typeof dataVal.CounterId !== "number") {
            section.showing = false;
            return;
        }

        section.preposition = undefined;
        parts.push("that triggers");
        parts.push(<NoblePhantasmDescriptorId region={region} noblePhantasmId={dataVal.CounterId} />);
    } else if (func.buffs[0] !== undefined && dataVal.Value !== undefined) {
        parts.push(<BuffValueDescription region={region} buff={func.buffs[0]} dataVal={dataVal} />);

        if (dataVal.ParamAddValue !== undefined) {
            let traitIds: number[] = [],
                whoseTrait: string = "";
            if (dataVal.ParamAddSelfIndividuality !== undefined) {
                traitIds = dataVal.ParamAddSelfIndividuality;
                whoseTrait = "on self";
            } else if (dataVal.ParamAddOpIndividuality !== undefined) {
                traitIds = dataVal.ParamAddOpIndividuality;
                whoseTrait = "on enemy";
            } else if (dataVal.ParamAddFieldIndividuality !== undefined) {
                traitIds = dataVal.ParamAddFieldIndividuality;
                whoseTrait = "on field";
            }
            const traitDescription = mergeElements(
                    traitIds.map((id) => <TraitDescription region={region} trait={id} />),
                    " or "
                ),
                maxStack = dataVal.ParamAddMaxCount ? `${dataVal.ParamAddMaxCount} stacks` : undefined,
                maxValue = dataVal.ParamAddMaxValue ? (
                    <BuffValueDescription
                        region={region}
                        buff={func.buffs[0]}
                        dataVal={{ Value: dataVal.ParamAddMaxValue }}
                    />
                ) : undefined,
                limitDescription =
                    maxStack !== undefined || maxValue !== undefined ? (
                        <>[Max {mergeElements([maxStack, maxValue], " or ")}]</>
                    ) : (
                        <></>
                    ),
                stackValue = (
                    <BuffValueDescription
                        region={region}
                        buff={func.buffs[0]}
                        dataVal={{ Value: dataVal.ParamAddValue }}
                    />
                );

            parts.push(
                <span>
                    + {stackValue} per stack of {traitDescription} {whoseTrait} {limitDescription}
                </span>
            );
        }
        if (dataVal.UseRate !== undefined) {
            parts.push(`with ${dataVal.UseRate / 10}% chance to work`);
        }
        if (dataVal.RatioHPLow !== undefined) {
            const maxScaleHP = dataVal.RatioHPRangeHigh ?? 1000,
                minScaleHP = dataVal.RatioHPRangeLow ?? 0;
            parts.push(`scaled with remaining HP ${maxScaleHP / 10}–${minScaleHP / 10}%`);
        }
    } else if (dataVal.Value) {
        parts.push(
            <FuncValueDescriptor
                region={region}
                func={func}
                staticDataVal={dataVal}
                dataVal={dataVal}
                hideRate={true}
            />
        );
    } else if (!dataVal.Value && dataVal.Correction) {
        section.preposition = "with";
        parts.push(
            <FuncValueDescriptor
                region={region}
                func={func}
                staticDataVal={dataVal}
                dataVal={dataVal}
                hideRate={true}
            />
        );
    } else if (dataVal.UseRate !== undefined) {
        section.preposition = undefined;
        parts.push(`with ${dataVal.UseRate / 10}% chance to work`);
    } else if (dataVal.RatioHPLow !== undefined) {
        section.preposition = undefined;
        const maxScaleValue = dataVal.RatioHPLow,
            minScaleValue = dataVal.RatioHPHigh ?? 0,
            maxScaleHP = dataVal.RatioHPRangeHigh ?? 1000,
            minScaleHP = dataVal.RatioHPRangeLow ?? 0;
        parts.push(
            `${minScaleValue / 10}–${maxScaleValue / 10}% scaled with remaining HP ${maxScaleHP / 10}–${
                minScaleHP / 10
            }%`
        );
    } else if (!dataVal.Value && dataVal.RatioHPRangeHigh !== undefined && dataVal.RatioHPRangeLow !== undefined) {
        section.preposition = undefined;
        parts.push(`scaled with remaining HP ${dataVal.RatioHPRangeHigh / 10}–${dataVal.RatioHPRangeLow / 10}%`);
    } else {
        section.showing = false;
    }

    if (dataVal.SameBuffLimitNum !== undefined) {
        section.preposition = undefined;
        parts.push(`[Max ${dataVal.SameBuffLimitNum} stacks]`);
        section.showing = true;
    }

    if (support) {
        parts.push(")");
    }
}
