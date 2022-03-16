import { expect } from "chai";

import { BattleTeam } from "../../src";
import BattleSkill from "../../src/Skill/BattleSkill";
import { createBattle, servant } from "../helpers";

describe("BattleSkill", () => {
    it("cooldown", async () => {
        const battle = createBattle(),
            actor = servant(2, BattleTeam.PLAYER),
            charisma = <BattleSkill>actor.skill(1);

        battle.addActor(actor);

        expect(charisma.level()).to.equal(10);
        expect(charisma.available()).to.be.true;
        expect(charisma.cooldown()).to.equal(0);

        await charisma.activate(battle);

        expect(charisma.available()).to.be.false;
        expect(charisma.cooldown()).to.equal(5);
    });

    it("cooldown is level dependant", async () => {
        const battle = createBattle(),
            actor = servant(2, BattleTeam.PLAYER, {
                skillLevels: [1],
            }),
            charisma = <BattleSkill>actor.skill(1);

        battle.addActor(actor);

        expect(charisma.level()).to.equal(1);
        expect(charisma.available()).to.be.true;
        expect(charisma.cooldown()).to.equal(0);

        await charisma.activate(battle);

        expect(charisma.available()).to.be.false;
        expect(charisma.cooldown()).to.equal(7);
    });
});
