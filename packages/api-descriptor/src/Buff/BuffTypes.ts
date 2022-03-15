import { Buff } from "@atlasacademy/api-connector";

export interface UpDownBuffType {
    up?: Buff.BuffType;
    down?: Buff.BuffType;
    description: string;
}

export const upDownBuffs: UpDownBuffType[] = [
    { up: Buff.BuffType.ADD_MAXHP, down: Buff.BuffType.SUB_MAXHP, description: "Max HP" },
    { up: Buff.BuffType.UP_ATK, down: Buff.BuffType.DOWN_ATK, description: "ATK" },
    { up: Buff.BuffType.UP_CHAGETD, down: undefined, description: "Overcharge" },
    { up: Buff.BuffType.UP_COMMANDALL, down: Buff.BuffType.DOWN_COMMANDALL, description: "Card" },
    { up: Buff.BuffType.UP_COMMANDATK, down: Buff.BuffType.DOWN_COMMANDATK, description: "ATK" },
    { up: Buff.BuffType.UP_CRITICALDAMAGE, down: Buff.BuffType.DOWN_CRITICALDAMAGE, description: "Critical Damage" },
    { up: Buff.BuffType.UP_CRITICALPOINT, down: Buff.BuffType.DOWN_CRITICALPOINT, description: "Star Drop Rate" },
    { up: Buff.BuffType.UP_CRITICALRATE, down: Buff.BuffType.DOWN_CRITICALRATE, description: "Critical Rate" },
    {
        up: Buff.BuffType.UP_CRITICAL_RATE_DAMAGE_TAKEN,
        down: Buff.BuffType.DOWN_CRITICAL_RATE_DAMAGE_TAKEN,
        description: "Chance of Receiving Critical Attack",
    },
    {
        up: Buff.BuffType.UP_CRITICAL_STAR_DAMAGE_TAKEN,
        down: Buff.BuffType.DOWN_CRITICAL_STAR_DAMAGE_TAKEN,
        description: "Attacker Star Drop Rate",
    },
    { up: Buff.BuffType.UP_DAMAGE, down: Buff.BuffType.DOWN_DAMAGE, description: "SP.DMG" },
    {
        up: Buff.BuffType.UP_DAMAGE_INDIVIDUALITY_ACTIVEONLY,
        down: Buff.BuffType.DOWN_DAMAGE_INDIVIDUALITY_ACTIVEONLY,
        description: "SP.DMG",
    },
    { up: Buff.BuffType.UP_DAMAGE_EVENT_POINT, description: "SP.DMG" },
    { up: Buff.BuffType.UP_DAMAGEDROPNP, down: Buff.BuffType.DOWN_DAMAGEDROPNP, description: "NP Gain When Damaged" },
    { up: Buff.BuffType.UP_DEFENCE, down: Buff.BuffType.DOWN_DEFENCE, description: "DEF" },
    { up: Buff.BuffType.UP_DEFENCECOMMANDALL, down: Buff.BuffType.DOWN_DEFENCECOMMANDALL, description: "Resistance" },
    { up: Buff.BuffType.UP_DROPNP, down: Buff.BuffType.DOWN_DROPNP, description: "NP Gain" },
    { up: Buff.BuffType.UP_GAIN_HP, down: Buff.BuffType.DOWN_GAIN_HP, description: "Received Healing" },
    { up: Buff.BuffType.UP_GIVEGAIN_HP, down: Buff.BuffType.DOWN_GIVEGAIN_HP, description: "Healing Dealt" },
    { up: Buff.BuffType.UP_FUNC_HP_REDUCE, down: Buff.BuffType.DOWN_FUNC_HP_REDUCE, description: "DoT Effectiveness" },
    {
        up: Buff.BuffType.UP_GRANT_INSTANTDEATH,
        down: Buff.BuffType.DOWN_GRANT_INSTANTDEATH,
        description: "Death Chance",
    },
    { up: Buff.BuffType.UP_RESIST_INSTANTDEATH, down: undefined, description: "Death Resist" },
    { up: Buff.BuffType.UP_GRANTSTATE, down: Buff.BuffType.DOWN_GRANTSTATE, description: "Casted Effect Chance" },
    { up: undefined, down: Buff.BuffType.UP_NONRESIST_INSTANTDEATH, description: "Death Resist" },
    { up: Buff.BuffType.UP_NPDAMAGE, down: Buff.BuffType.DOWN_NPDAMAGE, description: "NP Damage" },
    { up: Buff.BuffType.UP_SPECIALDEFENCE, down: Buff.BuffType.DOWN_SPECIALDEFENCE, description: "SP.DEF" },
    { up: Buff.BuffType.UP_DAMAGE_SPECIAL, down: undefined, description: "Attack Special Damage" },
    { up: Buff.BuffType.UP_STARWEIGHT, down: Buff.BuffType.DOWN_STARWEIGHT, description: "Star Weight" },
    { up: Buff.BuffType.DOWN_TOLERANCE, down: Buff.BuffType.UP_TOLERANCE, description: "Received Effect Chance" },
    {
        up: Buff.BuffType.UP_TOLERANCE_SUBSTATE,
        down: Buff.BuffType.DOWN_TOLERANCE_SUBSTATE,
        description: "Buff Removal Resistance",
    },
    { up: Buff.BuffType.BUFF_RATE, description: "Buff Effectiveness" },
];

