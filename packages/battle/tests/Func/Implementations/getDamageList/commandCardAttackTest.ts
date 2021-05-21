import {Card, Servant} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackAction, BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import BattleServantActor from "../../../../src/Actor/BattleServantActor";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {commandCardAttack} from "../../../../src/Func/Implementations/getDamageList";

import cuData from "../../../samples/servant/cu.json";
import musashiData from "../../../samples/servant/musashi.json";

describe('getDamageList commandCardAttack', () => {
    it('no bonus', () => {
        const servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>musashiData,
                team: BattleTeam.PLAYER,
            }, null),
            target = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>cuData,
                team: BattleTeam.ENEMY,
            }, null),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(commandCardAttack(battle, <BattleAttackAction>actions.get(1), servant, target).value()).to.equal(2);
        expect(commandCardAttack(battle, <BattleAttackAction>actions.get(2), servant, target).value()).to.be.closeTo(0.96, 0.0001);
        expect(commandCardAttack(battle, <BattleAttackAction>actions.get(3), servant, target).value()).to.be.closeTo(1.4, 0.0001);
        expect(commandCardAttack(battle, <BattleAttackAction>actions.get(4), servant, target).value()).to.equal(1);
    });

    it('bonus - musashi mana burst', () => {
        const servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>musashiData,
                team: BattleTeam.PLAYER,
            }, null),
            target = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>cuData,
                team: BattleTeam.ENEMY,
            }, null),
            battle = new Battle(null);

        battle.addActor(servant);
        battle.addActor(target);

        let actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        expect(commandCardAttack(battle, <BattleAttackAction>actions.get(1), servant, target).value()).to.equal(2);

        servant.skill(2)?.activate(battle);
        actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        expect(commandCardAttack(battle, <BattleAttackAction>actions.get(1), servant, target).value()).to.equal(2.75);
    });
});
