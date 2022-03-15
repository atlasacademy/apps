import { expect } from "chai";

import { Card, ClassName } from "@atlasacademy/api-connector";

import { BattleTeam } from "../../../src";
import { BattleAttackActionList } from "../../../src/Action/BattleAttackAction";
import { buff, createBattle, servant } from "../../helpers";

describe("BattleServantActor className", () => {
    it("normal", () => {
        let battle = createBattle(),
            actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            actions: BattleAttackActionList;

        battle.addActor(actor);
        battle.addActor(target);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(actor.baseClassName()).to.equal(ClassName.SABER);
        expect(actor.className(actions.get(1), target)).to.equal(ClassName.SABER);
    });

    it("override", () => {
        let battle = createBattle(),
            actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            actions: BattleAttackActionList,
            overrideClassBuff = buff(542, { Value: 5 }, false, false, null);

        battle.addActor(actor);
        battle.addActor(target);
        actor.addBuff(overrideClassBuff);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(actor.baseClassName()).to.equal(ClassName.SABER);
        expect(actor.className(actions.get(1), target)).to.equal(ClassName.CASTER);
    });
});
