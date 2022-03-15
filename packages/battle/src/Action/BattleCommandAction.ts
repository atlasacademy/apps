export enum BattleCommandAction {
    TARGET_ALLY_1,
    TARGET_ALLY_2,
    TARGET_ALLY_3,
    TARGET_ALLY_SELECT_1,
    TARGET_ALLY_SELECT_2,
    TARGET_ALLY_SELECT_3,
    TARGET_ALLY_RESERVE_1,
    TARGET_ALLY_RESERVE_2,
    TARGET_ALLY_RESERVE_3,
    TARGET_ENEMY_1,
    TARGET_ENEMY_2,
    TARGET_ENEMY_3,
    TARGET_ENEMY_SELECT_1,
    TARGET_ENEMY_SELECT_2,
    TARGET_ENEMY_SELECT_3,
    TARGET_SPECIAL_1,
    TARGET_SPECIAL_2,
    TARGET_SPECIAL_3,

    SERVANT_1_CARD_ARTS,
    SERVANT_1_CARD_BUSTER,
    SERVANT_1_CARD_QUICK,
    SERVANT_1_NP,
    SERVANT_1_SKILL_1,
    SERVANT_1_SKILL_2,
    SERVANT_1_SKILL_3,

    SERVANT_2_CARD_ARTS,
    SERVANT_2_CARD_BUSTER,
    SERVANT_2_CARD_QUICK,
    SERVANT_2_NP,
    SERVANT_2_SKILL_1,
    SERVANT_2_SKILL_2,
    SERVANT_2_SKILL_3,

    SERVANT_3_CARD_ARTS,
    SERVANT_3_CARD_BUSTER,
    SERVANT_3_CARD_QUICK,
    SERVANT_3_NP,
    SERVANT_3_SKILL_1,
    SERVANT_3_SKILL_2,
    SERVANT_3_SKILL_3,
}

export class BattleCommandActionFactory {
    static servantSkillAction(actorPosition: number, skillPosition: number): BattleCommandAction | undefined {
        if (actorPosition === 1 && skillPosition === 1) return BattleCommandAction.SERVANT_1_SKILL_1;
        if (actorPosition === 1 && skillPosition === 2) return BattleCommandAction.SERVANT_1_SKILL_2;
        if (actorPosition === 1 && skillPosition === 3) return BattleCommandAction.SERVANT_1_SKILL_3;

        if (actorPosition === 2 && skillPosition === 1) return BattleCommandAction.SERVANT_2_SKILL_1;
        if (actorPosition === 2 && skillPosition === 2) return BattleCommandAction.SERVANT_2_SKILL_2;
        if (actorPosition === 2 && skillPosition === 3) return BattleCommandAction.SERVANT_2_SKILL_3;

        if (actorPosition === 3 && skillPosition === 1) return BattleCommandAction.SERVANT_3_SKILL_1;
        if (actorPosition === 3 && skillPosition === 2) return BattleCommandAction.SERVANT_3_SKILL_2;
        if (actorPosition === 3 && skillPosition === 3) return BattleCommandAction.SERVANT_3_SKILL_3;

        return undefined;
    }
}
