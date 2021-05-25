import {Card} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {attackBonus} from "../../../../src/Func/Implementations/getDamageList";
import {artoria, cu, gilgamesh, waver} from "../../../helpers";

describe('getDamageList attackBonus', () => {
    it('no bonus', async () => {
        const servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(attackBonus(actions.get(1), servant, target).value()).to.equal(0);
    });

    it('divinity', async () => {
        const servant = gilgamesh(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);
        await battle.init();

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(attackBonus(actions.get(1), servant, target).value()).to.equal(175);
    });

    it('damage up', async () => {
        const servant = waver(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        await servant.skill(3)?.activate(battle);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(attackBonus(actions.get(1), servant, target).value()).to.equal(500);
    });

    it('buster brave', async () => {
        const servant = artoria(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.BUSTER, false);

        const baseAttack = 12221,
            busterBraveBonus = 0.2,
            expectedValue = baseAttack * busterBraveBonus;

        expect(attackBonus(actions.get(1), servant, target).value()).to.be.closeTo(expectedValue, 0.0001);
    });
});
