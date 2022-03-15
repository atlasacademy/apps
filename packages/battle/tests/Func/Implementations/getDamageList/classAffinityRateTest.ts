import { expect } from "chai";

import { Card, ClassName } from "@atlasacademy/api-connector";

import { BattleTeam } from "../../../../src";
import { BattleAttackActionList } from "../../../../src/Action/BattleAttackAction";
import { classAffinityRate } from "../../../../src/Func/Implementations/getDamageList";
import { createBattle, servant } from "../../../helpers";

describe("getDamageList classAffinityRate", () => {
    it("defined", () => {
        const actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(classAffinityRate(actions.get(1), actor, target).value()).to.equal(2);
        expect(classAffinityRate(actions.get(1), target, actor).value()).to.equal(0.5);
    });

    it("not defined", () => {
        const actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);
        target.props.className = ClassName.UNKNOWN;

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(classAffinityRate(actions.get(1), actor, target).value()).to.equal(1);
        expect(classAffinityRate(actions.get(1), target, actor).value()).to.equal(1);
    });

    it("handles overrides", async () => {
        const actor = servant(161, BattleTeam.PLAYER),
            target = servant(241, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        // without NP
        expect(classAffinityRate(actions.get(1), actor, target).value()).to.equal(1.5);

        // with NP
        await target.noblePhantasm().activate(battle);
        expect(classAffinityRate(actions.get(1), actor, target).value()).to.equal(1);
    });
});
