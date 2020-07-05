import React from "react";
import {BuffType} from "../Api/Data/Buff";
import Func, {DataVal, FuncType} from "../Api/Data/Func";
import Region from "../Api/Data/Region";
import {asPercent, mergeElements, Renderable} from "../Helper/OutputHelper";
import BuffValueDescriptor from "./BuffValueDescriptor";

interface IProps {
    region: Region;
    func: Func;
    dataVal: DataVal;
}

class FuncValueDescriptor extends React.Component<IProps> {
    render() {
        const region = this.props.region,
            func = this.props.func,
            dataVal = this.props.dataVal,
            parts: Renderable[] = [];

        if (
            (func.funcType === FuncType.ADD_STATE || func.funcType === FuncType.ADD_STATE_SHORT)
            && func.buffs[0]
            && (
                dataVal.Value
                || (func.buffs[0].type === BuffType.DAMAGE_FUNCTION && dataVal.Value2)
                || (func.buffs[0].type === BuffType.DELAY_FUNCTION && dataVal.Value2)
                || (func.buffs[0].type === BuffType.NPATTACK_PREV_BUFF && dataVal.SkillID)
                || (func.buffs[0].type === BuffType.SELFTURNEND_FUNCTION && dataVal.Value2)
            )
        ) {
            return <BuffValueDescriptor region={region} buff={func.buffs[0]} dataVal={dataVal}/>;
        }

        if (dataVal.Rate !== undefined) {
            parts.push(asPercent(dataVal.Rate, 1));
        }

        if (dataVal.Value !== undefined) {
            switch (func.funcType) {
                case FuncType.DAMAGE_NP:
                case FuncType.DAMAGE_NP_INDIVIDUAL:
                case FuncType.DAMAGE_NP_INDIVIDUAL_SUM:
                case FuncType.DAMAGE_NP_PIERCE:
                case FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX:
                    parts.push(asPercent(dataVal.Value, 1));
                    break;
                case FuncType.GAIN_NP:
                case FuncType.LOSS_NP:
                    parts.push(asPercent(dataVal.Value, 2));
                    break;
                default:
                    parts.push(dataVal.Value.toString());
            }
        }

        if (dataVal.Value2 !== undefined) {
            switch (func.funcType) {
                case FuncType.GAIN_NP_FROM_TARGETS:
                    parts.push(asPercent(dataVal.Value2, 2));
                    break;
                case FuncType.DAMAGE_NP_INDIVIDUAL_SUM:
                    parts.push("additional " + asPercent(dataVal.Value2, 1));
            }
        }

        if (dataVal.Correction !== undefined) {
            switch (func.funcType) {
                case FuncType.DAMAGE_NP_INDIVIDUAL:
                case FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX:
                    parts.push(asPercent(dataVal.Correction, 1));
                    break;
                case FuncType.DAMAGE_NP_INDIVIDUAL_SUM:
                    parts.push("(" + asPercent(dataVal.Correction, 1) + " x count)");
                    break;
                default:
                    parts.push(dataVal.Correction.toString());
            }
        }

        if (dataVal.DependFuncId !== undefined && dataVal.DependFuncVals !== undefined) {
            switch (func.funcType) {
                case FuncType.GAIN_NP_FROM_TARGETS:
                    let chargeAmount;

                    switch (dataVal.DependFuncId) {
                        case 474:
                            chargeAmount = dataVal.DependFuncVals.Value2;
                            break;
                        case 3962:
                            chargeAmount = dataVal.DependFuncVals.Value;
                            break;
                    }

                    if (chargeAmount !== undefined) {
                        parts.push(asPercent(chargeAmount, 2));
                    }
                    break;
            }
        }

        if (!parts.length)
            return <span>-</span>;

        return <span>{mergeElements(parts, ' + ')}</span>;
    }
}

export default FuncValueDescriptor;
