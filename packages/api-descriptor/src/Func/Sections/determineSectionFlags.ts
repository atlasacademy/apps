import { Buff, Func } from "@atlasacademy/api-connector";

interface SectionFlags {
    showing: boolean;
    preposition?: string;
}

interface Sections {
    team: SectionFlags;
    chance: SectionFlags;
    action: SectionFlags;
    affects: SectionFlags;
    amount: SectionFlags;
    target: SectionFlags;
    duration: SectionFlags;
    scaling: SectionFlags;
}

export default function (func: Func.Func): Sections {
    const flags: Sections = {
        team: { showing: true },
        chance: { showing: true },
        action: { showing: true },
        affects: { showing: true },
        amount: { showing: true, preposition: "of" },
        target: { showing: true, preposition: "to" },
        duration: { showing: true },
        scaling: { showing: true },
    };

    switch (func.funcType) {
        case Func.FuncType.ADD_STATE:
        case Func.FuncType.ADD_STATE_SHORT:
            return determineBuffSectionFlags(func, flags);
        case Func.FuncType.SUB_STATE:
            flags.target.preposition = "on";

            return flags;
        case Func.FuncType.GAIN_NP_BUFF_INDIVIDUAL_SUM:
            flags.amount.preposition = "by";
            flags.target.preposition = "for";

            return flags;
        case Func.FuncType.DAMAGE_NP:
        case Func.FuncType.DAMAGE_NP_HPRATIO_LOW:
        case Func.FuncType.DAMAGE_NP_INDIVIDUAL:
        case Func.FuncType.DAMAGE_NP_INDIVIDUAL_SUM:
        case Func.FuncType.DAMAGE_NP_PIERCE:
        case Func.FuncType.DAMAGE_NP_RARE:
        case Func.FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX:
        case Func.FuncType.DAMAGE_NP_COUNTER:
            flags.amount.preposition = "of";

            return flags;
        case Func.FuncType.ABSORB_NPTURN:
        case Func.FuncType.GAIN_HP_FROM_TARGETS:
        case Func.FuncType.GAIN_NP_FROM_TARGETS:
            flags.amount.preposition = "of";
            flags.target.preposition = "from";

            return flags;
        case Func.FuncType.CARD_RESET:
        case Func.FuncType.GAIN_STAR:
        case Func.FuncType.LOSS_STAR:
            flags.target.showing = false;

            return flags;
        case Func.FuncType.DELAY_NPTURN:
        case Func.FuncType.LOSS_HP:
        case Func.FuncType.LOSS_HP_SAFE:
        case Func.FuncType.LOSS_NP:
            flags.amount.preposition = "by";
            flags.target.preposition = "from";

            return flags;
        case Func.FuncType.ENEMY_ENCOUNT_COPY_RATE_UP:
        case Func.FuncType.ENEMY_ENCOUNT_RATE_UP:
        case Func.FuncType.FIX_COMMANDCARD:
            flags.amount.showing = false;
            flags.target.showing = false;

            return flags;
        case Func.FuncType.EVENT_DROP_UP:
        case Func.FuncType.EVENT_POINT_UP:
        case Func.FuncType.EVENT_DROP_RATE_UP:
        case Func.FuncType.EVENT_POINT_RATE_UP:
        case Func.FuncType.FRIEND_POINT_UP:
        case Func.FuncType.FRIEND_POINT_UP_DUPLICATE:
        case Func.FuncType.EXP_UP:
        case Func.FuncType.QP_DROP_UP:
        case Func.FuncType.QP_UP:
        case Func.FuncType.SERVANT_FRIENDSHIP_UP:
        case Func.FuncType.USER_EQUIP_EXP_UP:
            flags.chance.showing = false;
            flags.amount.preposition = "by";
            flags.target.showing = false;

            return flags;
        case Func.FuncType.EXTEND_SKILL:
        case Func.FuncType.GAIN_HP:
        case Func.FuncType.GAIN_NP:
        case Func.FuncType.HASTEN_NPTURN:
        case Func.FuncType.SHORTEN_SKILL:
            flags.amount.preposition = "by";
            flags.target.preposition = "for";

            return flags;
        case Func.FuncType.FORCE_INSTANT_DEATH:
        case Func.FuncType.INSTANT_DEATH:
            flags.amount.showing = false;
            flags.target.preposition = "on";

            return flags;
        case Func.FuncType.GAIN_HP_PER:
            flags.amount.preposition = "of";
            flags.target.preposition = "for";

            return flags;
        case Func.FuncType.NONE:
            flags.chance.showing = false;
            flags.target.showing = false;

            return flags;
        case Func.FuncType.REPLACE_MEMBER:
            flags.amount.showing = false;
            flags.target.preposition = "with";

            return flags;
        case Func.FuncType.MOVE_TO_LAST_SUBMEMBER:
            flags.amount.showing = false;
            flags.target.preposition = "from";

            return flags;
        default:
            return flags;
    }
}

function determineBuffSectionFlags(func: Func.Func, flags: Sections): Sections {
    switch (func.buffs[0]?.type) {
        case Buff.BuffType.FIELD_INDIVIDUALITY:
        case Buff.BuffType.CHANGE_COMMAND_CARD_TYPE:
            flags.amount.preposition = "to";
    }

    flags.target.preposition = "on";
    switch (func.buffs[0]?.type) {
        case Buff.BuffType.COMMANDATTACK_FUNCTION:
        case Buff.BuffType.NPATTACK_PREV_BUFF:
        case Buff.BuffType.COUNTER_FUNCTION:
            flags.target.preposition = "for";
    }

    return flags;
}
