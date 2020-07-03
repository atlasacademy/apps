import React from "react";
import Buff, {BuffType} from "../Api/Data/Buff";
import {DataVal} from "../Api/Data/Func";
import Region from "../Api/Data/Region";
import {asPercent} from "../Helper/OutputHelper";

interface IProps {
    region: Region;
    buff: Buff;
    dataVal: DataVal;
}

class BuffValueDescriptor extends React.Component<IProps>{
    render() {
        let value = "";

        switch (this.props.buff.type) {
            case BuffType.UP_ATK:
            case BuffType.DOWN_ATK:
            case BuffType.UP_COMMANDALL:
            case BuffType.DOWN_COMMANDALL:
            case BuffType.UP_CRITICALDAMAGE:
            case BuffType.DOWN_CRITICALDAMAGE:
            case BuffType.UP_DEFENCE:
            case BuffType.DOWN_DEFENCE:
            case BuffType.UP_DROPNP:
            case BuffType.DOWN_DROPNP:
            case BuffType.UP_HATE:
            case BuffType.UP_TOLERANCE:
            case BuffType.DOWN_TOLERANCE:
                value = asPercent(this.props.dataVal.Value, 1);
                break;
            case BuffType.COMMANDATTACK_FUNCTION:
                if (this.props.dataVal.Value2)
                    value = 'Lv. ' + this.props.dataVal.Value2;
                break;
            case BuffType.NPATTACK_PREV_BUFF:
                if (this.props.dataVal.SkillLV)
                    value = 'Lv. ' + this.props.dataVal.SkillLV;
                break;
            default:
                value = this.props.dataVal.Value?.toString() ?? "";
        }

        return value;
    }
}

export default BuffValueDescriptor;
