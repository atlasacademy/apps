import { expect } from "chai";

import { BattleTeam } from "../../src";
import { BattleCommandAction } from "../../src/Action/BattleCommandAction";
import inspectAvailable from "../../src/Action/inspectAvailable";
import BattleSkill from "../../src/Skill/BattleSkill";
import { createBattle, servant } from "../helpers";

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
