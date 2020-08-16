import {Buff, Region} from "@atlasacademy/api-connector";
import BuffType from "@atlasacademy/api-connector/dist/Enum/BuffType";
import DataVal from "@atlasacademy/api-connector/dist/Schema/DataVal";
import React from "react";
import {asPercent, mergeElements, Renderable} from "../Helper/OutputHelper";
import TraitDescription from "./TraitDescription";

interface IProps {
    region: Region;
    buff: Buff;
    dataVal: DataVal;
}

class BuffValueDescriptor extends React.Component<IProps> {
    descrbibeValue(value: number): Renderable {
        let part: Renderable;

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
            case BuffType.UP_DEFENCECOMMANDALL:
            case BuffType.DOWN_DEFENCECOMMANDALL:
            case BuffType.UP_DROPNP:
            case BuffType.DOWN_DROPNP:
            case BuffType.UP_FUNC_HP_REDUCE:
            case BuffType.DOWN_FUNC_HP_REDUCE:
            case BuffType.UP_HATE:
            case BuffType.UP_NONRESIST_INSTANTDEATH:
            case BuffType.UP_NPDAMAGE:
            case BuffType.DOWN_NPDAMAGE:
            case BuffType.UP_SPECIALDEFENCE:
            case BuffType.DOWN_SPECIALDEFENCE:
            case BuffType.UP_STARWEIGHT:
            case BuffType.DOWN_STARWEIGHT:
            case BuffType.UP_TOLERANCE:
            case BuffType.DOWN_TOLERANCE:
            case BuffType.UP_TOLERANCE_SUBSTATE:
            case BuffType.DOWN_TOLERANCE_SUBSTATE:
                part = asPercent(value, 1);
                break;
            case BuffType.REGAIN_NP:
                part = asPercent(value, 2);
                break;
            case BuffType.ATTACK_FUNCTION:
            case BuffType.COMMANDATTACK_FUNCTION:
            case BuffType.COMMANDATTACK_BEFORE_FUNCTION:
            case BuffType.DAMAGE_FUNCTION:
            case BuffType.DEAD_FUNCTION:
            case BuffType.DELAY_FUNCTION:
            case BuffType.FIELD_INDIVIDUALITY:
                    part = <TraitDescription region={this.props.region} trait={value}/>;
                break;
            case BuffType.CHANGE_COMMAND_CARD_TYPE:
                // TODO: CardDescriptor
                switch (value) {
                    case 1:
                        part = "[Card: Arts]";
                        break;
                    case 2:
                        part = "[Card: Buster]";
                        break;
                    case 3:
                        part = "[Card: Quick]";
                        break;
                    case 4:
                        part = "[Card: Extra]";
                        break;
                    default:
                        part = value.toString();
                }
                break;
            default:
                part = value.toString();
        }

        return part;
    }

    render() {
        const parts: Renderable[] = [];

        switch (this.props.buff.type) {
            case BuffType.COMMANDATTACK_FUNCTION:
                if (this.props.dataVal.Value2)
                    parts.push('Lv. ' + this.props.dataVal.Value2);
                break;
            case BuffType.NPATTACK_PREV_BUFF:
                if (this.props.dataVal.SkillLV)
                    parts.push('Lv. ' + this.props.dataVal.SkillLV);
                break;
            case BuffType.SELFTURNEND_FUNCTION:
                if (this.props.dataVal.Value2)
                    parts.push('Lv. ' + this.props.dataVal.Value2);
                break;
        }

        if (this.props.dataVal.Value !== undefined) {
            parts.push(this.descrbibeValue(this.props.dataVal.Value));
        }

        if (this.props.dataVal.RatioHPLow !== undefined) {
            parts.push(<React.Fragment>
                ({this.descrbibeValue(this.props.dataVal.RatioHPLow)} Scales by Low HP)
            </React.Fragment>)
        }

        if (parts.length === 0)
            parts.push('-');

        return (
            mergeElements(parts, ' + ')
        );
    }
}

export default BuffValueDescriptor;
