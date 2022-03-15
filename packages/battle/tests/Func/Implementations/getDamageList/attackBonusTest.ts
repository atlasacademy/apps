import { expect } from "chai";

import { Card } from "@atlasacademy/api-connector";

import { BattleTeam } from "../../../../src";
import { BattleAttackActionList } from "../../../../src/Action/BattleAttackAction";
import { attackBonus } from "../../../../src/Func/Implementations/getDamageList";
import { createBattle, servant } from "../../../helpers";

describe("getDamageList attackBonus", () => {
    it("no bonus", async () => {
        const actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(attackBonus(actions.get(1), actor, target).value()).to.equal(0);
    });

    it("divinity", async () => {
        const actor = servant(12, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);
        await battle.init();

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(attackBonus(actions.get(1), actor, target).value()).to.equal(175);
    });

    it("damage up", async () => {
        const actor = servant(37, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        await actor.skill(3)?.activate(battle);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(attackBonus(actions.get(1), actor, target).value()).to.equal(500);
    });

    it("buster brave", async () => {
        const actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.BUSTER, false);

        const baseAttack = 12221,
            busterBraveBonus = 0.2,
            expectedValue = baseAttack * busterBraveBonus;

        expect(attackBonus(actions.get(1), actor, target).value()).to.be.closeTo(expectedValue, 0.0001);
    });
});