export const buffTraitDescriptions = new Map<number, string>([
    [3011, "Poison"],
    [3012, "Charm"],
    [3015, "Burn"],
    [3026, "Curse"],
    [3047, "Pigify"],
    [3066, "Sleep"],
]);

export const buffTypeDescriptions = new Map<Buff.BuffType, string>([
    [Buff.BuffType.AVOID_INSTANTDEATH, "Immune to Death"],
    [Buff.BuffType.AVOID_STATE, "Immunity"],
    [Buff.BuffType.ADD_DAMAGE, "Damage Plus"],
    [Buff.BuffType.ADD_INDIVIDUALITY, "Add Trait"],
    [Buff.BuffType.AVOIDANCE, "Evade"],
    [Buff.BuffType.AVOIDANCE_INDIVIDUALITY, "Evade"],
    [Buff.BuffType.CHANGE_COMMAND_CARD_TYPE, "Change Command Card Types"],
    [Buff.BuffType.COMMANDCODEATTACK_FUNCTION, "Command Code Effect"],
    [Buff.BuffType.COMMANDCODEATTACK_AFTER_FUNCTION, "Command Code After Effect"],
    [Buff.BuffType.BREAK_AVOIDANCE, "Sure Hit"],
    [Buff.BuffType.DELAY_FUNCTION, "Trigger Skill after Duration"],
    [Buff.BuffType.DONOT_ACT, "Stun"],
    [Buff.BuffType.DONOT_NOBLE, "NP Seal"],
    [Buff.BuffType.DONOT_NOBLE_COND_MISMATCH, "NP Block if Condition Failed"],
    [Buff.BuffType.DONOT_RECOVERY, "Recovery Disabled"],
    [Buff.BuffType.DONOT_REPLACE, "No Order Change"],
    [Buff.BuffType.DONOT_SELECT_COMMANDCARD, "Do Not Shuffle In Cards"],
    [Buff.BuffType.DONOT_SKILL, "Skill Seal"],
    [Buff.BuffType.DONOT_SKILL_SELECT, "Skill Seal"],
    [Buff.BuffType.FIELD_INDIVIDUALITY, "Change Field Type"],
    [Buff.BuffType.FIX_COMMANDCARD, "Freeze Command Cards"],
    [Buff.BuffType.GUTS, "Guts"],
    [Buff.BuffType.GUTS_FUNCTION, "Trigger Skill on Guts"],
    [Buff.BuffType.GUTS_RATIO, "Guts"],
    [Buff.BuffType.INVINCIBLE, "Invincible"],
    [Buff.BuffType.MULTIATTACK, "Multiple Hits"],
    [Buff.BuffType.PIERCE_INVINCIBLE, "Ignore Invincible"],
    [Buff.BuffType.PIERCE_DEFENCE, "Ignore DEF"],
    [Buff.BuffType.PREVENT_DEATH_BY_DAMAGE, "Prevent death by damage"],
    [Buff.BuffType.REFLECTION_FUNCTION, "Trigger Skill on end of enemy's turn"],
    [Buff.BuffType.REGAIN_HP, "HP Per Turn"],
    [Buff.BuffType.REGAIN_NP, "NP Per Turn"],
    [Buff.BuffType.REGAIN_STAR, "Stars Per Turn"],
    [Buff.BuffType.SELFTURNEND_FUNCTION, "Trigger Skill every Turn"],
    [Buff.BuffType.SPECIAL_INVINCIBLE, "Special invincible"],
    [Buff.BuffType.SUB_SELFDAMAGE, "Damage Cut"],
    [Buff.BuffType.TD_TYPE_CHANGE, "Change Noble Phantasm"],
    [Buff.BuffType.TD_TYPE_CHANGE_ARTS, "Set Noble Phantasm: Arts"],
    [Buff.BuffType.TD_TYPE_CHANGE_BUSTER, "Set Noble Phantasm: Buster"],
    [Buff.BuffType.TD_TYPE_CHANGE_QUICK, "Set Noble Phantasm: Quick"],
    [Buff.BuffType.UP_HATE, "Taunt"],
]);

export interface BuffTriggerType {
    after: boolean;
    when?: string;
    event: string;
    counterNp?: boolean;
}

export const buffTriggerTypes = new Map<Buff.BuffType, BuffTriggerType>([
    [Buff.BuffType.ATTACK_FUNCTION, { after: true, event: "attacks" }],
    [Buff.BuffType.ATTACK_BEFORE_FUNCTION, { after: false, event: "attacks" }],
    [Buff.BuffType.COMMANDATTACK_FUNCTION, { after: true, event: "cards" }],
    [Buff.BuffType.COMMANDATTACK_BEFORE_FUNCTION, { after: false, event: "cards" }],
    [Buff.BuffType.DAMAGE_FUNCTION, { after: true, when: "receiving", event: "attacks" }],
    [Buff.BuffType.DEAD_FUNCTION, { after: true, event: "death" }],
    [Buff.BuffType.ENTRY_FUNCTION, { after: true, event: "entry" }],
    [Buff.BuffType.NPATTACK_PREV_BUFF, { after: true, event: "NP" }],
    [Buff.BuffType.WAVESTART_FUNCTION, { after: true, event: "wave start" }],
    [Buff.BuffType.REFLECTION_FUNCTION, { after: true, event: "end of enemy's turn" }],
    [Buff.BuffType.COUNTER_FUNCTION, { after: true, event: "NP", counterNp: true }],
]);
