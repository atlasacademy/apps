import { expect } from "chai";

import { BattleTeam } from "../../../src";
import BattleRemoveBuffEvent from "../../../src/Event/BattleRemoveBuffEvent";
import subStateFunc from "../../../src/Func/Implementations/subStateFunc";
import BattleSkillFunc from "../../../src/Skill/BattleSkillFunc";
import { createBattle, servant } from "../../helpers";

describe("subStateFunc", () => {
    it("fails when no matching buffs", async () => {
        const actor = servant(17, BattleTeam.PLAYER),
            battle = createBattle(),
            cleanse = <BattleSkillFunc>actor.skill(3)?.func(1);

        battle.addActor(actor);

        const events = await subStateFunc(battle, cleanse, actor, actor);
        expect(events).to.be.length(1);
        expect(events[0]).to.be.instanceof(BattleRemoveBuffEvent);
        expect(events[0].success).to.be.false;
    });

    it("is able to cleanse debuffs", async () => {
        const actor = servant(17, BattleTeam.PLAYER),
            enemy = servant(13, BattleTeam.ENEMY),
            battle = createBattle(),
            cleanse = <BattleSkillFunc>actor.skill(3)?.func(1);

        battle.addActor(actor);
        battle.addActor(enemy);

        expect(actor.buffs().hasTrait(3011, true)).to.be.false;

        await enemy.skill(1)?.activate(battle);
        expect(actor.buffs().hasTrait(3011, true)).to.be.true;

        const events = await subStateFunc(battle, cleanse, actor, actor);
        expect(events).to.be.length(2);
        expect(events[0].success).to.be.true;
        expect(events[1].success).to.be.true;

        expect(actor.buffs().hasTrait(3011, true)).to.be.false;
    });

    it("is only cleanses applicable buffs", async () => {
        const actor = servant(17, BattleTeam.PLAYER),
            enemy = servant(13, BattleTeam.ENEMY),
            battle = createBattle(),
            cleanse = <BattleSkillFunc>actor.skill(3)?.func(1);

        battle.addActor(actor);
        battle.addActor(enemy);

        expect(actor.buffs().hasTrait(3011, true)).to.be.false; // poison
        expect(actor.buffs().hasTrait(3021, true)).to.be.false; // evade

        await actor.skill(2)?.activate(battle);
        await enemy.skill(1)?.activate(battle);
        expect(actor.buffs().hasTrait(3011, true)).to.be.true;
        expect(actor.buffs().hasTrait(3021, true)).to.be.true;

        const events = await subStateFunc(battle, cleanse, actor, actor);
        expect(events).to.be.length(2);
        expect(events[0].success).to.be.true;
        expect(events[1].success).to.be.true;

        expect(actor.buffs().hasTrait(3011, true)).to.be.false;
        expect(actor.buffs().hasTrait(3021, true)).to.be.true;
    });
});
