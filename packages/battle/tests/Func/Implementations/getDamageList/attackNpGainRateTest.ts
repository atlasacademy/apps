import {Card} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {attackNpGainRate} from "../../../../src/Func/Implementations/getDamageList";
import {artoria, cu, emiya, gilgamesh} from "../../../helpers";

describe('getDamageList attackNpGainRate', () => {
    it('card types and first card bonus', async () => {
        const servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        let actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.BUSTER, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(0);
        expect(attackNpGainRate(actions.get(2), servant, target).value()).to.equal(0);
        expect(attackNpGainRate(actions.get(3), servant, target).value()).to.equal(0);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(86);
        expect(attackNpGainRate(actions.get(2), servant, target).value()).to.equal(129);
        expect(attackNpGainRate(actions.get(3), servant, target).value()).to.equal(172);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.ARTS, false);
        actions.add(servant, Card.ARTS, false);
        actions.add(servant, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(344);
        expect(attackNpGainRate(actions.get(2), servant, target).value()).to.equal(473);
        expect(attackNpGainRate(actions.get(3), servant, target).value()).to.equal(602);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.ARTS, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(344);
        expect(attackNpGainRate(actions.get(2), servant, target).value()).to.equal(215);
        expect(attackNpGainRate(actions.get(3), servant, target).value()).to.equal(258);
    });

    it('card up bonus', async () => {
        const servant = emiya(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        let actions: BattleAttackActionList;

        // No buffs
        actions = new BattleAttackActionList();
        actions.add(servant, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(204);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(51);

        // After card up
        await servant.skill(3)?.activate(battle);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(280);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(76);
    });

    it('server mod check', async () => {
        const servant = emiya(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        let actions: BattleAttackActionList;

        // No mod
        actions = new BattleAttackActionList();
        actions.add(servant, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(204);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(51);

        // With 50% mod
        target.props.serverMod.tdRate = 500;

        actions = new BattleAttackActionList();
        actions.add(servant, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(102);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(25);

        // With 200% mod
        target.props.serverMod.tdRate = 2000;

        actions = new BattleAttackActionList();
        actions.add(servant, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(408);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(102);
    });

    it('np gain bonus', async () => {
        const servant = gilgamesh(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        let actions: BattleAttackActionList;

        // No buffs
        actions = new BattleAttackActionList();
        actions.add(servant, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(136);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(34);

        // After np gain up
        await servant.skill(2)?.activate(battle);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(204);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(51);
    });

    it('np gain critical bonus', async () => {
        const servant = gilgamesh(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        let actions: BattleAttackActionList;

        // No crit
        actions = new BattleAttackActionList();
        actions.add(servant, Card.ARTS, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(136);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.QUICK, false);
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(34);

        // With crit
        actions = new BattleAttackActionList();
        actions.add(servant, Card.ARTS, false);
        actions.get(1).critical = true;
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(272);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.QUICK, false);
        actions.get(1).critical = true;
        expect(attackNpGainRate(actions.get(1), servant, target).value()).to.equal(68);
    });
});
