import {Card, ClassName, Servant} from "@atlasacademy/api-connector";
import {expect} from 'chai';
import {BattleAttackAction, BattleAttackActionList} from "../../src/Action/BattleAttackAction";
import BattleServantActor from "../../src/Actor/BattleServantActor";
import {Battle} from "../../src/Battle";
import {BattleTeam} from "../../src/Enum/BattleTeam";

import artoriaData from "../samples/servant/artoria.json";
import cuData from "../samples/servant/cu.json";
import musashiData from "../samples/servant/musashi.json";

describe('BattleServantActor', () => {
    it('defaults', () => {
        const servant = new BattleServantActor({
            id: 1,
            phase: 1,
            servant: <Servant.Servant>artoriaData,
            team: BattleTeam.PLAYER,
        }, null);

        const battle = new Battle(null);
        battle.addActor(servant);

        expect(servant.props.className).to.equal(ClassName.SABER);
        expect(servant.props.level).to.equal(90);
        expect(servant.props.baseAttack).to.equal(12221);
        expect(servant.props.baseHealth).to.equal(16150);
        expect(servant.hasTrait(1)).to.equal(false);
        expect(servant.hasTrait(2)).to.equal(true);
        expect(servant.hasTrait(2009)).to.equal(true);
        expect(servant.attack()).to.equal(12221);
        expect(servant.health()).to.equal(16150);

        expect(servant.skill(1)?.props.skill.id).to.equal(5450);
        expect(servant.skill(2)?.props.skill.id).to.equal(756450);
        expect(servant.skill(3)?.props.skill.id).to.equal(501650);

        servant.skill(1)?.activate(battle);
        expect(servant.attack()).to.equal(14421);
    });

    it('autoAttack', () => {
        const battle = new Battle(null),
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

        // servant.autoAttack(<BattleAttackAction>actions.get(1), battle, target);
        // servant.autoAttack(<BattleAttackAction>actions.get(2), battle, target);
        // servant.autoAttack(<BattleAttackAction>actions.get(3), battle, target);
        // servant.autoAttack(<BattleAttackAction>actions.get(4), battle, target);
        // servant.autoAttack(battle, target, actions, 2);
        // servant.autoAttack(battle, target, actions, 3);
        // servant.autoAttack(battle, target, actions, 4);

    });

    it('hits - artoria normal', () => {
        let battle = new Battle(null),
            servant = new BattleServantActor({
                id: 1,
                phase: 1,
                servant: <Servant.Servant>artoriaData,
                team: BattleTeam.PLAYER,
            }, null),
            actions: BattleAttackActionList;

        battle.addActor(servant);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(servant.hits(<BattleAttackAction>actions.get(1))).to.eql([100]);
        expect(servant.hits(<BattleAttackAction>actions.get(2))).to.eql([33, 67]);
        expect(servant.hits(<BattleAttackAction>actions.get(3))).to.eql([33, 67]);
        expect(servant.hits(<BattleAttackAction>actions.get(4))).to.eql([12, 25, 63]);
    });

    it('hits - musashi normal', () => {
        let battle = new Battle(null),
            musashi = new BattleServantActor({
                id: 2,
                phase: 1,
                servant: <Servant.Servant>musashiData,
                team: BattleTeam.PLAYER,
            }, null),
            actions: BattleAttackActionList;

        battle.addActor(musashi);

        actions = new BattleAttackActionList();
        actions.add(musashi, Card.BUSTER, false);
        actions.add(musashi, Card.QUICK, false);
        actions.add(musashi, Card.ARTS, false);
        expect(musashi.hits(<BattleAttackAction>actions.get(1))).to.eql([33, 67]);
        expect(musashi.hits(<BattleAttackAction>actions.get(2))).to.eql([16, 33, 51]);
        expect(musashi.hits(<BattleAttackAction>actions.get(3))).to.eql([16, 33, 51]);
        expect(musashi.hits(<BattleAttackAction>actions.get(4))).to.eql([10, 20, 30, 40]);
    });

    it('hits - musashi skill 1', () => {
        let battle = new Battle(null),
            servant = new BattleServantActor({
                id: 2,
                phase: 1,
                servant: <Servant.Servant>musashiData,
                team: BattleTeam.PLAYER,
            }, null),
            actions: BattleAttackActionList;

        battle.addActor(servant);

        servant.skill(1)?.activate(battle);

        actions = new BattleAttackActionList();
        actions.add(servant, Card.BUSTER, false);
        actions.add(servant, Card.QUICK, false);
        actions.add(servant, Card.ARTS, false);

        expect(servant.hits(<BattleAttackAction>actions.get(1))).to.eql([33, 33, 67, 67]);
        expect(servant.hits(<BattleAttackAction>actions.get(2))).to.eql([16, 16, 33, 33, 51, 51]);
        expect(servant.hits(<BattleAttackAction>actions.get(3))).to.eql([16, 16, 33, 33, 51, 51]);
        expect(servant.hits(<BattleAttackAction>actions.get(4))).to.eql([10, 10, 20, 20, 30, 30, 40, 40]);
    });
});
