import { Buff, DataVal } from "@atlasacademy/api-connector";

export interface UpDownBuffType {
    up?: Buff.BuffType;
    down?: Buff.BuffType;
    description: string;
}

export const upDownBuffs: UpDownBuffType[] = [
    { up: Buff.BuffType.ADD_MAXHP, down: Buff.BuffType.SUB_MAXHP, description: "Max HP" },
    { up: Buff.BuffType.UP_MAXHP, down: Buff.BuffType.DOWN_MAXHP, description: "Max HP (Percentage)" },
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
        description: "SP.DMG (Active only)",
    },
    {
        up: Buff.BuffType.UP_DAMAGE_INDIVIDUALITY,
        down: Buff.BuffType.DOWN_DAMAGE_INDIVIDUALITY,
        description: "SP.DMG",
    },
    { up: Buff.BuffType.UP_DAMAGE_EVENT_POINT, description: "SP.DMG" },
    { up: Buff.BuffType.UP_DAMAGEDROPNP, down: Buff.BuffType.DOWN_DAMAGEDROPNP, description: "NP Gain When Damaged" },
    { up: Buff.BuffType.UP_DEFENCE, down: Buff.BuffType.DOWN_DEFENCE, description: "DEF" },
    { up: Buff.BuffType.UP_DEFENCECOMMANDALL, down: Buff.BuffType.DOWN_DEFENCECOMMANDALL, description: "Resistance" },
    {
        up: Buff.BuffType.UP_DEFENCE_COMMANDDAMAGE,
        down: Buff.BuffType.DOWN_DEFENCE_COMMANDDAMAGE,
        description: "Damage Resistance",
    },
    { up: Buff.BuffType.UP_DROPNP, down: Buff.BuffType.DOWN_DROPNP, description: "NP Gain" },
    { up: Buff.BuffType.UP_GAIN_HP, down: Buff.BuffType.DOWN_GAIN_HP, description: "Received Healing" },
    { up: Buff.BuffType.UP_GIVEGAIN_HP, down: Buff.BuffType.DOWN_GIVEGAIN_HP, description: "Healing Dealt" },
    { up: Buff.BuffType.UP_FUNC_HP_REDUCE, down: Buff.BuffType.DOWN_FUNC_HP_REDUCE, description: "DoT Effectiveness" },
    { up: Buff.BuffType.ADD_FUNC_HP_REDUCE, down: Buff.BuffType.SUB_FUNC_HP_REDUCE, description: "DoT Value" },
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
    {
        up: Buff.BuffType.UP_FUNCGAIN_NP,
        down: Buff.BuffType.DOWN_FUNCGAIN_NP,
        description: "Received NP Battery Amount",
    },
    {
        up: Buff.BuffType.MASTER_SKILL_VALUE_UP,
        description: "Master Skill Effectiveness",
    },
    {
        up: Buff.BuffType.UP_DEFENCE_NPDAMAGE,
        down: Buff.BuffType.DOWN_DEFENCE_NPDAMAGE,
        description: "NP Damage Defense",
    },
    {
        up: Buff.BuffType.UP_DEFENCE_CRITICALDAMAGE,
        down: Buff.BuffType.DOWN_DEFENCE_CRITICALDAMAGE,
        description: "Critical Damage Defense",
    },
];

export const buffTraitDescriptions = new Map<number, { name: string; priority: number }>([
    [3011, { name: "Poison", priority: 1 }],
    [3012, { name: "Charm", priority: 1 }],
    [3013, { name: "Petrify", priority: 1 }],
    [3014, { name: "Stun", priority: 2 }],
    [3015, { name: "Burn", priority: 1 }],
    [3026, { name: "Curse", priority: 1 }],
    [3045, { name: "Bound", priority: 2 }],
    [3047, { name: "Pigify", priority: 1 }],
    [3066, { name: "Sleep", priority: 1 }],
]);

