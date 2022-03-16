import { expect } from "chai";

import { BattleTeam } from "../../../src";
import BattleSkill from "../../../src/Skill/BattleSkill";
import { createBattle, servant } from "../../helpers";

describe("adjustNpFunc", () => {
    it("artoria skill 3", async () => {
        const actor = servant(2, BattleTeam.PLAYER),
            battle = createBattle(),
            charge = <BattleSkill>actor.skill(3);

        battle.addActor(actor);

        expect(actor.gaugePercent()).to.equal(0);
        await charge.activate(battle);

        expect(actor.gaugePercent()).to.equal(0.3);
    });

    it("shiki saber skill 3", async () => {
        const shiki = servant(91, BattleTeam.PLAYER),
            waver = servant(37, BattleTeam.PLAYER),
            battle = createBattle();

        battle.addActor(shiki);
        battle.addActor(waver);

        expect(shiki.gaugePercent()).to.equal(0);

        await waver.skill(2)?.activate(battle);
        expect(shiki.gaugePercent()).to.equal(0.1);

        await waver.skill(3)?.activate(battle);
        expect(shiki.gaugePercent()).to.equal(0.2);

        await shiki.skill(3)?.activate(battle);
        expect(shiki.gaugePercent()).to.equal(0.1);
    });
});
