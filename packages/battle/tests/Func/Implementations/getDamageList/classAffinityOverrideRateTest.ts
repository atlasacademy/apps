import { expect } from "chai";

import { Card, ClassName } from "@atlasacademy/api-connector";

import { BattleTeam } from "../../../../src";
import { BattleAttackActionList } from "../../../../src/Action/BattleAttackAction";
import { classAffinityOverrideRate } from "../../../../src/Func/Implementations/getDamageList";
import { createBattle, servant } from "../../../helpers";

describe("getDamageList classAffinityOverrideRate", () => {
    it("no override", () => {
        const actor = servant(161, BattleTeam.PLAYER),
            target = servant(241, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(classAffinityOverrideRate(1500, actions.get(1), actor, target, true)).to.equal(1500);
        expect(classAffinityOverrideRate(1500, actions.get(1), actor, target, false)).to.equal(1500);
    });

    it("with override", async () => {
        const actor = servant(161, BattleTeam.PLAYER),
            target = servant(241, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        await target.noblePhantasm().activate(battle);

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(classAffinityOverrideRate(1500, actions.get(1), actor, target, true)).to.equal(1500);
        expect(classAffinityOverrideRate(1500, actions.get(1), actor, target, false)).to.equal(1000);
    });

    it("supports overwrite more than target", async () => {
        const actor = servant(11, BattleTeam.PLAYER),
            target = servant(241, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        await target.noblePhantasm().activate(battle);
        target.props.className = ClassName.LANCER;

        const actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(classAffinityOverrideRate(1500, actions.get(1), actor, target, false)).to.equal(1000);
        expect(classAffinityOverrideRate(500, actions.get(1), actor, target, false)).to.equal(500);
    });
});
