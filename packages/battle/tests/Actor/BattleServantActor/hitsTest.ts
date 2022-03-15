import { expect } from "chai";

import { Card } from "@atlasacademy/api-connector";

import { BattleTeam } from "../../../src";
import { BattleAttackActionList } from "../../../src/Action/BattleAttackAction";
import { createBattle, servant } from "../../helpers";

describe("BattleServantActor hits", () => {
    it("artoria normal", () => {
        let battle = createBattle(),
            actor = servant(2, BattleTeam.PLAYER),
            actions: BattleAttackActionList;

        battle.addActor(actor);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(actor.hits(actions.get(1))).to.eql([100]);
        expect(actor.hits(actions.get(2))).to.eql([33, 67]);
        expect(actor.hits(actions.get(3))).to.eql([33, 67]);
        expect(actor.hits(actions.get(4))).to.eql([12, 25, 63]);
    });

    it("musashi normal", () => {
        let battle = createBattle(),
            actor = servant(153, BattleTeam.PLAYER),
            actions: BattleAttackActionList;

        battle.addActor(actor);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);
        expect(actor.hits(actions.get(1))).to.eql([33, 67]);
        expect(actor.hits(actions.get(2))).to.eql([16, 33, 51]);
        expect(actor.hits(actions.get(3))).to.eql([16, 33, 51]);
        expect(actor.hits(actions.get(4))).to.eql([10, 20, 30, 40]);
    });

    it("musashi skill 1", async () => {
        let battle = createBattle(),
            actor = servant(153, BattleTeam.PLAYER),
            actions: BattleAttackActionList;

        battle.addActor(actor);

        await actor.skill(1)?.activate(battle);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, true);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(actor.hits(actions.get(1))).to.eql([3, 7, 10, 14, 17, 21, 28]);
        expect(actor.hits(actions.get(2))).to.eql([16, 16, 33, 33, 51, 51]);
        expect(actor.hits(actions.get(3))).to.eql([16, 16, 33, 33, 51, 51]);
        expect(actor.hits(actions.get(4))).to.eql([10, 10, 20, 20, 30, 30, 40, 40]);
    });

    it("musashi summer skill 2", async () => {
        let battle = createBattle(),
            actor = servant(261, BattleTeam.PLAYER),
            actions: BattleAttackActionList;

        battle.addActor(actor);

        await actor.skill(2)?.activate(battle);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, true);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);

        expect(actor.hits(actions.get(1))).to.eql([10, 20, 30, 40]);
        expect(actor.hits(actions.get(2))).to.eql([10, 20, 30, 40]);
        expect(actor.hits(actions.get(3))).to.eql([16, 16, 33, 33, 51, 51]);
        expect(actor.hits(actions.get(4))).to.eql([6, 13, 20, 26, 35]);
    });
});
