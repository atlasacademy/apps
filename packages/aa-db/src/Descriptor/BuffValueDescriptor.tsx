import {Buff, DataVal, Region} from "@atlasacademy/api-connector";
import React from "react";
import {asPercent, mergeElements, Renderable} from "../Helper/OutputHelper";
import TraitDescription from "./TraitDescription";

interface IProps {
    region: Region;
    buff: Buff.Buff;
    dataVal: DataVal.DataVal;
}

class BuffValueDescriptor extends React.Component<IProps> {
    descrbibeValue(value: number): Renderable {
        let part: Renderable;

        switch (this.props.buff.type) {
            case Buff.BuffType.UP_ATK:
            case Buff.BuffType.DOWN_ATK:
            case Buff.BuffType.UP_COMMANDALL:
            case Buff.BuffType.DOWN_COMMANDALL:
            case Buff.BuffType.UP_CRITICALDAMAGE:
            case Buff.BuffType.DOWN_CRITICALDAMAGE:
            case Buff.BuffType.UP_CRITICALPOINT:
            case Buff.BuffType.DOWN_CRITICALPOINT:
            case Buff.BuffType.UP_CRITICALRATE:
            case Buff.BuffType.DOWN_CRITICALRATE:
            case Buff.BuffType.UP_CRITICAL_RATE_DAMAGE_TAKEN:
            case Buff.BuffType.DOWN_CRITICAL_RATE_DAMAGE_TAKEN:
            case Buff.BuffType.UP_DAMAGE:
            case Buff.BuffType.DOWN_DAMAGE:
            case Buff.BuffType.UP_DAMAGEDROPNP:
            case Buff.BuffType.DOWN_DAMAGEDROPNP:
            case Buff.BuffType.UP_DEFENCE:
            case Buff.BuffType.DOWN_DEFENCE:
            case Buff.BuffType.UP_DEFENCECOMMANDALL:
            case Buff.BuffType.DOWN_DEFENCECOMMANDALL:
            case Buff.BuffType.UP_DROPNP:
            case Buff.BuffType.DOWN_DROPNP:
            case Buff.BuffType.UP_FUNC_HP_REDUCE:
            case Buff.BuffType.DOWN_FUNC_HP_REDUCE:
            case Buff.BuffType.UP_HATE:
            case Buff.BuffType.UP_NONRESIST_INSTANTDEATH:
            case Buff.BuffType.UP_NPDAMAGE:
            case Buff.BuffType.DOWN_NPDAMAGE:
            case Buff.BuffType.UP_SPECIALDEFENCE:
            case Buff.BuffType.DOWN_SPECIALDEFENCE:
            case Buff.BuffType.UP_STARWEIGHT:
            case Buff.BuffType.DOWN_STARWEIGHT:
            case Buff.BuffType.UP_TOLERANCE:
            case Buff.BuffType.DOWN_TOLERANCE:
            case Buff.BuffType.UP_TOLERANCE_SUBSTATE:
            case Buff.BuffType.DOWN_TOLERANCE_SUBSTATE:
                part = asPercent(value, 1);
                break;
            case Buff.BuffType.REGAIN_NP:
                part = asPercent(value, 2);
                break;
            case Buff.BuffType.ATTACK_FUNCTION:
            case Buff.BuffType.COMMANDATTACK_FUNCTION:
            case Buff.BuffType.COMMANDATTACK_BEFORE_FUNCTION:
            case Buff.BuffType.DAMAGE_FUNCTION:
            case Buff.BuffType.DEAD_FUNCTION:
            case Buff.BuffType.DELAY_FUNCTION:
            case Buff.BuffType.FIELD_INDIVIDUALITY:
                part = <TraitDescription region={this.props.region} trait={value}/>;
                break;
            case Buff.BuffType.CHANGE_COMMAND_CARD_TYPE:
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
            case Buff.BuffType.COMMANDATTACK_FUNCTION:
                if (this.props.dataVal.Value2)
                    parts.push('Lv. ' + this.props.dataVal.Value2);
                break;
            case Buff.BuffType.NPATTACK_PREV_BUFF:
                if (this.props.dataVal.SkillLV)
                    parts.push('Lv. ' + this.props.dataVal.SkillLV);
                break;
            case Buff.BuffType.SELFTURNEND_FUNCTION:
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