export const buffTypeDescriptions = new Map<Buff.BuffType, string>([
    [Buff.BuffType.AVOID_INSTANTDEATH, "Immune to Death"],
    [Buff.BuffType.AVOID_STATE, "Immunity"],
    [Buff.BuffType.ADD_DAMAGE, "Damage Plus"],
    [Buff.BuffType.SUB_DAMAGE, "Damage Minus"],
    [Buff.BuffType.ADD_SPECIALDAMAGE, "Special Damage Up"],
    [Buff.BuffType.SUB_SPECIALDAMAGE, "Special Damage Cut (Can't be ignored)"],
    [Buff.BuffType.ADD_INDIVIDUALITY, "Add Trait"],
    [Buff.BuffType.SUB_INDIVIDUALITY, "Remove Trait"],
    [Buff.BuffType.AVOIDANCE, "Evade"],
    [Buff.BuffType.AVOIDANCE_INDIVIDUALITY, "Evade"],
    [Buff.BuffType.AVOIDANCE_ATTACK_DEATH_DAMAGE, "Evade if Attack is Lethal"],
    [Buff.BuffType.CHANGE_COMMAND_CARD_TYPE, "Change Command Card Types"],
    [Buff.BuffType.BREAK_AVOIDANCE, "Sure Hit"],
    [Buff.BuffType.DONOT_ACT, "Unable to Act"],
    [Buff.BuffType.DONOT_NOBLE, "NP Seal"],
    [Buff.BuffType.DONOT_NOBLE_COND_MISMATCH, "NP Block if Condition Failed"],
    [Buff.BuffType.DONOT_RECOVERY, "Recovery Disabled"],
    [Buff.BuffType.DONOT_REPLACE, "No Order Change"],
    [Buff.BuffType.DONOT_SELECT_COMMANDCARD, "Do Not Shuffle In Cards"],
    [Buff.BuffType.DONOT_SKILL, "Skill Seal"],
    [Buff.BuffType.DONOT_SKILL_SELECT, "Skill Seal"],
    [Buff.BuffType.FIELD_INDIVIDUALITY, "Add Field Trait"],
    [Buff.BuffType.SUB_FIELD_INDIVIDUALITY, "Remove Field Trait"],
    [Buff.BuffType.FIX_COMMANDCARD, "Freeze Command Cards"],
    [Buff.BuffType.GUTS, "Guts"],
    [Buff.BuffType.GUTS_RATIO, "Guts"],
    [Buff.BuffType.INVINCIBLE, "Invincible"],
    [Buff.BuffType.MULTIATTACK, "Multiple Hits"],
    [Buff.BuffType.PIERCE_INVINCIBLE, "Ignore Invincible"],
    [Buff.BuffType.PIERCE_SPECIAL_INVINCIBLE, "Ignore Special invincible"],
    [Buff.BuffType.PIERCE_DEFENCE, "Ignore DEF"],
    [Buff.BuffType.PIERCE_SUBDAMAGE, "Ignore Damage Cut"],
    [Buff.BuffType.PREVENT_DEATH_BY_DAMAGE, "Prevent death by damage"],
    [Buff.BuffType.REGAIN_HP, "HP Per Turn"],
    [Buff.BuffType.REGAIN_NP, "NP Per Turn"],
    [Buff.BuffType.REDUCE_NP, "NP Lost Per Turn"],
    [Buff.BuffType.REGAIN_STAR, "Stars Per Turn"],
    [Buff.BuffType.SPECIAL_INVINCIBLE, "Special invincible"],
    [Buff.BuffType.ADD_SELFDAMAGE, "Damage Up"],
    [Buff.BuffType.SUB_SELFDAMAGE, "Damage Cut"],
    [Buff.BuffType.TD_TYPE_CHANGE, "Change Noble Phantasm"],
    [Buff.BuffType.TD_TYPE_CHANGE_ARTS, "Set Noble Phantasm: Arts"],
    [Buff.BuffType.TD_TYPE_CHANGE_BUSTER, "Set Noble Phantasm: Buster"],
    [Buff.BuffType.TD_TYPE_CHANGE_QUICK, "Set Noble Phantasm: Quick"],
    [Buff.BuffType.UP_HATE, "Taunt"],
    [Buff.BuffType.UP_NPTURNVAL, "Increase NP Gauge Gained Per Turn"],
    [Buff.BuffType.DOWN_NPTURNVAL, "Reduce NP Gauge Gained Per Turn"],
    [Buff.BuffType.HP_REDUCE_TO_REGAIN, "Convert HP Loss to HP Gain"],
    [Buff.BuffType.BUFF_CONVERT, "Convert Buff"],
    [Buff.BuffType.SHIFT_GUTS, "Guts on Break"],
    [Buff.BuffType.SHIFT_GUTS_RATIO, "Guts on Break"],
    [Buff.BuffType.AVOID_FUNCTION_EXECUTE_SELF, "Block Function Execution on Self"],
    [Buff.BuffType.OVERWRITE_SUBATTRIBUTE, "Overwrite Attribute"],
    [Buff.BuffType.SHORTEN_SKILL_AFTER_USE_SKILL, "Reduce Skill Cooldown after Skill Use"],
    [Buff.BuffType.OVERWRITE_BATTLECLASS, "Overwrite Class to Target Enemy's Class"],
]);

export interface BuffTriggerType {
    after: boolean;
    when?: string;
    event: string;
    counterNp?: boolean;
    mainOnly?: boolean;
    skill?: DataVal.DataValField;
    level?: DataVal.DataValField;
    position?: DataVal.DataValField;
    rate?: DataVal.DataValField;
}

const DataValField = DataVal.DataValField;

