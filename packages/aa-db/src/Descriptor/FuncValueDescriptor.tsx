import React from "react";
import Func, {DataVal, FuncType} from "../Api/Data/Func";
import Region from "../Api/Data/Region";
import {asPercent, joinElements, Renderable} from "../Helper/OutputHelper";
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

        if (dataVal.Rate !== undefined) {
            parts.push(asPercent(dataVal.Rate, 1));
        }

        if (dataVal.Value !== undefined) {
            switch (func.funcType) {
                case FuncType.ADD_STATE:
                case FuncType.ADD_STATE_SHORT:
                    parts.push(<BuffValueDescriptor region={region} buff={func.buffs[0]} dataVal={dataVal}/>);
                    break;
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

        if (dataVal.Value2 !== undefined || dataVal.SkillLV !== undefined) {
            switch (func.funcType) {
                case FuncType.ADD_STATE:
                case FuncType.ADD_STATE_SHORT:
                    parts.push(<BuffValueDescriptor region={region} buff={func.buffs[0]} dataVal={dataVal}/>);
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

        if (!parts.length)
            return <span>-</span>;

        return <span>
            {joinElements(parts, ' + ')
                .map((element, index) => {
                    return <React.Fragment key={index}>{element}</React.Fragment>;
                })}
        </span>;
    }
}

export default FuncValueDescriptor;
