import { expect } from "chai";

import { Card } from "@atlasacademy/api-connector";

import { BattleTeam } from "../../../../src";
import { BattleAttackActionList } from "../../../../src/Action/BattleAttackAction";
import { starGenRate } from "../../../../src/Func/Implementations/getDamageList";
import { createBattle, servant } from "../../../helpers";

describe("getDamageList starGenRate", () => {
    it("card types and first card bonus", async () => {
        const actor = servant(11, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        let actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.BUSTER, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(179);
        expect(starGenRate(actions.get(2), actor, target).value()).to.equal(229);
        expect(starGenRate(actions.get(3), actor, target).value()).to.equal(279);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.QUICK, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(1079);
        expect(starGenRate(actions.get(2), actor, target).value()).to.equal(1579);
        expect(starGenRate(actions.get(3), actor, target).value()).to.equal(2079);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, false);
        actions.add(actor, Card.ARTS, false);
        actions.add(actor, Card.ARTS, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(79);
        expect(starGenRate(actions.get(2), actor, target).value()).to.equal(79);
        expect(starGenRate(actions.get(3), actor, target).value()).to.equal(79);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.ARTS, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(1079);
        expect(starGenRate(actions.get(2), actor, target).value()).to.equal(429);
        expect(starGenRate(actions.get(3), actor, target).value()).to.equal(279);
    });

    it("card up bonus", async () => {
        const actor = servant(11, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        let actions: BattleAttackActionList;

        // No buffs
        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(179);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(1079);

        // After card up
        await actor.skill(3)?.activate(battle);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(229);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(1479);
    });

    it("server mod check", async () => {
        const actor = servant(11, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        let actions: BattleAttackActionList;

        // No mod
        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(179);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(1079);

        // With 1 extra star
        target.props.serverMod.starRate = 1000;

        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(1179);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(2079);

        // With -1 star
        target.props.serverMod.starRate = -1000;

        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(0);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(79);
    });

    it("star gen bonus", async () => {
        const actor = servant(11, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        let actions: BattleAttackActionList;

        // No buffs
        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(179);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(1079);

        // After star gen up
        await actor.skill(2)?.activate(battle);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(1179);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(2079);
    });

    it("star gen critical bonus", async () => {
        const actor = servant(11, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        let actions: BattleAttackActionList;

        // No crit
        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(179);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(1079);

        // With crit
        actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.get(1).critical = true;
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(379);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        actions.get(1).critical = true;
        expect(starGenRate(actions.get(1), actor, target).value()).to.equal(1279);
    });
});