export const buffTriggerTypes = new Map<Buff.BuffType, BuffTriggerType>([
    [Buff.BuffType.ATTACK_AFTER_FUNCTION, { after: true, event: "attacks" }],
    [Buff.BuffType.ATTACK_BEFORE_FUNCTION, { after: false, event: "attacks" }],
    [Buff.BuffType.COMMANDATTACK_AFTER_FUNCTION, { after: true, event: "normal attacks", rate: DataValField.USE_RATE }],
    [Buff.BuffType.DEADATTACK_FUNCTION, { after: true, when: "after", event: "defeating an enemy" }],
    [Buff.BuffType.COMMANDATTACK_BEFORE_FUNCTION, { after: false, event: "normal attacks" }],
    [Buff.BuffType.DAMAGE_FUNCTION, { after: true, when: "on receiving", event: "attacks" }],
    [Buff.BuffType.DEAD_FUNCTION, { after: true, event: "death" }],
    [Buff.BuffType.ENTRY_FUNCTION, { after: true, event: "entry" }],
    [
        Buff.BuffType.NPATTACK_PREV_BUFF,
        {
            after: true,
            event: "NP attack",
            skill: DataValField.SKILL_ID,
            level: DataValField.SKILL_LV,
            position: DataValField.VALUE,
        },
    ],
    [
        Buff.BuffType.SELFTURNEND_FUNCTION,
        {
            after: true,
            when: "every",
            event: "turn",
            skill: DataValField.VALUE,
            level: DataValField.VALUE2,
            rate: DataValField.USE_RATE,
        },
    ],
    [Buff.BuffType.WAVESTART_FUNCTION, { after: true, event: "wave start", rate: DataValField.USE_RATE }],
    [Buff.BuffType.DELAY_FUNCTION, { after: true, event: "Duration" }],
    [Buff.BuffType.REFLECTION_FUNCTION, { after: true, event: "end of enemy's turn" }],
    [
        Buff.BuffType.COUNTER_FUNCTION,
        { after: true, event: "NP", counterNp: true, skill: DataValField.COUNTER_ID, level: DataValField.COUNTER_LV },
    ],
    [Buff.BuffType.CONTINUE_FUNCTION, { after: true, event: "Party Revive" }],
    [Buff.BuffType.GUTS_FUNCTION, { after: true, event: "Guts" }],
    [Buff.BuffType.SKILL_AFTER_FUNCTION, { after: true, event: "skill" }],
    [Buff.BuffType.SKILL_AFTER_FUNCTION_MAIN_ONLY, { after: true, event: "skill", mainOnly: true }],
    [Buff.BuffType.TREASURE_DEVICE_AFTER_FUNCTION, { after: true, event: "NP attack" }],
    [Buff.BuffType.TREASURE_DEVICE_AFTER_FUNCTION_MAIN_ONLY, { after: true, event: "NP attack", mainOnly: true }],
    [Buff.BuffType.COMMANDCODEATTACK_BEFORE_FUNCTION, { after: false, event: "attacks with CC" }],
    [Buff.BuffType.COMMANDCODEATTACK_AFTER_FUNCTION, { after: true, event: "attacks with CC" }],
    [
        Buff.BuffType.COMMANDCODEATTACK_BEFORE_FUNCTION_MAIN_ONLY,
        { after: false, event: "attacks with CC", mainOnly: true },
    ],
    [
        Buff.BuffType.COMMANDCODEATTACK_AFTER_FUNCTION_MAIN_ONLY,
        { after: true, event: "attacks with CC", mainOnly: true },
    ],
    [Buff.BuffType.COMMANDATTACK_BEFORE_FUNCTION_MAIN_ONLY, { after: false, event: "attacks", mainOnly: true }],
    [Buff.BuffType.COMMANDATTACK_AFTER_FUNCTION_MAIN_ONLY, { after: true, event: "attacks", mainOnly: true }],
    [Buff.BuffType.ATTACK_BEFORE_FUNCTION_MAIN_ONLY, { after: false, event: "attacks", mainOnly: true }],
    [Buff.BuffType.ATTACK_AFTER_FUNCTION_MAIN_ONLY, { after: true, event: "attacks", mainOnly: true }],
    [Buff.BuffType.FIELD_INDIVIDUALITY_CHANGED_FUNCTION, { after: false, event: "", when: "" }],
    [Buff.BuffType.CONFIRM_COMMAND_FUNCTION, { after: true, event: "command card chosen" }],
    [Buff.BuffType.SKILL_BEFORE_FUNCTION, { after: false, event: "skill is used" }],
    [Buff.BuffType.TREASURE_DEVICE_BEFORE_FUNCTION, { after: false, event: "noble phantasm is used" }],
    [Buff.BuffType.SKILL_TARGETED_BEFORE_FUNCTION, { after: false, event: "targeted by skill" }],
    [Buff.BuffType.FUNCTIONED_FUNCTION, { after: true, event: "being NP drained or stunned" }],
    [Buff.BuffType.SELFTURNSTART_FUNCTION, { after: false, event: "start of own turn" }],
    [Buff.BuffType.COMBO_START_FUNCTION, { after: false, event: "function" }],
    [Buff.BuffType.COMBO_END_FUNCTION, { after: true, event: "function" }],
    [Buff.BuffType.WAVESTART_ANIMATION_BEFORE_FUNCTION, { after: false, event: "wave start" }],
]);
