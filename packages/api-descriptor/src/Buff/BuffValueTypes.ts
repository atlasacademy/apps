import { Buff, DataVal } from "@atlasacademy/api-connector";

const DataValField = DataVal.DataValField;

export interface BuffValuePercentType {
    value: DataVal.DataValField;
    power: number;
}

export const buffValuePercentTypes = new Map<Buff.BuffType, BuffValuePercentType>([
    // Normal
    [Buff.BuffType.UP_ATK, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_ATK, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_COMMANDALL, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_COMMANDALL, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_COMMANDATK, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_COMMANDATK, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_CRITICALDAMAGE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_CRITICALDAMAGE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_CRITICALPOINT, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_CRITICALPOINT, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_CRITICALRATE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_CRITICALRATE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_CRITICAL_RATE_DAMAGE_TAKEN, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_CRITICAL_RATE_DAMAGE_TAKEN, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_CRITICAL_STAR_DAMAGE_TAKEN, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_CRITICAL_STAR_DAMAGE_TAKEN, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_DAMAGE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_DAMAGE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_DAMAGE_INDIVIDUALITY_ACTIVEONLY, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_DAMAGE_INDIVIDUALITY_ACTIVEONLY, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_DAMAGE_INDIVIDUALITY, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_DAMAGE_INDIVIDUALITY, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_DAMAGE_EVENT_POINT, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_DAMAGEDROPNP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_DAMAGEDROPNP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_DEFENCE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_DEFENCE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_DEFENCECOMMANDALL, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_DEFENCECOMMANDALL, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_DROPNP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_DROPNP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_FUNC_HP_REDUCE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_FUNC_HP_REDUCE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_GAIN_HP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_GAIN_HP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_GRANTSTATE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_GRANTSTATE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_HATE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_RESIST_INSTANTDEATH, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_NONRESIST_INSTANTDEATH, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_GRANT_INSTANTDEATH, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_GRANT_INSTANTDEATH, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_NPDAMAGE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_NPDAMAGE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_SPECIALDEFENCE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_SPECIALDEFENCE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_DAMAGE_SPECIAL, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_STARWEIGHT, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_STARWEIGHT, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_TOLERANCE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_TOLERANCE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_TOLERANCE_SUBSTATE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_TOLERANCE_SUBSTATE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_GIVEGAIN_HP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_GIVEGAIN_HP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.GUTS_RATIO, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.BUFF_RATE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_MAXHP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_MAXHP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_DEFENCE_COMMANDDAMAGE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_DEFENCE_COMMANDDAMAGE, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.UP_FUNCGAIN_NP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.DOWN_FUNCGAIN_NP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.HP_REDUCE_TO_REGAIN, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.MASTER_SKILL_VALUE_UP, { value: DataValField.VALUE, power: 1 }],
    [Buff.BuffType.SHIFT_GUTS_RATIO, { value: DataValField.VALUE, power: 1 }],

    // NP
    [Buff.BuffType.REGAIN_NP, { value: DataValField.VALUE, power: 2 }],
    [Buff.BuffType.REDUCE_NP, { value: DataValField.VALUE, power: 2 }],
]);

export interface BuffValueTraitType {
    trait: DataVal.DataValField;
}

export const buffValueTraitTypes = new Map<Buff.BuffType, BuffValueTraitType>([
    [Buff.BuffType.FIELD_INDIVIDUALITY, { trait: DataValField.VALUE }],
]);

export interface BuffValueCommandCardType {
    card: DataVal.DataValField;
}

export const buffValueCommandCardTypes = new Map<Buff.BuffType, BuffValueCommandCardType>([
    [Buff.BuffType.CHANGE_COMMAND_CARD_TYPE, { card: DataValField.VALUE }],
]);
