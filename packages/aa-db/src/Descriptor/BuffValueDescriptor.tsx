import React from "react";
import Buff, {BuffType} from "../Api/Data/Buff";
import {DataVal} from "../Api/Data/Func";
import Region from "../Api/Data/Region";
import {asPercent} from "../Helper/OutputHelper";
import TraitDescriptor from "./TraitDescriptor";

interface IProps {
    region: Region;
    buff: Buff;
    dataVal: DataVal;
}

class BuffValueDescriptor extends React.Component<IProps> {
    render() {
        let value: JSX.Element | string | null = null;

        switch (this.props.buff.type) {
            case BuffType.UP_ATK:
            case BuffType.DOWN_ATK:
            case BuffType.UP_COMMANDALL:
            case BuffType.DOWN_COMMANDALL:
            case BuffType.UP_CRITICALDAMAGE:
            case BuffType.DOWN_CRITICALDAMAGE:
            case BuffType.UP_CRITICALPOINT:
            case BuffType.DOWN_CRITICALPOINT:
            case BuffType.UP_CRITICALRATE:
            case BuffType.DOWN_CRITICALRATE:
            case BuffType.UP_CRITICAL_RATE_DAMAGE_TAKEN:
            case BuffType.DOWN_CRITICAL_RATE_DAMAGE_TAKEN:
            case BuffType.UP_DAMAGE:
            case BuffType.DOWN_DAMAGE:
            case BuffType.UP_DAMAGEDROPNP:
            case BuffType.DOWN_DAMAGEDROPNP:
            case BuffType.UP_DEFENCE:
            case BuffType.DOWN_DEFENCE:
            case BuffType.UP_DROPNP:
            case BuffType.DOWN_DROPNP:
            case BuffType.UP_FUNC_HP_REDUCE:
            case BuffType.DOWN_FUNC_HP_REDUCE:
            case BuffType.UP_HATE:
            case BuffType.UP_NONRESIST_INSTANTDEATH:
            case BuffType.UP_NPDAMAGE:
            case BuffType.DOWN_NPDAMAGE:
            case BuffType.UP_STARWEIGHT:
            case BuffType.DOWN_STARWEIGHT:
            case BuffType.UP_TOLERANCE:
            case BuffType.DOWN_TOLERANCE:
            case BuffType.UP_TOLERANCE_SUBSTATE:
            case BuffType.DOWN_TOLERANCE_SUBSTATE:
                value = asPercent(this.props.dataVal.Value, 1);
                break;
            case BuffType.REGAIN_NP:
                value = asPercent(this.props.dataVal.Value, 2);
                break;
            case BuffType.ATTACK_FUNCTION:
            case BuffType.COMMANDATTACK_FUNCTION:
            case BuffType.COMMANDATTACK_BEFORE_FUNCTION:
            case BuffType.DAMAGE_FUNCTION:
            case BuffType.SELFTURNEND_FUNCTION:
                if (this.props.dataVal.Value2)
                    value = 'Lv. ' + this.props.dataVal.Value2;
                break;
            case BuffType.NPATTACK_PREV_BUFF:
                if (this.props.dataVal.SkillLV)
                    value = 'Lv. ' + this.props.dataVal.SkillLV;
                break;
            case BuffType.FIELD_INDIVIDUALITY:
                if (this.props.dataVal.Value)
                    value = <TraitDescriptor region={this.props.region} trait={this.props.dataVal.Value}/>;
                break;
            default:
                value = this.props.dataVal.Value?.toString() ?? "";
        }

        return value;
    }
}

export default BuffValueDescriptor;
