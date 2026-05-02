import { expect } from "chai";

import { BattleTeam } from "../../src/index.js";
import { BattleCommandAction } from "../../src/Action/BattleCommandAction.js";
import inspectAvailable from "../../src/Action/inspectAvailable.js";
import BattleSkill from "../../src/Skill/BattleSkill.js";
import { createBattle, servant } from "../helpers.js";

describe("inspectAvailable", () => {
    it("returns available skills", async () => {
        const battle = createBattle(),
            actor = servant(2, BattleTeam.PLAYER),
            manaBurst = <BattleSkill>actor.skill(2);

        battle.addActor(actor);

        let availableActions = inspectAvailable(battle);
        expect(availableActions).to.contain(BattleCommandAction.SERVANT_1_SKILL_1);
        expect(availableActions).to.contain(BattleCommandAction.SERVANT_1_SKILL_2);
        expect(availableActions).to.contain(BattleCommandAction.SERVANT_1_SKILL_3);

        await manaBurst.activate(battle);
        availableActions = inspectAvailable(battle);
        expect(availableActions).to.contain(BattleCommandAction.SERVANT_1_SKILL_1);
        expect(availableActions).to.not.contain(BattleCommandAction.SERVANT_1_SKILL_2);
        expect(availableActions).to.contain(BattleCommandAction.SERVANT_1_SKILL_3);
    });
});
