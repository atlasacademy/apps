import { Buff, DataVal, Entity, Func, Region } from "@atlasacademy/api-connector";
import { BuffDescriptor } from "@atlasacademy/api-descriptor";

import { asPercent, mergeElements } from "../../Helper/OutputHelper";
import { OrdinalNumeral } from "../../Helper/StringHelper";
import { lang } from "../../Setting/Manager";
import { BgmDescriptorId } from "../BgmDescriptor";
import BuffValueDescription from "../BuffValueDescription";
import EntityReferenceDescriptor from "../EntityReferenceDescriptor";
import FuncValueDescriptor from "../FuncValueDescriptor";
import { MultipleBuffIds, MultipleFunctionIds } from "../MultipleDescriptors";
import { NoblePhantasmDescriptorId } from "../NoblePhantasmDescriptor";
import SkillReferenceDescriptor from "../SkillReferenceDescriptor";
import TraitDescription from "../TraitDescription";
import { FuncDescriptorSections } from "./FuncDescriptorSections";

export default function handleAmountSection(
    region: Region,
    sections: FuncDescriptorSections,
    func: Func.BasicFunc,
    dataVal: DataVal.DataVal,
    mutatingDataVal: DataVal.DataVal[],
    support?: boolean,
    dependFunc?: Func.BasicFunc
): void {
    const section = sections.amount,
        parts = section.parts;

    if (support) {
        parts.push("( Support only:");
    }

    if (
        (func.buffs[0]?.type === Buff.BuffType.ADD_INDIVIDUALITY ||
            func.buffs[0]?.type === Buff.BuffType.SUB_INDIVIDUALITY) &&
        typeof dataVal.Value === "number"
    ) {
        const buff = func.buffs[0];
        if (dataVal.Value && ![9999].includes(dataVal.Value)) {
            parts.push(<TraitDescription region={region} trait={dataVal.Value} />);
        } else {
            if (buff !== undefined && buff.vals.length > 0) {
                parts.push(
                    mergeElements(
                        buff.vals
                            .filter((trait) => !["buffPositiveEffect", "buffNegativeEffect"].includes(trait.name))
                            .map((val) => <TraitDescription region={region} trait={val} />),
                        ","
                    )
                );
            } else {
                section.preposition = undefined;
            }
        }
    } else if (func.buffs[0]?.type === Buff.BuffType.SUB_FIELD_INDIVIDUALITY && dataVal.TargetList) {
        for (const traitId of dataVal.TargetList) {
            parts.push(<TraitDescription region={region} trait={traitId} />);
        }
    } else if (func.buffs[0]?.type === Buff.BuffType.CHANGE_BGM && dataVal.BgmId) {
        section.preposition = "to";
        parts.push(<BgmDescriptorId region={region} bgmId={dataVal.BgmId} showLink />);
    } else if (
        BuffDescriptor.BuffTypes.buffTriggerTypes.has(func.buffs[0]?.type) &&
        typeof dataVal.Value === "number"
    ) {
        section.preposition = undefined;
        if (dataVal.UseRate !== undefined) {
            parts.push(`that has ${dataVal.UseRate / 10}% chance to trigger`);
        } else if (
            dataVal.UseRate === undefined &&
            mutatingDataVal.filter((val) => val.UseRate !== undefined).length > 0
        ) {
            parts.push("with a chance to trigger");
        } else {
            parts.push("that triggers");
        }
        parts.push(<SkillReferenceDescriptor region={region} id={dataVal.Value} />);
    } else if (func.funcType === Func.FuncType.DISPLAY_BUFFSTRING) {
        section.preposition = undefined;
        parts.push(<span lang={lang(region)}>[{func.funcPopupText}]</span>);
    } else if (func.funcType === Func.FuncType.CARD_RESET && dataVal.Value) {
        section.preposition = undefined;
        parts.push(`${dataVal.Value} time${dataVal.Value > 1 ? "s" : ""}`);
    } else if (func.funcType === Func.FuncType.HASTEN_NPTURN && dataVal.Value) {
        section.preposition = undefined;
        parts.push(`by ${dataVal.Value}`);
    } else if (
        [
            Func.FuncType.EXTEND_BUFFCOUNT,
            Func.FuncType.SHORTEN_BUFFCOUNT,
            Func.FuncType.EXTEND_BUFFTURN,
            Func.FuncType.SHORTEN_BUFFTURN,
        ].includes(func.funcType) &&
        dataVal.Value !== undefined
    ) {
        section.preposition = "by";
        parts.push(`${dataVal.Value} turns`);
        if (dataVal.TargetList !== undefined) {
            parts.push(`for buffs with`);
            const traits = dataVal.TargetList.map((trait) => (
                <TraitDescription region={region} trait={trait} owner="buffs" ownerParameter="vals" />
            ));
            parts.push(mergeElements(traits, " or "));
        }
    } else if (func.funcType === Func.FuncType.SHORTEN_SKILL) {
        section.preposition = undefined;
        if (dataVal.Value2) {
            parts.push("of", <OrdinalNumeral index={dataVal.Value2} />, "skill");
        }
        if (dataVal.Value) {
            parts.push("by", dataVal.Value);
        }
    } else if (func.funcType === Func.FuncType.LAST_USE_PLAYER_SKILL_COPY) {
        if (dataVal.Value) parts.push(dataVal.Value);
        if (dataVal.CopyTargetBuffType) {
            parts.push(<MultipleBuffIds region={region} buffTypeIds={dataVal.CopyTargetBuffType} />);
            parts.push(`buff${dataVal.Value && dataVal.Value > 1 ? "s" : ""}`);
        }
        if (dataVal.CopyTargetFunctionType) {
            parts.push("applied by");
            parts.push(<MultipleFunctionIds region={region} funcTypeIds={dataVal.CopyTargetFunctionType} />);
            parts.push(`function${dataVal.Value && dataVal.Value > 1 ? "s" : ""}`);
        }
        if (dataVal.CopyFunctionTargetPTOnly === 1) {
            parts.push("from player servant");
        }
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
    } else if (
        func.funcType === Func.FuncType.LOSS_HP_SAFE &&
        dataVal.Value !== undefined &&
        dataVal.Value2 !== undefined
    ) {
        parts.push(`a random amount between ${dataVal.Value} and ${dataVal.Value2}`);
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
                    dependFunc={dependFunc}
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
            func.funcType === Func.FuncType.FRIEND_POINT_UP_DUPLICATE ||
            func.funcType === Func.FuncType.SERVANT_FRIENDSHIP_UP)
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
        parts.push(
            <EntityReferenceDescriptor region={region} svtId={dataVal.Value} forceType={Entity.EntityType.NORMAL} />
        );
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
    } else if (func.funcType === Func.FuncType.ADD_FIELD_CHANGE_TO_FIELD && dataVal.FieldIndividuality !== undefined) {
        parts.push(
            mergeElements(
                dataVal.FieldIndividuality.map((trait) => <TraitDescription region={region} trait={trait} />),
                ", "
            )
        );
    } else if (func.funcType === Func.FuncType.SUB_STATE) {
        section.preposition = "";
    } else if (
        func.buffs[0]?.type === Buff.BuffType.HP_REDUCE_TO_REGAIN &&
        dataVal.HpReduceToRegainIndiv !== undefined
    ) {
        section.preposition = "from";
        if (dataVal.Value !== undefined) {
            parts.push(<BuffValueDescription region={region} buff={func.buffs[0]} dataVal={dataVal} />);
            parts.push("of");
        } else {
            parts.push("100% of");
        }
        parts.push(
            <TraitDescription
                region={region}
                trait={dataVal.HpReduceToRegainIndiv}
                owner="buffs"
                ownerParameter="vals"
            />
        );
        parts.push("damage");
    } else if (func.buffs[0] !== undefined && dataVal.Value !== undefined) {
        parts.push(<BuffValueDescription region={region} buff={func.buffs[0]} dataVal={dataVal} />);

        if (
            dataVal.ParamAddValue !== undefined ||
            dataVal.ParamAddSelfIndividuality !== undefined ||
            dataVal.ParamAddOpIndividuality !== undefined ||
            dataVal.ParamAddFieldIndividuality !== undefined
        ) {
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
                stackValue =
                    dataVal.ParamAddValue !== undefined ? (
                        <BuffValueDescription
                            region={region}
                            buff={func.buffs[0]}
                            dataVal={{ Value: dataVal.ParamAddValue }}
                        />
                    ) : (
                        "additional"
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
        if (dataVal.UseRate === undefined && mutatingDataVal.filter((val) => val.UseRate !== undefined).length > 0) {
            parts.push("with a chance to work");
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

    if (func.funcType === Func.FuncType.CHANGE_BGM && dataVal.Value !== undefined) {
        section.showing = false;
    }

    if (support) {
        parts.push(")");
    }
}
