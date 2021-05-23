import {Card} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {commandCardAttack} from "../../../../src/Func/Implementations/getDamageList";
import {cu, musashi} from "../../../helpers";

describe('getDamageList commandCardAttack', () => {
    it('no bonus', () => {
        const servant = musashi(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(commandCardAttack(battle, actions.get(1), servant, target).value()).to.equal(2);
        expect(commandCardAttack(battle, actions.get(2), servant, target).value()).to.be.closeTo(0.96, 0.0001);
        expect(commandCardAttack(battle, actions.get(3), servant, target).value()).to.be.closeTo(1.4, 0.0001);
        expect(commandCardAttack(battle, actions.get(4), servant, target).value()).to.equal(1);
    });

    it('bonus - musashi mana burst', async () => {
        const servant = musashi(BattleTeam.PLAYER),
            target = cu(BattleTeam.ENEMY),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        let actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        expect(commandCardAttack(battle, actions.get(1), servant, target).value()).to.equal(2);

        await servant.skill(2)?.activate(battle);
        actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        expect(commandCardAttack(battle, actions.get(1), servant, target).value()).to.equal(2.75);
    });
});
