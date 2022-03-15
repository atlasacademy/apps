import { expect } from "chai";

import { Card } from "@atlasacademy/api-connector";

import { BattleTeam } from "../../../../src";
import { BattleAttackActionList } from "../../../../src/Action/BattleAttackAction";
import { attackNpGainRate } from "../../../../src/Func/Implementations/getDamageList";
import { buff, createBattle, servant } from "../../../helpers";

describe("getDamageList attackNpGainRate", () => {
    it("card types and first card bonus", async () => {
        const actor = servant(2, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        let actions = new BattleAttackActionList();
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.BUSTER, false);
        actions.add(actor, Card.BUSTER, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(0);
        expect(attackNpGainRate(actions.get(2), actor, target).value()).to.equal(0);
        expect(attackNpGainRate(actions.get(3), actor, target).value()).to.equal(0);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(86);
        expect(attackNpGainRate(actions.get(2), actor, target).value()).to.equal(129);
        expect(attackNpGainRate(actions.get(3), actor, target).value()).to.equal(172);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, false);
        actions.add(actor, Card.ARTS, false);
        actions.add(actor, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(344);
        expect(attackNpGainRate(actions.get(2), actor, target).value()).to.equal(473);
        expect(attackNpGainRate(actions.get(3), actor, target).value()).to.equal(602);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(344);
        expect(attackNpGainRate(actions.get(2), actor, target).value()).to.equal(215);
        expect(attackNpGainRate(actions.get(3), actor, target).value()).to.equal(258);
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
        actions.add(actor, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(204);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(51);

        // After card up
        await actor.skill(3)?.activate(battle);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(280);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(76);
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
        actions.add(actor, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(204);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(51);

        // With 50% mod
        target.props.serverMod.tdRate = 500;

        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(102);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(25);

        // With 200% mod
        target.props.serverMod.tdRate = 2000;

        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(408);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(102);
    });

    it("np gain bonus", async () => {
        const actor = servant(12, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        let actions: BattleAttackActionList;

        // No buffs
        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(136);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(34);

        // After np gain up
        await actor.skill(2)?.activate(battle);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(204);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(51);
    });

    it("np gain critical bonus", async () => {
        const actor = servant(12, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        let actions: BattleAttackActionList;

        // No crit
        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(136);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(34);

        // With crit
        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, false);
        actions.get(1).critical = true;
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(272);

        actions = new BattleAttackActionList();
        actions.add(actor, Card.QUICK, false);
        actions.get(1).critical = true;
        expect(attackNpGainRate(actions.get(1), actor, target).value()).to.equal(68);
    });

    it("32-bit number melt", async () => {
        const actor = servant(163, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const quickBuff = buff(100, { Value: 1880 }, false, false, null);

        actor.addBuff(quickBuff);

        let actions: BattleAttackActionList;

        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.QUICK, false);
        actions.get(3).critical = true;
        expect(attackNpGainRate(actions.get(3), actor, target).value()).to.equal(1243);
    });

    it("32-bit number abby", async () => {
        const actor = servant(195, BattleTeam.PLAYER),
            target = servant(17, BattleTeam.ENEMY),
            battle = createBattle();

        battle.addActor(actor);
        battle.addActor(target);

        const artsBuff = buff(101, { Value: 800 }, false, false, null);

        const npGainBuff = buff(140, { Value: 300 }, false, false, null);

        actor.addBuff(artsBuff);
        actor.addBuff(npGainBuff);

        let actions: BattleAttackActionList;

        actions = new BattleAttackActionList();
        actions.add(actor, Card.ARTS, false);
        actions.add(actor, Card.QUICK, false);
        actions.add(actor, Card.ARTS, false);
        actions.get(3).critical = true;
        expect(attackNpGainRate(actions.get(3), actor, target).value()).to.equal(766);
    });
});
