import { Buff } from "@atlasacademy/api-connector";
import { DataValField } from "@atlasacademy/api-connector/dist/Schema/DataVal";

export interface BuffValuePercentType {
    value: DataValField;
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

    // NP
    [Buff.BuffType.REGAIN_NP, { value: DataValField.VALUE, power: 2 }],
]);

export interface BuffValueTriggerType {
    skill: DataValField;
    level: DataValField;
    position?: DataValField;
    rate?: DataValField;
}

export const buffValueTriggerTypes = new Map<Buff.BuffType, BuffValueTriggerType>([
    [Buff.BuffType.REFLECTION_FUNCTION, { skill: DataValField.VALUE, level: DataValField.VALUE2 }],
    [Buff.BuffType.ATTACK_FUNCTION, { skill: DataValField.VALUE, level: DataValField.VALUE2 }],
    [
        Buff.BuffType.COMMANDATTACK_FUNCTION,
        {
            skill: DataValField.VALUE,
            level: DataValField.VALUE2,
            rate: DataValField.USE_RATE,
        },
    ],
    [Buff.BuffType.COMMANDATTACK_BEFORE_FUNCTION, { skill: DataValField.VALUE, level: DataValField.VALUE2 }],
    [Buff.BuffType.DAMAGE_FUNCTION, { skill: DataValField.VALUE, level: DataValField.VALUE2 }],
    [Buff.BuffType.DEAD_FUNCTION, { skill: DataValField.VALUE, level: DataValField.VALUE2 }],
    [Buff.BuffType.DELAY_FUNCTION, { skill: DataValField.VALUE, level: DataValField.VALUE2 }],
    [
        Buff.BuffType.NPATTACK_PREV_BUFF,
        {
            skill: DataValField.SKILL_ID,
            level: DataValField.SKILL_LV,
            position: DataValField.VALUE,
        },
    ],
    [
        Buff.BuffType.SELFTURNEND_FUNCTION,
        {
            skill: DataValField.VALUE,
            level: DataValField.VALUE2,
            rate: DataValField.USE_RATE,
        },
    ],
    [
        Buff.BuffType.WAVESTART_FUNCTION,
        {
            skill: DataValField.VALUE,
            level: DataValField.VALUE2,
            rate: DataValField.USE_RATE,
        },
    ],
    [
        Buff.BuffType.COUNTER_FUNCTION,
        {
            skill: DataValField.COUNTER_ID,
            level: DataValField.COUNTER_LV,
        },
    ],
]);

export interface BuffValueTraitType {
    trait: DataValField;
}

export const buffValueTraitTypes = new Map<Buff.BuffType, BuffValueTraitType>([
    [Buff.BuffType.FIELD_INDIVIDUALITY, { trait: DataValField.VALUE }],
]);

export interface BuffValueCommandCardType {
    card: DataValField;
}

export const buffValueCommandCardTypes = new Map<Buff.BuffType, BuffValueCommandCardType>([
    [Buff.BuffType.CHANGE_COMMAND_CARD_TYPE, { card: DataValField.VALUE }],
]);
