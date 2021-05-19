import {Card, Servant} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackAction, BattleAttackActionList} from "../../../../src/Action/BattleAttackAction";
import BattleServantActor from "../../../../src/Actor/BattleServantActor";
import {Battle} from "../../../../src/Battle";
import {BattleTeam} from "../../../../src/Enum/BattleTeam";
import {cardHitDistribution} from "../../../../src/Func/Implementations/getDamageList";

import artoriaData from "../../../samples/servant/artoria.json";
import cuData from "../../../samples/servant/cu.json";
import musashiData from "../../../samples/servant/musashi.json";

describe('getDamageList.ts cardHitDistribution', () => {
    it('standard hits', () => {
        let battle = new Battle(null),
            servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>artoriaData,
                team: BattleTeam.PLAYER,
            }, null),
            target = new BattleServantActor({
                id: 2,
                phase: 1,
                servant: <Servant.Servant>cuData,
                team: BattleTeam.ENEMY,
            }, null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(cardHitDistribution(battle, <BattleAttackAction>actions.get(1), servant, target)).to.eql([100]);
        expect(cardHitDistribution(battle, <BattleAttackAction>actions.get(2), servant, target)).to.eql([33, 67]);
        expect(cardHitDistribution(battle, <BattleAttackAction>actions.get(3), servant, target)).to.eql([33, 67]);
        expect(cardHitDistribution(battle, <BattleAttackAction>actions.get(4), servant, target)).to.eql([12, 25, 63]);
    });

    it('multi hits', () => {
        let battle = new Battle(null),
            servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>musashiData,
                team: BattleTeam.PLAYER,
            }, null),
            target = new BattleServantActor({
                id: 2,
                phase: 1,
                servant: <Servant.Servant>cuData,
                team: BattleTeam.ENEMY,
            }, null);

        battle.addActor(servant);
        battle.addActor(target);

        const actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(cardHitDistribution(battle, <BattleAttackAction>actions.get(1), servant, target)).to.eql([33, 67]);
        expect(cardHitDistribution(battle, <BattleAttackAction>actions.get(2), servant, target)).to.eql([16, 33, 51]);
        expect(cardHitDistribution(battle, <BattleAttackAction>actions.get(3), servant, target)).to.eql([16, 33, 51]);
        expect(cardHitDistribution(battle, <BattleAttackAction>actions.get(4), servant, target)).to.eql([10, 20, 30, 40]);

        servant.skill(1)?.activate(battle);

        expect(cardHitDistribution(battle, <BattleAttackAction>actions.get(1), servant, target)).to.eql([16, 16, 33, 33]);
        expect(cardHitDistribution(battle, <BattleAttackAction>actions.get(2), servant, target)).to.eql([8, 8, 16, 16, 25, 25]);
        expect(cardHitDistribution(battle, <BattleAttackAction>actions.get(3), servant, target)).to.eql([8, 8, 16, 16, 25, 25]);
        expect(cardHitDistribution(battle, <BattleAttackAction>actions.get(4), servant, target)).to.eql([5, 5, 10, 10, 15, 15, 20, 20]);
    });
});
