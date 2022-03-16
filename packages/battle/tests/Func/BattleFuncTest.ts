import { expect } from "chai";

import { BattleTeam } from "../../src";
import BattleSkillFunc from "../../src/Skill/BattleSkillFunc";
import { createBattle, servant } from "../helpers";

describe("BattleFunc", () => {
    it("applicableToTarget vs no required trait", async () => {
        const actor = servant(15, BattleTeam.PLAYER),
            emiya = servant(11, BattleTeam.ENEMY),
            artoria = servant(2, BattleTeam.ENEMY),
            battle = createBattle(),
            drain = <BattleSkillFunc>actor.skill(1)?.func(1);

        battle.addActor(actor);
        battle.addActor(emiya);
        battle.addActor(artoria);
        await battle.init();

        expect(drain.applicableToTarget(emiya)).to.be.true;
        expect(drain.applicableToTarget(artoria)).to.be.true;
    });

    it("applicableToTarget vs innate trait", async () => {
        const actor = servant(15, BattleTeam.PLAYER),
            emiya = servant(11, BattleTeam.ENEMY),
            artoria = servant(2, BattleTeam.ENEMY),
            battle = createBattle(),
            charm = <BattleSkillFunc>actor.skill(2)?.func(1);

        battle.addActor(actor);
        battle.addActor(emiya);
        battle.addActor(artoria);
        await battle.init();

        expect(charm.applicableToTarget(emiya)).to.be.true;
        expect(charm.applicableToTarget(artoria)).to.be.false;
    });

    it("applicableToTarget vs dynamic trait", async () => {
        const actor = servant(156, BattleTeam.PLAYER),
            artoria = servant(2, BattleTeam.PLAYER),
            battle = createBattle(),
            evilCharisma = <BattleSkillFunc>actor.skill(3)?.func(2);

        battle.addActor(actor);
        battle.addActor(artoria);
        await battle.init();

        expect(evilCharisma.applicableToTarget(artoria)).to.be.false;

        // change artoria's alignment
        await actor.skill(2)?.activate(battle);
        expect(evilCharisma.applicableToTarget(artoria)).to.be.true;
    });
});
